import {useEffect, useState} from "react";
import axios from "axios";
import {useStockContext} from "@/app/contexts/StockContext";

interface INotification {
    message: string;
    date: Date;
    _id: string;
}

class DateTimeFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    timeZoneName?: 'long' | 'short';
    hour12?: boolean;
    timeZone?: string;
}

const Notifications = ():JSX.Element => {
    const [notifications, setNotifications] = useState<INotification[]>([]),
        [notificationsOpen, setNotificationsOpen] = useState<boolean>(false),
        {token, buttonClick, secondaryBackgroundColor, primaryTextColor, primaryBackgroundColor, secondaryTextColor} = useStockContext();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {headers: {Authorization: `Bearer ${token}`}});
                console.log('Notifications:', response.data.notifications)
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [token]);

    const formatDate = (date: Date) => {
        const options:DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const deleteNotification = async (notificationId: string): Promise<void> => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`, {headers: {Authorization: `Bearer ${token}`}});
            console.log('Notification deleted:', response.data);
            setNotifications(notifications?.filter(notification => notification._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    return (
        <div>
            <button onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`${buttonClick} group fill-stone-400 w-[4.5vh] h-[4.5vh] rounded-[1.25vh] px-[0.5vh] py-[0.5vh] flex-center`}>
                {notifications && notifications.length > 0 ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={'w-full group-active:w-2/3 transition-[width_100ms_ease-in-out]'}>
                        <g id="Artboard_1" data-name="Artboard – 1">
                            <path id="icons8-new-message"
                                  d="M16,15a6,6,0,0,0-6,6V42a6,6,0,0,0,6,6H36.01a14.363,14.363,0,0,1,.42-4H16a2.006,2.006,0,0,1-2-2V21.193L26.273,32.852a7.614,7.614,0,0,0,10.488,0L49,21.227V33.07a14.68,14.68,0,0,1,4,.15V21a6,6,0,0,0-6-6Zm1.5,4H45.535L34.008,29.951a3.614,3.614,0,0,1-4.979,0Zm33,17A11.5,11.5,0,1,0,62,47.5,11.5,11.5,0,0,0,50.5,36Zm0,5A1.5,1.5,0,0,1,52,42.5V46h3.5a1.5,1.5,0,0,1,0,3H52v3.5a1.5,1.5,0,0,1-3,0V49H45.5a1.5,1.5,0,0,1,0-3H49V42.5A1.5,1.5,0,0,1,50.5,41Z"
                                  transform="translate(-4 -5)"/>
                            <path id="icons8-new-message-2" data-name="icons8-new-message" className={'fill-blue-500'}
                                  d="M50.5,36A11.5,11.5,0,1,0,62,47.5,11.5,11.5,0,0,0,50.5,36Zm0,5A1.5,1.5,0,0,1,52,42.5V46h3.5a1.5,1.5,0,0,1,0,3H52v3.5a1.5,1.5,0,0,1-3,0V49H45.5a1.5,1.5,0,0,1,0-3H49V42.5A1.5,1.5,0,0,1,50.5,41Z"
                                  transform="translate(-4 -5)"/>
                        </g>
                    </svg>

                    : <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" className={'w-full group-active:w-2/3 transition-[width_100ms_ease-in-out]'}>
                        <path
                            d="M 15 14 C 11.691 14 9 16.691 9 20 L 9 44 C 9 47.309 11.691 50 15 50 L 49 50 C 52.309 50 55 47.309 55 44 L 55 20 C 55 16.691 52.309 14 49 14 L 15 14 z M 16.349609 18 L 47.652344 18 L 35.443359 29.597656 C 33.513359 31.432656 30.486641 31.432656 28.556641 29.597656 L 16.349609 18 z M 13 20.337891 L 25.800781 32.498047 C 27.538781 34.149047 29.77 34.974609 32 34.974609 C 34.23 34.974609 36.460219 34.148047 38.199219 32.498047 L 51 20.337891 L 51 44 C 51 45.103 50.103 46 49 46 L 15 46 C 13.897 46 13 45.103 13 44 L 13 20.337891 z"></path>
                    </svg>}
            </button>
            <div className={'absolute m-auto h-max bottom-0 left-0 flex justify-end flex-col w-[29vh] z-10'}>
                {notificationsOpen ?
                    <div className={`${secondaryBackgroundColor} display-mode-transition bg-opacity-50 dark:bg-opacity-50 backdrop-blur-xl rounded-[2vh] w-full h-[25vh] mx-[3vh] my-[3vh] overflow-x-hidden`}>
                        {notifications.length > 0 ?
                            <div className={'w-full pl-[2vh] pr-[1vh] pt-[2vh] pb-[1.5vh] h-full flex-col justify-start items-start overflow-y-scroll'}>
                                <h2 className={`${primaryTextColor} font-bold mb-[1vh] display-mode-transition`}>Unread:</h2>
                                {notifications?.map((notification, index) => (
                                    <div key={index} className={'w-full flex justify-between items-stretch flex-nowrap group mb-[0.5vh]'}>
                                        <div
                                            className={`${primaryBackgroundColor} display-mode-transition w-[25vh] py-[1vh] px-[1.5vh] rounded-[1.25vh] drop-shadow-lg group-hover:w-[21vh] transition-[width_200ms_ease-in-out] whitespace-nowrap`}>
                                            <p className={`${primaryTextColor} z-10 display-mode-transition`}>{notification.message}</p>
                                            <h6 className={`${secondaryTextColor} z-10 display-mode-transition`}>{formatDate(notification.date)}</h6>
                                        </div>
                                        <button onClick={() => deleteNotification(notification._id)}
                                                className={'w-0 group-hover:w-[4vh] bg-red-600 flex-center rounded-[1.25vh] fill-red-400 active:bg-red-300 [transition:width_200ms_ease-in-out,_filter_200ms_ease-in-out,_background-color_100ms_ease-in-out] [filter:_drop-shadow(-1vh_0_1vh_rgba(220,_38,_38,_0))] hover:[filter:_drop-shadow(-1vh_0_1vh_rgba(220,_38,_38,_0.5))] group'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64"
                                                 className={'w-2/3 group-active:w-1/2 transition-[width_100ms_ease-in-out]'}>
                                                <path
                                                    d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            : <div className={'flex-center h-full w-full'}>
                                <h2 className={`${secondaryTextColor} display-mode-transition`}>Nothing here now!</h2>
                            </div>}
                    </div>
                    : <></>}
            </div>
        </div>
    )
}

export default Notifications;