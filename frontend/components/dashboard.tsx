import {useEffect, useState} from "react";
import axios from "axios";
import {useStockContext, SearchResult} from "@/app/contexts/StockContext";

export const SavedStocks = ():JSX.Element => {
    const [stocks, setStocks] = useState<SearchResult[]>([]),
        {refresh, setRefresh, token, setSelectedStock, secondaryBackgroundColor, primaryTextColor, secondaryTextColor} = useStockContext();

    useEffect(() => {
        const fetchSavedStocks = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/saved`, {headers: {Authorization: `Bearer ${token}`}});
                setStocks(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Something went wrong.');
            }
        }

        fetchSavedStocks();
    }, [refresh, token]);

    return (
        <div className={`${secondaryBackgroundColor} w-1/4 flex flex-col justify-start items-start px-[1.25vh] pb-[1.25vh] pt-[0.25vh] rounded-[1.25vh] mx-[3vh] display-mode-transition`}>
            <h2 className={`${primaryTextColor} font-bold px-[1vh] py-[1vh] display-mode-transition`}>Saved stocks</h2>
            {stocks.map((stock, index) => (
                <button onClick={() => setSelectedStock(stock)} key={index} className={'w-full flex justify-between items-baseline hover:bg-stone-300 hover:dark:bg-stone-700 px-[1vh] py-[0.5vh] mt-[0.5vh] rounded-[1vh]'}>
                    <p className={`${primaryTextColor} display-mode-transition`}>{stock['1. symbol']}</p>
                    <p className={`${secondaryTextColor} display-mode-transition`}>{stock['2. name']}</p>
                </button>
            ))}
        </div>
    )
}

export const RandomPicks = ():JSX.Element => {
    return (
        <></>
    )
}