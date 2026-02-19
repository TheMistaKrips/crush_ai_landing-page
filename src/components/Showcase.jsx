import React, { useEffect, useRef } from 'react';

// ПРАВИЛЬНЫЙ ИМПОРТ КАРТИНКИ В VITE/REACT
import editorPreview from '../assets/editor-preview.png';

export default function Showcase() {
    const sectionRef = useRef(null);

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

        const revealElements = sectionRef.current.querySelectorAll('.reveal');
        revealElements.forEach((el) => observer.observe(el));

        return () => {
            revealElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <>
            <style>{`
        .showcase-section {
          padding: 120px 20px;
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        /* Глубокое неоновое свечение за скриншотом */
        .showcase-bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 60px;
          z-index: 10;
        }

        .showcase-header h2 {
          font-size: 56px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .showcase-header p {
          font-size: 20px;
          color: #94a3b8;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Обертка для скриншота с эффектом плавной левитации */
        .showcase-image-wrapper {
          width: 100%;
          max-width: 1100px;
          border-radius: 20px;
          overflow: hidden;
          background: #0f1217;
          border: 1px solid rgba(255, 255, 255, 0.1);
          /* Двойная тень: темная для объема, синяя для неона */
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 80px -20px rgba(59, 130, 246, 0.25);
          animation: levitate 8s ease-in-out infinite;
          z-index: 10;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* Анимация парения */
        @keyframes levitate {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        /* Темная шапка в стиле Mac */
        .mac-window-bar {
          height: 44px;
          background: #181c24;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .mac-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          opacity: 0.8;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .showcase-image-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .showcase-header h2 { font-size: 40px; }
          .showcase-bg-glow { width: 400px; height: 400px; }
        }
      `}</style>

            <section id="showcase" className="showcase-section section-container" ref={sectionRef}>
                <div className="showcase-bg-glow"></div>

                <div className="showcase-header reveal">
                    <h2>Your entire architecture,<br />at a glance.</h2>
                    <p>No more digging through folders. See the data flow, edit the code, and chat with AI in one unified workspace.</p>
                </div>

                <div className="showcase-image-wrapper reveal" style={{ transitionDelay: '0.2s' }}>
                    <div className="mac-window-bar">
                        <div className="mac-dot dot-red"></div>
                        <div className="mac-dot dot-yellow"></div>
                        <div className="mac-dot dot-green"></div>
                    </div>

                    {/* Изображение рендерится через переменную из импорта */}
                    <img src={editorPreview} alt="CRUSH AI Interface" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
            </section>
        </>
    );
}