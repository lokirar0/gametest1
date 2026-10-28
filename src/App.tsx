import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createInitialState, initRun, update, installTurret, reloadRifle,
  playSlots, playRoulette,
  SHOP_ITEMS,
  type GameState, type CasinoResult,
} from './game/engine';
import { soundManager } from './game/sound';
import type { GameRenderer3D } from './game/renderer3d';

function App() {
  const [gameState] = useState<GameState>(() => createInitialState());
  const [screen, setScreen] = useState<GameState['screen']>('menu');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [hud, setHud] = useState({
    speed: 0, hp: 100, passengers: 0, coins: 0,
    wave: 0, act: 1, distance: 0, time: 0, enemies: 0,
    gameOver: false, weapon: 'pistol' as GameState['weapon'],
    magazine: 30, reserve: 150, reloading: false, turrets: 0,
    interaction: '',
  });
  const worldRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Sync screen with game state
  useEffect(() => {
    gameState.screen = screen;
  }, [screen, gameState]);

  // Game loop
  useEffect(() => {
    if (screen !== 'playing') return;

    const host = worldRef.current;
    if (!host) return;
    let disposed = false;
    let world: GameRenderer3D | undefined;
    setRenderError(null);

    const start = async () => {
      try {
        const { GameRenderer3D } = await import('./game/renderer3d');
        if (disposed) return;
        world = new GameRenderer3D(host);
        soundManager.init();

        let prevWeaponCooldown = 0;
        let lastRenderTime = 0;
        let lastHudUpdate = 0;
        const loop = (time: number) => {
          try {
            const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
            lastTimeRef.current = time;

            world?.updateAim(gameState);
            update(gameState, dt);
            if (gameState.mouseDown && gameState.weaponCooldown > prevWeaponCooldown) {
              soundManager.shoot();
            }
            prevWeaponCooldown = gameState.weaponCooldown;

            if (time - lastRenderTime >= 1000 / 30) {
              world?.render(gameState);
              lastRenderTime = time;
            }

            if (time - lastHudUpdate >= 100) {
              const totalPassengers = gameState.wagons
                .filter(w => !w.detached)
                .reduce((sum, wagon) => sum + wagon.passengers, 0);
              const totalHp = gameState.wagons
                .filter(w => !w.detached)
                .reduce((sum, wagon) => sum + wagon.hp, 0);
              const maxHp = gameState.wagons
                .filter(w => !w.detached)
                .reduce((sum, wagon) => sum + wagon.maxHp, 0);

              setHud({
                speed: Math.round(gameState.trainSpeed),
                hp: maxHp > 0 ? Math.round((totalHp / maxHp) * 100) : 0,
                passengers: totalPassengers,
                coins: gameState.coins,
                wave: gameState.waveNumber,
                act: gameState.act,
                distance: Math.round(gameState.distanceTraveled),
                time: Math.round(gameState.gameTime),
                enemies: gameState.enemiesKilled,
                gameOver: gameState.gameOver,
                weapon: gameState.weapon,
                magazine: gameState.rifleMagazine,
                reserve: gameState.rifleReserve,
                reloading: gameState.rifleReload > 0,
                turrets: gameState.wagons.filter(wagon => !wagon.detached && wagon.turretInstalled).length,
                interaction: gameState.interactionMessageTimer > 0 ? gameState.interactionMessage : '',
              });
              lastHudUpdate = time;
            }

            if (gameState.gameOver && gameState.gameOverTimer > 3) {
              setScreen('results');
            }
          } catch (error) {
            console.error('Game loop failed', error);
            setRenderError(error instanceof Error ? error.message : String(error));
            return;
          }

          animRef.current = requestAnimationFrame(loop);
        };

        lastTimeRef.current = performance.now();
        animRef.current = requestAnimationFrame(loop);
      } catch (error) {
        if (!disposed) {
          setRenderError(error instanceof Error ? error.message : String(error));
        }
      }
    };

    void start();

    return () => {
      disposed = true;
      cancelAnimationFrame(animRef.current);
      world?.dispose();
    };
  }, [screen, gameState]);

  // Input handling
  useEffect(() => {
    if (screen !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
      if (!e.repeat) {
        if (e.code === 'Digit1') gameState.weapon = 'pistol';
        if (e.code === 'Digit2') gameState.weapon = 'rifle';
        if (e.code === 'KeyF') reloadRifle(gameState);
        if (e.code === 'KeyT') installTurret(gameState);
      }
      gameState.keys.add(e.code);
      if (e.code === 'KeyE' || e.code === 'KeyQ') {
        soundManager.whistle();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys.delete(e.code);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== worldRef.current) return;
      gameState.playerYaw -= e.movementX * 0.0025;
      gameState.playerPitch = Math.max(-1.15, Math.min(0.55, gameState.playerPitch - e.movementY * 0.002));
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (document.pointerLockElement !== worldRef.current) {
        void worldRef.current?.requestPointerLock();
        return;
      }
      if (e.button === 0) gameState.mouseDown = true;
    };
    const handleMouseUp = () => { gameState.mouseDown = false; };
    const handlePointerLockChange = () => {
      gameState.mouseDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (document.pointerLockElement === worldRef.current) document.exitPointerLock();
    };
  }, [screen, gameState]);

  const startGame = useCallback(() => {
    initRun(gameState);
    setScreen('playing');
  }, [gameState]);

  const goToDepot = useCallback(() => {
    setScreen('depot');
  }, []);

  const goToCasino = useCallback(() => {
    setScreen('casino');
  }, []);

  const goToMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  return (
    <div className="w-full h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      {screen === 'menu' && <MainMenu onStart={startGame} onDepot={goToDepot} />}
      {screen === 'depot' && (
        <DepotScreen
          state={gameState}
          onStart={startGame}
          onCasino={goToCasino}
          onBack={goToMenu}
        />
      )}
      {screen === 'casino' && (
        <CasinoScreen
          state={gameState}
          onBack={goToDepot}
        />
      )}
      {screen === 'playing' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-[1280px] aspect-video scanlines crt-glow overflow-hidden border-2 border-orange-800 cursor-crosshair">
            <div ref={worldRef} className="game-world" />
            <GameHUD hud={hud} />
            {renderError && (
              <div role="alert" className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-red-300">
                Не удалось запустить 3D-сцену: {renderError}
              </div>
            )}
            {hud.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-400 animate-pulse">
                    {gameState.distanceTraveled >= gameState.trackLength ? '🏆 ДЕПО!' : '💀 ПРОВАЛ!'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {screen === 'results' && (
        <ResultsScreen state={gameState} onMenu={goToMenu} onRetry={startGame} onDepot={goToDepot} />
      )}
    </div>
  );
}

// ============ MAIN MENU ============
function MainMenu({ onStart, onDepot }: { onStart: () => void; onDepot: () => void }) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
  };

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = (i * 97 + time * 5) % canvas.width;
        const y = (i * 43) % (canvas.height * 0.6);
        const brightness = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.globalAlpha = brightness * 0.6;
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Mountains
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 20) {
        const h = Math.sin(x * 0.01 + time * 0.2) * 30 + 60;
        ctx.lineTo(x, canvas.height - h);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Ground
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

      // Track
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, canvas.height - 32, canvas.width, 2);
      ctx.fillRect(0, canvas.height - 26, canvas.width, 2);

      // Moving train silhouette
      const trainX = (time * 40) % (canvas.width + 200) - 100;
      ctx.fillStyle = '#1a3a1a';
      ctx.fillRect(trainX, canvas.height - 55, 60, 25);
      ctx.fillStyle = '#2a4a2a';
      ctx.fillRect(trainX + 65, canvas.height - 50, 50, 20);
      ctx.fillRect(trainX + 120, canvas.height - 50, 50, 20);
      // Wheels
      ctx.fillStyle = '#3a3a3a';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(trainX + 10 + i * 25, canvas.height - 28, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Smoke
      ctx.fillStyle = '#4a4a4a44';
      for (let i = 0; i < 5; i++) {
        const sx = trainX + 10 - i * 15 + Math.sin(time + i) * 5;
        const sy = canvas.height - 60 - i * 8;
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + i * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={bgCanvasRef}
        width={800}
        height={400}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="relative text-center space-y-8 p-8 z-10">
        <div className="space-y-2">
          <div className="text-6xl mb-4 animate-bounce">🚂💥</div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 tracking-tight">
            RAIL MAYHEM
          </h1>
          <h2 className="text-2xl text-gray-400 font-bold">Depot to Depot</h2>
          <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto italic">
            «Защити поезд от первого лица: стреляй, чини вагоны и ставь турели.»
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { soundManager.init(); onStart(); }}
            className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-orange-900/50 transform hover:scale-105 transition-all animate-pulse-glow"
          >
            🚀 НАЧАТЬ РЕЙС
          </button>
          <button
            onClick={() => { soundManager.init(); onDepot(); }}
            className="block w-64 mx-auto px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-lg border border-gray-600 transition-all"
          >
            🏗️ ДЕПО
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-1 mt-8">
          <p>WASD — ходить по вагонам | Мышь — обзор | ЛКМ — стрелять</p>
          <p>1/2 — оружие | F — перезарядка | R — чинить | T — турель</p>
          <button
            onClick={toggleSound}
            className="mt-3 px-4 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-400 transition-all"
          >
            {soundEnabled ? '🔊 Звук: ВКЛ' : '🔇 Звук: ВЫКЛ'}
          </button>
          <p className="text-orange-700 mt-2">v0.1 Alpha — Прототип</p>
        </div>
      </div>
    </div>
  );
}

