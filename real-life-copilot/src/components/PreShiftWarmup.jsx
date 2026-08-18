import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { generatePreShiftQuiz } from '../services/geminiService.js';
import { getActiveSOPs } from '../services/ragEngine.js';

export default function PreShiftWarmup({ onCompleteWarmup }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    const sops = getActiveSOPs();
    const quiz = await generatePreShiftQuiz(sops);
    setQuestions(quiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setLoading(false);
  };

  const handleSelectOption = (qId, optionIndex) => {
    if (selectedAnswers[qId] !== undefined) return; // prevent changing after selected
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const currentQ = questions[currentIndex];
  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textFillColor: 'center', textAlign: 'center' }}>
        <Sparkles size={36} color="var(--primary-cyan)" className="spin-icon" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Generating 1-Minute Pre-Shift Quiz...</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scanning active SOPs & safety guidelines</p>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const total = questions.length;
    const passed = score >= 2;

    return (
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: `2px solid ${passed ? 'var(--emerald-success)' : 'var(--rose-danger)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: passed ? 'var(--emerald-success)' : 'var(--rose-danger)'
        }}>
          {passed ? <Award size={44} /> : <XCircle size={44} />}
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          {passed ? 'Shift Ready Certified! 🎉' : 'Review Safety SOPs'}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          You scored <strong style={{ color: passed ? 'var(--emerald-success)' : 'var(--rose-danger)', fontSize: '1.2rem' }}>{score}/{total}</strong> on the pre-shift safety micro-check.
        </p>

        {passed ? (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
            ✓ Verified for espresso machine operation & chemical safety standards. Have a safe shift!
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.3)', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
            Please review the safety guidelines and retake the 1-minute quiz before beginning your shift.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-secondary" onClick={loadQuiz}>
            <RotateCcw size={16} /> Retake Quiz
          </button>
          {passed && onCompleteWarmup && (
            <button className="btn-primary" onClick={onCompleteWarmup}>
              Start Shift (Open Voice HUD) <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
      {/* Quiz Progress Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck color="var(--primary-cyan)" size={24} />
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>1-Minute Pre-Shift Micro-Quiz</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safety & Quality SOP Verification</span>
          </div>
        </div>

        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Box */}
      {currentQ && (
        <div>
          <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.2rem', lineHeight: '1.4' }}>
            {currentQ.question}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((opt, oIdx) => {
              const selected = selectedAnswers[currentQ.id] === oIdx;
              const isCorrect = currentQ.correctIndex === oIdx;
              let borderCol = 'rgba(255,255,255,0.08)';
              let bgCol = 'rgba(11, 15, 25, 0.6)';

              if (isAnswered) {
                if (isCorrect) {
                  borderCol = 'var(--emerald-success)';
                  bgCol = 'rgba(16, 185, 129, 0.15)';
                } else if (selected) {
                  borderCol = 'var(--rose-danger)';
                  bgCol = 'rgba(244, 63, 94, 0.15)';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(currentQ.id, oIdx)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: bgCol,
                    border: `1px solid ${borderCol}`,
                    color: '#ffffff',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-fast)',
                    cursor: isAnswered ? 'default' : 'pointer'
                  }}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle size={18} color="var(--emerald-success)" />}
                  {isAnswered && selected && !isCorrect && <XCircle size={18} color="var(--rose-danger)" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-cyan)', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <strong>SOP Rationale:</strong> {currentQ.explanation}
            </div>
          )}

          {/* Next / Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {currentIndex < questions.length - 1 ? (
              <button
                className="btn-primary"
                disabled={!isAnswered}
                onClick={() => setCurrentIndex(currentIndex + 1)}
                style={{ opacity: isAnswered ? 1 : 0.5, cursor: isAnswered ? 'pointer' : 'not-allowed' }}
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn-primary"
                disabled={!isAnswered}
                onClick={() => setShowResult(true)}
                style={{ opacity: isAnswered ? 1 : 0.5, cursor: isAnswered ? 'pointer' : 'not-allowed' }}
              >
                Complete Micro-Check <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
