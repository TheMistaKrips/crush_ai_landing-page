import React, { useState, useEffect } from 'react';
// ИМПОРТИРУЕМ ЛОГОТИП (должен лежать в src/assets/)
import crushLogo from '../assets/crush_logo.png';

export default function Navbar({ onOpenModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#features');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['features', 'showcase', 'pricing'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveLink(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setActiveLink(href);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
                .navbar-wrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    transition: all 0.3s ease;
                    background: transparent;
                }

                .navbar-wrapper.scrolled {
                    background: rgba(11, 14, 20, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    height: 76px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    transition: height 0.3s ease;
                }

                .navbar-wrapper.scrolled .nav-container {
                    height: 64px;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .logo-image {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                }

                .logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.5px;
                }

                .nav-links {
                    display: flex;
                    gap: 40px;
                }

                .nav-link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: color 0.2s ease;
                    cursor: pointer;
                    position: relative;
                }

                .nav-link:hover {
                    color: #ffffff;
                }

                .nav-link.active {
                    color: #ffffff;
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: #3b82f6;
                    border-radius: 2px;
                }

                .nav-button {
                    background: #ffffff;
                    color: #0f172a;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nav-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
                }

                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .nav-container {
                        padding: 0 16px;
                    }
                }
            `}</style>

      <div className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src={crushLogo}
              alt="CRUSH AI"
              className="logo-image"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.target.style.display = 'none';
                // Добавляем fallback
                const fallback = document.createElement('div');
                fallback.style.width = '32px';
                fallback.style.height = '32px';
                fallback.style.background = '#3b82f6';
                fallback.style.borderRadius = '8px';
                e.target.parentNode.appendChild(fallback);
              }}
            />
            <span className="logo-text">CRUSH AI</span>
          </div>

          <div className="nav-links">
            <a
              className={`nav-link ${activeLink === '#features' ? 'active' : ''}`}
              href="#features"
              onClick={(e) => handleLinkClick(e, '#features')}
            >
              Features
            </a>
            <a
              className={`nav-link ${activeLink === '#showcase' ? 'active' : ''}`}
              href="#showcase"
              onClick={(e) => handleLinkClick(e, '#showcase')}
            >
              Interface
            </a>
            <a
              className={`nav-link ${activeLink === '#pricing' ? 'active' : ''}`}
              href="#pricing"
              onClick={(e) => handleLinkClick(e, '#pricing')}
            >
              Pricing
            </a>
          </div>

          <button className="nav-button" onClick={onOpenModal}>
            Join Waitlist
          </button>
        </div>
      </div>
    </>
  );
}