import { useEffect, useState } from 'react';
import { Code2, Sparkles, Zap, Terminal, Database, Cloud, Shield } from 'lucide-react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [particles, setParticles] = useState([]);
  const [codeLines, setCodeLines] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: Math.random() * 15 + 10
    }));
    setParticles(newParticles);

    // Generate animated code lines
    const codeSnippets = [
      '<div className="code">const quest = true;</div>',
      'function solve() { return "success"; }',
      'import React from "react";',
      'SELECT * FROM knowledge WHERE level = "expert";',
      'const app = express();',
      'class Developer extends Learner {}',
      'npm install success',
      'git commit -m " mastered coding"',
      'docker run --name codequest',
      'aws lambda invoke --function learn'
    ];
    
    const lines = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      animationDelay: Math.random() * 5,
      animationDuration: Math.random() * 3 + 2
    }));
    setCodeLines(lines);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 800);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const title = "CodeQuest";
  const icons = [Terminal, Database, Cloud, Shield];
  
  return (
    <div className={`${styles.splashScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      {/* Animated Particles Background */}
      <div className={styles.particles}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* Floating Code Lines */}
      <div className={styles.codeLines}>
        {codeLines.map(line => (
          <div
            key={line.id}
            className={styles.codeLine}
            style={{
              left: `${line.left}%`,
              top: `${line.top}%`,
              animationDelay: `${line.animationDelay}s`,
              animationDuration: `${line.animationDuration}s`
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.splashContent}>
        {/* Orbiting Icons */}
        <div className={styles.iconOrbit}>
          {icons.map((Icon, index) => (
            <div
              key={index}
              className={styles.orbitingIcon}
              style={{
                animationDelay: `${index * 0.5}s`,
                transform: `rotate(${index * 90}deg) translateX(100px) rotate(-${index * 90}deg)`
              }}
            >
              <Icon size={24} className={styles.iconGlow} />
            </div>
          ))}
        </div>

        {/* Logo with enhanced glow effect */}
        <div className={styles.splashLogo}>
          <div className={styles.logoIcon}>
            <Code2 size={80} strokeWidth={1.5} color="#764ba2" />
            <div className={styles.logoInnerGlow} />
          </div>
          <div className={styles.logoGlow} />
          <div className={styles.logoPulse} />
        </div>

        {/* Animated Title with enhanced effects */}
        <h1 className={styles.splashTitle}>
          {title.split('').map((char, index) => (
            <span 
              key={index} 
              className={styles.char}
              style={{ 
                '--char-index': index,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Enhanced Subtitle with typing effect */}
        <div className={styles.splashSubtitle}>
          <div className={styles.typingContainer}>
            <span className={styles.typingText}>Master Your Coding Journey</span>
            <span className={styles.cursor}>|</span>
          </div>
          <div className={styles.subtitleIcons}>
            <Sparkles size={20} className={styles.sparkleIcon} />
            <Zap size={20} className={styles.zapIcon} />
            <Sparkles size={20} className={styles.sparkleIcon} />
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div className={styles.progressLabel}>Loading Amazing Content</div>
          <div className={styles.loadingBarWrap}>
            <div className={styles.loadingBar} />
            <div className={styles.progressGlow} />
          </div>
          <div className={styles.progressPercentage}>
            <span className={styles.percentageText}>0%</span>
          </div>
        </div>

        {/* Feature Pills */}
        <div className={styles.featurePills}>
          {['Multi-Language', '5 Paper Sets', 'Smart Questions', 'Advanced Analytics'].map((feature, index) => (
            <div
              key={index}
              className={styles.featurePill}
              style={{ animationDelay: `${2 + index * 0.2}s` }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Version */}
      <div className={styles.version}>
        <div className={styles.versionContent}>
          <span>Version 2.0</span>
          <span className={styles.versionSeparator}>•</span>
          <span>Advanced Learning Platform</span>
        </div>
      </div>
    </div>
  );
}
