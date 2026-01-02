# REFLEX - Monochrome Challenge 🎯

A minimalist, artistic reflex-based timing game built with Next.js and React. Test your reflexes and precision in this sleek monochrome experience featuring dynamic targets, combo multipliers, and stunning visual effects.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)

## 📋 Table of Contents

- [Game Features](#-game-features)
- [Getting Started](#-getting-started)
- [How to Play](#-how-to-play)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Features Details](#-features-details)
- [Score System](#-score-system)
- [Game States](#-game-states)
- [Game Architecture](#️-game-architecture)
- [Customization](#-customization)
- [Responsive Design](#-responsive-design)
- [Browser Compatibility](#-browser-compatibility)
- [Development Guide](#-development-guide)
- [Artistic Vision](#-artistic-vision)
- [Performance Optimizations](#-performance-optimizations)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Learning Resources](#-learning-resources)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [Game Statistics](#-game-statistics)
- [License](#-license)

## 🎮 Game Features

- **Reflex Training**: Click targets before they vanish (3 seconds each)
- **Combo System**: Build combos to multiply your score (up to 5x)
- **30 Second Challenge**: Race against the clock
- **High Score Tracking**: Local storage saves your best score
- **Smooth Animations**: 3D grid background, floating particles, scan lines
- **Minimalist Design**: Pure black & white aesthetic

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 🎯 How to Play

1. Click "START GAME" on the menu
2. Click the circular targets as they appear
3. Each target gives you 10 points (multiplied by combo)
4. Build combos by hitting targets quickly in succession
5. Combo resets after 1.5 seconds of no hits
6. Try to get the highest score before time runs out!

## 🛠️ Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library with hooks
- **TypeScript 5.x** - Type safety and better DX
- **Tailwind CSS 4.x** - Utility-first styling with custom animations
- **Client-side only** - No backend/database, pure browser game with localStorage

## 📁 Project Structure

```
monochrome-game/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (game wrapper)
│   └── globals.css         # Global styles
├── components/
│   └── MonochromeGame.tsx  # Main game component
└── package.json
```

## 🎨 Features Details

### Visual Elements & Animations
- **3D Grid Background**: Rotating perspective animation (30s cycle)
- **Corner Frame Decorations**: Static border accents in corners
- **Scanning Line Effect**: CRT-style line sweeps vertically (8s cycle)
- **Particle Explosions**: 8-directional burst on each target hit
- **Pulsing Concentric Rings**: Menu screen geometric art (4 rings)
- **Fade Animations**: Smooth state transitions (0.5s)
- **Target Animations**: Ping effect on outer ring (infinite pulse)
- **Crosshair Design**: Multi-layered circular targets with center dot
- **Hover Effects**: Scale transforms on targets and buttons
- **Backdrop Blur**: Semi-transparent game area effect

### Gameplay Mechanics
- **Dynamic Target Spawning**: New targets appear every 800ms during gameplay
- **Spiraling Movement**: Targets move in curved patterns with randomized angles and speeds
- **3-Second Lifetime**: Each target automatically disappears after 3 seconds
- **Combo Multiplier**: Increases every 3 consecutive hits (max 5x multiplier)
- **Real-time Scoring**: Instant score updates with combo calculations
- **30-Second Timer**: Countdown displayed prominently in HUD
- **Random Variations**: Target sizes (40-70px), speeds (0.3-0.8), and positions vary

### State Management & Performance
- **React Hooks**: useState, useEffect, useCallback, useRef for optimal performance
- **LocalStorage**: Persistent high score tracking across sessions
- **Refs**: DOM manipulation, target IDs, particle IDs, combo timeouts
- **60 FPS Animation Loop**: 16ms intervals for smooth target movement
- **Efficient Cleanup**: Automatic removal of expired targets and particles
- **Memoized Callbacks**: Prevents unnecessary re-renders during gameplay

## 🎯 Score System

- **Base Points**: 10 per target
- **Combo Multipliers**:
  - 0-2 hits: x1
  - 3-5 hits: x2
  - 6-8 hits: x3
  - 9-11 hits: x4
  - 12+ hits: x5 (max)

## 🎮 Game States

The game operates in three distinct states:

1. **Menu State**
   - Animated title with floating effect
   - Geometric art with pulsing concentric rings
   - Game instructions
   - High score display (if exists)
   - Start button with hover animation

2. **Playing State**
   - HUD showing: Score, Time Remaining, Combo Multiplier
   - 600px game area with border and backdrop blur
   - Active targets with crosshair design and animations
   - Particle effects on hits
   - Center guidelines for visual reference

3. **Game Over State**
   - Final score display (large and prominent)
   - New high score notification (if achieved)
   - Statistics: Average points/second, Total hits
   - Play Again and Menu buttons

## 🏗️ Game Architecture

### Component Structure
```typescript
MonochromeGame (Main Component)
├── State Management
│   ├── gameState: 'menu' | 'playing' | 'gameOver'
│   ├── score: number
│   ├── highScore: number
│   ├── targets: Target[]
│   ├── timeLeft: number
│   ├── combo: number
│   └── particles: Particle[]
│
├── Game Loops (useEffect)
│   ├── Timer Loop: Decrements time every 1000ms
│   ├── Spawn Loop: Creates targets every 800ms
│   ├── Animation Loop: Updates positions every 16ms
│   └── Particle Cleanup: Removes after 500ms
│
└── Event Handlers
    ├── startGame(): Initialize game state
    └── handleTargetClick(): Process hits, combos, particles
```

### Target Interface
```typescript
interface Target {
  id: number;      // Unique identifier
  x: number;       // Position X (10-90%)
  y: number;       // Position Y (10-90%)
  size: number;    // Diameter (40-70px)
  speed: number;   // Movement speed (0.3-0.8)
  angle: number;   // Current angle (radians)
}
```

## 🔧 Customization

You can easily customize game parameters in `components/MonochromeGame.tsx`:

| Parameter | Default | Location |
|-----------|---------|----------|
| Game Duration | 30 seconds | Line 99 |
| Target Spawn Rate | 800ms | Line 72 |
| Target Lifetime | 3000ms | Line 71 |
| Combo Timeout | 1500ms | Line 119 |
| Target Size Range | 40-70px | Line 61 |
| Movement Speed | 0.3-0.8 | Line 62 |
| Animation Frame Rate | 16ms (~60fps) | Line 90 |
| Particle Count | 8 per hit | Line 133 |
| Particle Duration | 500ms | Line 138 |

## 📱 Responsive Design

The game adapts to different screen sizes while maintaining the aesthetic:
- Centered layout with padding on all screens
- Max-width constraints for optimal gameplay area (5xl = 896px)
- Flexible text sizing with Tailwind responsive utilities
- Touch-friendly target sizes (minimum 40px)
- Works on desktop, tablet, and mobile devices

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

**Requirements:**
- ES6+ JavaScript support
- CSS Grid & Flexbox
- CSS Custom Properties (variables)
- CSS Animations & Transforms
- LocalStorage API
- Modern event handling

## 💻 Development Guide

### Scripts Available
```bash
npm run dev      # Start development server (hot reload)
npm run build    # Create production build
npm run start    # Run production build locally
npm run lint     # Run ESLint for code quality
```

### Development Tips
1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Type Safety**: TypeScript catches errors at compile time
3. **Component Organization**: Game logic isolated in `MonochromeGame.tsx`
4. **State Inspection**: Use React DevTools to monitor state changes
5. **Performance**: Check browser DevTools for FPS and memory usage

### Key Files to Understand
- `components/MonochromeGame.tsx` - All game logic (442 lines)
- `app/page.tsx` - Simple wrapper component
- `app/globals.css` - Tailwind imports and global styles
- `app/layout.tsx` - Root layout with metadata

### Extending the Game
Ideas for enhancements:
- Add difficulty levels (faster spawns, shorter lifetime)
- Power-ups (freeze time, double points, auto-aim)
- Different target types (bonus, penalty, moving patterns)
- Sound effects and background music
- Multiplayer mode with leaderboards
- Achievement system
- Different visual themes
- Mobile touch optimization
- Gamepad/keyboard controls

## 🎭 Artistic Vision

The game embraces a monochrome aesthetic inspired by:
- **Minimalist Art Movements** - Less is more philosophy
- **Brutalist Design** - Raw, functional beauty
- **Geometric Abstraction** - Pure shapes and forms
- **Cyberpunk UI Elements** - Tech-noir visual language
- **CRT Aesthetics** - Retro scanning lines and grid patterns

Clean, simple, and visually striking - letting gameplay shine through pure form. The black and white palette removes distractions and focuses attention on the core mechanic: precision clicking.

## ⚡ Performance Optimizations

- **useCallback**: Memoized event handlers prevent re-renders
- **Efficient Timers**: Separate intervals for different update rates
- **Auto Cleanup**: useEffect return functions clear all timers
- **Minimal Re-renders**: State updates batched where possible
- **CSS Animations**: Hardware-accelerated transforms
- **Request Animation Frame**: Smooth 60fps target movement
- **Particle Limits**: Fixed particle count per hit (8)
- **Automatic GC**: Expired targets/particles removed from state

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Targets not appearing
- Check that game state is 'playing'
- Verify spawn loop is running (no console errors)
- Ensure game area is visible

### High score not saving
- Check localStorage is enabled in browser
- Verify browser allows localStorage for localhost
- Try clearing site data and playing again

### Performance issues
- Close other tabs/applications
- Disable browser extensions
- Check for memory leaks in DevTools
- Reduce particle effects (edit line 133 in MonochromeGame.tsx)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click (auto-detected Next.js config)

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **AWS/Azure/GCP**: Deploy as Node.js application
- **Static Hosting**: Export with `next export` (if needed)

The game has no backend dependencies, making deployment straightforward!

## 📚 Learning Resources

This project demonstrates modern web development concepts:

**React Patterns:**
- Functional components with hooks
- State management with useState
- Side effects with useEffect
- Performance with useCallback & useRef
- Event handling and delegation

**TypeScript Features:**
- Interface definitions
- Type unions (GameState)
- Type safety for props and state
- Enum-like string literal types

**Game Development:**
- Game loops and timing
- Collision detection (click events)
- Particle systems
- Score and combo mechanics
- State machines (menu/playing/gameOver)

**CSS Techniques:**
- Tailwind utility classes
- Custom keyframe animations
- CSS transforms and transitions
- Backdrop filters
- Responsive design

**Performance:**
- Efficient state updates
- Timer cleanup
- Memory management
- Animation optimization

Great for learning intermediate-to-advanced React and game development concepts!

## ❓ FAQ

**Q: What's a good score for beginners?**
A: 200-300 points is good for first-timers. 500+ is excellent. 1000+ means you're a reflex master!

**Q: How do I maximize my score?**
A: Focus on maintaining combos! A 5x multiplier gives you 50 points per target instead of 10. Click quickly and accurately.

**Q: Why monochrome/black & white?**
A: The minimalist aesthetic removes visual distractions and lets you focus purely on reaction time and precision.

**Q: Can I play on mobile?**
A: Yes! The game works on touch devices, though a mouse/trackpad offers better precision.

**Q: Is there a leaderboard?**
A: Currently only local high scores. Could be added with a backend in future versions!

**Q: Can I contribute to the project?**
A: Absolutely! See the Contributing section below.

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (follow existing code style)
4. **Test thoroughly** (try to break it!)
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Ideas
- 🎵 Add sound effects and music
- 🏆 Implement online leaderboards
- 🎨 Create alternative color themes
- 🎮 Add keyboard/gamepad controls
- 📊 Add detailed statistics tracking
- 🌍 Internationalization (i18n)
- ♿ Accessibility improvements
- 📱 Mobile-specific optimizations
- 🎯 Different game modes (endless, sprint, accuracy challenge)

## 📊 Game Statistics

- **Lines of Code**: ~442 (main game component)
- **Game States**: 3 (menu, playing, gameOver)
- **Animation Loops**: 4 concurrent loops
- **Frame Rate**: 60 FPS target
- **Maximum Combo**: 5x multiplier
- **Target Lifetime**: 3 seconds
- **Game Duration**: 30 seconds
- **Technologies Used**: 5 core (Next.js, React, TypeScript, Tailwind, Node)

## 📄 License

MIT - Feel free to use, modify, and distribute for personal or commercial projects!

## 🙏 Credits

Created as a demonstration of combining artistic design with functional gameplay in a modern React application. Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS.

## 🎯 Project Goals

This project showcases:
- Clean, maintainable code architecture
- Modern React best practices
- TypeScript integration
- Responsive game design
- Minimalist UI/UX principles
- Performance optimization techniques

---

**🎮 Ready to test your reflexes? Start the game and beat your high score! 🏆**
