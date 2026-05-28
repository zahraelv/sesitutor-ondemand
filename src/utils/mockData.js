import parsedTeachers from './parsed_teachers.json';
import validationMap from './validation_map.json';

export const MOCK_STUDENTS = {
  "budi@ruangguru.com": {
    name: "Budi Setiawan",
    email: "budi@ruangguru.com",
    class: "12 SMA",
    package: "Elite",
    coins: 15
  },
  "ani@ruangguru.com": {
    name: "Ani Lestari",
    email: "ani@ruangguru.com",
    class: "10 SMA",
    package: "Regular",
    coins: 5
  },
  "clara@ruangguru.com": {
    name: "Clara Amanda",
    email: "clara@ruangguru.com",
    class: "11 SMA",
    package: "Premium",
    coins: 30
  },
  "zahraelvansari@ruangguru.com": {
    name: "Zahra Elvansari",
    email: "zahraelvansari@ruangguru.com",
    class: "12 SMA",
    package: "Brain Academy Online Regular",
    whatsapp: "",
    coins: 100
  }
};

export const SUBJECTS = [
  // SAINTEK
  { id: "matematika", name: "Matematika", category: "saintek" },
  { id: "biologi", name: "Biologi", category: "saintek" },
  { id: "kimia", name: "Kimia", category: "saintek" },
  { id: "fisika", name: "Fisika", category: "saintek" },
  { id: "informatika", name: "Informatika", category: "saintek" },
  
  // SOSHUM
  { id: "ekonomi", name: "Ekonomi", category: "soshum" },
  { id: "geografi", name: "Geografi", category: "soshum" },
  { id: "sosiologi", name: "Sosiologi", category: "soshum" },
  { id: "sejarah", name: "Sejarah", category: "soshum" },
  
  // UMUM / BAHASA
  { id: "b_indo", name: "Bahasa Indonesia", category: "umum" },
  { id: "b_ing", name: "Bahasa Inggris", category: "umum" },
  { id: "ppu", name: "PPU (Pengetahuan & Pemahaman Umum)", category: "umum" },
  { id: "lbi", name: "LBI (Literasi Bahasa Indonesia)", category: "umum" },
  { id: "lbe", name: "LBE (Literasi Bahasa Inggris)", category: "umum" },
  { id: "pnu", name: "PNU (Penalaran Umum)", category: "umum" },
  { id: "pkt", name: "PKT (Pengetahuan Kuantitatif)", category: "umum" },
  { id: "pbm", name: "PBM (Pemahaman Bacaan & Menulis)", category: "umum" },
  { id: "pnm", name: "PNM (Penalaran Matematika)", category: "umum" },
  
  // OLIMPIADE
  { id: "olimp_ipa", name: "Olimpiade IPA", category: "olimpiade" },
  { id: "olimp_ips", name: "Olimpiade IPS", category: "olimpiade" },
  { id: "olimp_mtk", name: "Olimpiade Matematika", category: "olimpiade" }
];

export { validationMap };

export function getSlotsForDay(day) {
  if (day === 'Sabtu') {
    return ["10:00", "11:00", "12:30", "13:30", "14:30", "15:30"];
  }
  return ["14:00", "15:00", "16:00", "17:00", "18:45", "19:30", "20:00", "20:30"];
}

const SUBJECT_MAP = {
  "Matematika": ["matematika", "pkt", "pnm", "olimp_mtk"],
  "Biologi": ["biologi", "olimp_ipa"],
  "Kimia": ["kimia"],
  "Fisika": ["fisika", "olimp_ipa"],
  "Bahasa Indonesia": ["b_indo", "ppu", "lbi", "pbm"],
  "Bahasa Inggris": ["b_ing", "lbe"],
  "Ekonomi": ["ekonomi", "olimp_ips"],
  "Geografi": ["geografi", "olimp_ips"],
  "Sosiologi": ["sosiologi"],
  "Sejarah": ["sejarah"],
  "Informatika": ["informatika"],
  "PKN": ["pkn"]
};

export const TEACHERS = parsedTeachers.map(t => {
  const mappedSubjects = SUBJECT_MAP[t.subject] || [t.subject.toLowerCase()];
  return {
    ...t,
    subjects: mappedSubjects
  };
});

// Day-specific time slots array generator for student booking wizard
export function generateTimeSlotsArray(dateStr) {
  if (!dateStr) return ["14:00", "15:00", "16:00", "17:00", "18:45", "19:30", "20:00", "20:30"];
  const dateObj = new Date(dateStr);
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dayName = dayNames[dateObj.getDay()];
  if (dayName === 'Sabtu') {
    return ["10:00", "11:00", "12:30", "13:30", "14:30", "15:30"];
  }
  if (dayName === 'Minggu') {
    return [];
  }
  return ["14:00", "15:00", "16:00", "17:00", "18:45", "19:30", "20:00", "20:30"];
}

export function getFormattedDateString(dateStr) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const options = { weekday: 'long', day: 'numeric', month: 'short' };
  return dateObj.toLocaleDateString('id-ID', options);
}

export function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
