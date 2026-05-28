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

const generateHalfHourSlots = (start = "09:00", end = "21:00") => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const slots = [];
  const cursor = new Date(2000, 0, 1, startHour, startMinute);
  const endTime = new Date(2000, 0, 1, endHour, endMinute);

  while (cursor <= endTime) {
    slots.push(`${String(cursor.getHours()).padStart(2, "0")}:${String(cursor.getMinutes()).padStart(2, "0")}`);
    cursor.setMinutes(cursor.getMinutes() + 30);
  }

  return slots;
};

export function getSlotsForDay(day) {
  return generateHalfHourSlots();
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
  return generateHalfHourSlots();
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
