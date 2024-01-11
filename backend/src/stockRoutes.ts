import express from "express";
import axios from "axios";
import User from "./models/User";
import {UserRequest} from "./types";
import authenticate from "./middleware";

const router = express.Router();

export const getStocks = async (keywords: string): Promise<any> => {
    if (!keywords) {
        return null;
    }

    const url = `${process.env.ALPHA_VANTAGE_API_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            console.log('Status:', response.status);
            throw new Error('Error fetching data.');
        }
        return response.data;
    } catch (error) {
        console.log('Error:', error);
        throw new Error('Server error.');
    }
}

router.get('/search', async (req, res) => {
    const keywords = req.query.keywords as string;

    if (!keywords) {
        return res.status(400).send('Keywords are required.');
    }

    try {
        const response = await getStocks(keywords);
        res.json(response);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Server error.');
    }
})

export const marketStatus = async (symbol: string): Promise<any> => {
    if (!symbol) {
        return null;
    }

    const url = `${process.env.ALPHA_VANTAGE_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            console.error('Error fetching data.')
            throw new Error('Error fetching data.')
        }
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Server error.')
    }
}

router.get('/market', async (req, res) => {
    const symbol = req.query.symbol as string;

    if (!symbol) {
        return res.status(400).send('Stock symbol is required.');
    }

    try {
        const response = await marketStatus(symbol);
        res.json(response);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Server error.');
    }
});

router.get('/time-series', async (req, res) => {
    const {symbol, timeScale} = req.query;

    let functionType;
    let url;
    switch (timeScale) {
        case 'day':
            functionType = 'TIME_SERIES_INTRADAY';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&interval=5min&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            break;
        case 'week':
            functionType = 'TIME_SERIES_INTRADAY';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&interval=60min&outputsize=full&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            break;
        case 'month':
            functionType = 'TIME_SERIES_DAILY_ADJUSTED';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            break;
        case 'year':
            functionType = 'TIME_SERIES_DAILY_ADJUSTED';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&outputsize=full&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            break;
        case 'lifetime':
            functionType = 'TIME_SERIES_DAILY_ADJUSTED';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&outputsize=full&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            break;
        default:
            functionType = 'TIME_SERIES_INTRADAY';
            url = `${process.env.ALPHA_VANTAGE_API_URL}?function=${functionType}&symbol=${symbol}&interval=5min&entitlement=delayed&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    }

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.log('Error fetching time series data:', error);
        res.status(500).send('Server error.');
    }
})

router.get('/is-saved', authenticate, async (req: UserRequest, res) => {
    if (!req.user) {
        return res.status(401).send({message: 'Unauthorized.'});
    }

    const userId = req.user._id;
    const symbol = req.query.symbol as string;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('User not found.');
        }

        const symbolSaved = user.stocks.some(stock => stock.symbol === symbol);
        res.status(200).send({isSaved: symbolSaved});
    } catch (error) {
        res.status(500).send({message: 'Error saved symbol.'});
    }
});

router.post('/save', authenticate, async (req:UserRequest, res) => {
    if (!req.user) {
        return res.status(401).send({message: 'Unauthorized.'});
    }

    const userId = req.user._id;
    const {symbol} = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const symbolSaved = user.stocks.some(stock => stock.symbol === symbol);

        if (symbolSaved) {
            await User.findByIdAndUpdate(userId, {$pull: {stocks: {symbol}}});
            res.status(200).send({message: 'Stock unsaved.'})
        } else {
            await User.findByIdAndUpdate(userId, {$addToSet: {stocks: {symbol}}});
            res.status(200).send({message: 'Stock saved.'})
        }
    } catch (error) {
        res.status(500).send({message: 'Error saving/unsaving stock.'});
    }
});

router.get('/saved', authenticate, async (req: UserRequest, res) => {
    if (!req.user) {
        return res.status(401).send({message: 'Unauthorized.'});
    }

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: 'User not found.'});
        }

        const symbols = user.stocks.map(stock => stock.symbol);
        const marketData = symbols.map(symbol => getStocks(symbol));
        const marketDataResponse = await Promise.all(marketData);

        const formattedResults = marketDataResponse.map(data => ({
            '1. symbol': data.bestMatches[0]['1. symbol'],
            '2. name': data.bestMatches[0]['2. name'],
        }));

        res.json(formattedResults);
    } catch (error) {
        res.status(500).send({message: 'Error fetching saved stocks.'})
    }
})

export default router;