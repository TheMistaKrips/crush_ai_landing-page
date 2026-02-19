import React, { useEffect, useRef, useState } from 'react';
import ContactModal from './ContactModal';

export default function Footer() {
  const footerRef = useRef(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = footerRef.current.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <style>{`
        .footer-section {
          padding: 80px 20px 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
          background: #0b0e14;
        }

        .footer-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 80px;
        }

        .footer-brand h3 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -1px;
          color: #ffffff;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-brand p {
          color: #94a3b8;
          margin-top: 16px;
          font-size: 15px;
          max-width: 300px;
          line-height: 1.6;
        }

        .footer-links-grid {
          display: flex;
          gap: 120px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-column-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .footer-link {
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-family: inherit;
        }

        .footer-link:hover {
          color: #ffffff;
        }

        /* Гигантский текст с градиентом в прозрачность */
        .footer-giant-wrapper {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          padding-top: 20px;
        }

        .footer-giant-text {
          font-size: 15vw; /* Масштабируется от ширины экрана */
          font-weight: 800;
          letter-spacing: -0.05em;
          text-align: center;
          margin: 0;
          padding: 0;
          line-height: 0.8;
          background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          user-select: none;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #64748b;
          font-size: 13px;
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .contact-button {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }

        @media (max-width: 768px) {
          .footer-section {
            padding: 60px 20px 20px;
          }
          .footer-top {
            flex-direction: column;
            gap: 40px;
            margin-bottom: 40px;
          }
          .footer-links-grid {
            gap: 60px;
            flex-wrap: wrap;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            align-items: center;
            text-align: center;
          }
          .footer-bottom-left {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <footer className="footer-section" ref={footerRef}>
        <div className="footer-container">

          <div className="footer-top reveal">
            <div className="footer-brand">
              <h3>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 15px #3b82f6' }}></div>
                CRUSH AI
              </h3>
              <p>
                The agentic IDE that builds, designs, and deploys. Welcome to the future of development.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-column">
                <span className="footer-column-title">Product</span>
                <a href="#features" className="footer-link">Features</a>
                <a href="#showcase" className="footer-link">Interface</a>
                <a href="#" className="footer-link">Changelog</a>
              </div>

              <div className="footer-column">
                <span className="footer-column-title">Resources</span>
                <a href="#" className="footer-link">Documentation</a>
                <a href="#" className="footer-link">API Reference</a>
                <a href="#" className="footer-link">Community</a>
              </div>
            </div>
          </div>

          <div className="footer-giant-wrapper reveal" style={{ transitionDelay: '0.2s' }}>
            <h1 className="footer-giant-text">
              CRUSH AI
            </h1>
          </div>

          <div className="footer-bottom reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="footer-bottom-left">
              <div>© {new Date().getFullYear()} CRUSH AI. All rights reserved.</div>
              <button
                className="contact-button"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact Developer
              </button>
            </div>
          </div>

        </div>
      </footer>

      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}
    </>
  );
}