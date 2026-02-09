import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './HulkFinal.css';

const HulkFinal = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get auth context from FR
  const token = user?.token;
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [stoneRevealed, setStoneRevealed] = useState(false);

  useEffect(() => {
    // Reveal stone animation on mount
    setTimeout(() => {
      setStoneRevealed(true);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!flag.trim()) {
      setError('Please enter the flag');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Get API URL from environment or use default
      const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      
      // Submit to backend API with authentication
      const response = await axios.post(
        `${API_URL}/game/submit-flag`,
        {
          flag: flag.trim(),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        // Redirect back to Challenges after short delay
        setTimeout(() => {
          navigate('/challenges');
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid flag. Try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit flag. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hulk-final-container">
      {/* Animated background */}
      <div className="victory-particles"></div>
      <div className="time-distortion"></div>

      {/* Success Animation */}
      {success && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="check-mark">✓</div>
            <h2>TIME STONE CAPTURED!</h2>
            <p>Redirecting to challenges...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="final-header">
        <h1 className="victory-title">
          🟢 GAMMA CONTAINMENT STABILIZED 🟢
        </h1>
        <p className="subtitle">Dr. Banner's challenge conquered!</p>
      </div>

      {/* Stone Reveal */}
      <div className={`stone-reveal ${stoneRevealed ? 'revealed' : ''}`}>
        <div className="stone-container">
          <div className="time-stone">
            <div className="stone-core"></div>
            <div className="stone-ring ring-1"></div>
            <div className="stone-ring ring-2"></div>
            <div className="stone-ring ring-3"></div>
            <div className="stone-glow"></div>
          </div>
          <h2 className="stone-name">⏰ TIME STONE ⏰</h2>
          <p className="stone-description">
            The power to manipulate time itself. You've proven your intellect 
            and patience through the gamma radiation challenge.
          </p>
        </div>
      </div>

      {/* Challenge Summary */}
      <div className="challenge-summary">
        <h3>🏆 Challenge Completed</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Difficulty:</span>
            <span className="stat-value hard">HARD</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Character:</span>
            <span className="stat-value">Hulk / Bruce Banner</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Puzzle Type:</span>
            <span className="stat-value">Timing + Decryption</span>
          </div>
        </div>
      </div>

      {/* Flag Submission */}
      <div className="submission-section">
        <h3>📝 Submit Your Flag</h3>
        <p className="submission-info">
          Enter the final flag keyword to claim your Time Stone:
        </p>
        
        <form onSubmit={handleSubmit} className="flag-form">
          <div className="flag-input-group">
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag: green_smash"
              className="flag-input"
              disabled={submitting || success}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting || success}
            >
              {submitting ? 'SUBMITTING...' : success ? 'SUBMITTED ✓' : 'CLAIM STONE'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flag-hint">
          <p>💡 The flag you discovered in the gamma wave analysis</p>
          <p className="hint-format">Format: lowercase_with_underscore</p>
        </div>
      </div>

      {/* Journey Recap */}
      <div className="journey-recap">
        <h3>🎯 Your Journey</h3>
        <div className="journey-steps">
          <div className="step completed">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Gamma Containment Chamber</h4>
              <p>Monitored fluctuating radiation gauges</p>
            </div>
          </div>
          <div className="step completed">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Perfect Timing</h4>
              <p>Triggered hidden button at precise moment</p>
            </div>
          </div>
          <div className="step completed">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Binary Decryption</h4>
              <p>Decoded waveform binary sequences</p>
            </div>
          </div>
          <div className="step completed">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Hidden Revelation</h4>
              <p>Discovered the true gamma signature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="final-navigation">
        <button 
          className="nav-button secondary"
          onClick={() => navigate('/leaderboard')}
        >
          📊 View Dashboard
        </button>
        <button 
          className="nav-button primary"
          onClick={() => navigate('/challenges')}
        >
          🎭 Back to Challenges
        </button>
      </div>

      {/* Footer Quote */}
      <div className="final-quote">
        <p className="quote-text">
          "That's my secret, Captain. I'm always angry."
        </p>
        <p className="quote-author">- Bruce Banner / Hulk</p>
      </div>
    </div>
  );
};

export default HulkFinal;