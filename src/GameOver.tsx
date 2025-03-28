import { motion } from 'framer-motion'
import { useGameStore } from './utils/gameState'
import { usePortfolioStore } from './utils/portfolio'

export default function GameOver() {
    const { categories, dayCount, lifeInsurance } = useGameStore()
    const { totalCash, propertiesOwned, monthlyIncome, netWorthGrowth } = usePortfolioStore()   

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8 sticky top-0 bg-gradient-to-b from-slate-900 to-transparent pt-4 pb-6 z-10"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm mb-4">
                        Financial Education Simulator v1.0
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Simulation Complete 🪿
                    </h1>
                    <p className="text-blue-200 text-lg">
                        Simulated Period: {dayCount} Days
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Portfolio Performance Card */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-blue-400 text-xl">📊</span>
                            Portfolio Metrics
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-blue-200">Total Assets Under Management</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        ${totalCash.toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((totalCash / 1000000) * 100, 100)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="bg-blue-500 h-2 rounded-full" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="text-blue-300 text-sm mb-1">Real Estate Portfolio</div>
                                    <div className="text-2xl font-bold text-white">{propertiesOwned}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="text-blue-300 text-sm mb-1">Monthly Revenue</div>
                                    <div className="text-2xl font-bold text-white">
                                        ${monthlyIncome.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="text-blue-300 mb-1">Simulated Growth Rate</div>
                                <div className={`text-3xl font-bold ${netWorthGrowth < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {netWorthGrowth}%
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Risk Analysis Card */}
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-blue-400 text-xl">🛡️</span>
                            Risk Management
                        </h2>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${
                                lifeInsurance 
                                    ? 'border-green-500/30 bg-green-500/10' 
                                    : 'border-red-500/30 bg-red-500/10'
                            }`}>
                                <h3 className="font-semibold text-lg mb-2 text-white">Life Insurance Coverage</h3>
                                {lifeInsurance ? (
                                    <p className="text-blue-200">
                                        Simulation indicates optimal protection with comprehensive life insurance coverage. 
                                        Beneficiaries are secured with established wealth transfer protocols.
                                    </p>
                                ) : (
                                    <p className="text-blue-200">
                                        Simulation detected potential risk: No life insurance coverage. 
                                        Recommended action: Implement wealth protection strategy.
                                    </p>
                                )}
                            </div>

                            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
                                <h3 className="font-semibold text-lg mb-2 text-white">Risk Assessment Score</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-200">Overall Protection Level</span>
                                    <span className="text-xl font-bold text-blue-400">
                                        {lifeInsurance ? '10/10' : '0/10'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decision Analysis */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-blue-400 text-xl">🎯</span>
                        Decision Analysis
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(categories).map(([id, category], index) => (
                            <motion.div 
                                key={id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`p-4 rounded-xl border transition-all ${
                                    category.completed 
                                        ? 'border-green-500/30 bg-green-500/10' 
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-white">{id}</span>
                                    {category.completed && (
                                        <span className="text-green-400">
                                            <CheckIcon className="w-6 h-6" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-200">{category.objective}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl 
                            shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/25"
                    >
                        Run New Simulation
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

function CheckIcon({ className = "w-6 h-6" }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={className} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-label="Check"
            role="img"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
            />
        </svg>
    )
}