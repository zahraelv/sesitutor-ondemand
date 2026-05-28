import React from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

export default function TopUpModal({ active, onClose, onPurchase, currentCoins }) {
  if (!active) return null;

  const packages = [
    { id: 'starter', name: 'Starter Pack', coins: 10, price: 'Rp 150rb', label: '150000' },
    { id: 'booster', name: 'Booster Pack', coins: 25, price: 'Rp 320rb', label: '320000', recommended: true },
    { id: 'elite', name: 'Elite Pack', coins: 50, price: 'Rp 580rb', label: '580000' }
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
            Kamu membutuhkan minimal <strong className="text-orange">10 koin</strong> untuk memesan 1 sesi tutor on demand. Saldo kamu saat ini: <strong className="current-user-coins-modal" style={{ color: 'var(--color-danger)' }}>{currentCoins} koin</strong>.
          </p>
          
          <div className="topup-packages-list">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`topup-package-card ${pkg.recommended ? 'recommended' : ''}`}
                onClick={() => onPurchase(pkg.coins)}
              >
                {pkg.recommended && <span className="badge-recommended">Paling Laris</span>}
                <div className="pkg-info">
                  <h4>{pkg.name}</h4>
                  <p>+{pkg.coins} Koin Belajar</p>
                </div>
                <div className="pkg-action">
                  <button className="btn-success btn-xs" type="button">Beli {pkg.price}</button>
                </div>
              </div>
            ))}
          </div>

          <div className="topup-notes">
            <Info size={16} />
            <span>Pembelian koin disimulasikan secara instan untuk mempercepat pengujian alur booking.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
