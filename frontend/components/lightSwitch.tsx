import light from '@/public/iconography/light.svg';
import dark from '@/public/iconography/dark.svg';
import Image from 'next/image';
import {useState} from "react";
import {useStockContext} from "@/app/contexts/StockContext";

const LightSwitch = ():JSX.Element => {
        const [lightSwitchInteraction, setLightSwitchInteraction] = useState<boolean>(false),
            {lightSwitch, setLightSwitch} = useStockContext();

    return (
        <div className={'absolute z-50 right-0 top-[3vh]'}>
            <button
                className={`[transition:transform_200ms,background-color_1000ms] ease-in-out ${lightSwitch ? 'bg-stone-950' : 'bg-stone-100'} w-[8vh] h-[5vh] rounded-l-[1vh] flex-center ${lightSwitchInteraction ? 'translate-x-0' : 'translate-x-[5vh]'}`} onMouseEnter={() => setLightSwitchInteraction(true)} onMouseLeave={() => setLightSwitchInteraction(false)} onClick={() => setLightSwitch(!lightSwitch)}>
                <div className={'flex-center space-x-[0.5vh] w-[3.5vh] h-full'} >
                    <div className={'light-switch-handle'}></div>
                    <div className={'light-switch-handle'}></div>
                </div>
                <div className={'flex-center flex-col overflow-hidden space-x-[0.5vh] w-[5vh] h-full'}>
                    <div className={`${lightSwitch ? 'translate-y-[-2.5vh]' : 'translate-y-[2.5vh]'} transition-transform duration-1000 ease-in-out`}>
                        <Image src={light} alt={'Light mode'} className={'h-[5vh] w-[5vh] p-[0.9vh]'} />
                        <Image src={dark} alt={'Dark mode'} className={'h-[5vh] w-[5vh] p-[1vh]'} />
                    </div>
                </div>
            </button>
        </div>
    )
}

export default LightSwitch;