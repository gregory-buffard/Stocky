import {useStockContext} from "@/app/contexts/StockContext";

const timeScales = ['lifetime', 'year', 'month', 'week', 'day'];

const TimeScale = (): JSX.Element => {
    const {timeScale, setTimeScale, primaryBackgroundColor, primaryTextColor, secondaryBackgroundColor, setGraphData} = useStockContext();

    // Please do not judge me for this, it's TailwindCSS' JIT fault,
    // because dynamic rendering isn't a thing apparently...
    const buttonOffset = {
        'lifetime': 'translate-x-0',
        'year': 'translate-x-[9vh]',
        'month': 'translate-x-[18vh]',
        'week': 'translate-x-[27vh]',
        'day': 'translate-x-[36vh]'
    }

    return (
        <div className={`${primaryBackgroundColor} rounded-[1.25vh] px-[0.75vh] py-[0.75vh] flex justify-between items-center text-[1.6vh] display-mode-transition`}>
            {timeScales.map((scale) => (
                    <button key={scale} onClick={() => setTimeScale(scale)} className={`${primaryTextColor} display-mode-transition w-[9vh] font-normal time-scale-button z-10`}>{scale.charAt(0).toUpperCase() + scale.slice(1)}</button>
            ))}
            <div className={`absolute z-0 ${secondaryBackgroundColor} [transition:transform_200ms_ease-in-out,_background-color_500ms_ease-in-out,_color_500ms_ease-in-out] duration-200 ease-in-out m-0 w-[9vh] font-normal bg-red-400 text-transparent px-[1vh] py-[0.5vh] rounded-[1vh] ${buttonOffset[timeScale as keyof typeof buttonOffset]}`}>{timeScale.charAt(0).toUpperCase() + timeScale.slice(1)}</div>
        </div>
    )
}

export default TimeScale;