import {useStockContext} from "@/app/contexts/StockContext";

const LogOut = ():JSX.Element => {
    const {lightSwitch, buttonClick} = useStockContext();

    const logOut = ():void => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    }

    return (
        <button onClick={() => logOut()} className={`${buttonClick} fill-stone-400 w-[4.5vh] h-[4.5vh] group flex-center px-[0.5vh] py-[0.5vh] rounded-[1.25vh]`}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" className={'w-full group-active:w-2/3 transition-[width_100ms_ease-in-out]'}>
                <path
                    d="M 22 9 C 18.69 9 16 11.69 16 15 L 16 49 C 16 52.31 18.69 55 22 55 L 42 55 C 45.31 55 48 52.31 48 49 L 48 42.019531 C 47.632 42.387531 46.365 43.982 44 44 L 44 49 C 44 50.1 43.1 51 42 51 L 22 51 C 20.9 51 20 50.1 20 49 L 20 15 C 20 13.9 20.9 13 22 13 L 42 13 C 43.1 13 44 13.9 44 15 L 44 20 C 46.371 20.018 47.643 21.623469 48 21.980469 L 48 15 C 48 11.69 45.31 9 42 9 L 22 9 z M 43.941406 22.998047 C 43.429406 22.999922 42.91925 23.197844 42.53125 23.589844 C 41.75325 24.373844 41.757016 25.641922 42.541016 26.419922 L 46.146484 30 L 30.949219 30 C 29.845219 30 28.949219 30.896 28.949219 32 C 28.949219 33.104 29.845219 34 30.949219 34 L 46.146484 34 L 42.541016 37.580078 C 41.757016 38.359078 41.75325 39.624203 42.53125 40.408203 C 42.92225 40.802203 43.434219 41 43.949219 41 C 44.459219 41 44.970375 40.807922 45.359375 40.419922 L 52.408203 33.419922 C 52.786203 33.044922 53 32.533 53 32 C 53 31.467 52.786203 30.956078 52.408203 30.580078 L 45.359375 23.580078 C 44.967375 23.190578 44.453406 22.996172 43.941406 22.998047 z"></path>
            </svg>
        </button>
    )
}

export default LogOut;