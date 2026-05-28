import React from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

export default function TopUpModal({ active, onClose, currentCoins }) {
  if (!active) return null;

  const packageUrl = 'https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor';
  const packages = [
    { id: 'minimum', name: 'Paket 1 Bulan', duration: 'Berlaku 30 hari', coins: 10, price: 'Rp89.000', badge: '10 Koin' },
    { id: 'best-value', name: 'Paket 6 Bulan', duration: 'Berlaku 180 hari', coins: 50, price: 'Rp329.000', recommended: true, badge: 'Best Value' }
  ];

  return (
    <div className={`modal-overlay ${active ? 'active' : ''}`}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>
            <AlertTriangle className="warn-icon" size={18} style={{ color: 'var(--color-warning)', marginRight: '8px', verticalAlign: 'middle' }} /> 
            Koin Tidak Cukup
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <p className="modal-subtitle">
            Kamu membutuhkan minimal <strong className="text-orange">10 koin</strong> untuk memesan 1 sesi tutor on demand. Saldo kamu saat ini: <strong className="current-user-coins-modal" style={{ color: 'var(--color-danger)' }}>{currentCoins} koin</strong>. Pilih Paket Koin Sesi Tutor di bawah ini.
          </p>
          
          <div className="topup-packages-list">
            {packages.map((pkg) => (
              <a 
                key={pkg.id} 
                className={`topup-package-card ${pkg.recommended ? 'recommended' : ''}`}
                href={packageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="badge-recommended">{pkg.badge}</span>
                <div className="pkg-info">
                  <h4>{pkg.name}</h4>
                  <p>{pkg.duration}</p>
                  <span className="pkg-coin-row">🪙 {pkg.coins} Koin</span>
                </div>
                <div className="pkg-action">
                  <button className="btn-success btn-xs" type="button">Lihat Paket {pkg.price}</button>
                </div>
              </a>
            ))}
          </div>

          <div className="topup-notes">
            <Info size={16} />
            <span>Butuh pilihan lain? <a href={packageUrl} target="_blank" rel="noopener noreferrer">Lihat semua paket koin dan promo menarik lainnya.</a></span>
          </div>
        </div>
      </div>
    </div>
  );
}
