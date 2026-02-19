import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Send, Mail, MessageCircle } from 'lucide-react';

export default function ContactModal({ onClose }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // Блокируем скролл страницы, пока открыто окно
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 14, 20, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: #11141d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 500px;
          border-radius: 24px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .modal-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-title {
          font-size: 28px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .modal-subtitle {
          font-size: 15px;
          color: #94a3b8;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .developer-info {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 14px;
        }

        .info-item a {
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.2s;
        }

        .info-item a:hover {
          color: #3b82f6;
          text-decoration: underline;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 15px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #475569;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .success-state {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon {
          color: #3b82f6;
          margin-bottom: 24px;
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4));
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-content">
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>

                    {status === 'success' ? (
                        <div className="success-state">
                            <CheckCircle2 size={72} className="success-icon" style={{ margin: '0 auto 16px' }} />
                            <h3 className="modal-title">Message Sent!</h3>
                            <p className="modal-subtitle">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="modal-title">Contact Developer</h3>
                            <p className="modal-subtitle">Get in touch directly or send a message</p>

                            <div className="developer-info">
                                <div className="info-item">
                                    <Mail size={18} color="#60a5fa" />
                                    <a href="mailto:fetisovdev0@gmail.com">fetisovdev0@gmail.com</a>
                                </div>
                                <div className="info-item">
                                    <MessageCircle size={18} color="#60a5fa" />
                                    <a href="https://t.me/fetisovdev" target="_blank" rel="noopener noreferrer">@fetisovdev</a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Your Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="john@example.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="What would you like to discuss?"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                {status === 'error' && (
                                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '10px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <><Loader2 size={20} className="spin" /> Sending...</>
                                    ) : (
                                        <><Send size={20} /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}