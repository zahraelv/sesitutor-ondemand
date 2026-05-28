import React from 'react';
import { CheckCircle, Star, Coins, Home, Presentation } from 'lucide-react';

export default function ConfirmedScreen({ session, onGoHome, onGoTeacher, getFormattedDateString }) {
  if (!session) return null;

  return (
    <div className="confirmed-container">
      <div className="confirmed-card">
        
        <div className="success-icon-wrapper" style={{ color: 'var(--color-success)', marginBottom: '16px' }}>
          <CheckCircle className="success-check-icon" size={56} style={{ strokeWidth: '2.5' }} />
        </div>

        <div className="matching-status-badge status-confirmed">
          Confirmed
        </div>

        <h2>Sesi Tutor Berhasil Dibuat!</h2>
        <p className="success-subtitle">Master Teacher telah menerima permintaan belajarmu. Cek detail di bawah:</p>

        <div className="teacher-profile-card">
          <div className="teacher-avatar">{session.teacherAvatar}</div>
          <div className="teacher-info">
            <h4>{session.teacherName}</h4>
            <p>{session.teacherDesc}</p>
            <div className="rating-group">
              <Star className="star-icon" size={12} style={{ fill: '#FFC107', stroke: '#FFC107' }} />
              <span>4.9 (120+ sesi)</span>
            </div>
          </div>
        </div>

        <div className="session-receipt">
          <div className="receipt-row">
            <span>ID Sesi:</span>
            <strong>{session.id}</strong>
          </div>
          <div className="receipt-row">
            <span>Mata Pelajaran:</span>
            <strong>{session.subjectName}</strong>
          </div>
          <div className="receipt-row">
            <span>Waktu Sesi:</span>
            <strong>{getFormattedDateString(session.date)}, {session.timeSlot}</strong>
          </div>
          <div className="receipt-row font-sm">
            <span>Biaya Potong:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Coins size={14} /> 10 Koin (Berhasil Didebet)</span>
          </div>
        </div>

        <div className="action-buttons-confirmed">
          <button className="btn-primary" onClick={onGoHome}>
            <Home size={15} /> Kembali ke Home
          </button>
          <button className="btn-secondary" onClick={onGoTeacher}>
            <Presentation size={15} /> Buka Dashboard Guru
          </button>
        </div>
      </div>
    </div>
  );
}
