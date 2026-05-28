import React from 'react';

export default function NetlifyLanding({ onBook }) {
  return (
    <div className="netlify-landing">
      

  
  <div className="announcement-bar" id="announcement-bar">
    <span>🎉 Fasilitas resmi Brain Academy Online oleh Ruangguru! Temukan kemudahan belajar fleksibel pilih jadwal sendiri!</span>
    <button className="close-announcement" id="close-announcement-btn" aria-label="Tutup"><i className="fas fa-times"></i></button>
  </div>

  
  <header className="main-header" id="main-header">
    <div className="container header-container">
      <a href="#" className="logo-wrapper">
        <img src="Logo Brain Academy Online by Ruangguru.png" alt="Logo Brain Academy Online" className="brand-logo logo-bao" />
        <span className="logo-divider"></span>
        <img src="SesiTutor_Logo_Draft2-02 (1).png" alt="Logo Sesi Tutor" className="brand-logo logo-sesitutor" />
      </a>
      
      
      <nav className="nav-menu" id="nav-menu">
        <ul className="nav-list">
          <li className="nav-item"><a href="#hero" className="nav-link active">Home</a></li>
          <li className="nav-item"><a href="#tentang" className="nav-link">Tentang</a></li>
          <li className="nav-item"><a href="#tipe-sesi" className="nav-link">Tipe Sesi</a></li>
          <li className="nav-item"><a href="#keunggulan" className="nav-link">Keunggulan</a></li>
          <li className="nav-item"><a href="#cara-join" className="nav-link">Cara Join</a></li>
          <li className="nav-item"><a href="#paket-coin" className="nav-link">Paket Coin</a></li>
          <li className="nav-item"><a href="#faq" className="nav-link">FAQ</a></li>
        </ul>
      </nav>

      
      <div className="header-ctas">
        <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-secondary btn-sm" id="btn-pesan-header"><i className="fas fa-comment-dots"></i> Pesan Sesi</a>
      </div>

      
      <button className="hamburger-btn" id="hamburger-btn" aria-label="Menu navigasi">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
    </div>
  </header>

  
  <section className="hero-section" id="hero">
    
    <div className="hero-bg-shapes">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
    </div>
    
    <div className="container hero-top-container">
      
      <div className="hero-main-flex">
        <div className="hero-left-content animate-fade-in">
          <div className="badge-official">
            <i className="fas fa-shield-alt"></i> Official Brain Academy Online Program
          </div>
          <h1 className="hero-title">Tanya Soal & Diskusi Materi 📚</h1>
          <p className="hero-subheadline">
            Diskusikan PR, latihan soal, materi sulit, hingga persiapan ujian sekolah & UTBK secara live dan interaktif bersama tutor dari Brain Academy Online
          </p>

          <div className="hero-ondemand-info">
            <h3 className="hero-ondemand-headline">Request sesi belajar sesuai mapel, jadwal, dan Master Teacher favoritmu.</h3>
            <p className="hero-ondemand-desc">
              Isi formnya dan tim kami akan mengonfirmasi ketersediaan sesi maksimal dalam 1x24 jam (bisa lebih cepat). Jika tutor serta hari dan waktu yang diinginkan belum tersedia, kami akan menawarkan alternatif jadwal sesuai ketersediaan tutor.
            </p>
          </div>

          
          <div className="new-hero-usp-box">
            <div className="new-usp-item">
              <div className="usp-icon-circle bg-light-green">
                <i className="fas fa-comments text-green"></i>
              </div>
              <div className="usp-text-content">
                <h4>Interaktif<br />2 Arah</h4>
                <p>Diskusi langsung & live</p>
              </div>
            </div>
            <div className="usp-vertical-divider"></div>
            <div className="new-usp-item">
              <div className="usp-icon-circle bg-light-red">
                <i className="far fa-calendar-alt text-red"></i>
              </div>
              <div className="usp-text-content">
                <h4>Fleksibel<br />Pilih Jadwal</h4>
                <p>Bebas atur waktu belajarmu</p>
              </div>
            </div>
            <div className="usp-vertical-divider"></div>
            <div className="new-usp-item">
              <div className="usp-icon-circle bg-light-blue">
                <i className="fas fa-user-friends text-blue"></i>
              </div>
              <div className="usp-text-content">
                <h4>Privat<br />hingga Grup Kecil</h4>
                <p>1:1 hingga maksimal 5 siswa</p>
              </div>
            </div>
          </div>

          
          <div className="new-hero-cta-container">
            <div className="new-cta-cards">
              <div className="new-cta-card card-pesan">
                <div className="cta-icon-wrapper icon-pesan">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <div className="cta-text-content">
                  <h4>Pesan Sesi Tutor</h4>
                  <p>Pesan dan mulai sesi belajar langsung di aplikasi.</p>
                </div>
                <div className="cta-arrow-wrapper">
                  <i className="fas fa-arrow-right"></i>
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="cta-overlay-link"></a>
              </div>

              <div className="new-cta-card card-ondemand">
                <div className="cta-icon-wrapper icon-ondemand">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="cta-text-content">
                  <h4>Sesi On Demand</h4>
                  <p>Isi form, kami cariin tutor terbaik sesuai kebutuhanmu.</p>
                </div>
                <div className="cta-arrow-wrapper">
                  <i className="fas fa-arrow-right"></i>
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="cta-overlay-link"></a>
              </div>
            </div>
          </div>

        </div>

        <div className="hero-right-illustration animate-fade-in-right">
          <div className="hero-image-wrapper">
            <img src="new foto hero.png" alt="Sesi Live Tutor Brain Academy Online" className="hero-img-main" />
            
            
            <div className="app-badge app-badge-saintek">
              <div className="app-badge-icon bg-purple">
                <i className="fas fa-atom"></i>
              </div>
              <div className="app-badge-label">SAINTEK</div>
              <svg className="app-connecting-line line-saintek" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M50,100 C60,50 90,20 100,0" stroke="#93C5FD" stroke-width="3" stroke-dasharray="6,6" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            
            <div className="app-badge app-badge-matematika">
              <div className="app-badge-icon bg-blue math-grid">
                <span>+</span><span>-</span><span>×</span><span>÷</span>
              </div>
              <div className="app-badge-label">MATEMATIKA</div>
              <svg className="app-connecting-line line-matematika" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M50,100 C40,50 10,20 0,0" stroke="#93C5FD" stroke-width="3" stroke-dasharray="6,6" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            
            <div className="app-badge app-badge-soshum">
              <div className="app-badge-icon bg-teal">
                <i className="fas fa-globe-asia"></i>
              </div>
              <div className="app-badge-label">SOSHUM</div>
              <svg className="app-connecting-line line-soshum" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M50,0 C60,50 90,80 100,100" stroke="#93C5FD" stroke-width="3" stroke-dasharray="6,6" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            
            <div className="app-badge app-badge-bahasa">
              <div className="app-badge-icon bg-orange">
                <i className="fas fa-book-open"></i>
              </div>
              <div className="app-badge-label">BAHASA</div>
              <svg className="app-connecting-line line-bahasa" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M50,0 C40,50 10,80 0,100" stroke="#93C5FD" stroke-width="3" stroke-dasharray="6,6" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="booking-options-section section-padding" id="pilihan-booking">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Pilih Cara Belajarmu</span>
        <h2 className="section-title">2 Cara Booking Sesi Belajar</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Tentukan metode booking yang paling pas untuk kenyamanan belajarmu.</p>
      </div>

      <div className="hero-dual-grid">
        
        <div className="hero-card hero-card-app animate-fade-in-left">
          <div className="hero-card-top-content">
            <span className="hero-card-badge badge-orange"><i className="fas fa-mobile-alt"></i> Cara Pertama</span>
            <h2 className="hero-card-title">📲 Pesan Sesi Tutor</h2>
            <p className="hero-card-desc">Pilih sesi tutor yang sudah tersedia langsung di aplikasi Brain Academy Online.</p>
            
            <ul className="hero-card-checkmarks">
              <li><i className="fas fa-check-circle text-orange"></i> <span>Pilih mata pelajaran</span></li>
              <li><i className="fas fa-check-circle text-orange"></i> <span>Pilih jadwal belajar</span></li>
              <li><i className="fas fa-check-circle text-orange"></i> <span>Pilih Master Teacher</span></li>
              <li><i className="fas fa-check-circle text-orange"></i> <span>Tersedia Privat, Semi Privat & Group</span></li>
            </ul>
          </div>
          
          <div className="hero-card-bottom-actions">
            <div className="hero-card-cta">
              <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-secondary btn-block btn-glow" id="btn-hero-pesan-sesi">
                Pesan Sesi Tutor
              </a>
            </div>
          </div>
        </div>

        
        <div className="hero-card hero-card-ondemand animate-fade-in-right">
          <div className="hero-card-top-content">
            <span className="hero-card-badge badge-blue"><i className="fas fa-user-tie"></i> Cara Kedua</span>
            <h2 className="hero-card-title">👨‍🏫 Sesi Tutor On Demand</h2>
            <p className="hero-card-desc">Request sesi privat 1-on-1 bersama Master Teacher sesuai kebutuhan belajar dan jadwal yang kamu inginkan.</p>
            
            <ul className="hero-card-checkmarks">
              <li><i className="fas fa-check-circle text-blue"></i> <span>Jadwal fleksibel</span></li>
              <li><i className="fas fa-check-circle text-blue"></i> <span>Request materi khusus</span></li>
              <li><i className="fas fa-check-circle text-blue"></i> <span>Fokus pembelajaran personal</span></li>
            </ul>
          </div>
          
          <div className="hero-card-bottom-actions">
            <div className="hero-card-cta">
              <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-primary btn-block btn-glow" id="btn-hero-ondemand">
                Sesi On Demand
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="about-section section-padding" id="tentang">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Mengenal Layanan Kami</span>
        <h2 className="section-title">Apa itu Sesi Tutor?</h2>
        <div className="title-underline"></div>
        <p className="section-desc">
          Sesi Tutor merupakan salah satu fasilitas eksklusif dari <strong>Brain Academy Online</strong> yang dirancang khusus untuk mempermudah perjalanan belajarmu. Kami hadir untuk membantu siswa secara langsung dan personal dalam mengatasi berbagai kesulitan akademik.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-left">
          <div className="about-card">
            <h3>Solusi Belajar Terintegrasi 🚀</h3>
            <p>
              Dengan Sesi Tutor, kamu tidak perlu lagi merasa bingung sendirian saat mengerjakan PR atau mempersiapkan ujian. Kamu bisa langsung terhubung dengan tutor berpengalaman secara real-time.
            </p>
            <div className="about-features">
              <div className="about-feat-item">
                <div className="feat-icon"><i className="fas fa-question-circle"></i></div>
                <div className="feat-info">
                  <h4>Tanya Jawab Soal</h4>
                  <p>Bahas soal-soal sulit yang belum kamu pahami secara mendetail.</p>
                </div>
              </div>
              <div className="about-feat-item">
                <div className="feat-icon"><i className="fas fa-comments"></i></div>
                <div className="feat-info">
                  <h4>Diskusi Materi</h4>
                  <p>Konsultasikan topik pelajaran sekolah yang ingin kamu dalami.</p>
                </div>
              </div>
              <div className="about-feat-item">
                <div className="feat-icon"><i className="fas fa-book-open"></i></div>
                <div className="feat-info">
                  <h4>Pembahasan Soal</h4>
                  <p>Dapatkan cara cepat dan taktik penyelesaian soal yang sistematis.</p>
                </div>
              </div>
              <div className="about-feat-item">
                <div className="feat-icon"><i className="fas fa-lightbulb"></i></div>
                <div className="feat-info">
                  <h4>Pendalaman Konsep</h4>
                  <p>Bukan sekadar rumus cepat, kami bantu kamu paham konsep dasarnya.</p>
                </div>
              </div>
              <div className="about-feat-item">
                <div className="feat-icon"><i className="fas fa-graduation-cap"></i></div>
                <div className="feat-info">
                  <h4>Persiapan Ujian</h4>
                  <p>Siap hadapi Penilaian Harian, Ujian Sekolah, hingga UTBK-SNBT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-right">
          <div className="about-visual-card">
            <div className="visual-badge">100% Interaktif</div>
            <img src="subject_icons.png" alt="Mata Pelajaran Sesi Tutor" className="about-sub-img" />
            <div className="visual-caption">
              <h4>Semua Mata Pelajaran Tersedia!</h4>
              <p>Mulai dari Matematika, Fisika, Kimia, Biologi, Bahasa Indonesia, Bahasa Inggris, hingga materi Soshum lainnya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="session-types-section section-padding bg-light" id="tipe-sesi">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">📚 Tipe Sesi Belajar</span>
        <h2 className="section-title">Pilih Tipe Sesi Belajarmu</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Sesuaikan kenyamanan, jumlah soal, dan kebutuhan belajar kamu dengan 3 tipe sesi interaktif kami.</p>
      </div>

      <div className="types-grid">
        
        <div className="type-card" data-tilt>
          <div className="type-badge badge-blue">Eksklusif 1-on-1</div>
          <div className="type-icon-wrapper tic-blue">
            <i className="fas fa-user-graduate"></i>
          </div>
          <h3 className="type-title">Privat 1:1</h3>
          <div className="type-rate">10 Koin</div>
          <p className="type-desc">Belajar 1-on-1 bareng Master Teacher (MT) pilihan secara personal. Sangat pas untuk pemahaman konsep mendalam.</p>
          <ul className="type-features">
            <li><i className="fas fa-check-circle"></i> Eksklusif 1 Siswa + 1 MT</li>
            <li><i className="fas fa-check-circle"></i> Maksimal 8 Soal + Penjelasan Materi</li>
            <li><i className="fas fa-check-circle"></i> Diskusi Personal & Bebas Bertanya</li>
          </ul>
          <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-outline-primary btn-block">Pesan Kelas Privat</a>
        </div>

        
        <div className="type-card featured-card" data-tilt>
          <div className="type-badge badge-orange">Paling Rekomendasi 🔥</div>
          <div className="type-icon-wrapper tic-orange">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="type-title">Semi Privat</h3>
          <div className="type-rate">4 Koin</div>
          <p className="type-desc">Belajar kolaboratif interaktif dalam kelompok super kecil. Diskusi aktif dipandu langsung oleh tutor ahli.</p>
          <ul className="type-features">
            <li><i className="fas fa-check-circle"></i> Kelompok Kecil (1-3 Siswa)</li>
            <li><i className="fas fa-check-circle"></i> Maksimal 4 Soal + Penjelasan Materi</li>
            <li><i className="fas fa-check-circle"></i> Belajar Seru Bersama Teman</li>
          </ul>
          <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-primary btn-block btn-glow">Pesan Semi Privat</a>
        </div>

        
        <div className="type-card" data-tilt>
          <div className="type-badge badge-teal">Paling Hemat</div>
          <div className="type-icon-wrapper tic-teal">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <h3 className="type-title">Group</h3>
          <div className="type-rate">2 Koin</div>
          <p className="type-desc">Belajar dalam kelompok untuk latihan & pembahasan soal-soal cepat secara ringkas tanpa pengenalan materi baru.</p>
          <ul className="type-features">
            <li><i className="fas fa-check-circle"></i> Kelompok Sedang (1-5 Siswa)</li>
            <li><i className="fas fa-check-circle"></i> Maksimal 2 Soal (No Materi)</li>
            <li><i className="fas fa-check-circle"></i> Cepat, Praktis, & Paling Hemat</li>
          </ul>
          <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-outline-primary btn-block">Pesan Kelas Group</a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="why-us-section section-padding" id="keunggulan">
    <div className="container">
      <div className="why-us-wrapper">
        <div className="why-us-left">
          <span className="section-subtitle">Mengapa Memilih Kami?</span>
          <h2 className="section-title">Keunggulan Sesi Tutor</h2>
          <div className="title-underline left-aligned"></div>
          <p className="why-desc">
            Sebagai bagian dari program resmi <strong>Brain Academy Online by Ruangguru</strong>, kami menjamin kualitas bimbingan belajar terbaik dengan standar pengajaran berskala nasional.
          </p>

          <div className="usp-list">
            <div className="usp-item">
              <div className="usp-icon"><i className="fas fa-user-tie"></i></div>
              <div className="usp-text">
                <h3>Tutor Aktif & Berpengalaman</h3>
                <p>Tutor kami telah melewati seleksi ketat dan terlatih mengajar dengan metode yang menyenangkan.</p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-icon"><i className="fas fa-calendar-check"></i></div>
              <div className="usp-text">
                <h3>Jadwal & Waktu Sangat Fleksibel</h3>
                <p>Kamu yang menentukan kapan ingin belajar! Cukup booking sesi dan tutor siap menunggumu.</p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-icon"><i className="fas fa-laptop-house"></i></div>
              <div className="usp-text">
                <h3>Interactive Learning Experience</h3>
                <p>Gunakan virtual whiteboard, audio, dan chat langsung untuk kemudahan berdiskusi.</p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-icon"><i className="fas fa-bullseye"></i></div>
              <div className="usp-text">
                <h3>Fokus Sesuai Kebutuhanmu</h3>
                <p>Bahas materi apa saja yang sedang kamu butuhkan di sekolah secara personal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="why-us-right">
          <div className="trust-card">
            <div className="trust-circle">
              <span className="trust-percentage">98.7%</span>
              <span className="trust-label">Tingkat Kepuasan</span>
            </div>
            <h4 className="trust-title">Kepercayaan Siswa & Orang Tua</h4>
            <p className="trust-desc">Siswa merasa lebih percaya diri menghadapi ujian setelah berdiskusi langsung di Sesi Tutor.</p>
            <div className="trust-avatars">
              <div className="avatar-group">
                <span className="avatar-i">👨‍🎓</span>
                <span className="avatar-i">👩‍🎓</span>
                <span className="avatar-i">👨‍💻</span>
                <span className="avatar-i">👩‍💻</span>
              </div>
              <span className="avatar-text">Bergabunglah dengan 10.000 siswa lainnya!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="flow-section section-padding bg-light" id="cara-join">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Alur Mudah</span>
        <h2 className="section-title">Tata Cara Booking Sesi Tutor 📲</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Ikuti 6 langkah mudah berikut untuk melakukan pemesanan sesi belajar di aplikasi.</p>
      </div>

      
      <div className="booking-steps-grid">
        <div className="booking-step-card">
          <div className="step-badge-num">1️⃣</div>
          <h3>Pilih Menu Sesi Tutor</h3>
          <p>Masuk ke menu <strong>Brain Academy</strong> di aplikasi Ruangguru, lalu pilih menu **Sesi Tutor**.</p>
        </div>

        <div className="booking-step-card">
          <div className="step-badge-num">2️⃣</div>
          <h3>Pilih MT & Tipe Sesi</h3>
          <p>Pilih jam belajar, Master Teacher (MT), dan tipe sesi tutor yang kamu inginkan (<strong>Privat</strong>, <strong>Semi Privat</strong>, atau **Group**).</p>
        </div>

        <div className="booking-step-card">
          <div className="step-badge-num">3️⃣</div>
          <h3>Klik Pesan Sesi</h3>
          <p>Klik tombol <strong>Pesan Sesi</strong> pada jadwal sesi belajar pilihanmu yang sesuai.</p>
        </div>

        <div className="booking-step-card">
          <div className="step-badge-num">4️⃣</div>
          <h3>Sesi Berhasil Dipesan</h3>
          <p>Jika berhasil dipesan, akan muncul notifikasi konfirmasi bahwa sesi belajar **berhasil dipesan** ✅.</p>
        </div>

        <div className="booking-step-card">
          <div className="step-badge-num">5️⃣</div>
          <h3>Buka Sesi Dipesan</h3>
          <p>Saat hari dan jam sesi berlangsung, buka tab **Sesi Dipesan**, lalu klik tombol **Lihat Detail**.</p>
        </div>

        <div className="booking-step-card">
          <div className="step-badge-num">6️⃣</div>
          <h3>Mulai Sesi Google Meet</h3>
          <p>Pastikan kamu sudah mengunduh aplikasi **Google Meet** di perangkatmu untuk mengikuti sesi belajarnya, ya! 📲</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="coin-section section-padding" id="paket-coin">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Investasi Belajar Terbaik</span>
        <h2 className="section-title">Paket Coin Sesi Tutor 💰</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Gunakan coin untuk mengikuti sesi tutor sesuai kebutuhan belajar kamu. Makin banyak coin, makin hemat harganya! ✨</p>
      </div>

      
      <div className="pricing-tabs">
        <button className="tab-btn active" data-filter="all">Semua Paket</button>
        <button className="tab-btn" data-filter="1-bulan">Masa Aktif 1 Bulan</button>
        <button className="tab-btn" data-filter="6-bulan">Masa Aktif 6 Bulan</button>
      </div>

      
      <div className="pricing-grid">
        
        <div className="pricing-card" data-duration="1-bulan">
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img" />
            <span className="coin-count">5 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount">Rp59.000</span>
            <span className="price-validity">Masa Berlaku: 1 Bulan</span>
          </div>
          <div className="price-details">
            <span className="per-coin-label">Harga per Coin:</span>
            <span className="per-coin-value">Rp11.800</span>
          </div>
          <ul className="pricing-features">
            <li><i className="fas fa-check"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check"></i> Bisa pilih Tutor favorit</li>
            <li><i className="fas fa-check"></i> Bebas tipe kelas apa saja</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-outline-primary btn-block">Beli Paket</a>
        </div>

        
        <div className="pricing-card" data-duration="1-bulan">
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img" />
            <span className="coin-count">10 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount">Rp89.000</span>
            <span className="price-validity">Masa Berlaku: 1 Bulan</span>
          </div>
          <div className="price-details">
            <span className="per-coin-label">Harga per Coin:</span>
            <span className="per-coin-value">Rp8.900</span>
          </div>
          <ul className="pricing-features">
            <li><i className="fas fa-check"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check"></i> Bisa pilih Tutor favorit</li>
            <li><i className="fas fa-check"></i> Bebas tipe kelas apa saja</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-outline-primary btn-block">Beli Paket</a>
        </div>

        
        <div className="pricing-card card-featured" data-duration="1-bulan">
          <div className="card-badge bg-orange">Most Popular 🔥</div>
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img anim-bounce" />
            <span className="coin-count text-white">15 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount text-white">Rp109.000</span>
            <span className="price-validity text-light">Masa Berlaku: 1 Bulan</span>
          </div>
          <div className="price-details bg-white-trans">
            <span className="per-coin-label text-light">Harga per Coin:</span>
            <span className="per-coin-value text-white">Rp7.267</span>
          </div>
          <ul className="pricing-features text-white">
            <li><i className="fas fa-check text-warning"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check text-warning"></i> Bisa pilih Tutor favorit</li>
            <li><i className="fas fa-check text-warning"></i> Bebas tipe kelas apa saja</li>
            <li><i className="fas fa-check text-warning"></i> Prioritas antrean booking</li>
          </ul>
          <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-secondary btn-block btn-glow">Beli Paket Populer</a>
        </div>

        
        <div className="pricing-card" data-duration="6-bulan">
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img" />
            <span className="coin-count">10 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount">Rp99.000</span>
            <span className="price-validity">Masa Berlaku: 6 Bulan</span>
          </div>
          <div className="price-details">
            <span className="per-coin-label">Harga per Coin:</span>
            <span className="per-coin-value">Rp9.900</span>
          </div>
          <ul className="pricing-features">
            <li><i className="fas fa-check"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check"></i> Masa aktif super panjang!</li>
            <li><i className="fas fa-check"></i> Bebas tipe kelas apa saja</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-outline-primary btn-block">Beli Paket</a>
        </div>

        
        <div className="pricing-card" data-duration="6-bulan">
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img" />
            <span className="coin-count">15 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount">Rp119.000</span>
            <span className="price-validity">Masa Berlaku: 6 Bulan</span>
          </div>
          <div className="price-details">
            <span className="per-coin-label">Harga per Coin:</span>
            <span className="per-coin-value">Rp7.933</span>
          </div>
          <ul className="pricing-features">
            <li><i className="fas fa-check"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check"></i> Masa aktif super panjang!</li>
            <li><i className="fas fa-check"></i> Bebas tipe kelas apa saja</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-outline-primary btn-block">Beli Paket</a>
        </div>

        
        <div className="pricing-card" data-duration="6-bulan">
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <div className="coin-icon">$</div>
            <span className="coin-count">25 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount">Rp179.000</span>
            <span className="price-validity">Masa Berlaku: 6 Bulan</span>
          </div>
          <div className="price-details">
            <span className="per-coin-label">Harga per Coin:</span>
            <span className="per-coin-value">Rp7.160</span>
          </div>
          <ul className="pricing-features">
            <li><i className="fas fa-check"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check"></i> Masa aktif super panjang!</li>
            <li><i className="fas fa-check"></i> Bebas tipe kelas apa saja</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-outline-primary btn-block">Beli Paket</a>
        </div>

        
        <div className="pricing-card card-featured card-teal" data-duration="6-bulan">
          <div className="card-badge bg-yellow text-dark">Best Value 🏆</div>
          <div className="card-glow"></div>
          <div className="coin-illustration-box">
            <img src="coin_illustration.png" alt="Coin" className="coin-img anim-pulse" />
            <span className="coin-count text-white">50 Coin</span>
          </div>
          <div className="price-header">
            <span className="price-amount text-white">Rp329.000</span>
            <span className="price-validity text-light">Masa Berlaku: 6 Bulan</span>
          </div>
          <div className="price-details bg-white-trans">
            <span className="per-coin-label text-light">Harga per Coin:</span>
            <span className="per-coin-value text-white">Rp6.580 (Paling Hemat!)</span>
          </div>
          <ul className="pricing-features text-white">
            <li><i className="fas fa-check text-warning"></i> Akses semua mata pelajaran</li>
            <li><i className="fas fa-check text-warning"></i> Prioritas antrean booking</li>
            <li><i className="fas fa-check text-warning"></i> Bebas tipe kelas apa saja</li>
            <li><i className="fas fa-check text-warning"></i> Masa berlaku panjang (6 Bulan)</li>
          </ul>
                      <a href="https://bayar.ruangguru.com/packages-list?tag=addon-sesi-tutor" target="_blank" className="btn btn-warning btn-block text-dark font-weight-bold">Beli Paket</a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="rules-section section-padding" id="rules-sesi">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">⚠️ Ketentuan Belajar</span>
        <h2 className="section-title">Aturan Sesi Tutor</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Mohon perhatikan beberapa ketentuan berikut demi kelancaran dan efektivitas proses belajar.</p>
      </div>

      <div className="rules-card-container">
        <div className="rules-card">
          <div className="rules-header">
            <i className="fas fa-info-circle"></i>
            <span>*Jika durasi sesi masih ada, siswa diperbolehkan menambah soal dan materi yang ingin ditanyakan.</span>
          </div>
          <div className="rules-content">
            <div className="rules-grid">
              <div className="rule-item">
                <span className="rule-num">1</span>
                <p>Siswa wajib mengupload foto soal dan menandai nomor soal yang ingin ditanyakan.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">2</span>
                <p>Jika tidak mengupload soal/materi yang ingin ditanyakan, akan dibahas terakhir. Jika durasi habis, maka bisa tidak dijelaskan.</p>
              </div>
              <div className="rule-item">
                <span className="rule-num">3</span>
                <p>Siswa hanya bisa bertanya sesuai dengan tingkatan kelasnya.</p>
              </div>
            </div>
            <div className="rules-note">
              <strong>Notes:</strong> Jika tidak bisa upload foto soal melalui Handphone, silakan upload melalui aplikasi web di <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank">app.brainacademy.id/klinik-pr-online</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="testi-section section-padding bg-light">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Apa Kata Mereka?</span>
        <h2 className="section-title">Testimoni Teman-teman Kita 💬</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Sudah banyak teman-teman yang merasakan keseruan belajar dan kenaikan nilai setelah mencoba Sesi Tutor.</p>
      </div>

      
      <div className="testi-carousel-container">
        <div className="testi-track" id="testi-track">
          
          <div className="testi-card">
            <div className="testi-stars">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
            </div>
            <p className="testi-text">"Sesi Tutor ngebantu aku banget pas lagi mentok ngerjain PR Matematika malem-malem. Penjelasan tutornya detail banget, gak cuma ngasih tahu jawabannya tapi diajarin sampai konsep dasarnya beneran paham!"</p>
            <div className="testi-user">
              <div className="user-avatar bg-blue">R</div>
              <div className="user-info">
                <h4>Rehan Aditya</h4>
                <p>Siswa SMA - Jakarta</p>
              </div>
            </div>
          </div>

          
          <div className="testi-card">
            <div className="testi-stars">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
            </div>
            <p className="testi-text">"Tipe Semi Privat di Sesi Tutor seru parah. Bisa belajar bareng temen kelompok kecil jadi gak bosen, terus tutornya juga asik diajak diskusi dan interaktif banget. Nilai ujian Fisika aku langsung naik drastis!"</p>
            <div className="testi-user">
              <div className="user-avatar bg-orange">A</div>
              <div className="user-info">
                <h4>Amanda Putri</h4>
                <p>Siswa SMP - Bandung</p>
              </div>
            </div>
          </div>

          
          <div className="testi-card">
            <div className="testi-stars">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
            </div>
            <p className="testi-text">"Buat persiapan UTBK kemarin, aku sering banget ambil paket coin Sesi Tutor. Soal-soal TPS yang rumit dibahas setahap demi setahap secara privat sampai aku bener-bener menguasai metodenya. Rekomendasi banget!"</p>
            <div className="testi-user">
              <div className="user-avatar bg-teal">F</div>
              <div className="user-info">
                <h4>Faisal Rahman</h4>
                <p>Gap Year Student - Surabaya</p>
              </div>
            </div>
          </div>

          
          <div className="testi-card">
            <div className="testi-stars">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
            </div>
            <p className="testi-text">"Sangat fleksibel dan praktis! Anak saya yang SD sekarang jadi rajin belajar sendiri semenjak ada Sesi Tutor. Gak bingung lagi kalau ada PR yang saya sendiri sudah lupa rumusnya. Terima kasih Brain Academy Online!"</p>
            <div className="testi-user">
              <div className="user-avatar bg-pink">B</div>
              <div className="user-info">
                <h4>Bunda Kartika</h4>
                <p>Orang Tua Siswa SD - Yogyakarta</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="carousel-controls">
          <button className="control-btn" id="prev-testi-btn" aria-label="Sebelumnya"><i className="fas fa-arrow-left"></i></button>
          <div className="carousel-dots" id="carousel-dots">
            <span className="dot active" data-index="0"></span>
            <span className="dot" data-index="1"></span>
            <span className="dot" data-index="2"></span>
            <span className="dot" data-index="3"></span>
          </div>
          <button className="control-btn" id="next-testi-btn" aria-label="Selanjutnya"><i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </section>

  
  <section className="faq-section section-padding" id="faq">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Punya Pertanyaan?</span>
        <h2 className="section-title">Frequently Asked Questions 🤔</h2>
        <div className="title-underline"></div>
        <p className="section-desc">Berikut adalah jawaban atas beberapa pertanyaan umum tentang layanan Sesi Tutor.</p>
      </div>

      <div className="faq-list">
        
        <div className="faq-item">
          <button className="faq-question">
            <span>Apakah tersedia untuk semua jenjang sekolah?</span>
            <i className="fas fa-chevron-down faq-arrow"></i>
          </button>
          <div className="faq-answer">
            <p>Ya, benar! Sesi Tutor dari Brain Academy Online tersedia untuk semua jenjang pendidikan mulai dari tingkat SD, SMP, SMA/SMK, hingga siswa Gap Year yang sedang bersiap menghadapi seleksi masuk perguruan tinggi (UTBK-SNBT).</p>
          </div>
        </div>

        
        <div className="faq-item">
          <button className="faq-question">
            <span>Mata pelajaran apa saja yang tersedia?</span>
            <i className="fas fa-chevron-down faq-arrow"></i>
          </button>
          <div className="faq-answer">
            <p>Kami menyediakan bimbingan belajar untuk semua mata pelajaran pokok sekolah seperti Matematika, Bahasa Indonesia, Bahasa Inggris, Fisika, Kimia, Biologi, Ekonomi, Geografi, Sejarah, hingga Sosiologi.</p>
          </div>
        </div>

        
        <div className="faq-item">
          <button className="faq-question">
            <span>Apakah saya harus beli koin untuk memesan sesi?</span>
            <i className="fas fa-chevron-down faq-arrow"></i>
          </button>
          <div className="faq-answer">
            <p>Jika koin kamu habis atau tidak ada koin, kamu bisa memesan koin terlebih dahulu agar dapat memesan jadwal sesi belajar tutor di aplikasi.</p>
          </div>
        </div>

        
        <div className="faq-item">
          <button className="faq-question">
            <span>Apakah sesi dilakukan secara online?</span>
            <i className="fas fa-chevron-down faq-arrow"></i>
          </button>
          <div className="faq-answer">
            <p>Sesi dilaksanakan secara online 100% menggunakan platform google meet dan mendapatkan virtual whiteboard untuk riwayat sesi kamu.</p>
          </div>
        </div>

        
        <div className="faq-item">
          <button className="faq-question">
            <span>Bagaimana cara booking sesi tutor setelah punya koin?</span>
            <i className="fas fa-chevron-down faq-arrow"></i>
          </button>
          <div className="faq-answer">
            <p>Setelah membeli koin, kamu cukup masuk ke menu Brain Academy di aplikasi Ruangguru, pilih Sesi Tutor. Kemudian pilih jam, Master Teacher (MT) dan tipe sesi tutor (Privat, Semi Privat, atau Group) lalu klik Pesan Sesi. Saat hari H sesi, buka tab Sesi Dipesan untuk masuk ke ruang Google Meet.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="final-cta-section section-padding">
    <div className="final-cta-bg"></div>
    <div className="container text-center">
      <h2 className="cta-title">Yuk belajar lebih maksimal bareng Sesi Tutor 🚀</h2>
      <p className="cta-subtitle">Dapatkan kemudahan bertanya soal, membahas PR sulit, serta memahami materi sekolah dan UTBK bersama tutor terpercaya!</p>
      
      <div className="cta-buttons-group">
        <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-secondary btn-xl btn-glow" id="btn-final-pesan">
          <i className="fas fa-bolt"></i> Pesan Sesi Tutor
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank" className="btn btn-outline-white btn-xl" id="btn-final-consult">
          <i className="fas fa-phone-alt"></i> Pesan Sesi Tutor On Demand
        </a>
      </div>
    </div>
  </section>

  
  <footer className="main-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <div className="footer-logos">
          <img src="Logo Brain Academy Online by Ruangguru.png" alt="Brain Academy Online Logo" className="f-logo-bao" />
          <img src="SesiTutor_Logo_Draft2-01.png" alt="Sesi Tutor Logo" className="f-logo-sesitutor" />
        </div>
        <p className="footer-desc">
          Sesi Tutor merupakan bagian dari program bimbingan belajar interaktif online terlengkap dan resmi dari Brain Academy Online oleh Ruangguru.
        </p>
        <div className="social-icons">
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
        </div>
      </div>

      <div className="footer-links">
        <h3>Navigasi</h3>
        <ul>
          <li><a href="#hero">Beranda</a></li>
          <li><a href="#tentang">Tentang Sesi Tutor</a></li>
          <li><a href="#tipe-sesi">Tipe Sesi</a></li>
          <li><a href="#keunggulan">Keunggulan</a></li>
          <li><a href="#cara-join">Cara Join</a></li>
          <li><a href="#paket-coin">Paket Coin</a></li>
        </ul>
      </div>

      <div className="footer-links">
        <h3>Tipe Sesi</h3>
        <ul>
          <li><a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank">Kelas Privat</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank">Kelas Semi Privat</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); onBook(); }} target="_blank">Kelas Grup</a></li>
        </ul>
      </div>

      <div className="footer-contact">
        <h3>Hubungi Kami</h3>
        <p><i className="fas fa-map-marker-alt"></i> Jl. Dr. Saharjo No.161, Manggarai Selatan, Tebet, Jakarta Selatan</p>
        <p><i className="fas fa-phone-alt"></i> (021) 4000-8000</p>
        <p><i className="fas fa-envelope"></i> info@brainacademy.id</p>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container footer-bottom-container">
        <p>&copy; 2026 Brain Academy Online by Ruangguru. Hak Cipta Dilindungi Undang-Undang.</p>
        <div className="bottom-links">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>

  
  <div className="success-toast" id="success-toast">
    <div className="toast-content">
      <i className="fas fa-check-circle toast-icon"></i>
      <div className="toast-text">
        <h4>Simulasi Berhasil!</h4>
        <p>Anda menyimulasikan pemesanan sesi di dashboard aplikasi.</p>
      </div>
    </div>
  </div>

  
  <button className="back-to-top" id="back-to-top" aria-label="Kembali ke atas"><i className="fas fa-chevron-up"></i></button>

  
  
  
  
  

  
  

    </div>
  );
}
