import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Save, 
  Download, 
  Clock, 
  RefreshCw, 
  X, 
  Check, 
  CalendarDays, 
  Hourglass, 
  FileText, 
  Grid, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { getSlotsForDay } from '../utils/mockData';

export default function TeacherDashboard({ 
  currentTeacher,
  onSwitchTeacher,
  activeRequest,
  onAcceptRequest,
  onRejectRequest,
  sessions,
  onUpdateSessionStatus,
  onExportToCSV,
  onUpdateTeacher,
  getFormattedDateString
}) {
  // Tabs: 'availability' (Isi Availability) or 'schedule' (Jadwal & Request Baru)
  const [activeTab, setActiveTab] = useState('availability');

  // Local grid availability state (cloned from teacher object)
  const [localAvail, setLocalAvail] = useState(currentTeacher?.availability || {});
  const [localSchedule, setLocalSchedule] = useState(currentTeacher?.schedule || {});

  // Sync state when active teacher changes
  useEffect(() => {
    if (currentTeacher) {
      setLocalAvail(currentTeacher.availability || {});
      setLocalSchedule(currentTeacher.schedule || {});
    }
  }, [currentTeacher]);

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Union of all possible slots across weekdays and Saturdays
  const ALL_SLOTS = [
    "10:00", "11:00", "12:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00", "18:45", "19:30", "20:00", "20:30"
  ];

  // Handle slot toggle on the interactive grid
  const handleCellClick = (day, slot) => {
    const daySchedule = { ...(localSchedule[day] || {}) };
    const session = daySchedule[slot];

    // If there is an assigned session that is locked (LT or student booked ST)
    if (session && (session.type === 'LT' || session.isBooked)) {
      alert(`Slot ini sudah di-plot oleh admin untuk ${session.type === 'LT' ? 'Live Teaching' : 'Sesi Tutor'}: ${session.class}. Tidak bisa diubah.`);
      return;
    }

    const dayAvailList = localAvail[day] || [];
    let updatedAvailList;
    const updatedSchedule = { ...localSchedule };
    if (!updatedSchedule[day]) {
      updatedSchedule[day] = {};
    } else {
      updatedSchedule[day] = { ...updatedSchedule[day] };
    }

    // Is it currently available? Either in availability list or is an unbooked ST slot
    const isCurrentlyAvail = dayAvailList.includes(slot) || (session && session.type === 'ST' && !session.isBooked);

    if (isCurrentlyAvail) {
      // Toggle to Not Available
      updatedAvailList = dayAvailList.filter(s => s !== slot);
      delete updatedSchedule[day][slot];
    } else {
      // Toggle to Available
      updatedAvailList = [...dayAvailList.filter(s => s !== slot), slot];
      
      const getDefaultClass = (notes) => {
        const n = (notes || "").toUpperCase();
        if (n.includes("SMA")) return "12 SMA";
        if (n.includes("SMP")) return "9 SMP";
        if (n.includes("SD")) return "5 SD";
        return "12 SMA";
      };

      const defaultClass = getDefaultClass(currentTeacher.notes);
      updatedSchedule[day][slot] = {
        type: 'ST',
        class: defaultClass,
        mapel: currentTeacher.subject || 'Matematika'
      };
    }

    const updatedAvail = {
      ...localAvail,
      [day]: updatedAvailList
    };

    setLocalAvail(updatedAvail);
    setLocalSchedule(updatedSchedule);
    
    // Save to parent state immediately
    onUpdateTeacher(currentTeacher.id, {
      ...currentTeacher,
      availability: updatedAvail,
      schedule: updatedSchedule
    });
  };

  // Helper values for countdowns
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (activeRequest) {
      setCountdown(activeRequest.estWaitTime);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeRequest]);

  const isCapable = activeRequest && currentTeacher.subjects.includes(activeRequest.subjectId);
  const filteredSessions = sessions.filter(s => s.teacherName === currentTeacher.name);

  return (
    <div className="teacher-dashboard-layout-new">
      
      {/* TABS HEADER */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Clock size={16} /> Jadwal & Request Baru
        </button>
        <button 
          className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          <Grid size={16} /> Kelola Availability
        </button>
      </div>

      {activeTab === 'schedule' ? (
        <div className="teacher-grid-view">
          
          {/* LEFT: Driver Style Request */}
          <div className="request-column">
            <div className="incoming-request-container">
              {activeRequest && isCapable ? (
                <div className="driver-request-card">
                  <div className="driver-request-header">
                    <span className="driver-badge-request">Request Sesi On-Demand</span>
                    <div className={`driver-timer ${countdown <= 5 ? 'urgent' : ''}`}>
                      <Hourglass size={14} /> <span>{countdown}s</span>
                    </div>
                  </div>
                  <div className="driver-request-body">
                    <h2 className="driver-request-subject">
                      <span>Mata Pelajaran</span>
                      {activeRequest.subjectName}
                    </h2>
                    
                    <div className="driver-meta-grid">
                      <div className="driver-meta-item">
                        <span>Siswa (Jenjang)</span>
                        <strong>{activeRequest.studentName} ({activeRequest.class})</strong>
                      </div>
                      <div className="driver-meta-item">
                        <span>Paket Belajar</span>
                        <strong>{activeRequest.package}</strong>
                      </div>
                      <div className="driver-meta-item">
                        <span>Hari Sesi</span>
                        <strong>{getFormattedDateString(activeRequest.date)}</strong>
                      </div>
                      <div className="driver-meta-item">
                        <span>Jam Sesi</span>
                        <strong>{activeRequest.timeSlot}</strong>
                      </div>
                    </div>

                    {activeRequest.notes && (
                      <div className="driver-notes-box">
                        "{activeRequest.notes}"
                      </div>
                    )}
                  </div>
                  
                  <div className="driver-actions">
                    <button className="btn-secondary btn-reject-driver" type="button" onClick={onRejectRequest}>
                      <X size={14} /> Tolak
                    </button>
                    <button className="btn-success btn-accept-driver" type="button" onClick={() => onAcceptRequest(activeRequest, currentTeacher)}>
                      <Check size={14} /> Terima Sesi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-request-placeholder">
                  <div className="radar-mini">
                    <div className="circle"></div>
                  </div>
                  <h4>Menunggu Request Baru...</h4>
                  <p>Belum ada siswa yang memesan slot pelajaranmu saat ini. Pastikan status ketersediaanmu online.</p>
                </div>
              )}
            </div>

            {/* Export & Profile Info */}
            <div className="dashboard-card card-profile-info" style={{ marginTop: '20px' }}>
              <h3>Info Master Teacher</h3>
              <div className="teacher-profile-detail-box">
                <div className="info-row">
                  <span>Nama:</span>
                  <strong>{currentTeacher.name}</strong>
                </div>
                <div className="info-row">
                  <span>Mata Pelajaran Utama:</span>
                  <strong>{currentTeacher.subject}</strong>
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  <strong>{currentTeacher.email}</strong>
                </div>
                <div className="info-row">
                  <span>Google Meet:</span>
                  <a href={currentTeacher.gmeet} target="_blank" rel="noreferrer" className="text-link-meet">Link Meet</a>
                </div>
              </div>

              <div className="avail-actions" style={{ marginTop: '16px' }}>
                <button className="btn-secondary btn-block" type="button" onClick={onExportToCSV}>
                  <Download size={14} /> Export Sesi ke CSV
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Confirmed Schedule List */}
          <div className="schedule-column">
            <div className="dashboard-card card-schedule">
              <h3><Clock size={16} /> Jadwal Sesi Hari Ini</h3>
              <div className="schedule-list">
                {filteredSessions.length === 0 ? (
                  <div className="empty-state-list">
                    <CalendarDays className="empty-icon" size={32} />
                    <p>Belum ada jadwal tutor terkonfirmasi hari ini.</p>
                  </div>
                ) : (
                  filteredSessions.map(session => (
                    <div key={session.id} className="schedule-card-item">
                      <div className="schedule-item-header">
                        <h4>{session.subjectName} ({session.class})</h4>
                        <span className={`badge-status ${session.status}`}>{session.status}</span>
                      </div>
                      <div className="schedule-item-body">
                        <div className="schedule-meta-row">
                          <span>Siswa:</span>
                          <strong>{session.studentName} ({session.studentEmail})</strong>
                        </div>
                        <div className="schedule-meta-row">
                          <span>Paket:</span>
                          <strong>{session.package}</strong>
                        </div>
                        <div className="schedule-meta-row">
                          <span>Jadwal:</span>
                          <strong>{getFormattedDateString(session.date)}, {session.timeSlot}</strong>
                        </div>
                        {session.notes && (
                          <div className="session-item-notes">
                            Catatan: "{session.notes}"
                          </div>
                        )}
                      </div>
                      {session.status === 'Confirmed' && (
                        <div className="schedule-item-footer">
                          <button className="btn-danger btn-xs" type="button" onClick={() => onUpdateSessionStatus(session.id, 'Cancelled')}>Batalkan</button>
                          <button className="btn-success btn-xs" type="button" onClick={() => onUpdateSessionStatus(session.id, 'Completed')}>Selesaikan Sesi</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* AVAILABILITY VIEW: GRID */
        <div className="teacher-availability-view">
          
          {/* BOTTOM: Interactive Visual Weekly Grid */}
          <div className="dashboard-card grid-availability-card">
            <div className="grid-card-header">
              <div>
                <h3><Grid size={18} /> Interactive Availability Weekly Grid</h3>
                <p className="section-desc" style={{ marginBottom: 0 }}>
                  Klik langsung pada kolom jam untuk mengubah ketersediaan. 
                  <span className="legend-indicator"><span className="legend-box green"></span> Available</span>
                  <span className="legend-indicator"><span className="legend-box red"></span> Not Available</span>
                  <span className="legend-indicator"><span className="legend-box yellow"></span> Assigned LT</span>
                  <span className="legend-indicator"><span className="legend-box blue"></span> Assigned ST</span>
                  <span className="legend-indicator"><span className="legend-box cell-disabled"></span> N/A (Outside Template)</span>
                </p>
              </div>
            </div>

            <div className="grid-table-container">
              <table className="weekly-grid-table">
                <thead>
                  <tr>
                    <th>Jam Sesi</th>
                    {daysOfWeek.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_SLOTS.map(slot => {
                    return (
                      <tr key={slot}>
                        <td className="slot-label-col">{slot}</td>
                        {daysOfWeek.map(day => {
                          const isValid = getSlotsForDay(day).includes(slot);
                          const isAvail = (localAvail[day] || []).includes(slot);
                          const session = (localSchedule[day] || {})[slot];

                          let cellClass = 'cell-red';
                          let cellText = 'Not Available';
                          let clickHandler = () => handleCellClick(day, slot);

                          if (!isValid) {
                            cellClass = 'cell-disabled';
                            cellText = 'N/A';
                            clickHandler = null;
                          } else if (session && (session.type === 'LT' || session.isBooked)) {
                            if (session.type === 'LT') {
                              cellClass = 'cell-yellow';
                              cellText = `LT: ${session.class}`;
                            } else {
                              cellClass = 'cell-blue';
                              cellText = `ST: ${session.class}`;
                            }
                            clickHandler = () => alert(`Slot ini sudah di-plot oleh admin untuk ${session.type === 'LT' ? 'Live Teaching' : 'Sesi Tutor'}: ${session.class}. Tidak bisa diubah.`);
                          } else if (session && session.type === 'ST' && !session.isBooked) {
                            cellClass = 'cell-green';
                            cellText = `Avail: ${session.class}`;
                          } else if (isAvail) {
                            cellClass = 'cell-green';
                            cellText = 'Available';
                          }

                          return (
                            <td 
                              key={day} 
                              className={`interactive-grid-cell ${cellClass}`}
                              onClick={clickHandler}
                              title={isValid ? `${day} ${slot}: ${cellText}` : `Slot ${slot} tidak tersedia di hari ${day}`}
                              style={!isValid ? { cursor: 'not-allowed' } : {}}
                            >
                              <div className="cell-content">
                                <span className="cell-indicator-text">{cellText}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
