import cron from 'node-cron';
import User from "./models/User";
import {marketStatus} from "./stockRoutes";

const checkStockPrices = async () => {
    const users = await User.find({'stocks.0': {$exists: true}});

    for (const user of users) {
        for (const stock of user.stocks) {
            try {
                const response = await marketStatus(stock.symbol);
                const changePercent = parseFloat(response['Global Quote - DATA DELAYED BY 15 MINUTES']['10. change percent'].slice(0, -1));
                if (Math.abs(changePercent) >= 10) {
                    console.log('sending notification')
                    const message = `${stock.symbol} changed by ${changePercent}%.`;
                    user.notifications.push({message: message, date: new Date()});
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        await user.save();
    }
}

cron.schedule('0 0 * * *', checkStockPrices);