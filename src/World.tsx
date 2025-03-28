// The world... import ./models/[model].tsx to construct the world

import { RigidBody } from '@react-three/rapier'
import Cityboyjj from './models/Cityboyjj'
import RealEstate from './characters/RealEstate'
import type { Dialog } from './utils/store'
import { useDialogStore } from './utils/store'

// import type { PortfolioState } from './utils/portfolio'
import BobCharacter from './characters/Bob'
import Flamingo from './characters/Flamingo'
import { Model as Goose } from './models/Goose'
import playSound from './utils/sound'
import { useGameStore } from './utils/gameState'
import { usePortfolioStore } from "./utils/portfolio";


// type Action = 'CharacterArmature|Death' | 'CharacterArmature|Duck' | 'CharacterArmature|HitReact' | 'CharacterArmature|Idle' | 'CharacterArmature|Idle_Gun' | 'CharacterArmature|Jump' | 'CharacterArmature|Jump_Idle' | 'CharacterArmature|Jump_Land' | 'CharacterArmature|No' | 'CharacterArmature|Punch' | 'CharacterArmature|Run' | 'CharacterArmature|Run_Gun' | 'CharacterArmature|Run_Gun_Shoot' | 'CharacterArmature|Walk' | 'CharacterArmature|Walk_Gun' | 'CharacterArmature|Wave' | 'CharacterArmature|Weapon' | 'CharacterArmature|Yes'

export default function World() {
    const { endGame } = useGameStore()

    return (
        <>
            <group scale={4}>
                {/* Ground and static elements */}
                <RigidBody type="fixed" colliders="trimesh">
                    <Cityboyjj />
                </RigidBody>
            </group>
            <RealEstate
                position={[-16, -6, -15]}
                rotation={[0, 2.5 * Math.PI / 2, 0]}
                dialog={house1Dialog}
            />
            <RealEstate
                position={[-17, 2, 61]}
                rotation={[0, 2.5 * Math.PI / 2, 0]}
                dialog={house2Dialog}
            />
            <Flamingo
                position={[15, -0.5, -18]}
                rotation={[0, 0, 0]}
                dialog={hotdogStandDialog}
            />
            <Flamingo
                position={[14.3, -6, -25.5]}
                rotation={[0,  Math.PI, 0]}
                dialog={carDialog}
            />
            <Flamingo
                position={[-12.5, -4.3, 7.2]}
                rotation={[0, Math.PI, 0]}
                dialog={restaurantInvestmentDialog}
            />
            <BobCharacter
                position={[31, 0.2, 40.5]}
                rotation={[0, 9 * Math.PI / 7, 0]}
                dialog={bobDialog}
            />
            <RigidBody
                type="fixed"
                colliders="trimesh"
                onCollisionEnter={({ rigidBody }) => {
                    console.log(rigidBody)
                    rigidBody?.setLinvel({ x: 0, y: 50, z: 0 }, true)
                    const interval = setInterval(() => {
                        playSound('/sound/quack.mp3')
                    }, 300)
                    setTimeout(() => {
                        console.log('Game Over')
                        endGame()
                        clearInterval(interval)
                    }, 2000)
                }}
            // onCollisionExit={({ rigidBody }) => {
            //     rigidBody?.resetForces(true)
            // }}
            >
                <Goose
                    position={[64, 4.8, 62]}
                    rotation={[0, 0, 0]}
                    scale={0.08}
                />
            </RigidBody>
        </>
    )
}

const bobDialog: Dialog = {
    stage: "playground",
    character: "Jerry not the Killer",
    text: "Hi there! I'm Jerry not the Killer. I heard there was a stash of cash hidden behind the building after me. I heard it was over a billion dollars.",
    options: [
        {
            text: "Omg free money?",
            next: {
                stage: "playground",
                character: "Jerry not the Killer",
                text: "You dropped your crown king 👑.",
            }
        }
    ]
}

