'use client';

import { useState } from 'react';
import {useStockContext} from "@/app/contexts/StockContext";

const Connection = () => {
    const [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        {primaryBackgroundColor, secondaryBackgroundColor, primaryTextColor, secondaryTextColor, buttonClick} = useStockContext();

    const connection = async (e:React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('authToken', data.token);
                window.location.href = '/';
            } else if (data.message === 'User already exists.') {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password}),
                });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className={`m-auto absolute w-screen h-screen flex-center flex-col ${primaryBackgroundColor} display-mode-transition bg-opacity-50 backdrop-blur-xl`}>
            <div className={`${secondaryBackgroundColor} drop-shadow-2xl display-mode-transition flex-center flex-col space-y-[3vh] p-[5vh] rounded-[3vh]`}>
                <div className={'flex-center flex-col'}>
                    <h1 className={`${primaryTextColor} display-mode-transition`}>Stocky</h1>
                    <h2 className={`${secondaryTextColor} display-mode-transition`}>Your favorite stocks app.</h2>
                </div>
                <form onSubmit={connection} className={'flex-center flex-col justify-start items-center'}>
                    <input type={'email'} placeholder={'email'} value={email}
                           onChange={(e) => setEmail(e.target.value)} className={`w-[30vh] ${primaryBackgroundColor} ${primaryTextColor} display-mode-transition px-[2.25vh] py-[1vh] rounded-[1.25vh] mb-[1vh]`}/>
                    <input type={'password'} placeholder={'password'} value={password}
                           onChange={(e) => setPassword(e.target.value)} className={`w-[30vh] ${primaryBackgroundColor} ${primaryTextColor} display-mode-transition px-[2.25vh] py-[1vh] rounded-[1.25vh] mb-[1vh]`}/>
                    <button type={'submit'} className={`${buttonClick} mt-[1vh] ${primaryTextColor} display-mode-transition font-medium w-[10vh] h-[4vh] rounded-[1.25vh] active:text-[1.25vh]`}>Connect!</button>
                </form>
            </div>
        </main>
    )
}

export default Connection;