// ============ DEPOT SCREEN ============
function DepotScreen({ state, onStart, onCasino, onBack }: {
  state: GameState; onStart: () => void; onCasino: () => void; onBack: () => void;
}) {
  const [purchased, setPurchased] = useState<string | null>(null);

  const buy = (item: typeof SHOP_ITEMS[0]) => {
    if (state.coins >= item.cost) {
      state.coins -= item.cost;
      item.apply(state);
      setPurchased(item.id);
      setTimeout(() => setPurchased(null), 1000);
    }
  };

  return (
    <div className="max-w-4xl w-full p-6 space-y-6 overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-orange-400">🏗️ ДЕПО</h1>
        <div className="flex gap-4 items-center">
          <span className="text-yellow-400 font-bold text-lg">💰 {state.coins} монет</span>
          <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">← Меню</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-blue-300 mb-3">📊 Статистика поезда</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Локомотив:</span>
              <span className="text-orange-300">{state.currentLocomotive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Макс. скорость:</span>
              <span className="text-blue-300">{state.maxSpeed} км/ч</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Броня:</span>
              <span className="text-green-300">+{state.trainArmor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Урон пушки:</span>
              <span className="text-red-300">{state.turretDamage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Перезарядка:</span>
              <span className="text-yellow-300">{state.turretMaxReload.toFixed(2)}с</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Авто-ремонт:</span>
              <span className="text-green-300">{state.autoRepair} HP/с</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-purple-300 mb-3">🎰 Казино</h3>
          <p className="text-sm text-gray-400 mb-4">
            Испытай удачу! Слоты, рулетка, ставки на вагоны.
          </p>
          <button
            onClick={onCasino}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all"
          >
            🎲 ВОЙТИ В КАЗИНО
          </button>
          <div className="mt-3 text-xs text-gray-500">
            Побед: {state.casinoWins} | Поражений: {state.casinoLosses}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-orange-300 mb-3">🛒 Магазин апгрейдов</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHOP_ITEMS.map(item => (
            <div key={item.id} className={`p-3 rounded-lg border transition-all ${
              purchased === item.id ? 'bg-green-900/30 border-green-500' : 'bg-gray-900 border-gray-700'
            }`}>
              <div className="font-bold text-sm text-white">{item.name}</div>
              <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-yellow-400 text-sm font-bold">💰 {item.cost}</span>
                <button
                  onClick={() => buy(item)}
                  disabled={state.coins < item.cost}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    state.coins >= item.cost
                      ? 'bg-orange-600 hover:bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {purchased === item.id ? '✓' : 'Купить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all"
      >
        🚀 ОТПРАВЛЯЕМСЯ В РЕЙС!
      </button>
    </div>
  );
}

// ============ CASINO SCREEN ============
function CasinoScreen({ state, onBack }: { state: GameState; onBack: () => void }) {
  const [bet, setBet] = useState(100);
  const [result, setResult] = useState<CasinoResult | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displaySymbols, setDisplaySymbols] = useState(['🚂', '🚃', '💰']);
  const maxBet = Math.floor(state.coins * 0.3);
  const betOptions = maxBet > 0
    ? Array.from(new Set([Math.floor(maxBet / 3), Math.floor(maxBet * 2 / 3), maxBet].filter(value => value > 0)))
    : [];

  const play = (type: 'slots' | 'roulette') => {
    if (state.coins < bet || bet > maxBet || spinning) return;
    soundManager.init();
    setSpinning(true);

    // Animate
    let count = 0;
    const interval = setInterval(() => {
      const syms = ['🚂', '🚃', '💰', '🎰', '⭐', '🔥', '💎', '🎲'];
      setDisplaySymbols([
        syms[Math.floor(Math.random() * syms.length)],
        syms[Math.floor(Math.random() * syms.length)],
        syms[Math.floor(Math.random() * syms.length)],
      ]);
      soundManager.slotSpin();
      count++;
      if (count > 15) {
        clearInterval(interval);
        let res: CasinoResult;
        if (type === 'slots') {
          res = playSlots(state, bet);
        } else {
          res = playRoulette(state, bet);
        }
        if (res.symbols) setDisplaySymbols(res.symbols);
        setResult(res);
        setSpinning(false);
        if (res.won) soundManager.casinoWin();
        else soundManager.casinoLose();
      }
    }, 80);
  };

  return (
    <div className="max-w-2xl w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-purple-400">🎰 КАЗИНО «УДАЧНЫЙ ВАГОН»</h1>
        <button onClick={onBack} disabled={spinning} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm">← Депо</button>
      </div>

      <div className="text-center">
        <div className="text-2xl text-yellow-400 font-bold">💰 {state.coins} монет</div>
      </div>

      {/* Slot machine display */}
      <div className="bg-gradient-to-b from-purple-900 to-gray-900 p-6 rounded-xl border-2 border-yellow-600 shadow-xl shadow-purple-900/50">
        <div className="flex justify-center gap-4 mb-6">
          {displaySymbols.map((sym, i) => (
            <div
              key={i}
              className={`w-20 h-20 bg-gray-800 rounded-lg border-2 border-yellow-500 flex items-center justify-center text-4xl ${
                spinning ? 'animate-pulse' : ''
              }`}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Result */}
        {result && !spinning && (
          <div className={`text-center mb-4 p-3 rounded-lg ${
            result.won ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'
          }`}>
            <div className={`text-lg font-bold ${result.won ? 'text-green-300' : 'text-red-300'}`}>
              {result.message}
            </div>
            <div className="text-sm text-gray-400">
              {result.won ? `+${result.amount}` : result.amount} монет
            </div>
          </div>
        )}

        {/* Bet controls */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <span className="text-gray-400">Ставка:</span>
          {betOptions.map(b => (
            <button
              key={b}
              onClick={() => setBet(b)}
              className={`px-4 py-2 rounded font-bold text-sm transition-all ${
                bet === b
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Play buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => play('slots')}
            disabled={spinning || state.coins < bet || bet > maxBet}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            🎰 СЛОТЫ
          </button>
          <button
            onClick={() => play('roulette')}
            disabled={spinning || state.coins < bet || bet > maxBet}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            🎡 РУЛЕТКА
          </button>
        </div>
      </div>

      {/* Rules */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 text-sm">
        <h3 className="text-orange-400 font-bold mb-2">📜 Правила</h3>
        <ul className="text-gray-400 space-y-1 text-xs">
          <li>• <strong>Слоты:</strong> 3 одинаковых = ×50, 2 одинаковых = ×2, иначе проигрыш</li>
          <li>• <strong>Рулетка:</strong> ×0 (35%), ×1.5 (25%), ×3 (20%), ×10 (5%), бонус (10%), дебафф (5%)</li>
          <li>• <strong>Pity:</strong> после 10 проигрышей — гарантированный выигрыш ×3</li>
          <li>• Макс. ставка: 30% от текущих монет</li>
        </ul>
      </div>
    </div>
  );
}

// ============ RESULTS SCREEN ============
function ResultsScreen({ state, onMenu, onRetry, onDepot }: {
  state: GameState; onMenu: () => void; onRetry: () => void; onDepot: () => void;
}) {
  const survived = state.distanceTraveled >= state.trackLength;
  const totalPassengers = state.wagons.filter(w => !w.detached).reduce((s, w) => s + w.passengers, 0);
  
  // Calculate rank
  let rank = 'D';
  if (survived && state.passengersLost === 0) rank = 'S';
  else if (survived && state.passengersLost <= 5) rank = 'A';
  else if (survived && state.passengersLost <= 15) rank = 'B';
  else if (survived) rank = 'C';

  const rankColors: Record<string, string> = {
    S: 'text-yellow-400', A: 'text-green-400', B: 'text-blue-400', C: 'text-gray-400', D: 'text-red-400',
  };

  return (
    <div className="max-w-lg w-full p-8 text-center space-y-6">
      <div className="text-6xl">{survived ? '🏆' : '💥'}</div>
      <h1 className={`text-4xl font-black ${survived ? 'text-green-400' : 'text-red-400'}`}>
        {survived ? 'ДЕПО ДОСТИГНУТО!' : 'РЕЙС ПРОВАЛЕН!'}
      </h1>

      <div className={`text-8xl font-black ${rankColors[rank]}`}>
        {rank}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Дистанция:</span>
          <span className="text-white">{Math.round(state.distanceTraveled)} м</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Время:</span>
          <span className="text-white">{Math.round(state.gameTime)} сек</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Пассажиры спасены:</span>
          <span className="text-green-400">{totalPassengers}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Пассажиры потеряны:</span>
          <span className="text-red-400">{state.passengersLost}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Враги уничтожены:</span>
          <span className="text-orange-400">{state.enemiesKilled}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
          <span className="text-gray-400 font-bold">Монеты:</span>
          <span className="text-yellow-400 font-bold">+{state.coins} 💰</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDepot}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all"
        >
          🏗️ В депо
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg transition-all"
        >
          🔄 Ещё раз
        </button>
        <button
          onClick={onMenu}
          className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-lg transition-all"
        >
          🏠 Меню
        </button>
      </div>
    </div>
  );
}

// ============ GAME HUD ============
interface HUDData {
  speed: number;
  hp: number;
  passengers: number;
  coins: number;
  wave: number;
  act: number;
  distance: number;
  time: number;
  enemies: number;
  gameOver: boolean;
  weapon: GameState['weapon'];
  magazine: number;
  reserve: number;
  reloading: boolean;
  turrets: number;
  interaction: string;
}

function GameHUD({ hud }: { hud: HUDData }) {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 z-10 pointer-events-none w-7 h-7 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute left-1/2 top-0 h-2 w-px bg-orange-300" />
        <div className="absolute left-1/2 bottom-0 h-2 w-px bg-orange-300" />
        <div className="absolute left-0 top-1/2 h-px w-2 bg-orange-300" />
        <div className="absolute right-0 top-1/2 h-px w-2 bg-orange-300" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300" />
      </div>

      {/* Top bar */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        <div className="space-y-1">
          <div className="bg-black/70 px-3 py-1 rounded text-xs font-mono border border-orange-800/50">
            <span className="text-orange-400">АКТ {hud.act}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-gray-300">Волна: {hud.wave}</span>
          </div>
          <div className="bg-black/70 px-3 py-1 rounded text-xs font-mono border border-orange-800/50">
            <span className="text-blue-400">🚂 {hud.speed} км/ч</span>
          </div>
        </div>

        <div className="space-y-1 text-right">
          <div className="bg-black/70 px-3 py-1 rounded text-xs font-mono border border-yellow-800/50">
            <span className="text-yellow-400">💰 {hud.coins}</span>
          </div>
          <div className="bg-black/70 px-3 py-1 rounded text-xs font-mono border border-orange-800/50">
            <span className="text-gray-300">👥 {hud.passengers}</span>
            <span className="text-gray-500 mx-1">|</span>
            <span className="text-red-400">💀 {hud.enemies}</span>
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
        <div className="bg-black/70 p-2 rounded border border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-8">HP</span>
            <div className="flex-1 h-3 bg-gray-800 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  hud.hp > 50 ? 'bg-green-500' : hud.hp > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${hud.hp}%` }}
              />
            </div>
            <span className="text-xs text-gray-300 w-10 text-right">{hud.hp}%</span>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-2 pointer-events-none text-right">
        <div className="bg-black/75 px-3 py-2 rounded border border-orange-800/60 font-mono">
          <div className="text-xs text-orange-300">
            {hud.weapon === 'pistol' ? 'ПИСТОЛЕТ [1]' : 'АВТОМАТ [2]'}
          </div>
          <div className="text-lg font-bold text-white">
            {hud.weapon === 'pistol' ? '∞' : `${hud.magazine} / ${hud.reserve}`}
          </div>
          {hud.reloading && <div className="text-[10px] text-yellow-300">ПЕРЕЗАРЯДКА...</div>}
          <div className="text-[10px] text-gray-400">Турели: {hud.turrets}</div>
        </div>
      </div>

      {hud.interaction && (
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 pointer-events-none">
          <div className="bg-black/75 px-4 py-2 rounded border border-orange-700 text-sm font-bold text-orange-200">
            {hud.interaction}
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/50 px-3 py-1 rounded text-[10px] text-gray-500 font-mono">
          WASD — ходьба | Мышь — обзор | ЛКМ — огонь | R — ремонт | T — турель
        </div>
      </div>
    </>
  );
}

export default App;
