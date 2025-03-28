import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Sky } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense, useEffect, useState, useRef } from 'react'
import { EcctrlJoystick } from 'ecctrl'
import Lights from './Lights'
import World from './World'
import GameCharacter from './components/Character'
import { useDialogStore } from './utils/store'
import Dialog from './components/Dialog'
import { usePortfolioStore } from './utils/portfolio'
import { useGameStore } from './utils/gameState'
import GameOver from './GameOver'
import { SmartphoneIcon } from 'lucide-react'
import { usePhoneStore } from './utils/phone'
import PhoneMenu from './PhoneMenu'
import { motion } from 'framer-motion'
import { Sparkles, Shield, TrendingUp } from 'lucide-react'
import Cityboyjj from './models/Cityboyjj'

function DayNightCycle() {
  const timeRef = useRef(0)
  const DAY_LENGTH = 60 // 5 seconds per day

  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current = (timeRef.current + 0.016) % DAY_LENGTH // Increment by roughly 1/60th of a second
    }, 16) // Run at ~60fps
    return () => clearInterval(interval)
  }, [])

  // Calculate sun position based on time
  // Map 0-5 seconds to 0-2π for a complete cycle
  const angle = (timeRef.current / DAY_LENGTH) * Math.PI * 2

  // Adjust the curve to have sunrise at 0s and sunset at 2.5s
  const height = Math.sin(angle) * 100
  const distance = Math.cos(angle) * 100

  // Smoothly interpolate atmospheric values based on height
  const rayleigh = 0.5 + Math.max(0, -height / 100) * 1.5 // Smoothly transition from 0.5 to 2
  const turbidity = 8 + Math.max(0, -height / 100) * 4 // Smoothly transition from 8 to 12

  const sunPosition: [number, number, number] = [
    distance, // x position
    Math.max(height, -20), // y position (clamp minimum height)
    0 // z position
  ]

  return (
    <Sky
      sunPosition={sunPosition}
      mieCoefficient={0.005}
      mieDirectionalG={0.7}
      rayleigh={rayleigh}
      turbidity={turbidity}
    />
  )
}

function TransitionOverlay({ onComplete }: { onComplete: () => void }) {
  return (
    <>
      {/* First wave */}
      <motion.div
        className="fixed inset-0 z-[999999999999] pointer-events-none bg-green-600"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ 
          clipPath: 'circle(150% at 50% 50%)',
        }}
        transition={{ 
          duration: 1,
          ease: [0.76, 0, 0.24, 1]
        }}
      />
      {/* Second wave */}
      <motion.div
        className="fixed inset-0 z-[999999999998] pointer-events-none bg-green-700"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ 
          clipPath: 'circle(150% at 50% 50%)',
        }}
        transition={{ 
          duration: 1,
          delay: 0.1,
          ease: [0.76, 0, 0.24, 1]
        }}
        onAnimationComplete={onComplete}
      />
    </>
  )
}

function StartScreenBackground() {
  const { scene } = useThree()
  
  useFrame(() => {
    scene.rotation.y += 0.001 // Slow auto-rotation
  })

  return (
    <>
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.5}
        azimuth={0.25}
      />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow
      />
      <Cityboyjj
        scale={20} 
        position={[0, -10, -50]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </>
  )
}

function StartScreen() {
  const { startGame, buyLifeInsurance } = useGameStore()
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-950 overflow-auto md:flex md:items-center md:justify-center z-[99999999999] md:overflow-hidden">
      {/* 3D Background with darker overlay */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Canvas>
          <Suspense fallback={null}>
            <StartScreenBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Main content container - adjusted max width and padding */}
      <div className="max-w-5xl w-full mx-auto px-8 py-12">
        <div className="space-y-12">
          {/* Title Section - adjusted spacing */}
          <motion.div 
            className="text-center mb-16"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-8xl font-bold text-white tracking-tight drop-shadow-lg mb-4">
              Capital<span className="text-emerald-400">Quest</span>
            </h1>
            <p className="text-3xl text-emerald-200 drop-shadow-lg">
              Master Your Financial Future
            </p>
          </motion.div>

          {/* Feature Cards - adjusted grid and spacing */}
          <motion.div className="hidden md:grid grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Investment",
                description: "Learn market dynamics"
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Protection",
                description: "Secure your assets"
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "Growth",
                description: "Build your wealth"
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className="bg-green-950 rounded-2xl p-8 border-2 border-emerald-600 shadow-lg flex flex-col items-center text-center"
                whileHover={{ scale: 1.02, backgroundColor: "#052e16" }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-emerald-400 mb-6 p-3 bg-green-900/50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-emerald-200 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Life Insurance Choice - adjusted container and spacing */}
          <motion.div 
            className="bg-green-950 rounded-2xl border-2 border-emerald-600 shadow-lg overflow-hidden max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="p-8 text-center">
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-8">Before You Begin</h2>
              
              <div className="bg-green-900 rounded-xl p-8 mb-10 border border-emerald-700">
                <p className="text-base md:text-2xl text-white mb-4">
                  Would you like to purchase life insurance?
                </p>
                <p className="text-sm md:text-lg text-emerald-200">
                  Protect your family's financial future and ensure long-term security.
                </p>
              </div>

              <div className="flex gap-4 md:gap-8 justify-center">
                <motion.button
                  className={`px-8 py-4 rounded-xl text-base md:text-xl font-semibold transition-all shadow-lg ${
                    selected === 'yes'
                      ? 'bg-emerald-500 text-white scale-105 border-2 border-emerald-400'
                      : 'bg-green-900 text-white hover:bg-green-800 border-2 border-emerald-600'
                  }`}
                  onClick={() => {
                    setSelected('yes')
                    setIsTransitioning(true)
                    setTimeout(() => {
                      buyLifeInsurance()
                      startGame()
                    }, 1000)
                  }}
                  whileHover={{ scale: selected === 'yes' ? 1.05 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Protect My Family
                </motion.button>
                <motion.button
                  className={`px-8 py-4 rounded-xl text-base md:text-xl font-semibold transition-all shadow-lg ${
                    selected === 'no'
                      ? 'bg-red-500 text-white scale-105 border-2 border-red-400'
                      : 'bg-green-900 text-white hover:bg-green-800 border-2 border-emerald-600'
                  }`}
                  onClick={() => {
                    setSelected('no')
                    setIsTransitioning(true)
                    setTimeout(() => {
                      startGame()
                    }, 1000)
                  }}
                  whileHover={{ scale: selected === 'no' ? 1.05 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No, I'll Take the Risk
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <TransitionOverlay onComplete={() => startGame()} />
      )}
    </div>
  )
}

function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio('/ost.mp3')
    audio.loop = true
    audio.volume = 0.1 // Adjust volume as needed
    
    // Start playing
    audio.play().catch(error => {
      console.log("Audio playback failed:", error)
    })

    // Cleanup on unmount
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  return null
}

