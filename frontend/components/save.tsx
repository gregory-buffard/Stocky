import axios from "axios";
import {SearchResult, useStockContext} from "@/app/contexts/StockContext";
import {useEffect, useState} from "react";

const Save = ({selectedStock}: {selectedStock: SearchResult}):JSX.Element => {
    const {token, refresh, setRefresh, setSelectedStock} = useStockContext(),
        [isSaved, setIsSaved] = useState<boolean | null>(null);
    const save = async (selectedStock: string) => {
        try {
            setIsSaved(!isSaved);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/save`, {symbol: selectedStock}, {headers: {Authorization: `Bearer ${token}`}});
            setRefresh(refresh + 1);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error saving stock:', error.response?.data.message);
            } else {
                console.log('An unexpected error occurred:', error);
            }
        }
    }

    const checkSaved = async (selectedStock: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/is-saved?symbol=${selectedStock}`, {headers: {Authorization: `Bearer ${token}`}});
            return response.data.isSaved;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error checking save status:', error.response?.data?.message || error.message)
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }

    useEffect(() => {
        const init = async () => {
            const status = await checkSaved(selectedStock['1. symbol']);
            setIsSaved(status);
        };

        if (selectedStock) {
            init();
        }
    }, [selectedStock]);

    if (isSaved === null) {
        return <></>;
    }

    return (
        <button onClick={() => save(selectedStock['1. symbol'])}
                className={'w-full h-full flex-center bg-stone-700 dark:bg-stone-100 active:bg-opacity-10 dark:active:bg-opacity-10 bg-opacity-0 dark:bg-opacity-0 transition-[background-color_100ms_ease-in-out] rounded-[1.25vh] group'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.553 128"  className={'w-2/5 group-active:w-1/4 transition-[width_100ms_ease-in-out]'}>
                <g id="savedState" transform="translate(-239 -306)">
                    <path id="notSaved" d="M265.1,308.12H241.663V420.65l32.748-30.662L307.8,422.563V308.12Z"
                          transform="translate(4.998 3.979)"
                          className={`${isSaved ? 'fill-stone-400' : 'fill-transparent'} transition-[fill_200ms_ease-in-out]`} />
                    <path id="saved"
                          d="M84.595,21.508H31.947A2.454,2.454,0,0,0,29.5,23.959v93.1a.967.967,0,0,0,1.64.693L55.754,93.87a3.611,3.611,0,0,1,5.026,0L85.4,117.749a.964.964,0,0,0,1.637-.69v-93.1a2.454,2.454,0,0,0-2.44-2.454Zm0-11.508A13.961,13.961,0,0,1,98.553,23.956V131.728a6.266,6.266,0,0,1-10.63,4.5L58.277,107.461,28.63,136.23a6.266,6.266,0,0,1-10.63-4.5V23.962A13.962,13.962,0,0,1,31.959,10Z"
                          transform="translate(221 296)"/>
                </g>
            </svg>

        </button>
    )
}

export default Save;