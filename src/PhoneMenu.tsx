// import { usePhoneStore } from "./utils/phone"
import { MapIcon, BookOpenIcon, HomeIcon, CarIcon, TrendingUpIcon, HeartIcon, Stethoscope, Users, FileText, PiggyBank, Building2Icon, Calculator, LightbulbIcon } from 'lucide-react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { usePhoneStore } from './utils/phone'

interface Product {
    icon: React.ReactNode
    title: string
    subtitle?: string
}

interface StockData {
    icon: React.ReactNode
    symbol: string
    name: string
    price: number | null
    change: number | null
    loading: boolean
}

interface PropertyDetails {
    location: string
    price: number
    image: string
    status: 'Fully Owned' | 'In Progress'
    downPayment: number
    loanTerms: string
    yearlyPayment: number
}

interface CarListing {
    model: string
    price: number
    image: string
    status: 'Fully Owned' | 'In Progress'
}

const products: Product[] = [
    {
        icon: <HeartIcon className="w-8 h-8 text-white" />,
        title: "Insurance",
        subtitle: "Life insurance"
    },
    {
        icon: <Stethoscope className="w-8 h-8 text-white" />,
        title: "Insurance",
        subtitle: "Health insurance"
    },
    {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Investment",
        subtitle: "Mutual funds"
    },
    {
        icon: <FileText className="w-8 h-8 text-white" />,
        title: "Investment",
        subtitle: "Insurance GICS"
    },
    {
        icon: <PiggyBank className="w-8 h-8 text-white" />,
        title: "Financial Advising",
        subtitle: "Financial planning"
    },
    {
        icon: <Building2Icon className="w-8 h-8 text-white" />,
        title: "Asset Management",
        subtitle: "Mutual funds"
    },
    {
        icon: <Calculator className="w-8 h-8 text-white" />,
        title: "Sun Life Digital Se...",
        subtitle: "Retirement calculator"
    }
]

const initialStocks: StockData[] = [
    {
        // biome-ignore lint/a11y/useAltText: <explanation>
        icon: <img src="/sunlife.png" className="w-12 h-12" />,
        symbol: "SLF",
        name: "SunLife",
        price: null,
        change: null,
        loading: true
    },
    {
        // biome-ignore lint/a11y/useAltText: <explanation>
        icon: <img src="/google.svg" className="w-12 h-12" />,
        symbol: "GOOGL",
        name: "Google",
        price: null,
        change: null,
        loading: true
    },
    {
        // biome-ignore lint/a11y/useAltText: <explanation>
        icon: <img src="/amazon.svg" className="w-12 h-12" />,
        symbol: "AMZN",
        name: "Amazon",
        price: null,
        change: null,
        loading: true
    }
]

const properties: PropertyDetails[] = [
    {
        location: 'Kitchener',
        price: 700000,
        image: '/house1.png',
        status: 'Fully Owned',
        downPayment: 600,
        loanTerms: '25 years at 5% interest',
        yearlyPayment: 600 * 12
    },
    {
        location: 'Waterloo',
        price: 950000,
        image: '/house2.png',
        status: 'In Progress',
        downPayment: 600,
        loanTerms: '25 years at 5% interest',
        yearlyPayment: 600 * 12
    }
]

const cars: CarListing[] = [
    {
        model: 'Tesla Model 3',
        price: 30000,
        image: '/tesla.png',
        status: 'In Progress'
    }
]

function generateRandomSparkline(seed: number, yearOffset: number) {
    const points = 10
    // Use both seed and yearOffset to generate consistent but different values for each year
    const values = Array.from({ length: points }, (_, i) => {
        const random = Math.sin((i + yearOffset) * seed) * 0.5 +
            Math.sin(seed * 0.7) * 0.5
        return 25 + random * 20
    })

    const pathData = values.map((value, index) => {
        const x = (index / (points - 1)) * 100
        return `${index === 0 ? 'M' : 'L'} ${x} ${value}`
    }).join(' ')

    return pathData
}

