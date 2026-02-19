import React, { useEffect, useRef } from 'react';
import { Network, Terminal, Zap } from 'lucide-react';

// ИМПОРТИРУЕМ КАРТИНКИ (Они должны лежать в src/assets/)
import imgNodes from '../assets/feature-nodes.png';
import imgChat from '../assets/feature-chat.png';
import imgCode from '../assets/feature-code.png';

export default function Features() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Запускаем внутреннюю анимацию картинок с небольшой задержкой
                        const images = entry.target.querySelectorAll('.card-image-wrapper img');
                        images.forEach((img, index) => {
                            setTimeout(() => {
                                img.style.opacity = '1';
                                img.style.transform = 'scale(1) translateY(0)';
                            }, 200 + (index * 100));
                        });
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
        .features-section {
          padding: 140px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .features-header { text-align: center; margin-bottom: 80px; }
        .features-header h2 { font-size: 56px; font-weight: 600; color: #ffffff; letter-spacing: -0.03em; margin-bottom: 24px; line-height: 1.1; }
        .gradient-text { background: linear-gradient(135deg, #3b82f6, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .features-header p { font-size: 20px; color: #94a3b8; max-width: 600px; margin: 0 auto; line-height: 1.6; }

        /* ИДЕАЛЬНАЯ 4-КОЛОНОЧНАЯ СЕТКА */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 540px 420px; /* Первый ряд выше, чтобы ноды влезли по вертикали */
          gap: 24px;
          width: 100%;
        }

        .bento-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 40px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .bento-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.15);
        }

        /* Распределение по колонкам */
        .card-nodes  { grid-column: span 3; } /* Широкая, почти на весь экран */
        .card-chat   { grid-column: span 1; grid-row: span 2; } /* Высокая, справа */
        .card-models { grid-column: span 1; justify-content: center; align-items: center; text-align: center; } /* Квадрат слева снизу */
        .card-code   { grid-column: span 2; } /* Широкая для кода */

        .card-header-horizontal {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .card-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex; align-items: center; justify-content: center;
          color: #3b82f6; flex-shrink: 0;
          box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .card-title { font-size: 26px; font-weight: 600; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.02em; }
        .card-desc { font-size: 16px; color: #94a3b8; line-height: 1.6; max-width: 480px; }

        /* Контейнер для скриншотов */
        .card-image-wrapper {
          margin-top: auto; /* Прижимает картинку к низу карточки */
          flex: 1;
          border-radius: 16px 16px 0 0; /* Скругление только сверху, снизу уходит в край */
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.1);
          border-bottom: none;
          background: #0b0e14;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          display: flex;
        }

        /* Вертикальная карточка Чата (отступы другие) */
        .card-chat .card-image-wrapper {
          margin-top: 32px;
          border-radius: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        /* Сами скриншоты */
        .card-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: left top;
          /* Начальное состояние для анимации появления */
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Анимация при наведении на саму карточку */
        .bento-card:hover .card-image-wrapper img {
          transform: scale(1.03) translateY(-4px) !important; /* Увеличиваем масштаб на ховере */
        }

        /* Адаптивность */
        @media (max-width: 1200px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; }
          .card-nodes { grid-column: span 2; height: 500px; }
          .card-chat { grid-column: span 2; grid-row: auto; height: 600px; }
          .card-models { grid-column: span 1; height: 350px; }
          .card-code { grid-column: span 1; height: 350px; }
        }

        @media (max-width: 768px) {
          .features-header h2 { font-size: 40px; }
          .bento-grid { grid-template-columns: 1fr; }
          .card-nodes, .card-chat, .card-models, .card-code { grid-column: span 1; height: auto; min-height: 400px; }
          .card-header-horizontal { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

            <section id="features" className="features-section section-container" ref={sectionRef}>

                <div className="features-header reveal">
                    <h2>Built for developers.<br />Designed for the <span className="gradient-text">agentic era.</span></h2>
                    <p>CRUSH AI combines the power of visual node-based architecture with advanced AI models to accelerate your workflow.</p>
                </div>

                <div className="bento-grid">

                    {/* КАРТОЧКА 1: НОДЫ (Очень широкая и высокая) */}
                    <div className="bento-card card-nodes reveal" style={{ transitionDelay: '0.1s' }}>
                        <div className="card-header-horizontal">
                            <div className="card-icon">
                                <Network size={28} />
                            </div>
                            <div>
                                <h3 className="card-title">Visual Node Architecture</h3>
                                <p className="card-desc">Connect frontend, backend, and AI models visually. See the big picture without losing the details. Your entire infrastructure mapped out.</p>
                            </div>
                        </div>

                        <div className="card-image-wrapper">
                            <img src={imgNodes} alt="Node Editor Interface" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                    </div>

                    {/* КАРТОЧКА 2: ЧАТ (Высокая, вертикальная) */}
                    <div className="bento-card card-chat reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="card-icon" style={{ color: '#a855f7', marginBottom: '24px' }}>
                            <Terminal size={28} />
                        </div>
                        <h3 className="card-title">AI Architect</h3>
                        <p className="card-desc">Your personal AI understands your entire graph and writes code tailored to your exact architecture.</p>

                        <div className="card-image-wrapper">
                            <img src={imgChat} alt="AI Architect Chat" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                    </div>

                    {/* КАРТОЧКА 4: МОДЕЛИ (Квадратная, только текст) */}
                    <div className="bento-card card-models reveal" style={{ transitionDelay: '0.3s' }}>
                        <h3 className="card-title" style={{ fontSize: '28px', textAlign: 'center' }}>Any Model<br />You Want</h3>
                        <p className="card-desc" style={{ fontSize: '16px', textAlign: 'center', marginTop: '12px' }}>
                            Support for DeepSeek R1, FLUX.2, Claude 3.5, and local Ollama natively.
                        </p>
                    </div>

                    {/* КАРТОЧКА 3: КОД (Широкая, под нодами) */}
                    <div className="bento-card card-code reveal" style={{ transitionDelay: '0.4s' }}>
                        <div className="card-header-horizontal" style={{ marginBottom: '20px' }}>
                            <div className="card-icon" style={{ color: '#fbbf24', width: '48px', height: '48px' }}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="card-title" style={{ fontSize: '22px', marginBottom: '4px' }}>Instant Generation</h3>
                                <p className="card-desc" style={{ fontSize: '15px' }}>Turn graph into production-ready React and FastAPI code.</p>
                            </div>
                        </div>

                        <div className="card-image-wrapper">
                            <img src={imgCode} alt="Code Generation" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                    </div>

                </div>

            </section>
        </>
    );
}