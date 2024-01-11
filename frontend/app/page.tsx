'use client';

import {useAuth} from "@/app/hooks/useAuth";
import Connection from "@/components/connection";
import LightSwitch from "@/components/lightSwitch";
import {useState} from "react";
import SearchBar from "@/components/search";
import {SearchResult} from "./contexts/StockContext";
import SelectedStock from "@/components/selectedStock";
import {StockProvider} from "./contexts/StockContext";
import {SavedStocks} from "@/components/dashboard";
import Notifications from "@/components/notifications";
import LogOut from "@/components/logOut";

const Home = ():JSX.Element => {
  const isAuth = useAuth(),
      [selectedStock, setSelectedStock] = useState<null | SearchResult>(null),
      [lightSwitch, setLightSwitch] = useState<boolean>(false);

  const externalProps = {
        selectedStock,
        setSelectedStock,
        lightSwitch,
        setLightSwitch
  }

  if (isAuth === null) {
        return <main>Loading...</main>
  }

  return (
      <StockProvider externalProps={externalProps}>
          <main
              className={`m-auto w-screen h-screen ${lightSwitch ? 'bg-stone-100' : 'dark bg-stone-950'} display-mode-transition`}>
              <LightSwitch />
              {isAuth ?
                  <>
                      <section className={'m-auto w-full pt-[3vh] flex items-start justify-start mx-[3vh] space-x-[3vh]'}>
                          <Notifications />
                          <SearchBar />
                          <LogOut />
                      </section>
                      <section className={'m-auto pt-[6vh] flex justify-end'}>
                          <SavedStocks />
                            {selectedStock && <SelectedStock />}
                      </section>
                  </>
                  : <Connection />}
          </main>
      </StockProvider>
  )
}

export default Home;
