import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  { q: "Apa itu Sesi Tutor On Demand?", a: "Sesi Tutor On Demand adalah layanan belajar 1-on-1 bersama Master Teacher yang bisa di-request sesuai kebutuhan materi dan jadwal belajarmu." },
  { q: "Apakah saya bisa request materi tertentu?", a: "Bisa. Kamu bebas request pembahasan materi sekolah, PR, latihan soal, persiapan UTBK, ujian sekolah, dan kebutuhan belajar lainnya." },
  { q: "Berapa lama proses pencarian tutor?", a: "Estimasi pencarian tutor maksimal 1x24 jam setelah form booking berhasil dikirim." },
  { q: "Apakah saya bisa request Master Teacher tertentu?", a: "Bisa. Kamu dapat request Master Teacher tertentu. Jika tutor yang dipilih tidak tersedia, tim kami akan menawarkan alternatif jadwal sesuai ketersediaan tutor atau guru lain pada jam yang kamu inginkan." },
  { q: "Berapa durasi sesi belajar?", a: "Setiap sesi berlangsung selama 60 menit." },
  { q: "Apakah sesi dilakukan secara online?", a: "Ya. Seluruh sesi dilakukan secara online menggunakan Google Meet sehingga bisa diakses dari mana saja." },
  { q: "Berapa koin yang dibutuhkan untuk booking sesi?", a: "Setiap sesi membutuhkan 10 koin yang terintegrasi dengan akun Ruangguru kamu." },
  { q: "Bagaimana jika tutor tidak tersedia?", a: "Tim kami akan membantu mencarikan alternatif tutor atau jadwal lain yang paling sesuai dengan kebutuhan belajarmu." }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="faq-section" id="faq">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>FAQ — Sesi Tutor On Demand</h2>
      </div>
      {faqData.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
          <button 
            className="faq-question" 
            onClick={() => toggleFaq(index)}
          >
            <span>{faq.q}</span>
            <ChevronDown size={20} className="faq-icon" />
          </button>
          {openIndex === index && (
            <div className="faq-answer">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