function SparklineChart({ seed, trend = 1, yearOffset = 0 }: {
    seed: number
    trend?: number
    yearOffset: number
}) {
    // Memoize the path to prevent regeneration on every render
    const path = useMemo(() =>
        generateRandomSparkline(seed, yearOffset),
        [seed, yearOffset]
    )

    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg className="w-32 h-16" viewBox="0 0 100 50">
            <path
                d={path}
                fill="none"
                stroke={trend >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
            />
        </svg>
    )
}

// Add this new component for the close button
function CloseButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 
                transition-all duration-200 group"
        >
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
                className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    )
}

export default function PhoneMenu() {
    const [activeTab, setActiveTab] = useState('map')
    const [selectedYear, setSelectedYear] = useState(2025)
    const [stocks, setStocks] = useState<StockData[]>(initialStocks)
    const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null)
    const { setIsOpen } = usePhoneStore()

    // Calculate price based on year and change
    const getAdjustedPrice = (basePrice: number | null, change: number | null, yearDiff: number) => {
        if (basePrice === null || change === null) return null
        return basePrice + (change * yearDiff)
    }

    // Move fetch outside of useEffect to prevent dependency issues
    const fetchStockData = useCallback(async () => {
        const API_KEY = 'cub52p1r01qsc2sktto0cub52p1r01qsc2skttog'

        // check if stocks is empty (price is null)
        if (!stocks.some(stock => stock.price === null)) {
            console.log("Stocks already loaded")
            return
        }

        const updatedStocks = await Promise.all(
            stocks.map(async (stock) => {
                try {
                    // Get current price
                    const quoteResponse = await fetch(
                        `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${API_KEY}`
                    )
                    const quoteData = await quoteResponse.json()

                    if (quoteData.c && quoteData.d) { // c = current price, d = change
                        return {
                            ...stock,
                            price: quoteData.c,
                            change: quoteData.d,
                            loading: false
                        }
                    }

                    console.error(`No data found for ${stock.symbol}`)
                    return {
                        ...stock,
                        price: 0,
                        change: 0,
                        loading: false
                    }
                } catch (error) {
                    console.error(`Error fetching data for ${stock.symbol}:`, error)
                    return stock
                }
            })
        )

        setStocks(updatedStocks)
    }, [stocks])

    useEffect(() => {
        if (activeTab === 'stocks') {
            fetchStockData()
        }
    }, [activeTab, fetchStockData])

    // Calculate when the property will be fully owned
    const getPropertyStatus = (yearsPaid: number) => {
        const totalYears = 25 // from loan terms
        if (yearsPaid >= totalYears) return 'FULLY OWNED'
        return `FULLY OWNED IN ${totalYears - yearsPaid} YEARS`
    }

    return (
        // Remove onClick from this div
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999999999]">
            {/* Remove onClick from this div too */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Add close button */}
                <CloseButton onClick={() => setIsOpen(false)} />
                
                <MainSvg>
                    <div className="w-full h-full flex flex-col">
                        {/* Navigation Bar - Pill Style */}
                        <div className="absolute left-32 right-32 top-12">
                            <div className="bg-green-600 h-24 rounded-full flex items-center px-4">
                                <div className="flex-1 flex justify-between items-center">
                                    <TabButton
                                        icon={<MapIcon size={48} />}
                                        isActive={activeTab === 'map'}
                                        onClick={() => setActiveTab('map')}
                                    />
                                    <TabButton
                                        icon={<BookOpenIcon size={48} />}
                                        isActive={activeTab === 'catalog'}
                                        onClick={() => setActiveTab('catalog')}
                                    />
                                    <TabButton
                                        icon={<HomeIcon size={48} />}
                                        isActive={activeTab === 'home'}
                                        onClick={() => setActiveTab('home')}
                                    />
                                    <TabButton
                                        icon={<CarIcon size={48} />}
                                        isActive={activeTab === 'car'}
                                        onClick={() => setActiveTab('car')}
                                    />
                                    <TabButton
                                        icon={<TrendingUpIcon size={48} />}
                                        isActive={activeTab === 'stocks'}
                                        onClick={() => setActiveTab('stocks')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Area with adjusted spacing */}
                        <div className="w-full h-full bg-white">
                            {activeTab === 'map' && (
                                <img src="/mapbirdeye.png" alt="Map View" className="w-full h-full object-contain" />
                            )}
                            {activeTab === 'catalog' && (
                                <div className="px-16 pt-64">
                                    <h2 className="text-6xl font-bold mb-12">Products</h2>
                                    <div className="space-y-10">
                                        {products.map((product, index) => (
                                            <div
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                key={index}
                                                className="flex items-center p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                            >
                                                <div className="bg-green-600 p-4 rounded-xl">
                                                    {React.cloneElement(product.icon as React.ReactElement, {
                                                        className: "w-12 h-12 text-white"
                                                    })}
                                                </div>
                                                <div className="ml-6">
                                                    <h3 className="text-4xl font-semibold text-gray-900">{product.title}</h3>
                                                    {product.subtitle && (
                                                        <p className="text-gray-500 text-2xl mt-2">{product.subtitle}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'home' && (
                                <div className="px-16 pt-64">
                                    <h2 className="text-6xl font-bold mb-12">Home</h2>

                                    {/* Info Banner */}
                                    <div className="mb-12 bg-gray-100 rounded-xl p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-200 rounded-full">
                                                <LightbulbIcon className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <p className="text-2xl text-gray-600">
                                                CLICK ON "IN PROGRESS" HOMES TO SIMULATE
                                            </p>
                                        </div>
                                    </div>

                                    {/* Property List */}
                                    <div className="space-y-8">
                                        {properties.map((property, index) => (
                                            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                            <div
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                key={index}
                                                className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden cursor-pointer"
                                                onClick={() => setSelectedProperty(property)}
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-4xl font-semibold text-gray-900">
                                                                {property.location}
                                                            </h3>
                                                            <p className="text-3xl text-gray-600 mt-2">
                                                                ${property.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-xl ${property.status === 'Fully Owned'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {property.status}
                                                        </span>
                                                    </div>

                                                    <div className="aspect-[16/9] rounded-xl overflow-hidden">
                                                        <img
                                                            src={property.image}
                                                            alt={`Property in ${property.location}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'car' && (
                                <div className="px-16 pt-64">
                                    <h2 className="text-6xl font-bold mb-12">Car</h2>

                                    {/* Info Banner */}
                                    <div className="mb-12 bg-gray-100 rounded-xl p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-200 rounded-full">
                                                <LightbulbIcon className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <p className="text-2xl text-gray-600">
                                                CLICK ON "IN PROGRESS" CARS TO SIMULATE
                                            </p>
                                        </div>
                                    </div>

                                    {/* Car List */}
                                    <div className="space-y-8">
                                        {cars.map((car, index) => (
                                            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                            <div
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                key={index}
                                                className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden cursor-pointer"
                                                onClick={() => {
                                                    // Trigger car dialog from World.tsx
                                                }}
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-4xl font-semibold text-gray-900">
                                                                {car.model}
                                                            </h3>
                                                            <p className="text-3xl text-gray-600 mt-2">
                                                                ${car.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-xl ${car.status === 'Fully Owned'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {car.status}
                                                        </span>
                                                    </div>

                                                    <div className="aspect-[16/9] rounded-xl overflow-hidden">
                                                        <img
                                                            src={car.image}
                                                            alt={car.model}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'stocks' && (
                                <div className="px-16 pt-64">
                                    <h2 className="text-6xl font-bold mb-12">Stocks</h2>
                                    <div className="space-y-10">
                                        {stocks.map((stock, index) => (
                                            <div
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                key={index}
                                                className="flex items-center justify-between p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                            >
                                                <div className="flex items-center gap-6">
                                                    {stock.icon}
                                                    <div>
                                                        <h3 className="text-4xl font-semibold text-gray-900">{stock.name}</h3>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            {stock.loading ? (
                                                                <span className="text-2xl text-gray-400">Loading...</span>
                                                            ) : (
                                                                <>
                                                                    <span className="text-2xl text-gray-900">
                                                                        ${getAdjustedPrice(
                                                                            stock.price,
                                                                            stock.change,
                                                                            selectedYear - 2025
                                                                        )?.toFixed(2)}
                                                                    </span>
                                                                    <span className={`text-2xl ${stock.change && stock.change >= 0
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                        }`}>
                                                                        {stock.change && stock.change >= 0 ? '+' : ''}
                                                                        {stock.change?.toFixed(2)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <SparklineChart
                                                    seed={index + 1}
                                                    trend={stock.change || 0}
                                                    yearOffset={selectedYear - 2025}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timeline slider */}
                                    <div className="mt-20 space-y-4">
                                        <div className="relative">
                                            <div className="relative">
                                                <div className="absolute text-2xl text-gray-900 font-medium"
                                                    style={{
                                                        left: `${((selectedYear - 2020) / (2030 - 2020 + 1)) * 100}%`,
                                                        bottom: '100%',
                                                        transform: 'translateX(-50%)',
                                                        marginBottom: '8px',
                                                        marginLeft: '24px',
                                                    }}
                                                >
                                                    {selectedYear}
                                                </div>
                                                <input
                                                    type="range"
                                                    min="2020"
                                                    max="2030"
                                                    defaultValue="2025"
                                                    className="w-full h-3 bg-green-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                                                    onChange={(e) => {
                                                        setSelectedYear(Number.parseInt(e.target.value))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-2xl">
                                            <span className="text-gray-500">2020</span>
                                            <span className="text-gray-500">2030</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </MainSvg>

                {/* Property Details Modal */}
                {selectedProperty && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-4xl font-bold text-gray-900">
                                            {selectedProperty.location}
                                        </h3>
                                        <p className="text-2xl text-gray-600 mt-2">
                                            ${selectedProperty.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProperty(null)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Property Image */}
                                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
                                    <img
                                        src={selectedProperty.image}
                                        alt={`Property in ${selectedProperty.location}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Status Banner */}
                                <div className="bg-gray-100 rounded-xl p-6 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-200 rounded-full">
                                            <LightbulbIcon className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <p className="text-2xl text-gray-600">
                                            {getPropertyStatus(selectedYear - 2025)}
                                        </p>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900">House Price</h4>
                                        <p className="text-3xl text-gray-900">${selectedProperty.price.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900">Down Payment</h4>
                                        <p className="text-3xl text-gray-900">${selectedProperty.downPayment}/month</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900">Loan Terms</h4>
                                        <p className="text-3xl text-gray-900">{selectedProperty.loanTerms}</p>
                                    </div>
                                </div>

                                {/* Timeline Slider */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="relative">
                                            <div
                                                className="absolute text-2xl text-gray-900 font-medium"
                                                style={{
                                                    left: `${((selectedYear - 2020) / (2030 - 2020 + 1)) * 100}%`,
                                                    bottom: '100%',
                                                    transform: 'translateX(-50%)',
                                                    marginBottom: '8px',
                                                    marginLeft: '24px',
                                                }}
                                            >
                                                {selectedYear}
                                            </div>
                                            <input
                                                type="range"
                                                min="2020"
                                                max="2030"
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                                className="w-full h-3 bg-green-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-2xl">
                                        <span className="text-gray-500">2020</span>
                                        <span className="text-gray-500">2030</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function TabButton({
    icon,
    isActive,
    onClick,
    className = ''
}: {
    icon: React.ReactNode
    isActive: boolean
    onClick: () => void
    className?: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-3 rounded-full transition-all ${isActive
                ? 'bg-white text-green-600'
                : 'text-white hover:text-white hover:bg-white/10'
                } ${className}`}
        >
            {icon}
        </button>
    )
}

function MainSvg({
    children
}: {
    children: React.ReactNode
}) {
    // Original coordinates of white rectangle
    const rectX = 250
    const rectWidth = 773
    const rectY = 41
    const rectHeight = 1660

    // Calculate center of the rectangle
    const rectCenterX = rectX + rectWidth / 2
    const rectCenterY = rectY + rectHeight / 2

    // Calculate required translation to center the rectangle
    const translateX = -(rectCenterX - 2575.01 / 2)
    const translateY = -(rectCenterY - 2965.84 / 2)

    return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2575.01 2965.84"
            width="1000"
            height="1200"
            style={{
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                left: '50%',
                top: '50%'
            }}
        >
            <g
                clipPath="url(#a)"
                transform={`translate(${translateX}, ${translateY})`}
            >
                {/* <path fill="#fff" d="M250 41h773v1660H250z" /> */}
                <foreignObject x="250" y="41" width="773" height="1660">
                    <div className="w-full h-full bg-white">
                        {children}
                    </div>
                </foreignObject>
                <path
                    fill="#46484A"
                    d="m221.7 1332.18-2.23 137.14-.42 25.4s-20.56 5.21-42.14 6.67c-5.41.38-10.9.52-16.12.27-26.08-1.23-49.31-13.86-63.15-24.04-13.86-10.18-16.3-16.7-18.33-22.82-.63-1.9-2.38-2.69-4.61-3.41-4.94-1.53-12.28-2.61-15.35-14.11-4.49-16.7 2.45-61.1 15.07-77.4 11.03-14.24 36.86-25.68 63.18-32.82 3.79-1.03 7.6-1.98 11.38-2.83 29.94-6.72 72.71 7.95 72.71 7.95h.01Z"
                />
                <path
                    fill="#46484A"
                    d="m219.47 1469.33-.42 25.4s-20.56 5.21-42.14 6.67c1.81-5.99 4.97-11.91 11.99-16.04 7.92-4.66 20.89-11.26 30.56-16.04l.01.01ZM219.06 1051.08s-3.68 61.52-4.89 72.93c-.75 7-2.11 45.93-3.06 74.96-.58 18.25-1.01 32.59-1.01 32.59s-7.34.4-15.89.4c-7.5 0-12.51 2.21-19.98 5.22-1.03.42-2.11.85-3.24 1.3-9.37 3.68-44.4 8.15-72.11 7.34-27.7-.82-38.69-13.04-46.85-20.78-.73-.68-1.48-1.43-2.25-2.2-7.85-7.92-17.32-20.03-17.32-30.81 0-11.81 4.89-56.21 16.3-72.91 6.09-8.92 22.52-22.84 40.56-35.55 15.72-11.08 32.66-21.26 45-26.38 26.48-11 84.74-6.1 84.74-6.1v-.01Z"
                />
                <path
                    fill="#46484A"
                    d="M211.1 1198.97c-.58 18.25-1.01 32.59-1.01 32.59s-7.34.4-15.89.4c-7.5 0-12.51 2.21-19.98 5.22 3.44-6.06 7.44-12.53 11.43-16.84 4.41-4.76 16.02-14.06 25.45-21.38v.01ZM181.29 749.52c-17.6 5.51-37.03 11.91-44.95 15.57 0 0-17.22 9.17-32.67 17.73-5.67 3.16-11.11 6.24-15.39 8.75-15.9 9.37-57.86 24.04-64.38 47.66-6.35 23.06-7.67 36.41-.55 53.32.17.43.37.85.55 1.28 7.74 17.52 14.67 25.67 33.4 35.03 18.75 9.37 26.48 19.15 67.22 21.59 14.11.85 29.1 1.45 42.67 1.88 25.6.8 46.15.96 46.15.96l2.03-213.88c-.62 0-16.44 4.59-34.09 10.1l.01.01Z"
                />
                <path
                    fill="#46484A"
                    d="m215.38 739.42-2.03 213.88s-20.54-.17-46.15-.96c8.55-9.02 17.65-20.34 23.32-31.42 12.23-23.82 22.62-100.83 12.23-124.65-6.79-15.59-15.94-35.1-21.46-46.75 17.65-5.51 33.47-10.1 34.09-10.1Z"
                />
                <path
                    fill="#231F20"
                    d="M942.18 0H331.09c-70.87 0-128.33 57.46-128.33 128.33V1619.4c0 70.87 57.46 128.33 128.33 128.33h611.09c70.87 0 128.33-57.46 128.33-128.33V128.33C1070.51 57.46 1013.05 0 942.18 0Zm77 1615.73c0 45.9-37.21 83.11-83.11 83.11H337.2c-45.9 0-83.11-37.21-83.11-83.11V127.11c0-45.9 37.21-83.11 83.11-83.11h598.87c45.9 0 83.11 37.21 83.11 83.11v1488.62Z"
                />
                <path
                    fill="#46484A"
                    d="m2582 2966.22-921.92-3.33s-274.32-439.42-319.54-509.32c-45.2-69.91-147.84-194.75-168.61-218.48-15.87-18.11-36.74-34.77-59.88-51.63-7.15-5.22-14.51-10.45-22-15.77-.43-.31-.88-.64-1.33-.95-32.39-22.72-102.22-66.08-168.365-128.89-28.294-26.84-76.393-87.27-122.543-148.14a5674.575 5674.575 0 0 1-28.223-37.59C717.93 1782.74 675 1722.03 675 1722.03h242.455c14.037 0 53.808-1.89 64.136-4.13 10.328-2.25 32.879-13.9 44.919-22.09 1.88-1.28 3.51-3.11 4.92-5.37v-.02c7.74-12.24 9.42-36.88 10.96-52.68 1.83-18.72-9.17-71.77-9.78-119.84-.62-48.05-1.21-182.05 3.66-207.01 1.6-8.2 5.84-22.3 10.93-38.44.86-2.72 1.75-5.5 2.64-8.34 9.97-31.4 21.9-67.66 23.91-83.06.22-1.66.42-3.73.58-6.15 2.45-33.57 1.05-133.44 1.05-153.64 0-6.73-.08-14.83-.37-23.603-.62-19.417-2.23-42.103-6.15-60.458-5.71-26.639-35.02-72.827-37.47-101.54-2.45-28.712-3.68-93.623 1.21-128.576 4.89-34.953 67.2 58.643 67.2-136.902 10.6-9.162 9.12 332.504 41.7 136.902 9.78-9.142-5.73 81.97 13 81.143 18.75-.838-53.03-150.116-44.07-106 8.97 44.115 112.39 11.966 112.39 11.966 13.03 32.451 25.69 418.368 53.18 486.858 27.49 68.5 109.34 322.91 135 380.95 25.66 58.06 118.92 86.36 151.91 160.02 32.98 73.64 113.62 173.52 201.6 259.65 87.98 86.14 157.64 224.71 271.26 362.45 113.65 137.74 546.2 622.09 546.2 622.09l.03.01Z"
                />
                <path
                    fill="#46484A"
                    d="M1271.43 2064.92c-4.89-3.26-52.15-33.42-83.93-59.49-31.79-26.07-61.93-33.4-121.4-62.73-59.49-29.34-129.56-76.59-146.09-116.51-9.86-23.84-15.14-56.09-17.78-78.22h14.87c14.04 0 53.82-1.85 64.15-4.04 10.33-2.21 32.89-13.61 44.93-21.63 1.88-1.25 3.51-3.04 4.92-5.26 1.76 11.54 4.29 26.65 7.29 39.06 5.71 23.64 38.29 82.3 57.04 114.07 18.75 31.79 83.93 86.37 119.77 114.9 35.85 28.51 61.1 83.09 56.23 79.85Z"
                />
                <path
                    fill="#D9D9D9"
                    d="m1026.5 2209.5-60-74.5 87.5-22 138.5-31.5 173-114 93-117.5 45-110.5 24-68.5 86.5 68.5c-6.83 27.67-28.8 103-62 183s-253.5 211-359.5 266.5l-166 20.5Z"
                />
                <path
                    fill="#46484A"
                    stroke="#46484A"
                    d="M1102.05 405.146c64.94-87.307 107.69 161.568 120.95 296.919L1116.02 849l-93-137.18c-.71-65.846 14.09-219.366 79.03-306.674ZM1037 1321l30-411.5 60 338-90 73.5Z"
                />
                <path
                    fill="#272929"
                    d="m1403.9 1730.73 35.6-130.23 93 74.5-37.03 106.02-61.05 100.09-76.06 89.73-137.11 85.29-41.03 25.14L967.048 2136l-44.548-98 14.024-16.87h76.556l91.08-35.01 76.06-39.93 96.57-65.08 61.05-70.01 66.06-80.37Z"
                />
                <path
                    fill="#BABAC4"
                    d="M1641 2972.5c-402 10.8-577.67-519.33-620-769.5l166-16 359-251 59.5-195c134-128.8 719.83 773.5 994.5 1231.5-149.67-4.5-557-10.8-959 0Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h2575.01v2965.84H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}