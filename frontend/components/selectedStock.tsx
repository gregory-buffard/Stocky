import {useEffect, useState} from "react";
import TimeScale from "@/components/timeScale";
import {useStockContext} from "@/app/contexts/StockContext";
import Graph from "@/components/stockGraph";
import Save from "@/components/save";

export interface StockTrends {
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '09. change': string;
    '10. change percent': string;
}

const SelectedStock = ():JSX.Element => {
    const [stockTrends, setStockTrends] = useState<null | StockTrends>(null),
        [changeColor, setChangeColor] = useState<string>('text-stone-100'),
        [graphColor, setGraphColor] = useState<string>('rgba(245, 245, 244, 1)'),
        [graphShadow, setGraphShadow] = useState<string>('rgba(245, 245, 244, 0.5)'),
        {selectedStock, setSelectedStock, primaryBackgroundColor, secondaryBackgroundColor, secondaryTextColor, lightSwitch, primaryTextColor} = useStockContext(),
        [shadow, setShadow] = useState<string>('[filter:drop-shadow(0_0.75vh_0.1vh_rgba(255,_255,_255,_0.25)]');

    const fetchMarketStatus = async (): Promise<void> => {
        if (selectedStock === null) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/market?symbol=${selectedStock["1. symbol"]}`);
            const data = await response.json();
            setStockTrends(data['Global Quote - DATA DELAYED BY 15 MINUTES']);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchMarketStatus();
    }, []);

    useEffect(() => {
        if (stockTrends == null) {
            setChangeColor('text-stone-100')
            setShadow('[filter:drop-shadow(0_0.75vh_0.1vh_rgba(255,_255,_255,_0.25)]')
        } else {
            setChangeColor(stockTrends["09. change"].startsWith('-') ? 'text-red-400' : 'text-green-400')
            stockTrends['09. change'].startsWith('-') ? setGraphColor('rgba(248, 113, 113, 1)') : setGraphColor('rgba(74, 222, 128, 1)');
            stockTrends['09. change'].startsWith('-') ? setGraphShadow('rgba(248, 113, 113, 0.5)') : setGraphShadow('rgba(74, 222, 128, 0.5)');
            stockTrends?.["09. change"].startsWith("-") ? setShadow('[filter:drop-shadow(0_0.75vh_0.5vh_rgba(248,_113,_113,_0.25))]') : setShadow('[filter:drop-shadow(0_0.75vh_0.5vh_rgba(74,_222,_128,_0.25))]');
        }
    }, [stockTrends]);

    if (selectedStock === null) {
        return <></>;
    }

    const stockDetails = [
        {
            'Open': stockTrends?.['02. open']
        },
        {
            'High': stockTrends?.['03. high']
        },
        {
            'Low': stockTrends?.['04. low']
        },
        {
            'Volume': stockTrends?.['06. volume']
        },
        {
            'Change': `${stockTrends?.['09. change']} / ${stockTrends?.['10. change percent']}`
        }
    ]

    return (
        <div className={`absolute m-auto top-0 ${primaryBackgroundColor} bg-opacity-50 dark:bg-opacity-50 backdrop-blur-xl w-screen h-screen display-mode-transition flex-center z-40`}>
            <div className={`m-auto w-5/6 h-5/6 ${secondaryBackgroundColor} drop-shadow-2xl rounded-[2vh] flex-center px-[5vh] display-mode-transition`}>
                <div className={'absolute w-full flex justify-end items-center top-0'}>
                        <button onClick={() => setSelectedStock(null)}
                                className={'fill-stone-400 dark:fill-stone-700 hover:fill-red-400 dark:hover:fill-red-400 [transition:fill_200ms_ease-in-out,_background-color_100ms_ease-in-out] w-[5vh] h-[5vh] mr-[1vh] mt-[1vh] group dark:bg-stone-100 bg-stone-700 bg-opacity-0 dark:bg-opacity-0 active:bg-opacity-10 dark:active:bg-opacity-10 rounded-[1.25vh] flex-center'}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" className={'group-active:w-2/3 w-full transition-[width_100ms_ease-in-out]'}>
                                <path
                                    d="M 23.773438 12 C 12.855437 12 12 12.854437 12 23.773438 L 12 40.226562 C 12 51.144563 12.855438 52 23.773438 52 L 40.226562 52 C 51.144563 52 52 51.145563 52 40.226562 L 52 23.773438 C 52 12.854437 51.145563 12 40.226562 12 L 23.773438 12 z M 21.167969 16 L 42.832031 16 C 47.625031 16 48 16.374969 48 21.167969 L 48 42.832031 C 48 47.625031 47.624031 48 42.832031 48 L 21.167969 48 C 16.374969 48 16 47.624031 16 42.832031 L 16 21.167969 C 16 16.374969 16.374969 16 21.167969 16 z M 25.636719 23.636719 C 25.124969 23.636719 24.613156 23.832156 24.222656 24.222656 C 23.441656 25.003656 23.441656 26.269781 24.222656 27.050781 L 29.171875 32 L 24.222656 36.949219 C 23.441656 37.730219 23.441656 38.996344 24.222656 39.777344 C 25.003656 40.558344 26.269781 40.558344 27.050781 39.777344 L 32 34.828125 L 36.949219 39.777344 C 37.730219 40.558344 38.996344 40.558344 39.777344 39.777344 C 40.558344 38.996344 40.558344 37.730219 39.777344 36.949219 L 34.828125 32 L 39.777344 27.050781 C 40.558344 26.269781 40.558344 25.003656 39.777344 24.222656 C 38.996344 23.441656 37.730219 23.441656 36.949219 24.222656 L 32 29.171875 L 27.050781 24.222656 C 26.660281 23.832156 26.148469 23.636719 25.636719 23.636719 z"></path>
                            </svg>
                        </button>
                </div>
                <div className={'w-2/3 h-full py-[7vh] flex-center flex-col space-y-[3vh]'}>
                    <Graph graphColor={graphColor} graphShadow={graphShadow}/>
                    <TimeScale/>
                </div>
                <div className={'w-1/3 h-full py-[7vh] flex flex-col justify-start items-end space-y-[3vh]'}>
                    <div className={'flex justify-start items-end flex-col space-y-[1vh]'}>
                        <div className={'flex justify-end items-center w-full space-x-[3vh]'}>
                            <div className={`w-[8vh] h-[8vh] fill-stone-400`}>
                                <Save selectedStock={selectedStock}/>
                            </div>
                            <div className={'bg-stone-950 w-[25vh] px-[2vh] py-[1vh] rounded-[1vh]'}>
                                <h1 className={`w-full text-right ${changeColor} digital font-normal display-mode-transition ${shadow}`}>{selectedStock['1. symbol']}</h1>
                            </div>
                        </div>
                        <h2 className={`${secondaryTextColor} font-medium display-mode-transition`}>{selectedStock["2. name"]}</h2>
                    </div>
                    <div className={`flex-center flex-col w-4/6 space-y-[1vh]`}>
                        {stockDetails.map((detail) => (
                            <div key={Object.keys(detail)[0]}
                                 className={`flex justify-between items-baseline w-full px-[0.75vh] py-[0.75vh] rounded-[1.25vh] ${primaryBackgroundColor} display-mode-transition`}>
                            <p className={secondaryTextColor}>{Object.keys(detail)[0]}</p>
                                <p className={`${Object.keys(detail)[0] === 'Change' ? changeColor : primaryTextColor} display-mode-transition`}>{Object.values(detail)[0]}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`flex flex-col justify-center items-start ${primaryBackgroundColor} rounded-[1.25vh] px-[2vh] py-[1.5vh] display-mode-transition`}>
                        <h2 className={`${secondaryTextColor} display-mode-transition`}>Price</h2>
                        <h1 className={changeColor}>{stockTrends?.['05. price']}$</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectedStock;