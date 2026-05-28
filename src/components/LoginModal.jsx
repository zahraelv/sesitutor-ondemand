import React, { useState } from 'react';
import { Mail, X, Coins, GraduationCap, Presentation, Sliders } from 'lucide-react';

export default function LoginModal({ active, onClose, onLogin, mockStudents }) {
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  if (!active) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      onLogin({ role: 'admin', name: 'Admin Sesi Tutor', email: 'admin@ruangguru.com' });
      return;
    }
    
    if (selectedRole === 'teacher') {
      onLogin({ role: 'teacher', name: 'Master Teacher', email: 'teacher@ruangguru.com' });
      return;
    }

    const email = emailInput.trim().toLowerCase();
    if (!email) return;

    if (mockStudents[email]) {
      onLogin({ ...mockStudents[email], role: 'student' });
    } else {
      // Create new trial account
      onLogin({
        role: 'student',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        class: '12 SMA',
        package: 'Regular',
        coins: 0
      });
    }
    setEmailInput('');
  };

  return (
    <div className={`modal-overlay ${active ? 'active' : ''}`}>
      <div className="modal-card login-modal-modern">
        <div className="modal-header">
          <img src="./Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Logo" className="modal-brand-logo" />
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <h3 className="login-title">Masuk ke Sesi Tutor</h3>
          <p className="modal-subtitle">Pilih peranmu untuk masuk ke dalam sistem.</p>
          
          <div className="role-selector">
            <button 
              className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => setSelectedRole('student')}
            >
              <GraduationCap size={20} />
              <span>Siswa</span>
            </button>
            <button 
              className={`role-btn ${selectedRole === 'teacher' ? 'active' : ''}`}
              onClick={() => setSelectedRole('teacher')}
            >
              <Presentation size={20} />
              <span>Guru</span>
            </button>
            <button 
              className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <Sliders size={20} />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {selectedRole === 'student' && (
              <div className="form-field animated-field">
                <label htmlFor="loginEmail">Email Ruangguru</label>
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
            )}

            {selectedRole !== 'student' && (
              <div className="info-box info-box-soft">
                Login sebagai {selectedRole === 'teacher' ? 'Master Teacher' : 'Admin Sesi Tutor'} untuk mengakses dashboard.
              </div>
            )}

            <button type="submit" className="btn-primary btn-block btn-login-submit">
              Masuk Sekarang
            </button>
          </form>

          {selectedRole === 'student' && (
            <>
              <div className="divider-text">ATAU PILIH AKUN UJI COBA (SIMULASI KOIN)</div>
              <div className="quick-login-grid">
                {Object.values(mockStudents).map((student) => {
                  const isPositive = student.coins >= 10;
                  return (
                    <div 
                      key={student.email} 
                      className="quick-login-card" 
                      onClick={() => onLogin({ ...student, role: 'student' })}
                    >
                      <div className="login-meta">
                        <strong>{student.name}</strong>
                        <span>{student.email}</span>
                      </div>
                      <div className={`coin-badge ${isPositive ? 'positive' : 'negative'}`}>
                        <Coins size={14} /> {student.coins} Koin
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