const house1Dialog: Dialog = {
    stage: "buyRentSimulation",
    character: "Financial Advisor Frog",
    text: "Let's help you analyze whether buying or renting makes more sense for you!",
    options: [
        {
            text: "Start Buy/Rent Analysis",
            next: {
                stage: "buyRentSimulation",
                character: "Financial Advisor Frog",
                text: "It seems that you are in Waterloo, Ontario, where the average price for a home of this size is $700,000.",
                options: [
                    {
                        text: "Next",
                        next: {
                            stage: "buyRentSimulation",
                            character: "Financial Advisor Frog",
                            text: "Currently, mortgage interest rates are around 6.5%. We'll use this rate for your analysis.",
                            options: [
                                {
                                    text: "Next",
                                    next: {
                                        stage: "buyRentSimulation",
                                        character: "Financial Advisor Frog",
                                        text: "What down payment percentage can you make?",
                                        options: [
                                            {
                                                type: 'slider',
                                                text: 'Down Payment Percentage',
                                                min: 3,
                                                max: 50,
                                                minLabel: '3%',
                                                maxLabel: '50%',
                                                next: {
                                                    stage: "buyRentSimulation",
                                                    character: "Financial Advisor Frog",
                                                    text: "Fun fact: The typical down payment for a first-time buyer is around 6%, while repeat buyers average closer to 17%. On to the next question!",
                                                    options: [
                                                        {
                                                            text: "Next",
                                                            next: {
                                                                stage: "buyRentSimulation",
                                                                character: "Financial Advisor Frog",
                                                                text: "How long will your mortgage term be?",
                                                                options: [
                                                                    {
                                                                        type: 'slider',
                                                                        text: 'Loan Term',
                                                                        min: 10,
                                                                        max: 40,
                                                                        minLabel: '10 years',
                                                                        maxLabel: '40 years',
                                                                        next: {
                                                                            stage: "buyRentSimulation",
                                                                            character: "Financial Advisor Frog",
                                                                            text: "Here's a tip: Shorter loan terms have higher monthly payments but save you a lot in interest over the loan period!",
                                                                            options: [
                                                                                {
                                                                                    text: "Next",
                                                                                    next: {
                                                                                        stage: "buyRentSimulation",
                                                                                        character: "Financial Advisor Frog",
                                                                                        text: "What's the equivalent monthly rent for a similar property?",
                                                                                        options: [
                                                                                            {
                                                                                                type: 'slider',
                                                                                                text: 'Monthly Rent',
                                                                                                min: 500,
                                                                                                max: 5000,
                                                                                                minLabel: '$500',
                                                                                                maxLabel: '$5000',
                                                                                                next: {
                                                                                                    stage: "buyRentSimulation",
                                                                                                    character: "Financial Advisor Frog",
                                                                                                    text: "Did you know? Renting often includes utilities, which can add up to $200–$500 in monthly expenses when buying. Let’s move on!",
                                                                                                    options: [
                                                                                                        {
                                                                                                            text: "Next",
                                                                                                            next: {
                                                                                                                stage: "buyRentSimulation",
                                                                                                                character: "Financial Advisor Frog",
                                                                                                                text: "How many years do you plan to stay?",
                                                                                                                options: [
                                                                                                                    {
                                                                                                                        type: 'slider',
                                                                                                                        text: 'Length of Stay',
                                                                                                                        min: 1,
                                                                                                                        max: 20,
                                                                                                                        minLabel: '1 year',
                                                                                                                        maxLabel: '20 years',
                                                                                                                        next: {
                                                                                                                            stage: "buyRentSimulation",
                                                                                                                            character: "Financial Advisor Frog",
                                                                                                                            text: "I am done! Click 'See Results' to analyze your decision.",
                                                                                                                            options: [
                                                                                                                                {
                                                                                                                                    text: "See Results",
                                                                                                                                    next: {
                                                                                                                                        stage: "results",
                                                                                                                                        character: "Financial Advisor Frog",
                                                                                                                                        text: `
                                                                                                                                            Buying vs Renting Analysis: Step 1

                                                                                                                                            <strong>Buying a House:</strong>
                                                                                                                                            • Monthly mortgage payment: $2,456.78
                                                                                                                                            • Upfront costs: $140,000.00 (down payment)
                                                                                                                                            • Property value growth: $735,000.00
                                                                                                                                            • Total costs after 5 years: $147,406.80
                                                                                                                                            • Equity after 5 years: $247,593.20
                                                                                                                                        `,
                                                                                                                                        options: [
                                                                                                                                            {
                                                                                                                                                text: "Next: Renting Analysis",
                                                                                                                                                next: {
                                                                                                                                                    stage: "results",
                                                                                                                                                    character: "Financial Advisor Frog",
                                                                                                                                                    text: `
                                                                                                                                                        Buying vs Renting Analysis: Step 2

                                                                                                                                                        <strong>Renting:</strong>
                                                                                                                                                        • Total rent paid: $168,000.00 over 5 years
                                                                                                                                                        • Savings growth: $157,500.00
                                                                                                                                                    `,
                                                                                                                                                    options: [
                                                                                                                                                        {
                                                                                                                                                            text: "Purchase House and Close",
                                                                                                                                                            action: () => {
                                                                                                                                                                // Add the house value to the portfolio
                                                                                                                                                                const houseValue = 700000; // Hardcoded value for this house
                                                                                                                                                                const { totalCash, setTotalCash, propertiesOwned, setPropertiesOwned } = usePortfolioStore.getState();
                                                                                                                                                                setPropertiesOwned(propertiesOwned + 1);
                                                                                                                                                                setTotalCash(totalCash - houseValue);

                                                                                                                                                                // Clear the dialog
                                                                                                                                                                useDialogStore.getState().clearDialog();
                                                                                                                                                            },
                                                                                                                                                        },
                                                                                                                                                    ],
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                        ],
                                                                                                                                    },
                                                                                                                                },
                                                                                                                            ],
                                                                                                                        },
                                                                                                                    },
                                                                                                                ],
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};

const house2Dialog: Dialog = {
    stage: "buyRentSimulation",
    character: "Franklin the Real Estate Frog",
    text: "Hi there! I'm Franklin, your friendly neighborhood real estate advisor. Let’s help you analyze whether buying or renting this spacious home makes more sense for you!",
    options: [
        {
            text: "Start Buy/Rent Analysis",
            next: {
                stage: "buyRentSimulation",
                character: "Franklin the Real Estate Frog",
                text: "It seems that you’re looking at a beautiful 5-bedroom house priced at $950,000.",
                options: [
                    {
                        text: "Next",
                        next: {
                            stage: "buyRentSimulation",
                            character: "Franklin the Real Estate Frog",
                            text: "Currently, mortgage interest rates are around 6.5%. We'll use this rate for your analysis.",
                            options: [
                                {
                                    text: "Next",
                                    next: {
                                        stage: "buyRentSimulation",
                                        character: "Franklin the Real Estate Frog",
                                        text: "What down payment percentage can you make?",
                                        options: [
                                            {
                                                type: 'slider',
                                                text: 'Down Payment Percentage',
                                                min: 3,
                                                max: 50,
                                                minLabel: '3%',
                                                maxLabel: '50%',
                                                next: {
                                                    stage: "buyRentSimulation",
                                                    character: "Franklin the Real Estate Frog",
                                                    text: "Fun fact: The typical down payment for a first-time buyer is around 6%, while repeat buyers average closer to 17%. On to the next question!",
                                                    options: [
                                                        {
                                                            text: "Next",
                                                            next: {
                                                                stage: "buyRentSimulation",
                                                                character: "Franklin the Real Estate Frog",
                                                                text: "How long will your mortgage term be?",
                                                                options: [
                                                                    {
                                                                        type: 'slider',
                                                                        text: 'Loan Term',
                                                                        min: 10,
                                                                        max: 40,
                                                                        minLabel: '10 years',
                                                                        maxLabel: '40 years',
                                                                        next: {
                                                                            stage: "buyRentSimulation",
                                                                            character: "Franklin the Real Estate Frog",
                                                                            text: "Here's a tip: Shorter loan terms have higher monthly payments but save you a lot in interest over the loan period!",
                                                                            options: [
                                                                                {
                                                                                    text: "Next",
                                                                                    next: {
                                                                                        stage: "buyRentSimulation",
                                                                                        character: "Franklin the Real Estate Frog",
                                                                                        text: "What's the equivalent monthly rent for a similar property?",
                                                                                        options: [
                                                                                            {
                                                                                                type: 'slider',
                                                                                                text: 'Monthly Rent',
                                                                                                min: 500,
                                                                                                max: 6000,
                                                                                                minLabel: '$500',
                                                                                                maxLabel: '$6000',
                                                                                                next: {
                                                                                                    stage: "buyRentSimulation",
                                                                                                    character: "Franklin the Real Estate Frog",
                                                                                                    text: "Did you know? Renting often includes utilities, which can add up to $200–$500 in monthly expenses when buying. Let’s move on!",
                                                                                                    options: [
                                                                                                        {
                                                                                                            text: "Next",
                                                                                                            next: {
                                                                                                                stage: "buyRentSimulation",
                                                                                                                character: "Franklin the Real Estate Frog",
                                                                                                                text: "How many years do you plan to stay?",
                                                                                                                options: [
                                                                                                                    {
                                                                                                                        type: 'slider',
                                                                                                                        text: 'Length of Stay',
                                                                                                                        min: 1,
                                                                                                                        max: 20,
                                                                                                                        minLabel: '1 year',
                                                                                                                        maxLabel: '20 years',
                                                                                                                        next: {
                                                                                                                            stage: "buyRentSimulation",
                                                                                                                            character: "Franklin the Real Estate Frog",
                                                                                                                            text: "I am done! Click 'See Results' to analyze your decision.",
                                                                                                                            options: [
                                                                                                                                {
                                                                                                                                    text: "See Results",
                                                                                                                                    next: {
                                                                                                                                        stage: "results",
                                                                                                                                        character: "Franklin the Real Estate Frog",
                                                                                                                                        text: `
                                                                                                                                            Buying vs Renting Analysis: Step 1

                                                                                                                                            <strong>Buying a House:</strong>
                                                                                                                                            • Monthly mortgage payment: $3,124.56
                                                                                                                                            • Upfront costs: $190,000.00 (down payment)
                                                                                                                                            • Property value growth: $1,050,000.00
                                                                                                                                            • Total costs after 5 years: $187,473.60
                                                                                                                                            • Equity after 5 years: $282,526.40
                                                                                                                                        `,
                                                                                                                                        options: [
                                                                                                                                            {
                                                                                                                                                text: "Next: Renting Analysis",
                                                                                                                                                next: {
                                                                                                                                                    stage: "results",
                                                                                                                                                    character: "Franklin the Real Estate Frog",
                                                                                                                                                    text: `
                                                                                                                                                        Buying vs Renting Analysis: Step 2

                                                                                                                                                        <strong>Renting:</strong>
                                                                                                                                                        • Total rent paid: $192,000.00 over 5 years
                                                                                                                                                        • Savings growth: $225,000.00
                                                                                                                                                    `,
                                                                                                                                                    options: [
                                                                                                                                                        {
                                                                                                                                                            text: "Purchase House and Close",
                                                                                                                                                            action: () => {
                                                                                                                                                                // Add the house value to the portfolio
                                                                                                                                                                const houseValue = 950000; // Hardcoded value for this house
                                                                                                                                                                const { totalCash, setTotalCash, propertiesOwned, setPropertiesOwned } = usePortfolioStore.getState();
                                                                                                                                                                setPropertiesOwned(propertiesOwned + 1);
                                                                                                                                                                setTotalCash(totalCash + houseValue);

                                                                                                                                                                // Clear the dialog
                                                                                                                                                                useDialogStore.getState().clearDialog();
                                                                                                                                                            },
                                                                                                                                                        },
                                                                                                                                                    ],
                                                                                                                                                },
                                                                                                                                            },
                                                                                                                                        ],
                                                                                                                                    },
                                                                                                                                },
                                                                                                                            ],
                                                                                                                        },
                                                                                                                    },
                                                                                                                ],
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};


const carDialog: Dialog = {
    stage: "carLeaseSimulation",
    character: "Car Expert Turtle",
    text: "Welcome! Let’s explore whether leasing or buying this car makes more sense for you.",
    options: [
        {
            text: "Start Lease/Buy Analysis",
            next: {
                stage: "carLeaseSimulation",
                character: "Car Expert Turtle",
                text: "The car you’re looking at is priced at $30,000.",
                options: [
                    {
                        text: "Next",
                        next: {
                            stage: "carLeaseSimulation",
                            character: "Car Expert Turtle",
                            text: "Unfortunately, it seems you don’t have enough cash to purchase this car outright.",
                            options: [
                                {
                                    text: "What are my options?",
                                    next: {
                                        stage: "carLeaseSimulation",
                                        character: "Car Expert Turtle",
                                        text: "You can lease the car with a 10% down payment. This means you’ll pay $3,000 upfront and lease the remaining amount.",
                                        options: [
                                            {
                                                text: "How does leasing work?",
                                                next: {
                                                    stage: "carLeaseSimulation",
                                                    character: "Car Expert Turtle",
                                                    text: "Leasing involves smaller monthly payments, but you don’t own the car outright at the end unless you buy it for its residual value. Let’s calculate the details.",
                                                    options: [
                                                        {
                                                            type: 'slider',
                                                            text: 'Choose Lease Term (in months)',
                                                            min: 12,
                                                            max: 60,
                                                            minLabel: '12 months',
                                                            maxLabel: '60 months',
                                                            next: {
                                                                stage: "carLeaseSimulation",
                                                                character: "Car Expert Turtle",
                                                                text: "I am done! Click 'See Results' to analyze your decision.",
                                                                options: [
                                                                    {
                                                                        text: "See Results",
                                                                        next: {
                                                                            stage: "results",
                                                                            character: "Car Expert Turtle",
                                                                            text: `
                                                                                Lease Analysis: Step 1

                                                                                <strong>Leasing the Car:</strong>
                                                                                • Car price: $30,000.00
                                                                                • Down payment: $3,000.00 (10%)
                                                                                • Lease term: 36 months
                                                                                • Monthly lease payment: $350.00
                                                                                • Residual value after lease: $12,000.00
                                                                                • Total cost after 3 years: $15,600.00 (including residual buyout)
                                                                            `,
                                                                            options: [
                                                                                {
                                                                                    text: "Next: Lease Summary",
                                                                                    next: {
                                                                                        stage: "results",
                                                                                        character: "Car Expert Turtle",
                                                                                        text: `
                                                                                            Lease Analysis: Step 2

                                                                                            <strong>Summary:</strong>
                                                                                            • Total paid upfront: $3,000.00
                                                                                            • Total lease payments over 3 years: $12,600.00
                                                                                            • Total cost if purchased after lease ends: $15,600.00
                                                                                        `,
                                                                                        options: [
                                                                                            {
                                                                                                text: "Finalize Lease and Close",
                                                                                                action: () => {
                                                                                                    // Deduct the down payment and lease payments from the user's assets
                                                                                                    const downPayment = 3000; // 10% of car price
                                                                                                    const leasePayments = 12600; // Total lease payments over 3 years
                                                                                                    const { totalCash, setTotalCash } = usePortfolioStore.getState();
                                                                                                    setTotalCash(totalCash - (downPayment));

                                                                                                    // Clear the dialog
                                                                                                    useDialogStore.getState().clearDialog();

                                                                                                    console.log(
                                                                                                        `User leased the car. Down payment: $${downPayment}, Lease payments: $${leasePayments}`
                                                                                                    );
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};


const hotdogStandDialog: Dialog = {
    stage: "investmentSimulation",
    character: "Hotdog Vendor",
    text: "Welcome! I'm running a small hotdog stand. It's a low-risk and cheap investment opportunity. However, the returns are also modest—you’ll only own a 5% stake in the business.",
    options: [
        {
            text: "Tell me more about the investment.",
            next: {
                stage: "investmentSimulation",
                character: "Hotdog Vendor",
                text: "For just $1,000, you can own 5% of my stand. I'll manage the day-to-day operations, and you'll earn a steady profit from sales.",
                options: [
                    {
                        text: "That sounds fair. I’ll invest.",
                        next: {
                            stage: "investmentSimulation",
                            character: "Hotdog Vendor",
                            text: "Great choice! Let’s finalize the investment. With 5% ownership, your returns will grow steadily over time.",
                            options: [
                                {
                                    text: "Finalize Investment",
                                    action: () => {
                                        const daysToFastForward = 50; // Fast-forward days
                                        const returnPercentage = 0.05; // 5% ownership
                                        const dailyRevenue = 200; // Daily revenue for the stand
                                        const totalRevenue = dailyRevenue * daysToFastForward; // Revenue over 50 days
                                        const profit = totalRevenue * returnPercentage; // Investor's share of the revenue

                                        // Access and update the portfolio store
                                        const { totalCash, setTotalCash } = usePortfolioStore.getState();
                                        setTotalCash(totalCash + profit); // Add the profit to assets

                                        // Fast-forward days (assuming a day-tracking system)
                                        

                                        // Log the details (optional)
                                        console.log(
                                            `Investment finalized. You earned $${profit.toFixed(
                                                2
                                            )} over ${daysToFastForward} days.`
                                        );
                                    },
                                    next: {
                                        stage: "investmentResult",
                                        character: "Hotdog Vendor",
                                        text: `
                                            Congratulations! Over 50 days, your investment of $1,000 earned you $500 in returns.
                                            
                                            <strong>Summary:</strong>
                                            • Total investment: $1,000
                                            • Days elapsed: 50
                                            • Profit earned: $500
                                            • Total assets increased by: $500
                                        `,
                                        options: [
                                            {
                                                text: "Close",
                                                action: () => useDialogStore.getState().clearDialog(),
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        text: "I’m not interested right now.",
                        next: {
                            stage: "investmentSimulation",
                            character: "Hotdog Vendor",
                            text: "No problem! If you change your mind, I’ll be here grilling hotdogs.",
                            options: [
                                {
                                    text: "Close",
                                    action: () => useDialogStore.getState().clearDialog(),
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};

const restaurantInvestmentDialog: Dialog = {
    stage: "investmentSimulation",
    character: "Ambitious Chef",
    text: "Greetings! I’m opening a high-end restaurant, and I’m looking for investors. It’s a high-risk, high-reward opportunity, and I’m offering 30% equity in the business.",
    options: [
        {
            text: "Tell me more about the investment.",
            next: {
                stage: "investmentSimulation",
                character: "Ambitious Chef",
                text: "The investment cost is $20,000. The potential returns could be massive, but there’s also a chance that the business might not succeed. Are you ready to take the risk?",
                options: [
                    {
                        text: "I’m interested. Let’s proceed.",
                        next: {
                            stage: "investmentSimulation",
                            character: "Ambitious Chef",
                            text: "Fantastic! Let’s finalize the investment. You’ll own 30% equity in the restaurant, but remember, this is a high-risk venture.",
                            options: [
                                {
                                    text: "Finalize Investment",
                                    action: () => {
                                        const investmentAmount = 20000; // Investment cost

                                        // Access and update the portfolio store
                                        const { totalCash, setTotalCash } = usePortfolioStore.getState();

                                        // Deduct the investment amount from total Cash
                                        setTotalCash(totalCash - investmentAmount);

                                        // Fast-forward days (if needed)
                

                                        // Log the loss
                                        console.log(
                                            `Investment failed. You lost $${investmentAmount.toFixed(2)}.`
                                        );
                                    },
                                    next: {
                                        stage: "investmentResult",
                                        character: "Ambitious Chef",
                                        text: `
                                            Unfortunately, the restaurant failed to take off, and you lost your investment.

                                            <strong>Summary:</strong>
                                            • Total investment: $20,000
                                            • Days elapsed: 100
                                            • Return on investment: $0
                                            • Loss: $20,000
                                        `,
                                        options: [
                                            {
                                                text: "Close",
                                                action: () => useDialogStore.getState().clearDialog(),
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        text: "This is too risky for me.",
                        next: {
                            stage: "investmentSimulation",
                            character: "Ambitious Chef",
                            text: "That’s fair. Not everyone has the appetite for high-risk investments. If you change your mind, I’ll be here sharpening my knives.",
                            options: [
                                {
                                    text: "Close",
                                    action: () => useDialogStore.getState().clearDialog(),
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};
