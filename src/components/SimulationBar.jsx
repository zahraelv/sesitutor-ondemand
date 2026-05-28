ada peimport React from 'react';
import { GraduationCap, Presentation, Columns, Sliders } from 'lucide-react';

export default function SimulationBar({ activeRole, setActiveRole, splitScreen, setSplitScreen, showToast }) {
  const toggleSplitScreen = () => {
    const nextSplit = !splitScreen;
    setSplitScreen(nextSplit);
    if (nextSplit) {
      showToast("Split View Aktif! Kamu bisa melihat kedua panel berdampingan.", "success");
    }
  };

  return (
    <div className="simulation-bar" id="simulationBar">
      <div className="sim-left">
        <span className="sim-badge">Simulation Mode</span>
        <p className="sim-text">Beralih peran untuk menguji pencocokan jadwal tutor otomatis!</p>
      </div>
      <div className="sim-actions">
        <button 
          className={`sim-btn ${activeRole === 'student' && !splitScreen ? 'active' : ''}`} 
          id="btnGoStudent" 
          onClick={() => {
            setActiveRole('student');
            setSplitScreen(false);
          }}
        >
          <GraduationCap size={15} /> Mode Siswa
        </button>
        <button 
          className={`sim-btn ${activeRole === 'teacher' && !splitScreen ? 'active' : ''}`} 
          id="btnGoTeacher" 
          onClick={() => {
            setActiveRole('teacher');
            setSplitScreen(false);
          }}
        >
          <Presentation size={15} /> Mode Master Teacher
        </button>
        <button 
          className={`sim-btn ${activeRole === 'admin' && !splitScreen ? 'active' : ''}`} 
          id="btnGoAdmin" 
          onClick={() => {
            setActiveRole('admin');
            setSplitScreen(false);
          }}
        >
          <Sliders size={15} /> Mode Admin (LT/ST Planner)
        </button>
        <button 
          className={`sim-btn ${splitScreen ? 'active' : ''}`} 
          id="btnSplitScreen" 
          onClick={toggleSplitScreen}
        >
          <Columns size={15} /> Split View (Gojek Demo)
        </button>
      </div>
    </div>
  );
}
