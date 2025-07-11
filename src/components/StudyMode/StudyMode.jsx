import { useState, useEffect, useContext } from 'react';
import { Context } from '../../context/context';
import './StudyMode.css';
import { jsPDF } from 'jspdf';

const subjects = ['Math', 'Science', 'History', 'English','Geography', 'Computer Science'];

const StudyMode = () => {
  const { onSent } = useContext(Context);

  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState('');
  const [concept, setConcept] = useState('');

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          if ((next % 300 === 0) && next !== duration * 60 && next !== 0) {
            generateQuestion();
          }
          if (next <= 0) {
            endSession();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startSession = () => {
    if (!concept.trim()) {
      alert('Please enter a concept before starting.');
      return;
    }
    setTimeLeft(duration * 60);
    setQuestions([]);
    setSummary('');
    setIsRunning(true);
  };

  const generateQuestion = async () => {
    const prompt = `Ask one short quiz question in ${concept} for a student.`;
    const response = await onSent(prompt);
    setQuestions(prev => [...prev, response]);
  };

  const endSession = async () => {
    setIsRunning(false);
    setTimeLeft(0);
    const prompt = `Give a short summary of ${concept} in ${selectedSubject}.`;
    const response = await onSent(prompt);
    setSummary(response);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`📋 Study Summary - ${concept}`, 10, 20);

    const lines = doc.splitTextToSize(summary, 180);
    doc.text(lines, 10, 30);

    doc.save(`${concept}_summary.pdf`);
  };

  return (
    <div className="study-mode-container">
      {!isRunning ? (
        <div className="setup">
          <h2>🎯 Study Mode</h2>

          <label>Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(subj => (
              <option key={subj}>{subj}</option>
            ))}
          </select>

          <label>Duration (minutes):</label>
          <input
            type="number"
            min="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <label>Concept:</label>
          <input
            type="text"
            placeholder="Enter a concept"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />

          <button onClick={startSession}>Start Study Session</button>
        </div>
      ) : (
        <div className="active-session">
          <h3>{selectedSubject}</h3>
          <p>⏱ Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>

          <div className="questions">
          </div>
        </div>
      )}
      {!isRunning && summary && (
        <div className="summary">
          <h3>📋 Study Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default StudyMode;
