'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
}

type GameState = 'menu' | 'playing' | 'gameOver';
type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultyConfig {
  spawnInterval: number;
  targetLifetime: number;
  targetSpeedMin: number;
  targetSpeedMax: number;
  comboTimeout: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    spawnInterval: 1200,
    targetLifetime: 4000,
    targetSpeedMin: 0.2,
    targetSpeedMax: 0.5,
    comboTimeout: 2000,
  },
  normal: {
    spawnInterval: 800,
    targetLifetime: 3000,
    targetSpeedMin: 0.3,
    targetSpeedMax: 0.8,
    comboTimeout: 1500,
  },
  hard: {
    spawnInterval: 500,
    targetLifetime: 2000,
    targetSpeedMin: 0.5,
    targetSpeedMax: 1.2,
    comboTimeout: 1000,
  },
};

export default function MonochromeGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('monochrome-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawn targets
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const newTarget: Target = {
        id: targetIdRef.current++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 30 + 40,
        speed: Math.random() * (config.targetSpeedMax - config.targetSpeedMin) + config.targetSpeedMin,
        angle: Math.random() * Math.PI * 2,
      };

      setTargets((prev) => [...prev, newTarget]);

      // Remove target after configured lifetime
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      }, config.targetLifetime);
    }, config.spawnInterval);

    return () => clearInterval(spawnInterval);
  }, [gameState, config]);

  // Animate targets
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animationInterval = setInterval(() => {
      setTargets((prev) =>
        prev.map((target) => ({
          ...target,
          x: target.x + Math.cos(target.angle) * target.speed,
          y: target.y + Math.sin(target.angle) * target.speed,
          angle: target.angle + 0.05,
        }))
      );
    }, 16);

    return () => clearInterval(animationInterval);
  }, [gameState]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTargets([]);
    setTimeLeft(30);
    setCombo(0);
  }, []);

  const handleTargetClick = useCallback(
    (targetId: number, e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      
      // Remove target
      setTargets((prev) => prev.filter((t) => t.id !== targetId));

      // Increase combo
      setCombo((prev) => prev + 1);

      // Reset combo timeout
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      comboTimeoutRef.current = setTimeout(() => {
        setCombo(0);
      }, config.comboTimeout);

      // Calculate score with combo multiplier
      const comboMultiplier = Math.min(Math.floor(combo / 3) + 1, 5);
      const points = 10 * comboMultiplier;
      setScore((prev) => prev + points);

      // Create particle effect
      const rect = e.currentTarget.getBoundingClientRect();
      const gameRect = gameAreaRef.current?.getBoundingClientRect();
      if (gameRect) {
        const x = ((rect.left + rect.width / 2 - gameRect.left) / gameRect.width) * 100;
        const y = ((rect.top + rect.height / 2 - gameRect.top) / gameRect.height) * 100;

        for (let i = 0; i < 8; i++) {
          const particleId = particleIdRef.current++;
          setParticles((prev) => [...prev, { id: particleId, x, y }]);
          setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== particleId));
          }, 500);
        }
      }
    },
    [combo, config.comboTimeout]
  );

  useEffect(() => {
    if (gameState === 'gameOver' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('monochrome-highscore', score.toString());
    }
  }, [gameState, score, highScore]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px] animate-[grid_30s_linear_infinite]" />
      </div>

      {/* Corner Decorations */}
      <div className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8 w-12 sm:w-20 h-12 sm:h-20 border-l-2 border-t-2 border-white/20" />
      <div className="hidden sm:block absolute top-4 sm:top-8 right-4 sm:right-8 w-12 sm:w-20 h-12 sm:h-20 border-r-2 border-t-2 border-white/20" />
      <div className="hidden sm:block absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-12 sm:w-20 h-12 sm:h-20 border-l-2 border-b-2 border-white/20" />
      <div className="hidden sm:block absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-12 sm:w-20 h-12 sm:h-20 border-r-2 border-b-2 border-white/20" />

      {/* Scan Line */}
      <div className="absolute inset-x-0 h-[2px] bg-linear-to-r from-transparent via-white/50 to-transparent animate-[scan_8s_linear_infinite]" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
        {gameState === 'menu' && (
          <div className="text-center space-y-6 sm:space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Title */}
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin tracking-wider text-white mb-4 animate-[float_3s_ease-in-out_infinite]">
                REFLEX
              </h1>
              <div className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] text-white/50 uppercase">
                Monochrome Challenge
              </div>
            </div>

            {/* Geometric Art */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 mx-auto my-8 sm:my-12">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-2 border-white/30 rounded-full"
                  style={{
                    width: `${i * 25}%`,
                    height: `${i * 25}%`,
                    left: `${50 - i * 12.5}%`,
                    top: `${50 - i * 12.5}%`,
                    animation: `pulse ${4 - i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse" />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-white/60 text-sm sm:text-base space-y-2 max-w-md mx-auto px-4">
              <p>Click the appearing targets before they vanish</p>
              <p>Build combos for higher scores</p>
              <p>30 seconds on the clock</p>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-3">
              <div className="text-white/40 text-xs tracking-widest uppercase">Difficulty</div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center px-4 sm:px-0">
                {(['easy', 'normal', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-6 sm:px-8 py-2 border-2 text-xs sm:text-sm tracking-wider uppercase transition-all ${
                      difficulty === diff
                        ? 'border-white text-black bg-white font-bold'
                        : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              {difficulty === 'easy' && (
                <p className="text-white/40 text-xs">Slower targets • Longer lifetime • More time to combo</p>
              )}
              {difficulty === 'normal' && (
                <p className="text-white/40 text-xs">Balanced challenge • Standard speed</p>
              )}
              {difficulty === 'hard' && (
                <p className="text-white/40 text-xs">Fast targets • Quick spawns • Test your reflexes!</p>
              )}
            </div>

            {/* High Score */}
            {highScore > 0 && (
              <div className="text-white/40 text-xs sm:text-sm tracking-widest">
                HIGH SCORE: {highScore}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={startGame}
              className="relative px-8 sm:px-12 py-3 sm:py-4 border-2 border-white text-white text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase overflow-hidden group transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-500">Start Game</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 tracking-[0.2em] sm:tracking-[0.3em] transition-opacity duration-500 z-20">
                START GAME
              </span>
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-5xl">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 text-white">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-thin tracking-wider">{score}</div>
                <div className="text-[10px] sm:text-xs tracking-widest text-white/40">SCORE</div>
              </div>

              <div className="text-center space-y-0.5 sm:space-y-1">
                <div className="text-4xl sm:text-5xl md:text-6xl font-thin">{timeLeft}</div>
                <div className="text-[10px] sm:text-xs tracking-widest text-white/40">SECONDS</div>
              </div>

              <div className="space-y-0.5 sm:space-y-1 text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-thin tracking-wider">
                  {combo > 0 ? `x${Math.min(Math.floor(combo / 3) + 1, 5)}` : '—'}
                </div>
                <div className="text-[10px] sm:text-xs tracking-widest text-white/40">COMBO</div>
              </div>
            </div>

            {/* Game Area */}
            <div
              ref={gameAreaRef}
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border-2 border-white/20 bg-black/40 backdrop-blur-sm"
            >
              {/* Targets */}
              {targets.map((target) => (
                <div
                  key={target.id}
                  onClick={(e) => handleTargetClick(target.id, e)}
                  className="absolute cursor-pointer group transition-transform hover:scale-110"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-2 border-white/40 rounded-full animate-[ping_1s_ease-out_infinite]" />
                    {/* Middle ring */}
                    <div className="absolute inset-[25%] border-2 border-white/60 rounded-full" />
                    {/* Center dot */}
                    <div className="absolute inset-[45%] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-[2px] bg-white/30" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-[2px] bg-white/30" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Particles */}
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-2 h-2 bg-white rounded-full pointer-events-none animate-[particle_0.5s_ease-out_forwards]"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                />
              ))}

              {/* Center Guidelines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-white/5" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-px bg-white/5" />
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center space-y-6 sm:space-y-8 animate-[fadeIn_0.5s_ease-out] px-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin tracking-wider text-white mb-4 sm:mb-8">
              GAME OVER
            </h2>

            {/* Score Display */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-thin text-white mb-2">{score}</div>
                <div className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] text-white/40">FINAL SCORE</div>
              </div>

              {score === highScore && score > 0 && (
                <div className="text-white/60 text-xs sm:text-sm tracking-widest animate-pulse">
                  ★ NEW HIGH SCORE ★
                </div>
              )}

              {highScore > 0 && score !== highScore && (
                <div className="text-white/40 text-xs sm:text-sm tracking-widest">
                  HIGH SCORE: {highScore}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 justify-center text-white/60 text-xs sm:text-sm">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-thin text-white">{Math.round(score / 30)}</div>
                <div className="tracking-widest mt-1">AVG/SEC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-thin text-white">{Math.floor(score / 10)}</div>
                <div className="tracking-widest mt-1">HITS</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8">
              <button
                onClick={startGame}
                className="px-8 sm:px-10 py-3 border-2 border-white text-white text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all"
              >
                Play Again
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-8 sm:px-10 py-3 border-2 border-white/40 text-white/40 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes grid {
          0% {
            transform: perspective(1000px) rotateX(60deg) rotateZ(0deg);
          }
          100% {
            transform: perspective(1000px) rotateX(60deg) rotateZ(360deg);
          }
        }

        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes particle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx, 50px)), calc(-50% + var(--ty, -50px)))
              scale(0);
          }
        }

        .animate-\[particle_0\.5s_ease-out_forwards\]:nth-child(1) {
          --tx: 30px;
          --ty: -30px;
        }
        .animate-\[particle_0\.5s_ease-out_forwards\]:nth-child(2) {
          --tx: -30px;
          --ty: -30px;
        }
        .animate-\[particle_0\.5s_ease-out_forwards\]:nth-child(3) {
          --tx: 30px;
          --ty: 30px;
        }
        .animate-\[particle_0\.5s_ease-out_forwards\]:nth-child(4) {
          --tx: -30px;
          --ty: 30px;
        }
      `}</style>
    </div>
  );
}
