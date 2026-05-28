import React, { useState } from 'react';
import { Mail, X, User, School, PackageCheck, Phone } from 'lucide-react';

const CLASS_OPTIONS = [
  '4 SD', '5 SD', '6 SD',
  '7 SMP', '8 SMP', '9 SMP',
  '10 SMA', '11 SMA', '12 SMA', 'Gap Year'
];

const PACKAGE_OPTIONS = [
  'Brain Academy Online Regular',
  'Brain Academy Online Premium',
  'Brain Academy Online Elite'
];

export default function LoginModal({ active, onClose, onLogin, registeredStudents = {}, eligibleStudents = {}, onOnboarding }) {
  const [emailInput, setEmailInput] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    class: '12 SMA',
    package: 'Brain Academy Online Regular'
  });

  if (!active) return null;

  const startOnboarding = (student) => {
    setMode('onboarding');
    setError('');
    setOnboardingData(prev => ({
      ...prev,
      name: student.name || prev.name,
      email: student.email,
      whatsapp: student.whatsapp || prev.whatsapp,
      class: student.class || prev.class,
      package: student.package || prev.package
    }));
  };

  const loginStudentByEmail = (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    const eligibleStudent = eligibleStudents[normalizedEmail];
    if (!eligibleStudent) {
      setError('Email ini belum terdaftar untuk Sesi Tutor.');
      return;
    }

    const student = registeredStudents[normalizedEmail];
    if (student) {
      onLogin({ ...student, role: 'student' });
      setEmailInput('');
      setMode('login');
      setError('');
      return;
    }

    startOnboarding({
      ...eligibleStudent,
      email: normalizedEmail
    });
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const name = onboardingData.name.trim();
    const email = onboardingData.email.trim().toLowerCase();
    const whatsapp = onboardingData.whatsapp.trim();
    if (!name || !email) {
      setError('Nama dan email wajib diisi.');
      return;
    }

    onOnboarding({
      ...onboardingData,
      name,
      email,
      whatsapp,
      coins: registeredStudents[email]?.coins ?? eligibleStudents[email]?.coins ?? 0
    });
    setEmailInput('');
    setMode('login');
    setError('');
  };

  const handleClose = () => {
    setMode('login');
    setError('');
    onClose();
  };

  const isOnboarding = mode === 'onboarding';

  return (
    <div className={`modal-overlay ${active ? 'active' : ''}`}>
      <div className="modal-card login-modal-modern">
        <div className="modal-header">
          <img src="./Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Logo" className="modal-brand-logo" />
          <button className="modal-close-btn" onClick={handleClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <h3 className="login-title">{isOnboarding ? 'Lengkapi Data Siswa' : 'Masuk ke Sesi Tutor'}</h3>
          <p className="modal-subtitle">
            {isOnboarding
              ? 'Data ini menjadi sumber validasi siswa untuk login berikutnya.'
              : 'Masukan email yang terdaftar di Ruangguru atau Brain Academy Online.'}
          </p>

          {error && <div className="login-error-message">{error}</div>}

          {isOnboarding ? (
            <form onSubmit={handleOnboardingSubmit} className="login-form onboarding-form">
              <div className="form-field animated-field">
                <label htmlFor="studentName">Nama</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    id="studentName"
                    placeholder="Nama lengkap siswa"
                    value={onboardingData.name}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-field animated-field">
                <label htmlFor="registeredEmail">Email yang terdaftar di Ruangguru/Brain Academy</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="registeredEmail"
                    placeholder="nama@ruangguru.com"
                    value={onboardingData.email}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-field animated-field">
                <label htmlFor="studentClass">Kelas</label>
                <div className="input-icon-wrapper select-icon-wrapper">
                  <School className="input-icon" size={18} />
                  <select
                    id="studentClass"
                    value={onboardingData.class}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, class: e.target.value }))}
                  >
                    {CLASS_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-field animated-field">
                <label htmlFor="studentWhatsapp">No. WhatsApp</label>
                <div className="input-icon-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    id="studentWhatsapp"
                    placeholder="08xxxxxxxxxx"
                    value={onboardingData.whatsapp}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-field animated-field">
                <label htmlFor="studentPackage">Paket Belajar di Brain Academy Online</label>
                <div className="input-icon-wrapper select-icon-wrapper">
                  <PackageCheck className="input-icon" size={18} />
                  <select
                    id="studentPackage"
                    value={onboardingData.package}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, package: e.target.value }))}
                  >
                    {PACKAGE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <p className="login-field-note">Jika tidak tau, hubungi student advisor kamu.</p>
              </div>

              <button type="submit" className="btn-primary btn-block btn-login-submit">
                Simpan & Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); loginStudentByEmail(emailInput); }} className="login-form">
              <div className="form-field animated-field">
                <label htmlFor="loginEmail">Email Ruangguru/Brain Academy</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="loginEmail"
                    placeholder="nama@ruangguru.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary btn-block btn-login-submit">
                Masuk Sekarang
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
