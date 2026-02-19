import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Monitor, ArrowRight, X, Plus } from 'lucide-react';

const generateParticles = () => {
  const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'];
  return Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    length: Math.random() * 20 + 5,
    angle: Math.random() * 360,
    colorStr: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 2,
    duration: Math.random() * 6 + 6,
    opacity: Math.random() * 0.5 + 0.2,
  }));
};

// Компонент для печатающегося текста
const TypingText = ({ texts, speed = 100, pauseDuration = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    let timeout;

    const currentFullText = texts[textIndex];

    if (!isDeleting && displayText === currentFullText) {
      // Пауза после завершения печати
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayText === '') {
      // Переход к следующему тексту
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      // Печать или удаление
      const nextIndex = isDeleting ? displayText.length - 1 : displayText.length + 1;

      timeout = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, pauseDuration]);

  return <span className="typing-text">{displayText}<span className="cursor">|</span></span>;
};

// Компонент для перемещаемых нод
const DraggableNode = ({ node, onDrag, onDragStart, onDragEnd, onConnect, connections, isConnecting, connectingFrom }) => {
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showConnector, setShowConnector] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (e.target.closest('.node-connector')) return;

    const rect = nodeRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    onDragStart(node.id);
  };

  const handleConnectorMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onConnect('start', node.id, {
      x: node.x + 100,
      y: node.y + 30
    });
  };

  const handleConnectorMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== node.id) {
      onConnect('end', node.id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Ограничиваем перемещение в пределах контейнера
      const container = document.querySelector('.nodes-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const boundedX = Math.max(0, Math.min(newX, containerRect.width - 200));
        const boundedY = Math.max(0, Math.min(newY, containerRect.height - 60));
        onDrag(node.id, boundedX, boundedY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node.id, onDrag, onDragEnd]);

  return (
    <div
      ref={nodeRef}
      className={`node ${node.type} ${isDragging ? 'dragging' : ''} ${connectingFrom === node.id ? 'connecting' : ''}`}
      style={{
        left: node.x,
        top: node.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : node.zIndex
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowConnector(true)}
      onMouseLeave={() => setShowConnector(false)}
    >
      <div className="node-header">
        <span className="node-icon">{node.icon}</span>
        <span className="node-title">{node.title}</span>
      </div>
      <div className="node-content">
        {node.description}
      </div>
      {(showConnector || isConnecting) && (
        <div
          className={`node-connector ${connectingFrom === node.id ? 'active' : ''}`}
          onMouseDown={handleConnectorMouseDown}
          onMouseUp={handleConnectorMouseUp}
        >
          <Plus size={14} />
        </div>
      )}
    </div>
  );
};

export default function Hero({ onOpenModal }) {
  const [particles] = useState(() => generateParticles());
  const [isLoaded, setIsLoaded] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const containerRef = useRef(null);

  // Тексты для печати
  const typingTexts = [
    "next-generation IDE",
    "visual development",
    "AI-powered coding",
    "instant deployment"
  ];

  // Инициализация нод
  useEffect(() => {
    const initialNodes = [
      {
        id: 'node1',
        x: 100,
        y: 200,
        title: 'Frontend',
        description: 'React + TypeScript',
        icon: '⚛️',
        type: 'frontend',
        zIndex: 1
      },
      {
        id: 'node2',
        x: 400,
        y: 150,
        title: 'Backend',
        description: 'Node.js + Express',
        icon: '⚙️',
        type: 'backend',
        zIndex: 1
      },
      {
        id: 'node3',
        x: 250,
        y: 350,
        title: 'Database',
        description: 'PostgreSQL',
        icon: '🗄️',
        type: 'database',
        zIndex: 1
      },
      {
        id: 'node4',
        x: 550,
        y: 300,
        title: 'AI Services',
        description: 'ML Models',
        icon: '🧠',
        type: 'ai',
        zIndex: 1
      }
    ];
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeDrag = useCallback((nodeId, x, y) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x, y } : node
    ));

    // Обновляем временное соединение
    if (connectingFrom === nodeId && tempConnection) {
      setTempConnection(prev => ({
        ...prev,
        endX: x + 100,
        endY: y + 30
      }));
    }
  }, [connectingFrom, tempConnection]);

  const handleNodeDragStart = useCallback((nodeId) => {
    setDraggedNode(nodeId);
    setNodes(prev => prev.map(node => ({
      ...node,
      zIndex: node.id === nodeId ? 1000 : 1
    })));
  }, []);

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const handleConnect = useCallback((type, nodeId, position) => {
    if (type === 'start') {
      setConnectingFrom(nodeId);
      setTempConnection({
        startX: position.x,
        startY: position.y,
        endX: position.x,
        endY: position.y
      });
    } else if (type === 'end' && connectingFrom && connectingFrom !== nodeId) {
      // Создаем соединение
      setConnections(prev => [...prev, {
        id: `${connectingFrom}-${nodeId}-${Date.now()}`,
        from: connectingFrom,
        to: nodeId
      }]);
      setConnectingFrom(null);
      setTempConnection(null);
    }
  }, [connectingFrom]);

  // Отмена соединения при клике вне нод
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.node') && connectingFrom) {
        setConnectingFrom(null);
        setTempConnection(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [connectingFrom]);

  // Обновление временного соединения при движении мыши
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (connectingFrom && !draggedNode && tempConnection) {
        setTempConnection(prev => ({
          ...prev,
          endX: e.clientX,
          endY: e.clientY
        }));
      }
    };

    if (connectingFrom) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [connectingFrom, draggedNode, tempConnection]);

  const clearConnections = () => {
    setConnections([]);
  };

  return (
    <>
      <style>{`
                .hero-section {
                    position: relative;
                    min-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 120px 20px 60px;
                }

                .particles-container {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; z-index: 1;
                    mask-image: radial-gradient(circle at center, transparent 40%, black 100%);
                    -webkit-mask-image: radial-gradient(circle at center, transparent 40%, black 100%);
                }

                .particle {
                    position: absolute; height: 2px; border-radius: 10px;
                    animation: float linear infinite;
                }

                @keyframes float {
                    0% { transform: translate(0, 0) rotate(var(--angle)); opacity: 0; }
                    20% { opacity: var(--target-opacity); }
                    50% { transform: translate(20px, -30px) rotate(var(--angle)); opacity: var(--target-opacity); }
                    100% { transform: translate(40px, -60px) rotate(var(--angle)); opacity: 0; }
                }

                /* Контейнер для нод */
                .nodes-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: all;
                    z-index: 20;
                    overflow: hidden;
                }

                /* Canvas для соединений */
                .connections-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 15;
                }

                .connection-line {
                    stroke: rgba(59, 130, 246, 0.6);
                    stroke-width: 2;
                    stroke-dasharray: 5;
                    filter: drop-shadow(0 0 6px #3b82f6);
                    animation: flow 1s linear infinite;
                }

                @keyframes flow {
                    to { stroke-dashoffset: -10; }
                }

                .temp-connection {
                    stroke: rgba(139, 92, 246, 0.8);
                    stroke-width: 2;
                    stroke-dasharray: 5 5;
                }

                /* Стили для нод */
                .node {
                    position: absolute;
                    width: 200px;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: 12px;
                    padding: 12px;
                    color: white;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    transition: box-shadow 0.2s, transform 0.2s;
                    user-select: none;
                    cursor: grab;
                }

                .node:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                }

                .node.dragging {
                    opacity: 0.9;
                    transform: scale(1.02);
                    box-shadow: 0 12px 48px rgba(59, 130, 246, 0.4);
                }

                .node.frontend { border-left: 4px solid #3b82f6; }
                .node.backend { border-left: 4px solid #8b5cf6; }
                .node.database { border-left: 4px solid #06b6d4; }
                .node.ai { border-left: 4px solid #a855f7; }

                .node-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .node-icon {
                    font-size: 18px;
                }

                .node-title {
                    font-size: 14px;
                    color: #fff;
                }

                .node-content {
                    font-size: 12px;
                    color: #94a3b8;
                }

                .node-connector {
                    position: absolute;
                    right: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    background: #1e293b;
                    border: 2px solid #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: crosshair;
                    color: #3b82f6;
                    transition: all 0.2s;
                    z-index: 25;
                }

                .node-connector:hover {
                    background: #3b82f6;
                    color: white;
                    transform: translateY(-50%) scale(1.1);
                }

                .node-connector.active {
                    background: #3b82f6;
                    color: white;
                    animation: pulse 1s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: translateY(-50%) scale(1); }
                    50% { transform: translateY(-50%) scale(1.2); }
                }

                .hero-content {
                    position: relative; z-index: 30; text-align: center;
                    max-width: 900px; width: 100%; margin: 0 auto;
                    display: flex; flex-direction: column; align-items: center;
                    pointer-events: none;
                }

                .hero-content * {
                    pointer-events: auto;
                }

                .hero-badge {
                    display: flex; align-items: center; gap: 8px;
                    padding: 6px 16px; background: rgba(59, 130, 246, 0.1);
                    color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2);
                    border-radius: 100px; font-size: 13px; font-weight: 600;
                    margin-bottom: 32px;
                    opacity: 0; transform: translateY(20px);
                    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .hero-title {
                    font-size: 84px; font-weight: 700; color: #ffffff;
                    line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 24px;
                }

                .title-line {
                    display: block; opacity: 0; transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .loaded .title-line-1 { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
                .loaded .title-line-2 { opacity: 1; transform: translateY(0); transition-delay: 0.3s; }

                /* Стили для печатающегося текста */
                .typing-text {
                    background: linear-gradient(to right, #3b82f6, #a855f7, #06b6d4);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    display: inline-block;
                    min-width: 300px;
                    text-align: left;
                }

                .cursor {
                    display: inline-block;
                    width: 4px;
                    margin-left: 4px;
                    color: #3b82f6;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }

                .hero-subtitle {
                    font-size: 20px; color: #94a3b8; line-height: 1.6;
                    max-width: 640px; margin-bottom: 48px; font-weight: 400;
                    opacity: 0; transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s;
                }

                .hero-buttons {
                    display: flex; align-items: center; gap: 16px;
                    opacity: 0; transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s;
                }

                .loaded .hero-badge { opacity: 1; transform: translateY(0); }
                .loaded .hero-subtitle { opacity: 1; transform: translateY(0); }
                .loaded .hero-buttons { opacity: 1; transform: translateY(0); }

                .btn-primary {
                    display: flex; align-items: center; gap: 10px; background: #ffffff;
                    color: #0f172a; border: none; padding: 16px 36px;
                    font-size: 16px; font-weight: 600; border-radius: 100px;
                    cursor: pointer; transition: all 0.3s ease;
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.3); }

                .btn-secondary {
                    display: flex; align-items: center; gap: 8px; background: transparent;
                    color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 16px 36px; font-size: 16px; font-weight: 600;
                    border-radius: 100px; cursor: pointer; transition: all 0.3s ease;
                }
                .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); border-color: #ffffff; }

                .clear-button {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 12px;
                    cursor: pointer;
                    z-index: 40;
                    transition: all 0.2s;
                }

                .clear-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 1024px) { 
                    .hero-title { font-size: 64px; } 
                }
                
                @media (max-width: 768px) {
                    .hero-title { font-size: 48px; }
                    .hero-subtitle { font-size: 18px; }
                    .hero-buttons { flex-direction: column; width: 100%; }
                    .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
                    
                    .node {
                        width: 150px;
                        padding: 8px;
                    }
                    
                    .node-connector {
                        width: 20px;
                        height: 20px;
                        right: -6px;
                    }
                }
            `}</style>

      <section className="hero-section">
        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`, top: `${p.y}%`, width: `${p.length}px`,
                backgroundColor: p.colorStr,
                boxShadow: `0 0 8px ${p.colorStr}, 0 0 3px ${p.colorStr}`,
                '--angle': `${p.angle}deg`, '--target-opacity': p.opacity,
                animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
                transform: `rotate(${p.angle}deg)`
              }}
            />
          ))}
        </div>

        <div ref={containerRef} className="nodes-container">
          {/* Рисуем соединения */}
          <svg className="connections-canvas">
            {connections.map(conn => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={conn.id}
                  x1={fromNode.x + 100}
                  y1={fromNode.y + 30}
                  x2={toNode.x + 100}
                  y2={toNode.y + 30}
                  className="connection-line"
                />
              );
            })}

            {tempConnection && (
              <line
                x1={tempConnection.startX}
                y1={tempConnection.startY}
                x2={tempConnection.endX}
                y2={tempConnection.endY}
                className="temp-connection"
              />
            )}
          </svg>

          {/* Рендерим ноды */}
          {nodes.map(node => (
            <DraggableNode
              key={node.id}
              node={node}
              onDrag={handleNodeDrag}
              onDragStart={handleNodeDragStart}
              onDragEnd={handleNodeDragEnd}
              onConnect={handleConnect}
              connections={connections}
              isConnecting={!!connectingFrom}
              connectingFrom={connectingFrom}
            />
          ))}
        </div>

        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <div className="hero-badge">
            <span style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 10px #60a5fa' }}></span>
            CRUSH AI Private Beta
          </div>

          <h1 className="hero-title">
            <span className="title-line title-line-1">Experience liftoff with</span>
            <span className="title-line title-line-2">
              the <TypingText texts={typingTexts} speed={100} pauseDuration={2000} />
            </span>
          </h1>

          <p className="hero-subtitle">
            CRUSH AI is our agentic development platform, evolving the IDE into the agent-first era. Build fullstack apps visually, generate code instantly, and deploy in seconds.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={onOpenModal}>
              <Monitor size={20} />
              Join Waitlist
            </button>
            <a href="#features" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">
                Explore use cases
                <ArrowRight size={18} />
              </button>
            </a>
          </div>
        </div>

        <button className="clear-button" onClick={clearConnections}>
          Clear Connections
        </button>
      </section>
    </>
  );
}