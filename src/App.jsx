import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#0b0e14', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* Декоративная сетка на фоне (Dev-стиль) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(to bottom, black 10%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 90%)'
      }}></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #f8fafc; /* Светлый текст */
          background-color: #0b0e14; /* Глубокий темный фон */
          overflow-x: hidden;
        }

        /* Глобальные классы для плавного появления */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        body.modal-open {
          overflow: hidden;
        }

        /* Общий контейнер, чтобы всё железно было по центру */
        .section-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }
      `}</style>

      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Обертка main, центрирующая все секции */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <Features />
        <Showcase />
      </main>

      <Footer />

      {isModalOpen && <WaitlistModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}