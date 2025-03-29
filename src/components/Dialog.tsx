import { useState } from 'react'
import { usePortfolioStore } from '../utils/portfolio'
import { useDialogStore, type DialogOption } from '../utils/store'

export default function Dialog() {
    const { currentDialog, selectOption, clearDialog } = useDialogStore()
    const portfolioStore = usePortfolioStore()
    const [sliderValue, setSliderValue] = useState(50)

    if (!currentDialog) return null

    const handleNext = () => {
        if (currentDialog.next) {
            selectOption({
                text: 'Continue',
                next: currentDialog.next
            })
        } else {
            if (currentDialog.onEnd) currentDialog.onEnd(portfolioStore)
            clearDialog()
        }
    }

    const handleOption = (option: DialogOption) => {
        // If option has a slider, pass the slider value
        if (option.type === 'slider') {
            selectOption({ ...option, sliderValue })
        } else {
            selectOption(option)
        }

        if (!option.next && currentDialog.onEnd) {
            currentDialog.onEnd(portfolioStore)
        }
    }

    const handleBackdropClick = (event: React.MouseEvent | React.KeyboardEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key !== 'Escape') {
            return
        }
        clearDialog()
    }

    return (
        <div className="fixed inset-0 z-[999999999] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleBackdropClick}
                onKeyDown={handleBackdropClick}
                role="button"
                tabIndex={0}
                aria-label="Close dialog"
            />
            <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full mx-4 space-y-4">
                {/* Character name */}
                <h2 className="text-xl font-bold text-gray-900">
                    {currentDialog.character}
                </h2>

                {/* Dialog text */}
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                <p className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{
                    __html: currentDialog.text
                }} />

                {/* Options or Next button */}
                <div className="flex justify-end gap-3 pt-4">
                    {currentDialog.options ? (
                        // Show options if available
                        <div className="flex flex-col w-full gap-2">
                            {currentDialog.options.map((option) => (
                                option.type === 'slider' ? (
                                    <div key="slider-option" className="w-full">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>{option.minLabel || 'Min'}</span>
                                            <span>{option.maxLabel || 'Max'}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={option.min || 0}
                                            max={option.max || 100}
                                            value={sliderValue}
                                            onChange={(e) => setSliderValue(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="text-center text-sm text-gray-600 mt-2">
                                            Selected Value: {sliderValue}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleOption(option)}
                                            className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        key={`${option.text}-${option.next?.text}`}
                                        type="button"
                                        onClick={() => handleOption(option)}
                                        className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        {option.text}
                                    </button>
                                )
                            ))}
                        </div>
                    ) : (
                        // Show next button if no options
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            {currentDialog.next ? 'Next' : 'Close'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