export default function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const { isGameOver, incrementDay, hasStarted } = useGameStore()
  const { isOpen } = usePhoneStore()

  const { currentDialog } = useDialogStore()

  const DAY_LENGTH = 60 // 5 seconds per day

  useEffect(() => {
    const interval = setInterval(() => {
      incrementDay()
    }, DAY_LENGTH * 1000)

    return () => clearInterval(interval)
  }, [incrementDay])

  if (!hasStarted) {
    return <StartScreen />
  }

  if (isGameOver) {
    return <GameOver />
  }

  return (
    <>
      <BackgroundMusic />
      {isMobile && <EcctrlJoystick />}
      {currentDialog && <Dialog />}
      {isOpen && <PhoneMenu />}
      <PortfolioStats />
      <PhoneButton />
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 50 }}
        onContextLost={(event) => {
          event.preventDefault();
          console.log('WebGL context lost, attempting to restore...');
          // Force a re-render after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
        onContextRestored={() => {
          console.log('WebGL context restored');
        }}
        gl={{
          powerPreference: 'high-performance',
          alpha: true,
          antialias: true,
          stencil: true,
          depth: true
        }}
      >
        <DayNightCycle />
        <Perf position="top-left" />
        <Lights />
        <Physics
          timeStep="vary"
        // debug
        >
          <Suspense fallback={null}>
            <GameCharacter />
            {/* <PerspectiveCamera makeDefault position={[10, 200, 30]} rotation={[-Math.PI/2, 0, Math.PI]} /> */}
            {/* <OrbitControls makeDefault /> */}
            <World />
          </Suspense>
        </Physics>
      </Canvas>
    </>
  )
}

function PortfolioStats() {
  const [isExpanded, setIsExpanded] = useState(true)
  const { totalCash, propertiesOwned, monthlyIncome, netWorthGrowth } = usePortfolioStore()
  const { dayCount } = useGameStore()

  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-blue-200 z-[9999999888] w-64 select-none">
      <div
        className="flex items-center justify-between p-2 cursor-pointer border-b border-blue-100"
        onClick={(e) => {
          if (e.type === 'click') {
            setIsExpanded(!isExpanded)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault()
          }
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <h2 className="text-sm font-bold text-gray-800">Portfolio Stats</h2>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-2">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Assets:</span>
              <span className="font-medium text-green-600">${totalCash.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Properties Owned:</span>
              <span className="font-medium text-blue-600">{propertiesOwned}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Monthly Income:</span>
              <span className="font-medium text-emerald-600">${monthlyIncome.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Day:</span>
              <span className="font-medium text-blue-600">{dayCount}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-blue-100">
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>Net Worth Growth</span>
              <span className={netWorthGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {netWorthGrowth >= 0 ? `+${netWorthGrowth}` : netWorthGrowth}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`${netWorthGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'} h-1.5 rounded-full`}
                style={{ width: `${Math.abs(netWorthGrowth)}%` }}

              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PhoneButton() {
  const { setIsOpen } = usePhoneStore()
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="fixed bottom-6 right-6 select-none z-[9999999999]"
      onClick={() => setIsOpen(true)}
    >
      {/* Outer glow/ring */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />

      {/* Button container with gradient */}
      <div className="relative group cursor-pointer">
        {/* Background with gradient */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg 
          shadow-blue-500/50 flex items-center justify-center transform transition-all duration-200 
          group-hover:scale-110 group-active:scale-95 group-hover:shadow-blue-500/60">

          {/* Icon */}
          <SmartphoneIcon className="w-8 h-8 text-white group-hover:text-blue-100 transition-colors" />
        </div>

        {/* Ripple effect on hover */}
        <div className="absolute inset-0 -z-10 rounded-full bg-blue-400/20 group-hover:scale-110 
          transition-transform duration-300 ease-out" />

        {/* Tooltip */}
        <div className="absolute top-0 right-full mr-4 px-3 py-1 bg-gray-900/90 text-white text-sm 
          rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Open Phone Menu
        </div>
      </div>
    </div>
  )
}
