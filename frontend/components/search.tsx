import {useEffect, useState, useRef} from "react";
import debounce from 'lodash/debounce';
import {SearchResult, useStockContext} from "@/app/contexts/StockContext";

const SearchBar = (): JSX.Element => {
    const [query, setQuery] = useState<string>(''),
        [results, setResults] = useState<SearchResult[]>([]),
        {selectedStock, setSelectedStock, secondaryBackgroundColor, primaryTextColor, secondaryTextColor} = useStockContext();

    const fetchResults = async (searchQuery:string): Promise<void> => {
        if (!searchQuery) {
            setResults([]);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/search?keywords=${query}`);
            const data = await response.json();
            setResults(data.bestMatches);
        } catch (error) {
            console.error(error);
            setResults([]);
        }
    };

    const debouncedFetchResults = debounce(fetchResults, 300);

    useEffect(() => {
        debouncedFetchResults(query);

        return () => {
            debouncedFetchResults.cancel();
        };
    }, [query])


    const handleStockSelection = (stock:SearchResult) => {
        setSelectedStock(stock);
    }

    return (
        <div className={'w-1/4 z-10'}>
            <div className={'flex justify-end items-center'}>
                <input type={'text'} value={query} onChange={(e) => setQuery(e.target.value)}
                       placeholder={'Look up stocks...'}
                       className={`w-full ${secondaryBackgroundColor} ${primaryTextColor} display-mode-transition px-[2.25vh] py-[1vh] rounded-t-[1.25vh] ${results.length > 0 ? 'rounded-b-0 border-b-[0.1vh] border-stone-300 dark:border-stone-700' : 'rounded-b-[1.25vh]'} placeholder-stone-400 h-[4.5]`}/>
                <button onClick={() => setQuery('')} className={'absolute translate-x-[-0.5vh] w-[3.5vh] h-[3.5vh] fill-stone-400 hover:fill-stone-700 dark:hover:fill-stone-100 transition-[fill] duration-200 ease-in-out'}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64">
                        <path
                            d="M 32 10 C 19.85 10 10 19.85 10 32 C 10 44.15 19.85 54 32 54 C 44.15 54 54 44.15 54 32 C 54 19.85 44.15 10 32 10 z M 32 14 C 41.941 14 50 22.059 50 32 C 50 41.941 41.941 50 32 50 C 22.059 50 14 41.941 14 32 C 14 22.059 22.059 14 32 14 z M 25.636719 23.636719 C 25.124969 23.636719 24.613156 23.832156 24.222656 24.222656 C 23.441656 25.003656 23.441656 26.269781 24.222656 27.050781 L 29.171875 32 L 24.222656 36.949219 C 23.441656 37.730219 23.441656 38.996344 24.222656 39.777344 C 25.003656 40.558344 26.269781 40.558344 27.050781 39.777344 L 32 34.828125 L 36.949219 39.777344 C 37.730219 40.558344 38.996344 40.558344 39.777344 39.777344 C 40.558344 38.996344 40.558344 37.730219 39.777344 36.949219 L 34.828125 32 L 39.777344 27.050781 C 40.558344 26.269781 40.558344 25.003656 39.777344 24.222656 C 38.996344 23.441656 37.730219 23.441656 36.949219 24.222656 L 32 29.171875 L 27.050781 24.222656 C 26.660281 23.832156 26.148469 23.636719 25.636719 23.636719 z"></path>
                    </svg>
                </button>
            </div>
            <div
                className={`absolute flex flex-col justify-start items-start w-1/4 ${secondaryBackgroundColor} ${results.length > 0 ? 'px-[1.25vh] pb-[1.25vh] pt-[0.75vh] rounded-b-[1.25vh]' : ''} display-mode-transition`}>
                {results.length > 0 && results.map((result, index) => (
                    <button key={index} onClick={() => handleStockSelection(result)}
                            className={'flex items-baseline justify-between w-full hover:bg-stone-300 hover:dark:bg-stone-700 px-[1vh] py-[0.5vh] mt-[0.5vh] rounded-[1vh]'}>
                        <p className={`${primaryTextColor} display-mode-transition`}>{result['1. symbol']}</p>
                        <h6 className={`${secondaryTextColor} display-mode-transition text-right`}>{result['2. name']}</h6>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SearchBar;