import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function MatchingRadar({ activeRequest, onCancel, getFormattedDateString }) {
  const [timeLeft, setTimeLeft] = useState(activeRequest?.estWaitTime || 15);
  const totalDuration = activeRequest?.estWaitTime || 15;

  useEffect(() => {
    setTimeLeft(activeRequest?.estWaitTime || 15);
  }, [activeRequest]);

  useEffect(() => {
    if (!activeRequest) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRequest]);

  if (!activeRequest) return null;

  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="matching-container">
      <div className="matching-card">
        
        <div className="radar-container">
          <div className="radar-pulse"></div>
          <div className="radar-pulse delay-1"></div>
          <div className="radar-pulse delay-2"></div>
          <div className="radar-core">
            <Search className="search-pulse-icon" size={24} style={{ animation: 'radarRotate 2.5s linear infinite' }} />
          </div>
        </div>

        <div className="matching-status-badge status-waiting">
          Waiting Teacher
        </div>

        <h2 className="matching-title">Mencari Master Teacher...</h2>
        <p className="matching-subtitle">Permintaanmu sedang dikirimkan ke Master Teacher yang stand-by dan available.</p>

        <div className="matching-details-card">
          <div className="detail-row">
            <span>Mata Pelajaran:</span>
            <strong>{activeRequest.subjectName}</strong>
          </div>
          <div className="detail-row">
            <span>Jadwal Sesi:</span>
            <strong>{getFormattedDateString(activeRequest.date)}, {activeRequest.timeSlot}</strong>
          </div>
          <div className="detail-row">
            <span>Siswa:</span>
            <strong>{activeRequest.studentName}</strong>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }}></div>
        </div>
        
        <div className="countdown-text">
          Mencocokkan jadwal otomatis dalam <span>{timeLeft}</span>s...
        </div>

        <div className="matching-actions">
          <button className="btn-danger btn-sm" onClick={onCancel}>
            <X size={14} /> Batalkan Request
          </button>
        </div>

      </div>
    </div>
  );
}
