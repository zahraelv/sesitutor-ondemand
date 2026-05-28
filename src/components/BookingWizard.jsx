import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Coins, CalendarCheck } from 'lucide-react';

export default function BookingWizard({ 
  currentUser, 
  onSubmit, 
  onCancel, 
  showToast,
  subjects,
  teachers,
  getFormattedDateString,
  formatDate,
  generateTimeSlotsArray,
  initialSubject = '',
  initialDate = ''
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(currentUser?.name || '');
  const [selectedClass, setSelectedClass] = useState(currentUser?.class || '12 SMA');
  const [selectedPackage, setSelectedPackage] = useState(currentUser?.package || 'Regular');
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || '');
  const [teacherRequest, setTeacherRequest] = useState('');
  const [notes, setNotes] = useState('');

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [waitTime, setWaitTime] = useState('15 detik');

  // Pre-fill profile info on load or changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setSelectedClass(currentUser.class);
      setSelectedPackage(currentUser.package);
    }
  }, [currentUser]);

  // Generate date cards
  useEffect(() => {
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const generated = [];

    for (let i = 0; i < 5; i++) {
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

    setDates(generated);
    if (generated.length > 0) {
      setSelectedDate(initialDate || generated[0].value);
    }
  }, [initialDate]);

  // Update wait time estimation dynamically based on subject
  useEffect(() => {
    if (selectedSubject) {
      const subObj = subjects.find(s => s.id === selectedSubject);
      let est = 15;
      if (subObj) {
        if (subObj.category === 'saintek') est = 10;
        if (subObj.category === 'olimpiade') est = 45;
        if (subObj.category === 'soshum') est = 20;
      }
      setWaitTime(`${est} detik`);
    }
  }, [selectedSubject, subjects]);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        showToast("Nama lengkap wajib diisi.", "warning");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedSubject) {
        showToast("Pilih salah satu Mata Pelajaran terlebih dahulu.", "warning");
        return;
      }
      setStep(3);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitForm = () => {
    if (!selectedTimeSlot) {
      showToast("Silakan pilih Jam Sesi terlebih dahulu.", "warning");
      return;
    }

    const bookingData = {
      name,
      email: currentUser.email,
      class: selectedClass,
      package: selectedPackage,
      subjectId: selectedSubject,
      subjectName: subjects.find(s => s.id === selectedSubject)?.name || selectedSubject,
      teacherRequest,
      notes,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      estWaitTime: parseInt(waitTime.replace(/\D/g, '')) || 15
    };

    onSubmit(bookingData);
  };

  // Helper render components
  const classOptions = [
    { value: '3 SD', label: '3 SD' },
    { value: '4 SD', label: '4 SD' },
    { value: '5 SD', label: '5 SD' },
    { value: '6 SD', label: '6 SD' },
    { value: '7 SMP', label: '7 SMP' },
    { value: '8 SMP', label: '8 SMP' },
    { value: '9 SMP', label: '9 SMP' },
    { value: '10 SMA', label: '10 SMA' },
    { value: '11 SMA', label: '11 SMA' },
    { value: '12 SMA', label: '12 SMA' },
    { value: 'Gap Year', label: 'Gap Year' },
  ];

  const packages = [
    { value: 'Regular' },
    { value: 'Premium' },
    { value: 'Elite' }
  ];

  const timeSlots = generateTimeSlotsArray(selectedDate);
  const now = new Date();
  const currentHourStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const isToday = selectedDate === formatDate(now);

  return (
    <div className="booking-wizard-card">
      <div className="wizard-header">
        <div className="wizard-title-group">
          <button className="btn-back" type="button" onClick={step === 1 ? onCancel : handlePrev}>
            <ChevronLeft size={18} />
          </button>
          <h2>Pesan Sesi Tutor</h2>
        </div>
        
        <div className="wizard-steps-indicator">
          <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1. Detail Sesi</div>
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2. Mapel & Guru</div>
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>3. Jadwal</div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="form-step active">
            <div className="form-group-row">
              <div className="form-field">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Masukkan nama kamu" 
                  required 
                />
              </div>
              <div className="form-field">
                <label>Email Ruangguru</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  readOnly 
                  className="readonly-input" 
                />
              </div>
            </div>

            <div className="form-field">
              <label>Pilih Jenjang Kelas</label>
              <div className="selection-chips">
                {classOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip ${selectedClass === opt.value ? 'active' : ''}`}
                    onClick={() => setSelectedClass(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label>Apa Paket Belajar di Ruangguru Kamu saat ini?</label>
              <div className="package-grid">
                {packages.map((pkg) => (
                  <div
                    key={pkg.value}
                    className={`package-card ${selectedPackage === pkg.value ? 'active' : ''}`}
                    onClick={() => setSelectedPackage(pkg.value)}
                  >
                    <div className="package-card-info">
                      <h4>{pkg.value}</h4>
                    </div>
                    <div className="package-radio"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="wizard-footer">
              <div></div>
              <button type="button" className="btn-primary" onClick={handleNext}>
                Lanjut <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="form-step active">
            <div className="form-field">
              <label>Pilih Mata Pelajaran</label>
              <div className="subject-categories">
                {['all', 'saintek', 'soshum', 'umum', 'olimpiade'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'Semua' : cat.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="subject-chips-grid">
                {subjects
                  .filter(s => selectedCategory === 'all' || s.category === selectedCategory)
                  .map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`subject-chip ${selectedSubject === sub.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubject(sub.id)}
                    >
                      <span className="subject-chip-icon"></span>
                      <span>{sub.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="form-field">
              <label>Request Master Teacher (Opsional)</label>
              <select value={teacherRequest} onChange={(e) => setTeacherRequest(e.target.value)}>
                <option value="">Bebas (Sistem Matching Otomatis)</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.desc.split("Spesialis ")[1] || t.desc})</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Catatan Tambahan untuk Tutor</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Tuliskan materi spesifik yang ingin dibahas (contoh: Belajar rumus integral substitusi, persiapan UTBK Bab 3)"
              />
            </div>

            <div className="wizard-footer">
              <button type="button" className="btn-secondary" onClick={handlePrev}>
                <ChevronLeft size={16} /> Kembali
              </button>
              <button type="button" className="btn-primary" onClick={handleNext}>
                Lanjut <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="form-step active">
            <div className="form-field">
              <label>Pilih Hari Sesi</label>
              <div className="date-selection-row">
                {dates.map((d) => (
                  <div
                    key={d.value}
                    className={`date-card ${selectedDate === d.value ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDate(d.value);
                      setSelectedTimeSlot(''); // reset slot when date changes
                    }}
                  >
                    <div className="day">{d.dayName}</div>
                    <div className="date">{d.dateNum}</div>
                    <div className="month">{d.monthStr}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-field">
              <div className="time-header-info">
                <label>Pilih Jam Sesi (09:00 - 21:00)</label>
                <span className="wait-time-badge">
                  <Clock size={12} /> Est. Menunggu: <strong>{waitTime}</strong>
                </span>
              </div>
              
              <div className="time-picker-grid">
                {timeSlots.map(slot => {
                  const isPast = isToday && slot <= currentHourStr;
                  const isMockBusy = slot.charCodeAt(3) % 7 === 0; // Mock slots matching formula
                  const isDisabled = isPast || isMockBusy;

                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot ${selectedTimeSlot === slot ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      disabled={isDisabled}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="booking-summary-banner">
              <div className="summary-item">
                <span className="label">Biaya Sesi:</span>
                <span className="valueHighlight coin-value">
                  <Coins size={16} className="coin-icon" style={{ animation: 'spinSlow 3s linear infinite' }} /> 10 Koin
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Koin Kamu Sekarang:</span>
                <span className="value"><Coins size={14} /> {currentUser?.coins} Koin</span>
              </div>
            </div>

            <div className="wizard-footer">
              <button type="button" className="btn-secondary" onClick={handlePrev}>
                <ChevronLeft size={16} /> Kembali
              </button>
              <button type="button" className="btn-success btn-block" onClick={handleSubmitForm} style={{ display: 'inline-flex', gap: '8px', flex: '1', marginLeft: '12px' }}>
                🚀 Isi Form Sekarang
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
