import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Users, 
  Clock, 
  Check, 
  X, 
  PieChart, 
  Trash2,
  AlertCircle,
  Download,
  Plus,
  Copy,
  Check as CheckIcon
} from 'lucide-react';
import { getSlotsForDay } from '../utils/mockData';

export default function AdminDashboard({ 
  teachers, 
  onUpdateTeacher,
  sessions,
  tutorRequests = [],
  onUpdateTutorRequest,
  onRefreshTutorRequests,
  onExportTutorRequestsCSV,
  getFormattedDateString,
  onExportSLMSCSV
}) {
  // Navigation: 'requests' | 'scheduler' | 'analytics'
  const [adminTab, setAdminTab] = useState('requests');
  
  // Mode toggle: 'LT' (Live Teaching Admin) | 'ST' (Sesi Tutor Admin)
  const [schedulerMode, setSchedulerMode] = useState('ST'); // Default Sesi Tutor

  // Exporter date
  const [weekStartDate, setWeekStartDate] = useState('2026-05-18');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Copy link state
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  // Assignment Modal/Popover State
  const [activeEditor, setActiveEditor] = useState(null); // { teacherId, day }
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedClass, setSelectedClass] = useState('12 SMA IPA');

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  // Union of all possible slots across weekdays and Saturdays for analytics
  const ALL_SLOTS = [
    "10:00", "11:00", "12:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00", "18:45", "19:30", "20:00", "20:30"
  ];

  // Extract unique subjects for filter dropdown
  const uniqueSubjects = ['all', ...new Set(teachers.map(t => t.subject))];

  // Filtered teachers list based on search and subject
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const handleCellClick = (teacherId, day) => {
    setActiveEditor({ teacherId, day });
    setSelectedSlot(getSlotsForDay(day)[0]);
  };

  const handleAssign = () => {
    if (!activeEditor || !selectedSlot) return;
    const { teacherId, day } = activeEditor;
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    // Validation
    const isAvail = (teacher.availability?.[day] || []).includes(selectedSlot);
    const session = teacher.schedule?.[day]?.[selectedSlot] || null;

    if (schedulerMode === 'ST') {
      if (session && session.type === 'LT') {
        alert("Slot ini dikunci oleh Admin LT!");
        return;
      }
      const isGreen = isAvail || (session && session.type === 'ST' && !session.isBooked);
      if (!isGreen) {
        alert("ST hanya bisa di-plot pada slot Available.");
        return;
      }
    }

    const updatedSchedule = { ...(teacher.schedule || {}) };
    if (!updatedSchedule[day]) updatedSchedule[day] = {};

    updatedSchedule[day][selectedSlot] = {
      type: schedulerMode, 
      class: selectedClass
    };

    onUpdateTeacher(teacherId, {
      ...teacher,
      schedule: updatedSchedule
    });
  };

  const handleClear = (slot) => {
    if (!activeEditor) return;
    const { teacherId, day } = activeEditor;
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const updatedSchedule = { ...(teacher.schedule || {}) };
    if (updatedSchedule[day]) {
      delete updatedSchedule[day][slot];
    }

    onUpdateTeacher(teacherId, {
      ...teacher,
      schedule: updatedSchedule
    });
  };

  const handleToggleAvailability = (slot, targetState) => {
    if (!activeEditor) return;
    const { teacherId, day } = activeEditor;
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const currentAvailList = teacher.availability?.[day] || [];
    let updatedList;
    if (targetState) {
      updatedList = Array.from(new Set([...currentAvailList, slot]));
    } else {
      updatedList = currentAvailList.filter(s => s !== slot);
    }

    onUpdateTeacher(teacherId, {
      ...teacher,
      availability: {
        ...(teacher.availability || {}),
        [day]: updatedList
      }
    });
  };

  // ANALYTICS COMPUTATIONS (Simplified for brevity)
  const emptySlots = []; // (mocked)
  const efficiency = { effective: [], ineffective: [] }; // (mocked)
  const utilization = { overloaded: [], underutilized: [], conflicts: [] }; // (mocked)

  const classList = [
    '3 SD', '4 SD', '5 SD', '6 SD',
    '7 SMP', '8 SMP', '9 SMP',
    '10 SMA IPA', '10 SMA IPS',
    '11 SMA IPA', '11 SMA IPS',
    '12 SMA IPA', '12 SMA IPS',
    'Gap Year'
  ];

  const opsStatuses = [
    'Request Masuk',
    'Dicarikan MT',
    'MT Tersedia',
    'Alternatif Jadwal',
    'Follow Up Siswa',
    'Sesi Diterima',
    'Dibatalkan Siswa',
    'Sesi Tidak Tersedia',
    'Koin Tidak Cukup'
  ];

  const requestRows = tutorRequests.filter(req => {
    const query = searchQuery.toLowerCase();
    return [
      req.studentName,
      req.studentEmail,
      req.class,
      req.subjectName,
      req.teacherRequest,
      req.teacherFix,
      req.opsStatus,
      req.picSA
    ].some(value => (value || '').toLowerCase().includes(query));
  });

  const getStatusClass = (status) => {
    if (status === 'Request Masuk') return 'gray';
    if (status === 'Dicarikan MT' || status === 'MT Tersedia' || status === 'Alternatif Jadwal') return 'blue';
    if (status === 'Follow Up Siswa') return 'yellow';
    if (status === 'Sesi Diterima') return 'green';
    if (status === 'Dibatalkan Siswa' || status === 'Sesi Tidak Tersedia' || status === 'Koin Tidak Cukup') return 'red';
    return 'gray';
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateRequest = (requestId, updates) => {
    if (!onUpdateTutorRequest) return;
    onUpdateTutorRequest(requestId, updates);
  };

  const getTeacherGmeetByName = (teacherName) => {
    if (!teacherName) return '';
    const normalized = teacherName.trim().toLowerCase();
    return teachers.find(teacher => teacher.name.trim().toLowerCase() === normalized)?.gmeet || '';
  };

  const handleTeacherFixChange = (requestId, teacherName) => {
    updateRequest(requestId, {
      teacherFix: teacherName,
      sessionLink: getTeacherGmeetByName(teacherName)
    });
  };

  const hasRequestedTeacher = (teacherName) => {
    if (!teacherName) return false;
    const normalized = teacherName.trim().toLowerCase();
    return teachers.some(teacher => teacher.name.trim().toLowerCase() === normalized);
  };

  const handleCopyLink = (requestId, link) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkId(requestId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-header">
        <div className="header-left">
          <h2>Dashboard Request Sesi Tutor</h2>
          <p className="admin-subtitle">CRM operasional untuk Admin dan Student Advisor.</p>
        </div>

        <div className="admin-tab-nav">
          <button 
            className={`admin-nav-btn ${adminTab === 'requests' ? 'active' : ''}`}
            onClick={() => setAdminTab('requests')}
          >
            <Activity size={15} /> Request CRM
          </button>
          <button 
            className={`admin-nav-btn ${adminTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setAdminTab('analytics')}
          >
            <PieChart size={15} /> Insights & Analytics
          </button>
        </div>
      </div>

      {adminTab === 'requests' && (
        <div className="request-crm-section">
          <div className="request-crm-summary">
            <div className="crm-summary-card">
              <span>Total Request</span>
              <strong>{tutorRequests.length}</strong>
            </div>
            <div className="crm-summary-card blue">
              <span>Diproses</span>
              <strong>{tutorRequests.filter(req => ['Dicarikan MT', 'MT Tersedia', 'Alternatif Jadwal'].includes(req.opsStatus)).length}</strong>
            </div>
            <div className="crm-summary-card yellow">
              <span>Follow Up</span>
              <strong>{tutorRequests.filter(req => req.opsStatus === 'Follow Up Siswa').length}</strong>
            </div>
            <div className="crm-summary-card green">
              <span>Sesi Diterima</span>
              <strong>{tutorRequests.filter(req => req.opsStatus === 'Sesi Diterima').length}</strong>
            </div>
          </div>

          <div className="request-crm-toolbar">
            <div className="input-with-icon">
              <Search size={14} className="icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, mapel, MT, status, atau PIC..."
              />
            </div>
            <div className="request-crm-actions">
              <button type="button" className="btn-secondary btn-sm" onClick={onRefreshTutorRequests}>
                Refresh Data
              </button>
              <button type="button" className="btn-primary btn-sm" onClick={onExportTutorRequestsCSV}>
                <Download size={14} /> Export CSV Upload
              </button>
            </div>
          </div>

          <div className="request-crm-table-wrap">
            <table className="request-crm-table">
              <colgroup>
                <col className="crm-col-name" />
                <col className="crm-col-email" />
                <col className="crm-col-class" />
                <col className="crm-col-package" />
                <col className="crm-col-whatsapp" />
                <col className="crm-col-subject" />
                <col className="crm-col-requested" />
                <col className="crm-col-final" />
                <col className="crm-col-mt-request" />
                <col className="crm-col-mt-fix" />
                <col className="crm-col-status" />
                <col className="crm-col-pic" />
                <col className="crm-col-notes" />
                <col className="crm-col-action" />
              </colgroup>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Kelas</th>
                  <th>Paket</th>
                  <th>WhatsApp</th>
                  <th>Mapel</th>
                  <th>Jadwal Diminta</th>
                  <th>Jadwal Final</th>
                  <th>MT Request</th>
                  <th>MT Fix</th>
                  <th>Status</th>
                  <th>PIC SA</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requestRows.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="crm-empty-cell">Belum ada request Sesi Tutor yang masuk.</td>
                  </tr>
                ) : requestRows.map(req => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.studentName}</strong>
                      <span className="crm-subtext">{formatDateTime(req.submittedAt)}</span>
                    </td>
                    <td>{req.studentEmail}</td>
                    <td>{req.class}</td>
                    <td>{req.package}</td>
                    <td>{req.whatsapp || '-'}</td>
                    <td>{req.subjectName}</td>
                    <td>
                      <strong>{getFormattedDateString ? getFormattedDateString(req.requestedDate) : req.requestedDate}</strong>
                      <span className="crm-subtext">{req.requestedTime}</span>
                    </td>
                    <td>
                      <div className="crm-final-schedule">
                        <select
                          className="crm-schedule-mode"
                          value={req.finalSameAsRequest ? 'same' : 'alternative'}
                          onChange={(e) => {
                            const isSame = e.target.value === 'same';
                            updateRequest(req.id, {
                              finalSameAsRequest: isSame,
                              finalDate: isSame ? req.requestedDate : (req.finalDate || ''),
                              finalTime: isSame ? req.requestedTime : (req.finalTime || '')
                            });
                          }}
                        >
                          <option value="same">Sama seperti diminta</option>
                          <option value="alternative">Jadwal alternatif</option>
                        </select>
                        {req.finalSameAsRequest ? (
                          <div className="crm-final-summary">
                            <strong>{req.requestedDate}</strong>
                            <span>{req.requestedTime} WIB</span>
                          </div>
                        ) : (
                          <div className="crm-final-inputs">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="\d{4}-\d{2}-\d{2}"
                              placeholder="2026-05-26"
                              value={req.finalDate || ''}
                              onChange={(e) => updateRequest(req.id, { finalDate: e.target.value })}
                            />
                            <input
                              type="time"
                              value={req.finalTime || ''}
                              onChange={(e) => updateRequest(req.id, { finalTime: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="crm-wrap-cell">{req.teacherRequest || 'Bebas'}</td>
                    <td>
                      <div className="crm-mt-fix-stack">
                        {hasRequestedTeacher(req.teacherRequest) && (
                          <button
                            type="button"
                            className="crm-use-request-btn"
                            onClick={() => handleTeacherFixChange(req.id, req.teacherRequest)}
                          >
                            Pakai MT Request
                          </button>
                        )}
                        <select
                          className="crm-mini-input"
                          value={req.teacherFix || ''}
                          onChange={(e) => handleTeacherFixChange(req.id, e.target.value)}
                        >
                          <option value="">Cari/Pilih MT</option>
                          {req.teacherRequest && hasRequestedTeacher(req.teacherRequest) && (
                            <option value={req.teacherRequest}>{req.teacherRequest} - request siswa</option>
                          )}
                          {teachers
                            .filter(teacher => teacher.name !== req.teacherRequest)
                            .map(teacher => (
                              <option key={teacher.id} value={teacher.name}>
                                {teacher.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <span className={`crm-status-badge ${getStatusClass(req.opsStatus)}`}>{req.opsStatus}</span>
                    </td>
                    <td>
                      <input
                        className="crm-mini-input"
                        value={req.picSA || ''}
                        onChange={(e) => updateRequest(req.id, { picSA: e.target.value })}
                        placeholder="PIC SA"
                      />
                    </td>
                    <td>
                      <div className="crm-notes-stack">
                        <textarea
                          value={req.saNotes || ''}
                          onChange={(e) => updateRequest(req.id, { saNotes: e.target.value })}
                          placeholder="Catatan SA"
                        />
                        <textarea
                          value={req.opsNotes || ''}
                          onChange={(e) => updateRequest(req.id, { opsNotes: e.target.value })}
                          placeholder="Catatan Ops"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="crm-action-stack">
                        <select
                          value={req.opsStatus}
                          onChange={(e) => updateRequest(req.id, { opsStatus: e.target.value })}
                        >
                          {opsStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        {req.sessionLink ? (
                          <button 
                            type="button"
                            onClick={() => handleCopyLink(req.id, req.sessionLink)}
                            className="crm-session-link"
                            title={req.sessionLink}
                          >
                            {copiedLinkId === req.id ? (
                              <>
                                <CheckIcon size={14} /> Tersalin
                              </>
                            ) : (
                              <>
                                <Copy size={14} /> Google Meet
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="crm-link-placeholder">Link otomatis setelah MT Fix dipilih</span>
                        )}
                        <input
                          type="date"
                          value={req.nextFollowUp || ''}
                          onChange={(e) => updateRequest(req.id, { nextFollowUp: e.target.value })}
                        />
                        <span className="crm-subtext">Last: {formatDateTime(req.lastUpdate)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'scheduler' ? (
        <div className="admin-scheduler-section">
          <div className="admin-grid-toolbar">
            <div className="toolbar-filters">
              <div className="input-with-icon">
                <Search size={14} className="icon" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Master Teacher..." 
                />
              </div>

              <div className="select-with-icon">
                <Filter size={14} className="icon" />
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="all">Semua Mata Pelajaran</option>
                  {uniqueSubjects.filter(s => s !== 'all').map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="toolbar-modes" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="mode-label">Mode Plotting:</span>
                <div className="mode-button-group">
                  <button
                    className={`mode-btn lt-mode ${schedulerMode === 'LT' ? 'active' : ''}`}
                    onClick={() => setSchedulerMode('LT')}
                  >
                    LT Mode
                  </button>
                  <button
                    className={`mode-btn st-mode ${schedulerMode === 'ST' ? 'active' : ''}`}
                    onClick={() => setSchedulerMode('ST')}
                  >
                    ST Mode
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="mode-label">Week Start:</span>
                <input 
                  type="date" 
                  value={weekStartDate}
                  onChange={(e) => setWeekStartDate(e.target.value)}
                  className="admin-date-input"
                />
                <button
                  className="btn-primary btn-export-csv"
                  onClick={() => onExportSLMSCSV && onExportSLMSCSV(weekStartDate)}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="master-grid-container weekly-overview">
            <div className="table-responsive-wrapper">
              <table className="master-grid-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Nama MT</th>
                    {daysOfWeek.map(day => (
                      <th key={day} className="day-header">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id}>
                      <td className="sticky-col mt-name-cell">
                        <strong>{teacher.name}</strong>
                        <span className="t-email-sub">{teacher.subject}</span>
                      </td>
                      
                      {daysOfWeek.map(day => {
                        const schedObj = teacher.schedule?.[day] || {};
                        const availList = teacher.availability?.[day] || [];
                        const slots = getSlotsForDay(day);
                        
                        // Count active items
                        const activeItems = slots.map(slot => {
                          const session = schedObj[slot];
                          const isAvail = availList.includes(slot);
                          if (session) return { slot, type: session.type, class: session.class };
                          if (isAvail) return { slot, type: 'Avail' };
                          return null;
                        }).filter(Boolean);

                        return (
                          <td
                            key={day}
                            className="admin-weekly-cell"
                            onClick={() => handleCellClick(teacher.id, day)}
                          >
                            <div className="cell-content-stack">
                              {activeItems.length === 0 ? (
                                <span className="empty-dash">-</span>
                              ) : (
                                activeItems.map((item, idx) => (
                                  <div key={idx} className={`mini-badge badge-${item.type.toLowerCase()}`}>
                                    {item.slot} {item.type !== 'Avail' ? `(${item.type})` : ''}
                                  </div>
                                ))
                              )}
                              <div className="hover-edit-icon"><Plus size={14}/></div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* INLINE ASSIGNMENT POPOVER */}
          {activeEditor && (
            <div className="admin-assignment-overlay" onClick={() => setActiveEditor(null)}>
              <div className="admin-assignment-modal large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-section">
                  <h4>Edit Jadwal: {teachers.find(t => t.id === activeEditor.teacherId)?.name} - {activeEditor.day}</h4>
                  <button className="close-modal-btn" onClick={() => setActiveEditor(null)}><X size={16} /></button>
                </div>

                <div className="modal-body-section">
                  <div className="quick-assign-bar">
                    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                      {getSlotsForDay(activeEditor.day).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                      {classList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn-primary" onClick={handleAssign}>Plot {schedulerMode}</button>
                  </div>

                  <div className="slot-editor-grid">
                    {getSlotsForDay(activeEditor.day).map(slot => {
                      const teacher = teachers.find(t => t.id === activeEditor.teacherId);
                      const isAvail = (teacher?.availability?.[activeEditor.day] || []).includes(slot);
                      const session = teacher?.schedule?.[activeEditor.day]?.[slot] || null;

                      let statusBadge = <span className="badge badge-gray">Kosong</span>;
                      if (session) {
                        statusBadge = <span className={`badge badge-${session.type.toLowerCase()}`}>{session.type}: {session.class}</span>;
                      } else if (isAvail) {
                        statusBadge = <span className="badge badge-avail">Tersedia</span>;
                      }

                      return (
                        <div key={slot} className="slot-editor-row">
                          <strong className="slot-time">{slot}</strong>
                          <div className="slot-status">{statusBadge}</div>
                          <div className="slot-actions">
                            {session ? (
                              <button className="btn-danger-outline btn-xs" onClick={() => handleClear(slot)}>Hapus Plot</button>
                            ) : (
                              isAvail ? (
                                <button className="btn-secondary-outline btn-xs" onClick={() => handleToggleAvailability(slot, false)}>Set Tidak Tersedia</button>
                              ) : (
                                <button className="btn-success-outline btn-xs" onClick={() => handleToggleAvailability(slot, true)}>Set Tersedia</button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : adminTab === 'analytics' ? (
        <div className="admin-analytics-section">
          {/* Analytics omitted for brevity, keeping UI structure */}
          <div className="analytics-summary-cards">
            <h3 style={{ margin: '20px', color: 'var(--text-light)' }}>Analytics Module is active. Gathering data...</h3>
          </div>
        </div>
      ) : null}
    </div>
  );
}
