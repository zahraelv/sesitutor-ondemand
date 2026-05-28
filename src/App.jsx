import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Coins, LogOut, Sliders, CheckCircle } from 'lucide-react';
import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import LoginModal from './components/LoginModal';
import TopUpModal from './components/TopUpModal';
import BookingWizard from './components/BookingWizard';
import MatchingRadar from './components/MatchingRadar';
import ConfirmedScreen from './components/ConfirmedScreen';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import FAQSection from './components/FAQSection';
import { db } from './firebase';

import { 
  MOCK_STUDENTS,
  SUBJECTS, 
  TEACHERS, 
  getFormattedDateString, 
  formatDate, 
  generateTimeSlotsArray,
  validationMap
} from './utils/mockData';

export default function App() {
  // Global States
  const [activeRole, setActiveRole] = useState('student');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('so_student')) || null;
      const savedStudents = JSON.parse(localStorage.getItem('so_onboarded_students')) || {};
      if (!savedUser?.email) return null;
      const savedStudent = savedStudents[savedUser.email];
      const eligibleStudent = MOCK_STUDENTS[savedUser.email];
      if (!savedStudent) return null;
      return {
        ...savedStudent,
        coins: Math.max(savedStudent.coins ?? 0, eligibleStudent?.coins ?? 0)
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  });
  const [onboardedStudents, setOnboardedStudents] = useState(() => {
    try {
      const savedStudents = JSON.parse(localStorage.getItem('so_onboarded_students')) || {};
      return Object.fromEntries(
        Object.entries(savedStudents).map(([email, student]) => {
          const eligibleStudent = MOCK_STUDENTS[email];
          return [
            email,
            {
              ...student,
              coins: Math.max(student.coins ?? 0, eligibleStudent?.coins ?? 0)
            }
          ];
        })
      );
    } catch (e) {
      console.error(e);
      return {};
    }
  });

  // Unified dynamic Master Teachers state loaded from localStorage or default TEACHERS
  const [teachersData, setTeachersData] = useState(() => {
    const saved = localStorage.getItem('so_teachers_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 117) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return TEACHERS;
  });

  const [currentTeacher, setCurrentTeacher] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('so_teacher'));
    if (saved) {
      // Return matching teacher from teachersData to ensure reference sync
      const matched = teachersData.find(t => t.id === saved.id);
      if (matched) return matched;
    }
    return teachersData[0] || TEACHERS[0];
  });

  const [sessions, setSessions] = useState(() => {
    return JSON.parse(localStorage.getItem('so_sessions')) || [];
  });
  const [tutorRequests, setTutorRequests] = useState(() => {
    return JSON.parse(localStorage.getItem('so_tutor_requests')) || [];
  });
  const [activeRequest, setActiveRequest] = useState(() => {
    return null;
  });

  // UI Control States
  const [studentSection, setStudentSection] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [confirmedSession, setConfirmedSession] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('so_admin_auth') === 'true';
  });
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const firestoreWarningShown = useRef(false);

  // Ruangguru Revamp States
  const [activeTab, setActiveTab] = useState('tersedia');
  const [selectedDashboardDate, setSelectedDashboardDate] = useState(() => formatDate(new Date()));
  const [dashboardDates, setDashboardDates] = useState([]);
  const [wizardSubject, setWizardSubject] = useState('');
  const [wizardDate, setWizardDate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if ((window.location.pathname === '/admin' || params.get('view') === 'admin') && isAdminAuthenticated) {
      setActiveRole('admin');
    }
  }, [isAdminAuthenticated]);

  // Generate dates for the dashboard carousel
  useEffect(() => {
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const generated = [];

    for (let i = 0; i < 12; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + i);
      const dateVal = formatDate(targetDate);
      
      let dayStr = dayNames[targetDate.getDay()];
      if (i === 0) dayStr = "Hari ini";
      if (i === 1) dayStr = "Besok";

      generated.push({
        value: dateVal,
        dayName: dayStr,
        dateNum: targetDate.getDate(),
        monthStr: targetDate.toLocaleString('id-ID', { month: 'short' })
      });
    }

    setDashboardDates(generated);
    if (generated.length > 0) {
      setSelectedDashboardDate(generated[0].value);
    }
  }, []);

  // References
  const autoAcceptTimer = useRef(null);

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('so_student', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('so_onboarded_students', JSON.stringify(onboardedStudents));
  }, [onboardedStudents]);

  useEffect(() => {
    if (!currentUser?.email) return;
    const eligibleStudent = MOCK_STUDENTS[currentUser.email];
    if (!eligibleStudent || (currentUser.coins ?? 0) >= (eligibleStudent.coins ?? 0)) return;

    const updatedUser = {
      ...currentUser,
      coins: eligibleStudent.coins
    };
    setCurrentUser(updatedUser);
    setOnboardedStudents(prev => ({
      ...prev,
      [updatedUser.email]: updatedUser
    }));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('so_teacher', JSON.stringify(currentTeacher));
  }, [currentTeacher]);

  useEffect(() => {
    localStorage.setItem('so_teachers_list', JSON.stringify(teachersData));
  }, [teachersData]);

  useEffect(() => {
    localStorage.setItem('so_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const requestsQuery = query(collection(db, 'tutorRequests'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const cloudRequests = snapshot.docs.map(requestDoc => ({
          id: requestDoc.id,
          ...requestDoc.data()
        }));
        setTutorRequests(cloudRequests);
        localStorage.setItem('so_tutor_requests', JSON.stringify(cloudRequests));
      },
      (error) => {
        console.error('Firestore tutorRequests sync failed:', error);
        if (!firestoreWarningShown.current) {
          firestoreWarningShown.current = true;
          showToast('Firestore belum bisa diakses. Data sementara masih tersimpan di browser ini.', 'warning');
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'studentProfiles'),
      (snapshot) => {
        const cloudStudents = {};
        snapshot.docs.forEach(profileDoc => {
          const student = profileDoc.data();
          if (student?.email) {
            const eligibleStudent = MOCK_STUDENTS[student.email];
            cloudStudents[student.email] = {
              ...student,
              coins: Math.max(student.coins ?? 0, eligibleStudent?.coins ?? 0)
            };
          }
        });

        if (Object.keys(cloudStudents).length === 0) return;

        setOnboardedStudents(prev => ({
          ...prev,
          ...cloudStudents
        }));

        setCurrentUser(prev => {
          if (!prev?.email || !cloudStudents[prev.email]) return prev;
          return {
            ...prev,
            ...cloudStudents[prev.email]
          };
        });
      },
      (error) => {
        console.error('Firestore studentProfiles sync failed:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const sessionsQuery = query(collection(db, 'sessions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const cloudSessions = snapshot.docs.map(sessionDoc => ({
          id: sessionDoc.id,
          ...sessionDoc.data()
        }));
        if (cloudSessions.length === 0) return;
        setSessions(cloudSessions);
        localStorage.setItem('so_sessions', JSON.stringify(cloudSessions));
      },
      (error) => {
        console.error('Firestore sessions sync failed:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        if (snapshot.empty) return;
        const cloudTeachersById = Object.fromEntries(
          snapshot.docs.map(teacherDoc => [teacherDoc.id, teacherDoc.data()])
        );
        setTeachersData(prev => prev.map(teacher => (
          cloudTeachersById[teacher.id]
            ? { ...teacher, ...cloudTeachersById[teacher.id], id: teacher.id }
            : teacher
        )));
      },
      (error) => {
        console.error('Firestore teachers sync failed:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const hydratedRequests = tutorRequests.map(req => {
      if (req.sessionLink || !req.teacherFix) return req;
      const matchedTeacher = teachersData.find(teacher => teacher.name.trim().toLowerCase() === req.teacherFix.trim().toLowerCase());
      return {
        ...req,
        sessionLink: matchedTeacher?.gmeet || ''
      };
    });
    if (JSON.stringify(hydratedRequests) !== JSON.stringify(tutorRequests)) {
      setTutorRequests(hydratedRequests);
      return;
    }
    localStorage.setItem('so_tutor_requests', JSON.stringify(hydratedRequests));
  }, [tutorRequests, teachersData]);

  useEffect(() => {
    localStorage.removeItem('so_active_request');
  }, [activeRequest]);

  // Translate 24h standard slot like "13:00" to slot interval label "13:00-13:30"
  const get30MinSlotLabel = (timeSlot) => {
    return timeSlot;
  };

  // Gojek Matching Simulator Auto-Accept Trigger with dynamic availability check
  useEffect(() => {
    if (activeRequest) {
      if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);

      autoAcceptTimer.current = setTimeout(() => {
        // Find day of the week
        const dateObj = new Date(activeRequest.date);
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dayName = dayNames[dateObj.getDay()];

        // Find 30 min slot range
        const slotLabel = get30MinSlotLabel(activeRequest.timeSlot);

        // Filter candidate teachers who can teach this subject, have slot available, are not booked, and match the class restriction
        let candidates = teachersData.filter(t => {
          const teachesSubject = t.subjects.includes(activeRequest.subjectId);
          
          const slotSession = t.schedule?.[dayName]?.[slotLabel];
          const isAvail = (t.availability[dayName] || []).includes(slotLabel) || (slotSession && slotSession.type === 'ST' && !slotSession.isBooked);
          
          const isBooked = !!(slotSession && (slotSession.isBooked || slotSession.type === 'LT'));
          
          if (!teachesSubject || !isAvail || isBooked) {
            return false;
          }

          // Check class restriction
          if (slotSession && slotSession.class) {
            // Exact match for the slot's designated class
            return slotSession.class === activeRequest.class;
          } else {
            // Check teacher capability from notes
            const n = (t.notes || "").toUpperCase();
            const cls = (activeRequest.class || "").toUpperCase();
            if (cls.includes("SD")) return n.includes("SD");
            if (cls.includes("SMP")) return n.includes("SMP");
            if (cls.includes("SMA") || cls.includes("GAP")) return n.includes("SMA");
            return true;
          }
        });

        // Optional: If student requested a specific teacher, prioritize them
        if (activeRequest.teacherRequest) {
          const reqTeacher = candidates.find(c => c.name === activeRequest.teacherRequest);
          if (reqTeacher) {
            candidates = [reqTeacher];
          }
        }

        if (candidates.length > 0) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          handleAcceptRequest(activeRequest, chosen);
        } else {
          // No available teacher found!
          showToast("Maaf, tidak ada Master Teacher yang tersedia di slot tersebut (penuh / tidak online).", "danger");
          handleUpdateTutorRequest(activeRequest.id, { opsStatus: 'Sesi Tidak Tersedia' });
          setActiveRequest(null);
          setStudentSection('booking');
        }
      }, 7000);
    } else {
      if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);
    }

    return () => {
      if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);
    };
  }, [activeRequest, teachersData]);

  // Toast Generator Helper
  const showToast = (message, type = 'primary') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconHTML = 'ℹ️';
    if (type === 'success') iconHTML = '✅';
    if (type === 'warning') iconHTML = '⚠️';
    if (type === 'danger') iconHTML = '❌';
    
    toast.innerHTML = `
      <span style="margin-right: 8px;">${iconHTML}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  // Auth Functions
  const handleLogin = (user) => {
    if (user.role === 'admin') {
      setActiveRole('admin');
      setShowLogin(false);
      showToast('Masuk sebagai Admin', 'success');
      return;
    }
    if (user.role === 'teacher') {
      setActiveRole('teacher');
      setShowLogin(false);
      showToast('Masuk sebagai Master Teacher', 'success');
      return;
    }
    setCurrentUser(user);
    setActiveRole('student');
    setShowLogin(false);
    showToast(`Selamat datang kembali, ${user.name}!`, 'success');
    setStudentSection('landing');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const username = adminLoginForm.username.trim().toLowerCase();
    const password = adminLoginForm.password;

    if (username === 'admin' && password === '1234') {
      localStorage.setItem('so_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setActiveRole('admin');
      setAdminLoginError('');
      setTutorRequests(JSON.parse(localStorage.getItem('so_tutor_requests')) || []);
      return;
    }

    setAdminLoginError('Username atau password admin belum sesuai.');
  };

  const handleStudentOnboarding = (student) => {
    const normalizedEmail = student.email.trim().toLowerCase();
    const studentRecord = {
      ...student,
      role: 'student',
      email: normalizedEmail,
      coins: student.coins ?? 0
    };

    setOnboardedStudents(prev => ({
      ...prev,
      [normalizedEmail]: studentRecord
    }));
    setCurrentUser(studentRecord);
    setActiveRole('student');
    setShowLogin(false);
    setStudentSection('landing');
    setDoc(doc(db, 'studentProfiles', normalizedEmail), studentRecord).catch(error => {
      console.error('Failed to save student profile to Firestore:', error);
      showToast('Profil tersimpan lokal, tapi belum tersinkron ke device lain.', 'warning');
    });
    showToast(`Onboarding selesai. Selamat datang, ${studentRecord.name}!`, 'success');
  };

  const handleLogout = () => {
    if (activeRole !== 'student') {
      if (activeRole === 'admin') {
        localStorage.removeItem('so_admin_auth');
        setIsAdminAuthenticated(false);
        setAdminLoginForm({ username: '', password: '' });
      }
      setActiveRole('student');
      setCurrentUser(null);
      showToast('Kamu telah keluar dari mode khusus.', 'info');
      return;
    }
    setCurrentUser(null);
    setStudentSection('landing');
    showToast('Kamu telah logout.', 'info');
  };

  // Booking Flow
  const handleStartBooking = () => {
    if (!currentUser) {
      showToast('Silakan login terlebih dahulu menggunakan email Ruangguru.', 'warning');
      setShowLogin(true);
      return;
    }
    setWizardSubject('');
    setWizardDate(selectedDashboardDate);
    setStudentSection('booking');
  };

  const handleBookingSubmit = (bookingData) => {
    if (currentUser.coins < 10) {
      showToast('Koin belajar kamu tidak cukup. Silakan top up koin.', 'warning');
      setShowTopup(true);
      return;
    }

    const reqId = "REQ-" + Math.floor(10000 + Math.random() * 90000);
    const crmRequest = {
      id: reqId,
      studentName: bookingData.name,
      studentEmail: bookingData.email,
      class: bookingData.class,
      package: bookingData.package,
      whatsapp: currentUser.whatsapp || '',
      submittedAt: new Date().toISOString(),
      subjectName: bookingData.subjectName,
      requestedDate: bookingData.date,
      requestedTime: bookingData.timeSlot,
      finalSameAsRequest: false,
      finalDate: '',
      finalTime: '',
      teacherRequest: bookingData.teacherRequest,
      teacherFix: '',
      sessionLink: '',
      opsStatus: 'Request Masuk',
      picSA: '',
      saNotes: '',
      opsNotes: '',
      lastUpdate: new Date().toISOString(),
      nextFollowUp: ''
    };

    setTutorRequests(prev => {
      const nextRequests = [crmRequest, ...prev];
      localStorage.setItem('so_tutor_requests', JSON.stringify(nextRequests));
      return nextRequests;
    });
    setDoc(doc(db, 'tutorRequests', reqId), crmRequest).catch(error => {
      console.error('Failed to save tutor request to Firestore:', error);
      showToast('Request tersimpan di browser ini, tapi belum tersinkron ke admin. Cek Firestore rules dulu ya.', 'warning');
    });
    setActiveRequest(null);
    setStudentSection('landing');
    setShowRequestSuccess(true);
  };

  const handleUpdateTutorRequest = (requestId, updates) => {
    const nextUpdates = {
      ...updates,
      lastUpdate: new Date().toISOString()
    };
    setTutorRequests(prev => {
      const nextRequests = prev.map(req => (
        req.id === requestId
          ? { ...req, ...nextUpdates }
          : req
      ));
      localStorage.setItem('so_tutor_requests', JSON.stringify(nextRequests));
      return nextRequests;
    });
    updateDoc(doc(db, 'tutorRequests', requestId), nextUpdates).catch(error => {
      console.error('Failed to update tutor request in Firestore:', error);
      showToast('Update tersimpan lokal, tapi belum tersinkron ke device lain.', 'warning');
    });
  };

  // Coin Purchase
  const handleTopupPurchase = (coinsToAdd) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      coins: currentUser.coins + coinsToAdd
    };
    setCurrentUser(updated);
    setOnboardedStudents(prev => ({
      ...prev,
      [updated.email]: updated
    }));
    setDoc(doc(db, 'studentProfiles', updated.email), updated).catch(error => {
      console.error('Failed to save student coins to Firestore:', error);
      showToast('Koin sudah berubah di browser ini, tapi belum tersinkron ke device lain.', 'warning');
    });
    setShowTopup(false);
    showToast(`Top Up Berhasil! +${coinsToAdd} Koin ditambahkan ke akunmu.`, 'success');
  };

  // Matching Engine confirmation & schedule plotting
  const handleAcceptRequest = (req, teacher) => {
    if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);

    // Deduct coins from student
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        coins: Math.max(0, currentUser.coins - 10)
      };
      setCurrentUser(updatedUser);
      setOnboardedStudents(students => ({
        ...students,
        [updatedUser.email]: updatedUser
      }));
      setDoc(doc(db, 'studentProfiles', updatedUser.email), updatedUser).catch(error => {
        console.error('Failed to save deducted student coins to Firestore:', error);
      });
    }

    const newSession = {
      id: "SES-" + Math.floor(100000 + Math.random() * 900000),
      requestId: req.id,
      studentName: req.studentName,
      studentEmail: req.studentEmail,
      class: req.class,
      package: req.package,
      subjectName: req.subjectName,
      date: req.date,
      timeSlot: req.timeSlot,
      notes: req.notes,
      teacherName: teacher.name,
      teacherAvatar: teacher.avatar,
      teacherDesc: teacher.desc,
      status: 'Confirmed',
      timestamp: new Date().getTime()
    };

    // Parse date to day name
    const dateObj = new Date(req.date);
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = dayNames[dateObj.getDay()];
    const slotLabel = get30MinSlotLabel(req.timeSlot);

    // Dynamic state update of the teacher schedule
    setTeachersData(prev => {
      return prev.map(t => {
        if (t.id === teacher.id) {
          const updatedSchedule = { ...(t.schedule || {}) };
          if (!updatedSchedule[dayName]) {
            updatedSchedule[dayName] = {};
          }
          updatedSchedule[dayName][slotLabel] = {
            ...updatedSchedule[dayName][slotLabel],
            type: 'ST',
            class: req.class,
            isBooked: true
          };
          const updated = { ...t, schedule: updatedSchedule };
          
          // Keep currentTeacher state in sync
          if (currentTeacher && currentTeacher.id === t.id) {
            setCurrentTeacher(updated);
          }
          return updated;
        }
        return t;
      });
    });

    setSessions(prev => [newSession, ...prev]);
    setDoc(doc(db, 'sessions', newSession.id), newSession).catch(error => {
      console.error('Failed to save session to Firestore:', error);
      showToast('Sesi tersimpan lokal, tapi belum tersinkron ke device lain.', 'warning');
    });
    handleUpdateTutorRequest(req.id, {
      opsStatus: 'MT Tersedia',
      teacherFix: teacher.name,
      sessionLink: teacher.gmeet || ''
    });
    setActiveRequest(null);
    setConfirmedSession(newSession);
    setStudentSection('confirmed');

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    showToast(`Sesi belajar berhasil dicocokkan dengan ${teacher.name}!`, 'success');
  };

  // Cancel Matching
  const handleCancelMatching = () => {
    if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);
    if (activeRequest?.id) {
      handleUpdateTutorRequest(activeRequest.id, { opsStatus: 'Dibatalkan Siswa' });
    }
    setActiveRequest(null);
    setStudentSection('landing');
    showToast("Request booking dibatalkan.", "info");
  };

  const handleRejectRequest = () => {
    if (autoAcceptTimer.current) clearTimeout(autoAcceptTimer.current);
    showToast("Request ditolak. Sistem akan mencoba mencarikan tutor lain.", "info");
    if (activeRequest?.id) {
      handleUpdateTutorRequest(activeRequest.id, { opsStatus: 'Dibatalkan Siswa' });
    }
    setActiveRequest(null);
    setTimeout(() => {
      showToast("Maaf, tidak ada Master Teacher yang tersedia di slot tersebut.", "danger");
      setStudentSection('booking');
    }, 1500);
  };

  // Update session status & sync cancellation back to teacher schedule
  const handleUpdateSessionStatus = (sessionId, status) => {
    const updated = sessions.map(sess => {
      if (sess.id === sessionId) {
        return { ...sess, status };
      }
      return sess;
    });
    setSessions(updated);
    updateDoc(doc(db, 'sessions', sessionId), { status }).catch(error => {
      console.error('Failed to update session status in Firestore:', error);
      showToast('Status sesi berubah lokal, tapi belum tersinkron ke device lain.', 'warning');
    });

    // If cancelled, refund student and clear slot in teacher schedule
    if (status === 'Cancelled') {
      const cancelledSess = sessions.find(s => s.id === sessionId);
      if (cancelledSess) {
        // Refund koin
        if (currentUser && cancelledSess.studentEmail === currentUser.email) {
          const updatedUser = {
            ...currentUser,
            coins: currentUser.coins + 10
          };
          setCurrentUser(updatedUser);
          setOnboardedStudents(students => ({
            ...students,
            [updatedUser.email]: updatedUser
          }));
          setDoc(doc(db, 'studentProfiles', updatedUser.email), updatedUser).catch(error => {
            console.error('Failed to refund student coins in Firestore:', error);
          });
          showToast("Sesi dibatalkan. 10 Koin dikembalikan ke siswa.", "info");
        }

        const dateObj = new Date(cancelledSess.date);
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dayName = dayNames[dateObj.getDay()];
        const slotLabel = get30MinSlotLabel(cancelledSess.timeSlot);

        // Revert slot back to available in teacher schedule or remove if not ST
        setTeachersData(prev => {
          return prev.map(t => {
            if (t.name === cancelledSess.teacherName) {
              const updatedSchedule = { ...(t.schedule || {}) };
              if (updatedSchedule[dayName] && updatedSchedule[dayName][slotLabel]) {
                if (updatedSchedule[dayName][slotLabel].type === 'ST') {
                  updatedSchedule[dayName][slotLabel] = {
                    ...updatedSchedule[dayName][slotLabel],
                    isBooked: false
                  };
                } else {
                  delete updatedSchedule[dayName][slotLabel];
                }
              }
              const updated = { ...t, schedule: updatedSchedule };
              
              if (currentTeacher && currentTeacher.id === t.id) {
                setCurrentTeacher(updated);
              }
              return updated;
            }
            return t;
          });
        });
      }
    } else {
      showToast(`Sesi tutor ditandai sebagai: ${status}`, "success");
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (sessions.length === 0) {
      showToast("Belum ada data sesi untuk diekspor.", "warning");
      return;
    }

    const headers = ["Session ID", "Student Name", "Student Email", "Class", "Package Tier", "Subject", "Teacher Name", "Scheduled Date", "Time Slot", "Status", "Created Timestamp"];
    const csvRows = [headers.join(",")];

    sessions.forEach(sess => {
      const row = [
        `"${sess.id}"`,
        `"${sess.studentName.replace(/"/g, '""')}"`,
        `"${sess.studentEmail}"`,
        `"${sess.class}"`,
        `"${sess.package}"`,
        `"${sess.subjectName}"`,
        `"${sess.teacherName}"`,
        `"${sess.date}"`,
        `"${sess.timeSlot}"`,
        `"${sess.status}"`,
        `"${new Date(sess.timestamp).toISOString()}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BA_SesiTutor_Export_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    
    document.body.removeChild(link);
    showToast("File CSV Berhasil Diekspor!", "success");
  };

  const getValidationGradeAndSubject = (classStr, teacherSubject) => {
    let cls = classStr ? classStr.trim() : "";
    let sub = teacherSubject ? teacherSubject.trim() : "";

    // 1. If class contains "SD":
    if (cls.includes("SD")) {
      const match = cls.match(/\d+/);
      const year = match ? match[0] : "";
      const baseGrade = year ? `${year} SD` : "3 SD";

      let valSubject = sub;
      if (sub === "Matematika" || sub === "Bahasa Indonesia" || sub === "Bahasa Inggris" || sub === "PKN") {
        valSubject = sub;
      } else if (["Biologi", "Fisika", "Kimia", "IPA Bio", "IPA Fis", "IPAS IPA", "IPA"].includes(sub)) {
        valSubject = "IPAS IPA";
      } else if (["Ekonomi", "Geografi", "Sosiologi", "Sejarah", "IPS Eko", "IPS Sos", "IPS Geo", "IPS Sej", "IPAS IPS", "IPS"].includes(sub)) {
        valSubject = "IPAS IPS";
      }
      return { grade: baseGrade, subject: valSubject };
    }

    // 2. If class contains "SMP":
    if (cls.includes("SMP")) {
      const match = cls.match(/\d+/);
      const year = match ? match[0] : "";
      const baseGrade = year ? `${year} SMP` : "7 SMP";

      let valSubject = sub;
      if (sub === "Matematika" || sub === "Bahasa Indonesia" || sub === "Bahasa Inggris" || sub === "PKN" || sub === "Informatika") {
        valSubject = sub;
      } else if (["Biologi", "IPA Bio", "IPA", "Kimia"].includes(sub)) {
        valSubject = "IPA Bio";
      } else if (["Fisika", "IPA Fis"].includes(sub)) {
        valSubject = "IPA Fis";
      } else if (["Ekonomi", "IPS Eko", "IPS"].includes(sub)) {
        valSubject = "IPS Eko";
      } else if (["Sosiologi", "IPS Sos"].includes(sub)) {
        valSubject = "IPS Sos";
      } else if (["Geografi", "IPS Geo"].includes(sub)) {
        valSubject = "IPS Geo";
      } else if (["Sejarah", "IPS Sej"].includes(sub)) {
        valSubject = "IPS Sej";
      }
      return { grade: baseGrade, subject: valSubject };
    }

    // 3. If class contains "Gap Year" or "SBMPTN":
    if (cls.includes("Gap Year") || cls.includes("SBMPTN") || cls.includes("Lulusan")) {
      let valSubject = "Pengetahuan Kuantitatif";
      if (["Matematika", "Pengetahuan Kuantitatif", "PKT", "pnm", "pkt"].includes(sub)) {
        valSubject = "Pengetahuan Kuantitatif";
      } else if (["Bahasa Indonesia", "Pemahaman Bacaan", "PBM", "PPU", "b_indo", "ppu", "lbi"].includes(sub)) {
        valSubject = "Pemahaman Bacaan";
      } else if (["Penalaran Umum", "PNU", "pnu"].includes(sub)) {
        valSubject = "Penalaran Umum";
      }
      return { grade: "SBMPTN IPA IPS", subject: valSubject };
    }

    // 4. If class contains "SMA":
    if (cls.includes("SMA")) {
      const match = cls.match(/\d+/);
      const year = match ? match[0] : "";
      const baseYear = year ? `${year} SMA` : "12 SMA";

      if (["Bahasa Indonesia", "Bahasa Inggris"].includes(sub)) {
        return { grade: `${baseYear} IPA IPS`, subject: sub };
      }

      let track = "";
      if (cls.includes("IPA")) {
        track = "IPA";
      } else if (cls.includes("IPS")) {
        track = "IPS";
      } else {
        if (["Biologi", "Fisika", "Kimia", "IPA Bio", "IPA Fis", "IPA"].includes(sub)) {
          track = "IPA";
        } else if (["Ekonomi", "Geografi", "Sosiologi", "Sejarah", "IPS Eko", "IPS Sos", "IPS Geo", "IPS Sej", "IPS"].includes(sub)) {
          track = "IPS";
        } else {
          track = "IPA";
        }
      }
      return { grade: `${baseYear} ${track}`, subject: sub };
    }

    return { grade: cls, subject: sub };
  };

  const handleExportSLMSCSV = (weekStartDate) => {
    const headers = [
      "email_guru",
      "tanggal",
      "jam",
      "durasi",
      "link kelas",
      "kapasitas",
      "catatan",
      "class",
      "subject",
      "topik",
      "type-product",
      "consultation_type"
    ];

    const csvRows = [headers.join(",")];

    const dayOffsets = {
      "Senin": 0,
      "Selasa": 1,
      "Rabu": 2,
      "Kamis": 3,
      "Jumat": 4,
      "Sabtu": 5
    };

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const [yr, mn, dy] = weekStartDate.split("-").map(Number);
    const start = new Date(yr, mn - 1, dy);

    teachersData.forEach(teacher => {
      const email = teacher.email;
      const gmeet = teacher.gmeet || "";
      const schedule = teacher.schedule || {};

      Object.keys(schedule).forEach(dayName => {
        const offset = dayOffsets[dayName];
        if (offset === undefined) return;

        const daySchedule = schedule[dayName] || {};
        Object.keys(daySchedule).forEach(timeSlot => {
          const sessionInfo = daySchedule[timeSlot];
          if (!sessionInfo || sessionInfo.type !== 'ST') return;

          // Calculate date
          const d = new Date(start);
          d.setDate(start.getDate() + offset);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;

          // Time offset
          let exportTime = timeSlot;
          if (dayName !== "Sabtu") {
            if (timeSlot === "15:00") {
              exportTime = "15:15";
            } else if (timeSlot === "16:00") {
              exportTime = "16:15";
            }
          }

          // Lookup serials
          const norm = getValidationGradeAndSubject(sessionInfo.class, teacher.subject);
          const key = `${norm.grade}|${norm.subject}`;
          const mapping = validationMap[key];
          const gradeSerial = mapping ? mapping.gradeSerial : "#N/A";
          const subjectSerial = mapping ? mapping.subjectSerial : "#N/A";

          const row = [
            escapeCsv(email),
            escapeCsv(dateStr),
            escapeCsv(exportTime),
            "60",
            escapeCsv(gmeet),
            "1",
            escapeCsv("Persiapkan dirimu Brainies saat Klinik PR, kamu bisa mengajukan 2 soal dahulu jika durasi berlebih bisa mengajukan soal lagi. Datang tepat waktu yaa :)"),
            escapeCsv(gradeSerial),
            escapeCsv(subjectSerial),
            "",
            escapeCsv("brainacademy-premium, brainacademy-elite, brainacademy-regular"),
            "Node-B8LY0C48"
          ];

          csvRows.push(row.join(","));
        });
      });
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Jadwal_Sesi_Tutor_Upload_${weekStartDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File CSV Berhasil Diekspor!", "success");
  };

  const handleExportTutorRequestsCSV = () => {
    const headers = [
      "email_guru",
      "tanggal",
      "jam",
      "durasi",
      "link kelas",
      "kapasitas",
      "catatan",
      "class",
      "subject",
      "topik",
      "type-product",
      "consultation_type"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const normalizeTime = (time) => {
      if (!time) return "";
      return String(time).replace(".", ":");
    };

    const normalizeDateForCsv = (dateValue) => {
      if (!dateValue) return "";
      const value = String(dateValue).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

      const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (slashMatch) {
        const [, day, month, year] = slashMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return formatDate(date);
    };

    const excelSafeDate = (dateValue) => {
      const normalizedDate = normalizeDateForCsv(dateValue);
      return normalizedDate ? `="${normalizedDate}"` : "";
    };

    const readyRequests = tutorRequests.filter(req => {
      const finalDate = req.finalDate || (req.finalSameAsRequest ? req.requestedDate : "");
      const finalTime = req.finalTime || (req.finalSameAsRequest ? req.requestedTime : "");
      return req.teacherFix && finalDate && finalTime;
    });

    if (readyRequests.length === 0) {
      showToast("Belum ada request dengan MT Fix dan Jadwal Final yang siap diekspor.", "warning");
      return;
    }

    const csvRows = [headers.join(",")];

    readyRequests.forEach(req => {
      const teacher = teachersData.find(t => t.name.trim().toLowerCase() === req.teacherFix.trim().toLowerCase());
      const finalDate = excelSafeDate(req.finalDate || req.requestedDate);
      const finalTime = normalizeTime(req.finalTime || req.requestedTime);
      const teacherSubject = teacher?.subject || req.subjectName;
      const norm = getValidationGradeAndSubject(req.class, teacherSubject);
      const key = `${norm.grade}|${norm.subject}`;
      const mapping = validationMap[key];

      const row = [
        escapeCsv(teacher?.email || ""),
        escapeCsv(finalDate),
        escapeCsv(finalTime),
        "60",
        escapeCsv(teacher?.gmeet || req.sessionLink || ""),
        "1",
        escapeCsv("Persiapkan dirimu Brainies saat Klinik PR, kamu bisa mengajukan 2 soal dahulu jika durasi berlebih bisa mengajukan soal lagi. Datang tepat waktu yaa :)"),
        escapeCsv(mapping ? mapping.gradeSerial : "#N/A"),
        escapeCsv(mapping ? mapping.subjectSerial : "#N/A"),
        "",
        escapeCsv("brainacademy-premium, brainacademy-elite, brainacademy-regular"),
        "Node-B8LY0C48"
      ];

      csvRows.push(row.join(","));
    });

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Jadwal_Sesi_Tutor_Request_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV request siap upload berhasil diekspor.", "success");
  };

  // Teacher switcher
  const handleSwitchTeacher = () => {
    const idx = teachersData.findIndex(t => t.id === currentTeacher.id);
    const nextIdx = (idx + 1) % teachersData.length;
    const nextTeacher = teachersData[nextIdx];
    setCurrentTeacher(nextTeacher);
    showToast(`Beralih ke Master Teacher: ${nextTeacher.name}`, 'info');
  };

  // Save changes from teacher or admin edits
  const handleUpdateTeacher = (teacherId, updatedTeacher) => {
    setTeachersData(prev => {
      const next = prev.map(t => {
        if (t.id === teacherId) {
          return updatedTeacher;
        }
        return t;
      });
      return next;
    });

    if (currentTeacher && currentTeacher.id === teacherId) {
      setCurrentTeacher(updatedTeacher);
    }
    setDoc(doc(db, 'teachers', teacherId), updatedTeacher).catch(error => {
      console.error('Failed to save teacher data to Firestore:', error);
      showToast('Data MT tersimpan lokal, tapi belum tersinkron ke device lain.', 'warning');
    });
  };

  // Helper render initials
  const getAvatarInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRequestStatusClass = (status) => {
    if (status === 'Request Masuk') return 'gray';
    if (status === 'Dicarikan MT' || status === 'MT Tersedia' || status === 'Alternatif Jadwal') return 'blue';
    if (status === 'Follow Up Siswa') return 'yellow';
    if (status === 'Sesi Diterima') return 'green';
    if (status === 'Dibatalkan Siswa' || status === 'Sesi Tidak Tersedia' || status === 'Koin Tidak Cukup') return 'red';
    return 'gray';
  };

  const myTutorRequests = currentUser
    ? tutorRequests.filter(req => req.studentEmail === currentUser.email)
    : [];

  const isAdminRoute = window.location.pathname === '/admin' || new URLSearchParams(window.location.search).get('view') === 'admin';

  if (isAdminRoute && !isAdminAuthenticated) {
    return (
      <div className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleAdminLogin}>
          <img src="/Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Online Logo" className="admin-login-logo" />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Masuk untuk melihat dan mengelola request Sesi Tutor.</p>
          </div>

          {adminLoginError && <div className="login-error-message">{adminLoginError}</div>}

          <div className="form-field">
            <label>Username</label>
            <input
              type="text"
              value={adminLoginForm.username}
              onChange={(e) => setAdminLoginForm(prev => ({ ...prev, username: e.target.value }))}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={adminLoginForm.password}
              onChange={(e) => setAdminLoginForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="1234"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block btn-login-submit">
            Masuk Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className={`app-container ${activeRole === 'admin' ? 'admin-layout-container' : ''}`} id="appContainer">
        
        {/* STUDENT WORKSPACE */}
        {activeRole === 'student' && (
          <div className="view-panel student-panel" id="studentPanel" style={{ position: 'relative' }}>
            
            <header className="app-header">
              <div className="header-logo-group">
                <img src="/Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Online Logo" className="brand-logo-ba" />
                <div className="logo-divider"></div>
                <img src="/SesiTutor_Logo_Draft2-02 (1).png" alt="SesiTutor Logo" className="brand-logo-sesitutor" />
              </div>
              
              <div className="app-nav-tabs">
                <a
                  href="https://sesitutor-landing-page.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    fontFamily: 'var(--font-family-sans)',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                  Lebih Tau Sesi Tutor
                </a>
                <button
                  onClick={() => setStudentSection('landing')}
                  style={{ 
                    fontFamily: 'var(--font-family-sans)',
                    fontWeight: '800',
                    color: studentSection === 'landing' ? '#00C16E' : '#1C2A39',
                    backgroundColor: studentSection === 'landing' ? '#E6F8F3' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '8px 20px',
                    borderRadius: '99px'
                  }}
                >
                  Sesi Tutor On Demand
                </button>
                {currentUser && (
                  <button
                    onClick={() => setStudentSection('requests')}
                    style={{ 
                      fontFamily: 'var(--font-family-sans)',
                      fontWeight: '800',
                      color: studentSection === 'requests' ? '#00C16E' : '#1C2A39',
                      backgroundColor: studentSection === 'requests' ? '#E6F8F3' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '8px 20px',
                      borderRadius: '99px'
                    }}
                  >
                    Request Saya
                  </button>
                )}
                <button
                  onClick={() => setStudentSection('booking')}
                  style={{ 
                    fontFamily: 'var(--font-family-sans)',
                    fontWeight: '800',
                    color: studentSection === 'booking' ? '#00C16E' : '#1C2A39',
                    backgroundColor: studentSection === 'booking' ? '#E6F8F3' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '8px 20px',
                    borderRadius: '99px'
                  }}
                >
                  Isi Form
                </button>
                <a
                  href="#faq"
                  onClick={() => setStudentSection('landing')}
                  style={{ 
                    fontFamily: 'var(--font-family-sans)',
                    fontWeight: '800',
                    color: '#1C2A39',
                    textDecoration: 'none',
                    fontSize: '14px',
                    padding: '8px 20px'
                  }}
                >
                  FAQ
                </a>
              </div>

              <div className="student-profile-nav">
                {currentUser ? (
                  <div className="profile-widget">
                    <div className="profile-avatar">{getAvatarInitials(currentUser.name)}</div>
                    <div className="profile-info">
                      <span className="name" title={currentUser.name}>{currentUser.name}</span>
                      <span 
                        className="coins" 
                        onClick={() => setShowTopup(true)} 
                        style={{ cursor: 'pointer' }}
                        title="Klik untuk Top Up Koin"
                      >
                        <Coins size={12} /> <span id="navCoinCount">{currentUser.coins}</span> Koin
                      </span>
                    </div>
                    <button className="btn-logout-small" onClick={handleLogout} title="Logout">
                      <LogOut size={14} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)}
                    style={{
                      backgroundColor: '#FA5C5C',
                      color: 'white',
                      border: 'none',
                      borderRadius: '99px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
                    onMouseOut={e => e.currentTarget.style.transform = 'none'}
                  >
                    Login & Akses
                  </button>
                )}
              </div>
            </header>

            <main className="panel-content">
              
              {/* LANDING SECTION */}
              {studentSection === 'landing' && (
                 <section className="student-section active">
                   {/* 1. Hero Section */}
                   <div className="hero-modern-section">
                     <div className="hero-modern-container">
                       <div className="hero-modern-left">
                         <div className="hero-title-row">
                           <div className="hero-badge-ba">
                             <span className="badge-icon">🛡️</span>
                             <span className="badge-text">OFFICIAL BRAIN ACADEMY ONLINE PROGRAM</span>
                           </div>
                           <h1 className="hero-modern-title">
                             <span className="hero-title-firstline">Belajar Lebih Fleksibel</span>
                             <span className="hero-title-secondline">Sesuai <span className="highlight-blue">Kebutuhanmu</span>.</span>
                           </h1>
                         </div>
                         
                         <div className="hero-subtitles">
                           <p className="hero-sub-primary">
                             Request sesi belajar sesuai mapel, jadwal, dan Master Teacher favoritmu.
                           </p>
                           <p className="hero-sub-secondary">
                             Isi form dan tim kami akan membantu mencarikan sesi sesuai kebutuhanmu.
                           </p>
                         </div>
                         
                         <div className="hero-checkmarks-row">
                           <div className="hero-check-pill">
                             <CheckCircle size={16} color="#00C16E" />
                             <span className="check-text">Jadwal Fleksibel</span>
                           </div>
                           <div className="hero-check-pill">
                             <CheckCircle size={16} color="#00C16E" />
                             <span className="check-text">Request Materi Khusus</span>
                           </div>
                           <div className="hero-check-pill">
                             <CheckCircle size={16} color="#00C16E" />
                             <span className="check-text">1-on-1 Master Teacher</span>
                           </div>
                         </div>
                         
                         <div className="hero-cta-group">
                           <button className="hero-cta-btn-red" onClick={() => setStudentSection('booking')}>
                             <div className="hero-cta-icon-circle">💬</div>
                             <span className="hero-cta-btn-text">Pesan Sesi Sekarang</span>
                             <span className="hero-cta-arrow">➔</span>
                           </button>
                           <p className="hero-cta-desc">
                             Bebas request pembahasan PR, latihan soal, UTBK, ujian sekolah, dan kebutuhan belajar lainnya secara on-demand.
                           </p>
                         </div>
                       </div>

                       <div className="hero-modern-right">
                         <div className="hero-image-wrapper" aria-label="Ilustrasi sesi tutor online">
                           <div className="hero-illustration-card">
                             <img src="/hero_reference_illustration.png" alt="Siswa sedang mengikuti sesi tutor online" className="hero-illustration-img" />
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Floating Social Proof Bar */}
                     <div className="hero-social-proof-bar">
                       <div className="social-proof-item">
                         <div className="social-proof-icon-box yellow">📖</div>
                         <div className="social-proof-text">
                           <strong>1.000+</strong>
                           <span>Sesi telah berjalan</span>
                         </div>
                       </div>
                       <div className="social-proof-divider"></div>
                       <div className="social-proof-item">
                         <div className="social-proof-icon-box orange">⭐</div>
                         <div className="social-proof-text">
                           <strong>4.9/5</strong>
                           <span>Rata-rata rating siswa</span>
                         </div>
                       </div>
                       <div className="social-proof-divider"></div>
                       <div className="social-proof-item">
                         <div className="social-proof-icon-box blue">👤</div>
                         <div className="social-proof-text">
                           <strong>Master Teacher</strong>
                           <span>Berpengalaman & terkurasi</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* 2. Benefit Section */}
                   <div className="benefits-section">
                     <div className="benefits-container">
                       <h2 className="benefits-title">Kenapa Sesi Tutor On Demand?</h2>
                       <div className="benefits-underline"></div>
                       
                       <div className="benefits-grid">
                         <div className="benefit-modern-card">
                           <div className="benefit-icon-circle bg-green">
                             <span className="benefit-icon-emoji">📅</span>
                           </div>
                           <h3 className="benefit-card-title">Jadwal Fleksibel</h3>
                           <p className="benefit-card-desc">Pilih waktu belajar sesuai kebutuhanmu tanpa perlu menunggu kelas dimulai.</p>
                         </div>

                         <div className="benefit-modern-card">
                           <div className="benefit-icon-circle bg-yellow">
                             <span className="benefit-icon-emoji">📚</span>
                           </div>
                           <h3 className="benefit-card-title">Request Materi Khusus</h3>
                           <p className="benefit-card-desc">Bebas request pembahasan PR, latihan soal, UTBK, ujian sekolah, hingga materi tertentu.</p>
                         </div>

                         <div className="benefit-modern-card">
                           <div className="benefit-icon-circle bg-purple">
                             <span className="benefit-icon-emoji">🎯</span>
                           </div>
                           <h3 className="benefit-card-title">Fokus Belajar Personal</h3>
                           <p className="benefit-card-desc">Belajar lebih nyaman karena sesi dilakukan secara 1-on-1 bersama Master Teacher.</p>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* 3. Steps Flow Section */}
                   <div className="flow-section-wrapper">
                     <div className="flow-container">
                       <h2 className="flow-title">Tinggal Request, Kami Siapkan</h2>
                       <p className="flow-subtitle">Kirim kebutuhan belajarmu dan tim kami akan membantu menyiapkan sesi yang sesuai.</p>
                       
                       <div className="flow-steps-grid">
                         {/* Step 1 */}
                         <div className="flow-step-card-wrapper">
                           <div className="flow-step-card">
                             <div className="flow-number-badge bg-red">1</div>
                             <div className="flow-card-icon-box">
                               <span className="flow-card-emoji">📝</span>
                             </div>
                             <h3 className="flow-card-title">Isi Form</h3>
                             <p className="flow-card-desc">Request mapel, jadwal, dan materi yang ingin dibahas sesuai kebutuhanmu.</p>
                           </div>
                         </div>

                         <div className="flow-step-arrow">➔</div>

                         {/* Step 2 */}
                         <div className="flow-step-card-wrapper">
                           <div className="flow-step-card">
                             <div className="flow-number-badge bg-green">2</div>
                             <div className="flow-card-icon-box">
                               <span className="flow-card-emoji">🔍</span>
                             </div>
                             <h3 className="flow-card-title">Kami Carikan Sesi yang Sesuai</h3>
                             <p className="flow-card-desc">Tim kami akan mengonfirmasi ketersediaan tutor dan jadwal maksimal dalam 1×24 jam kerja. Jika jadwal yang diinginkan belum tersedia, kami akan menawarkan alternatif sesi sesuai ketersediaan Master Teacher.</p>
                           </div>
                         </div>

                         <div className="flow-step-arrow">➔</div>

                         {/* Step 3 */}
                         <div className="flow-step-card-wrapper">
                           <div className="flow-step-card">
                             <div className="flow-number-badge bg-blue">3</div>
                             <div className="flow-card-icon-box">
                               <span className="flow-card-emoji">🚀</span>
                             </div>
                             <h3 className="flow-card-title">Booking & Mulai Belajar</h3>
                             <p className="flow-card-desc">Setelah sesi tersedia, kamu bisa langsung booking melalui aplikasi Ruangguru atau website Brain Academy.</p>
                             <a href="https://app.brainacademy.id/klinik-pr-online" target="_blank" rel="noopener noreferrer" className="flow-action-btn">
                               Booking via Brain Academy
                             </a>
                           </div>
                         </div>
                       </div>

                       <div className="flow-warning-note">
                         <span className="flow-note-icon">ℹ️</span>
                         <span className="flow-note-text">Catatan: Form yang masuk pada Sabtu, Minggu, atau hari libur nasional akan diproses pada hari kerja berikutnya.</span>
                       </div>
                     </div>
                   </div>

                   {/* 4. Coin Packages Section (updated) */}
                   <div className="section-divider"></div>

                   <section className="coin-packages-modern-section">
                     <div className="coin-packages-container">
                       <div className="coin-packages-left">
                         <h2 className="coin-packages-title">Pilih Paket Koin Sesi Tutor</h2>
                         <p className="coin-packages-subtitle">Gunakan koin untuk booking sesi belajar sesuai kebutuhanmu.</p>
                         <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" rel="noopener noreferrer" className="coin-packages-link">
                           Lihat detail koin ➔
                         </a>
                       </div>
                       <div className="coin-packages-right">
                         {/* Package 1 Month */}
                         <div className="pricing-card">
                           <div className="pricing-card-header">
                             <div className="pricing-header-icon-box blue-bg">🗓️</div>
                             <div className="pricing-header-text">
                               <h3>Paket 1 Bulan</h3>
                               <span>Berlaku 30 hari</span>
                             </div>
                           </div>
                           <div className="pricing-features-list">
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">5 Koin</span><span className="coin-price">Rp59.000</span></div>
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">10 Koin</span><span className="coin-price">Rp89.000</span></div>
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">15 Koin</span><span className="coin-price">Rp109.000</span></div>
                           </div>
                           <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" rel="noopener noreferrer" className="pricing-card-btn-outline">
                             Beli Sekarang
                           </a>
                         </div>
                         {/* Package 6 Months */}
                         <div className="pricing-card highlighted">
                           <div className="pricing-ribbon">PALING HEMAT</div>
                           <div className="pricing-card-header">
                             <div className="pricing-header-icon-box green-bg">📅</div>
                             <div className="pricing-header-text">
                               <h3>Paket 6 Bulan</h3>
                               <span>Berlaku 180 hari</span>
                             </div>
                           </div>
                           <div className="pricing-features-list">
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">10 Koin</span><span className="coin-price">Rp99.000 <span className="price-tag-badge">Hemat 5%</span></span></div>
                           <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">15 Koin</span><span className="coin-price">Rp119.000 <span className="price-tag-badge">Hemat 8%</span></span></div>
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">25 Koin</span><span className="coin-price">Rp179.000 <span className="price-tag-badge">Hemat 10%</span></span></div>
                             <div className="pricing-feature-row"><span className="coin-emoji">🪙</span><span className="coin-amount">50 Koin</span><span className="coin-price">Rp329.000 <span className="price-tag-badge yellow-badge">Best Value</span></span></div>
                           </div>
                           <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" rel="noopener noreferrer" className="pricing-card-btn-solid">
                             Beli Sekarang
                           </a>
                         </div>
                       </div>
                     </div>
                   </section>

                   <div className="section-divider"></div>

                   <div className="faq-section-wrapper">
                     <FAQSection />
                   </div>

                   <div className="section-divider"></div>

                   {/* BOTTOM CTA SECTION (Updated) */}
                   <section className="bottom-cta-banner">
                     <div className="bottom-cta-inner">
                       <div className="bottom-cta-content">
                         <h2>Siap Mulai Belajar?</h2>
                         <p>Pesan Sesi Tutor On-Demand pertamamu sekarang dan raih nilai impianmu!</p>
                        <button className="btn-primary btn-large" onClick={() => {
                            setStudentSection('booking');
                            document.getElementById('bookingFormSection')?.scrollIntoView({ behavior: 'smooth' });
                         }}>
                           Isi Form Sekarang
                         </button>
                       </div>
                       <div className="bottom-cta-illustration" aria-hidden="true">
                         <div className="cta-illu-card">
                           <span className="cta-illu-avatar">👩‍🎓</span>
                           <div className="cta-illu-copy">
                             <strong>Mendapat bimbingan 1-on-1</strong>
                             <p>Belajar lebih fokus, cepat paham, dan siap ujian.</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </section>

                    {/* ACTIVE BOOKINGS CONTAINER */}
                    {currentUser && (
                      <div className="active-bookings-container" style={{ width: '100%', marginTop: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
                        <h2 className="section-title" style={{ marginBottom: '24px', textAlign: 'center' }}>Sesi Tutor Aktif Kamu</h2>
                        {sessions.filter(s => s.studentEmail === currentUser.email && (s.status === 'Waiting Teacher' || s.status === 'Confirmed')).length === 0 ? (
                          <div className="session-list-empty">
                            <h3>Belum ada sesi tutor aktif</h3>
                            <p>Silakan klik tombol <strong>Isi Form Sekarang</strong> di atas untuk membuat request baru.</p>
                          </div>
                        ) : (
                          <div className="sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            {sessions.filter(s => s.studentEmail === currentUser.email && (s.status === 'Waiting Teacher' || s.status === 'Confirmed')).map(sess => (
                              <div key={sess.id} className="student-session-row-card">
                                <div className="row-card-left">
                                  <div className="row-card-avatar">
                                    {sess.subjectName.substring(0, 2)}
                                  </div>
                                  <div className="row-card-info" style={{ textAlign: 'left' }}>
                                    <h4 className="row-card-title">{sess.subjectName}: On Demand</h4>
                                    <div className="row-card-meta">
                                      <span>📅 {getFormattedDateString(sess.date)}</span>
                                      <span>•</span>
                                      <span>🕒 {sess.timeSlot} WIB</span>
                                      <span>•</span>
                                      <span>👤 Guru: {sess.teacherName}</span>
                                    </div>
                                    {sess.notes && <p className="row-card-notes">"{sess.notes}"</p>}
                                  </div>
                                </div>
                                <div className="row-card-right">
                                  <span className={`row-badge-status ${sess.status === 'Waiting Teacher' ? 'waiting' : 'confirmed'}`}>
                                    {sess.status === 'Waiting Teacher' ? 'Mencari Guru...' : 'Terkonfirmasi'}
                                  </span>
                                  <button 
                                    className="btn-logout-small" 
                                    onClick={() => handleUpdateSessionStatus(sess.id, 'Cancelled')}
                                    title="Batalkan Booking & Refund Koin"
                                    style={{ color: '#FF4D4F', fontWeight: 'bold' }}
                                  >
                                    Batalkan
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </section>
              )}

              {/* REQUEST LIST SECTION */}
              {studentSection === 'requests' && (
                <section className="student-section active">
                  <div className="student-requests-section">
                    <div className="student-requests-header">
                      <div>
                        <span className="section-subtitle">Daftar Request</span>
                        <h2 className="section-title">Request Sesi Kamu</h2>
                        <p className="section-desc">Pantau form Sesi Tutor yang sudah kamu kirim dan status konfirmasinya dari Student Advisor.</p>
                      </div>
                      <button className="btn-primary" type="button" onClick={() => setStudentSection('booking')}>
                        Isi Form Baru
                      </button>
                    </div>

                    {myTutorRequests.length === 0 ? (
                      <div className="session-list-empty">
                        <h3>Belum ada request sesi</h3>
                        <p>Request yang kamu kirim lewat form akan muncul di sini.</p>
                      </div>
                    ) : (
                      <div className="student-request-list">
                        {myTutorRequests.map(req => (
                          <div key={req.id} className="student-request-card">
                            <div className="student-request-main">
                              <div className="row-card-avatar">{req.subjectName.substring(0, 2)}</div>
                              <div>
                                <h3>{req.subjectName}</h3>
                                <div className="student-request-meta">
                                  <span>Diminta: {getFormattedDateString(req.requestedDate)}</span>
                                  <span>•</span>
                                  <span>{req.requestedTime} WIB</span>
                                  <span>•</span>
                                  <span>MT Request: {req.teacherRequest || 'Bebas'}</span>
                                </div>
                                {(req.finalDate || req.finalTime) && (
                                  <p className="student-request-note">
                                    Jadwal final: <strong>{req.finalDate ? getFormattedDateString(req.finalDate) : '-'}</strong>
                                    {req.finalTime ? `, ${req.finalTime} WIB` : ''}
                                  </p>
                                )}
                                {req.teacherFix && <p className="student-request-note">Master Teacher fix: <strong>{req.teacherFix}</strong></p>}
                                {req.sessionLink && (
                                  <a href={req.sessionLink} target="_blank" rel="noopener noreferrer" className="student-request-link">
                                    Buka link booking/session
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="student-request-side">
                              <span className={`crm-status-badge ${getRequestStatusClass(req.opsStatus)}`}>{req.opsStatus}</span>
                              <span className="crm-subtext">Dikirim: {new Date(req.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* BOOKING SECTION */}
              {studentSection === 'booking' && (
                <section className="student-section active">
                  <div className="booking-form-integration" style={{ marginTop: '20px', marginBottom: '40px' }} id="bookingFormSection">
                    <h2 className="section-title">Form Pesan Sesi On Demand</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-muted)' }}>
                      Isi kebutuhan belajarmu dan temukan Master Teacher terbaik sesuai materi dan jadwal yang kamu inginkan ✨<br/><br/>
                      1️⃣ <strong>Detail Sesi:</strong> Pilih jenjang kelas dan paket belajar yang kamu gunakan saat ini.<br/>
                      2️⃣ <strong>Mapel & Guru:</strong> Tentukan mata pelajaran yang ingin dipelajari dan request tutor favoritmu.<br/>
                      3️⃣ <strong>Jadwal:</strong> Pilih hari dan jam sesi sesuai waktu yang paling nyaman untukmu.
                    </p>
                    <BookingWizard 
                      currentUser={currentUser}
                      onSubmit={handleBookingSubmit}
                      onCancel={() => setStudentSection('landing')}
                      showToast={showToast}
                      subjects={SUBJECTS}
                      teachers={teachersData}
                      getFormattedDateString={getFormattedDateString}
                      formatDate={formatDate}
                      generateTimeSlotsArray={generateTimeSlotsArray}
                      initialSubject={wizardSubject}
                      initialDate={wizardDate}
                    />
                  </div>
                </section>
              )}

              {/* MATCHING SECTION */}
              {studentSection === 'matching' && (
                <section className="student-section active">
                  <MatchingRadar 
                    activeRequest={activeRequest}
                    onCancel={handleCancelMatching}
                    getFormattedDateString={getFormattedDateString}
                  />
                </section>
              )}

              {/* CONFIRMED SECTION */}
              {studentSection === 'confirmed' && (
                <section className="student-section active">
                  <ConfirmedScreen 
                    session={confirmedSession}
                    onGoHome={() => setStudentSection('landing')}
                    onGoTeacher={() => {
                      setActiveRole('teacher');
                      setSplitScreen(false);
                    }}
                    getFormattedDateString={getFormattedDateString}
                  />
                </section>
              )}

            </main>
          </div>
        )}

        {/* TEACHER WORKSPACE */}
        {activeRole === 'teacher' && (
          <div className="view-panel teacher-panel" id="teacherPanel">
            
            <header className="app-header">
              <div className="header-logo-group">
                <img src="/Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Online Logo" className="brand-logo-ba" />
                <div className="logo-divider"></div>
                <span className="teacher-title-badge">Dashboard Master Teacher</span>
              </div>

              <div className="teacher-profile-nav">
                <div className="teacher-active-user">
                  <div className="avatar">{currentTeacher.avatar}</div>
                  <div className="t-details">
                    <strong>{currentTeacher.name}</strong>
                    <span>{currentTeacher.desc.split("Spesialis ")[1] || currentTeacher.desc}</span>
                  </div>
                </div>
                <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: '12px', background: 'var(--color-danger)' }}>
                  <LogOut size={12} /> Keluar
                </button>
              </div>
            </header>

            <main className="panel-content">
              <TeacherDashboard 
                currentTeacher={currentTeacher}
                onSwitchTeacher={handleSwitchTeacher}
                activeRequest={activeRequest}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                sessions={sessions}
                onUpdateSessionStatus={handleUpdateSessionStatus}
                onExportToCSV={handleExportCSV}
                onUpdateTeacher={handleUpdateTeacher}
                getFormattedDateString={getFormattedDateString}
              />
            </main>

          </div>
        )}

        {/* ADMIN WORKSPACE */}
        {activeRole === 'admin' && (
          <div className="view-panel admin-panel" id="adminPanel" style={{ width: '100%' }}>
            
            <header className="app-header">
              <div className="header-logo-group">
                <img src="/Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Online Logo" className="brand-logo-ba" />
                <div className="logo-divider"></div>
                <div className="admin-header-badge">
                  <Sliders size={12} />
                  <span>Admin Workspace</span>
                </div>
              </div>
              <div className="teacher-profile-nav">
                <span className="status-indicator-dot online">Admin Active</span>
                <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: '12px', background: 'var(--color-danger)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogOut size={12} /> Keluar
                </button>
              </div>
            </header>

            <main className="panel-content">
              <AdminDashboard 
                teachers={teachersData}
                onUpdateTeacher={handleUpdateTeacher}
                sessions={sessions}
                tutorRequests={tutorRequests}
                onUpdateTutorRequest={handleUpdateTutorRequest}
                onRefreshTutorRequests={() => setTutorRequests(JSON.parse(localStorage.getItem('so_tutor_requests')) || [])}
                onExportTutorRequestsCSV={handleExportTutorRequestsCSV}
                getFormattedDateString={getFormattedDateString}
                onExportSLMSCSV={handleExportSLMSCSV}
              />
            </main>

          </div>
        )}

      </div>

      {/* MODALS */}
      <LoginModal 
        active={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
        registeredStudents={onboardedStudents}
        eligibleStudents={MOCK_STUDENTS}
        onOnboarding={handleStudentOnboarding}
      />

      <TopUpModal 
        active={showTopup} 
        onClose={() => setShowTopup(false)} 
        onPurchase={handleTopupPurchase} 
        currentCoins={currentUser?.coins || 0} 
      />

      {showRequestSuccess && (
        <div className="modal-overlay active">
          <div className="modal-card request-success-modal">
            <div className="request-success-icon">🎉</div>
            <h3>Request Berhasil Dikirim!</h3>
            <p>
              Terima kasih, request sesi tutor kamu sudah kami terima. Student Advisor akan mengonfirmasi ketersediaan tutor dan jadwal maksimal dalam 1×24 jam kerja.
            </p>
            <button
              type="button"
              className="btn-primary btn-block btn-login-submit"
              onClick={() => setShowRequestSuccess(false)}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Toast container */}
      <div className="toast-container" id="toastContainer"></div>
    </div>
  );
}
