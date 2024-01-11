import {createContext, useContext, useState} from "react";
import {ChartData, Point} from "chart.js";
export interface SearchResult {
    '1. symbol': string;
    '2. name': string;
}

interface internalContextProps {
    timeScale: string;
    setTimeScale: React.Dispatch<React.SetStateAction<string>>;
    primaryBackgroundColor: string;
    secondaryBackgroundColor: string;
    primaryTextColor: string;
    secondaryTextColor: string;
    buttonClick: string,
    graphData: ChartData<"line", (number | Point | null)[], unknown>;
    setGraphData: React.Dispatch<React.SetStateAction<ChartData<'line'>>>;
    token: string;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

interface externalContextProps {
    selectedStock: null | SearchResult;
    setSelectedStock: React.Dispatch<React.SetStateAction<null | SearchResult>>;
    lightSwitch: boolean;
    setLightSwitch: React.Dispatch<React.SetStateAction<boolean>>;
}

type combinedContextProps = internalContextProps & externalContextProps;
const StockContext = createContext<combinedContextProps | undefined>(undefined);

export const useStockContext = () => {
    const context = useContext(StockContext);
    if (context === undefined) {
        throw new Error('useStockContext must be used within a StockProvider.')
    }
    return context;
};

export const StockProvider: React.FC<{children: React.ReactNode, externalProps: externalContextProps}> = ({children, externalProps}) => {
    const [timeScale, setTimeScale] = useState<string>('day'),
        primaryBackgroundColor = 'bg-stone-100 dark:bg-stone-950',
        secondaryBackgroundColor = 'bg-stone-200 dark:bg-stone-900',
        primaryTextColor = 'text-stone-950 dark:text-stone-100',
        secondaryTextColor = 'text-stone-400',
        buttonClick = 'bg-stone-950/0 dark:bg-stone-100/0 active:bg-stone-950/10 dark:active:bg-stone-100/10 hover:bg-stone-950/5 dark:hover:bg-stone-100/5 transition-[background-color_100ms_ease-in-out]',
        [graphData, setGraphData] = useState<ChartData<'line'>>({
            labels: [],
            datasets: [
                {
                    data: [],
                    fill: false,
                    borderColor: '',
                    tension: 0
                }
            ]
        }),
        token = localStorage.getItem('authToken') || '',
        [refresh, setRefresh] = useState<number>(0);

    const contextValue = {
        timeScale,
        setTimeScale,
        primaryBackgroundColor,
        secondaryBackgroundColor,
        primaryTextColor,
        secondaryTextColor,
        buttonClick,
        graphData,
        setGraphData,
        token,
        refresh,
        setRefresh,
        ...externalProps
    };

    return (
        <StockContext.Provider value={contextValue}>
            {children}
        </StockContext.Provider>
    );
};