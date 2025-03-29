// Frog is a real estate agent

import { useState } from "react";
import Sensor from "../components/Sensor";
import Flamingo from "../models/Flamingo";
import { Html } from "@react-three/drei";
import type { Dialog } from "../utils/store";
import { useDialogStore } from "../utils/store";
// import Bob from "../models/Bob";

type Action = 'CharacterArmature|Death' | 'CharacterArmature|Duck' | 'CharacterArmature|HitReact' | 'CharacterArmature|Idle' | 'CharacterArmature|Idle_Gun' | 'CharacterArmature|Jump' | 'CharacterArmature|Jump_Idle' | 'CharacterArmature|Jump_Land' | 'CharacterArmature|No' | 'CharacterArmature|Punch' | 'CharacterArmature|Run' | 'CharacterArmature|Run_Gun' | 'CharacterArmature|Run_Gun_Shoot' | 'CharacterArmature|Walk' | 'CharacterArmature|Walk_Gun' | 'CharacterArmature|Wave' | 'CharacterArmature|Weapon' | 'CharacterArmature|Yes'

export default function RealEstate({
    position,
    rotation,
    action,
    dialog,
}: {
    position: [number, number, number],
    rotation: [number, number, number],
    action?: Action,
    dialog: Dialog,
}) {
    const [currentAction, setCurrentAction] = useState<Action>(action || 'CharacterArmature|HitReact')
    const { setDialog } = useDialogStore()
    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <group
            position={position}
            rotation={rotation}
            onClick={() => setDialog(dialog)}
        >
            <Html
                position={[0, 3.5, 0]}
                center
                scale={0.05}
            >
                <div className="relative select-none">
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-xl relative text-center border-2 border-gray-200">
                        <div className="text-2xl font-black text-red-500 animate-bounce">!</div>

                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 
                            border-l-[10px] border-l-transparent
                            border-t-[12px] border-t-white 
                            border-r-[10px] border-r-transparent
                            after:absolute after:top-[-14px] after:left-[-10px]
                            after:border-l-[10px] after:border-l-transparent
                            after:border-t-[12px] after:border-t-gray-200
                            after:border-r-[10px] after:border-r-transparent">
                        </div>
                    </div>
                </div>
            </Html>
            <Sensor
                onEnter={() => {
                    // console.log("Enter")
                    setCurrentAction('CharacterArmature|Wave')
                }}
                onLeave={() => {
                    // console.log("Leave")
                    setCurrentAction('CharacterArmature|HitReact')
                }}
            >
                <Flamingo
                    action={currentAction}
                />
            </Sensor>
        </group>
    )
}