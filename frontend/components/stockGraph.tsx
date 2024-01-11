import {useStockContext} from "@/app/contexts/StockContext";
import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {ChartData, ChartOptions, TimeScale} from "chart.js";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

Chart.register(TimeScale);

interface TTimeSeriesEntry {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
}

interface APIResponse {
    'Meta Data': {
        '1. Information': string;
        '2. Symbol': string;
        '3. Last Refreshed': string;
        '4. Interval': string;
        '5. Output Size': string;
        '6. Time Zone': string;
    };
    'Time Series (5min)'?: {
        [key: string]: TTimeSeriesEntry;
    };
    'Time Series (60min)'?: {
        [key: string]: TTimeSeriesEntry;
    };
    'Time Series (Daily)'?: {
        [key: string]: TTimeSeriesEntry;
    };
}

const Graph = ({graphColor, graphShadow}: {graphColor: string, graphShadow: string}):JSX.Element => {
    const {timeScale, selectedStock, primaryBackgroundColor, primaryTextColor, secondaryTextColor, lightSwitch, graphData, setGraphData} = useStockContext(),
    [unit, setUnit] = useState<any>('');

    useEffect(() => {
        if (!selectedStock) {
            return;
        }
        const fetchData = async () => {
            console.log(timeScale)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/time-series?symbol=${selectedStock['1. symbol']}&timeScale=${timeScale}`);
            const data = await response.json() as APIResponse | any;
            if (data['Error Message']) {
                alert("Alpha Vantage doesn't support this time scale for selected stock.");
            }
            setGraphData(formatGraphData(data));
        };

        fetchData();

        return () => setGraphData({
            labels: [],
            datasets: [
                {
                    data: [],
                    fill: false,
                    borderColor: '',
                    tension: 0
                }
            ]
        })
    }, [selectedStock, timeScale, graphColor]);

    const formatGraphData = (data: APIResponse):ChartData<'line'> => {
        const graphLabels: string[] = [],
        graphData: number[] = [],
        now = new Date();
        let cutOff, timeSeries;

        switch (timeScale) {
            case 'day':
                cutOff = new Date(now.setHours(now.getHours() - 24));
                setUnit('hour');
                timeSeries = data['Time Series (5min)'];
                break;
            case 'week':
                cutOff = new Date(now.setDate(now.getDate() - 7));
                setUnit('day');
                timeSeries = data['Time Series (60min)'];
                break;
            case 'month':
                cutOff = new Date(now.setMonth(now.getMonth() - 1));
                setUnit('day');
                timeSeries = data['Time Series (Daily)'];
                break;
            case 'year':
                cutOff = new Date(now.setFullYear(now.getFullYear() - 1));
                setUnit('month');
                timeSeries = data['Time Series (Daily)'];
                break;
            case 'lifetime':
                cutOff = new Date(now.setFullYear(now.getFullYear() - 20));
                setUnit('year');
                timeSeries = data['Time Series (Daily)'];
                break;
        }

        if (timeSeries) {
            for (const [key, value] of Object.entries(timeSeries).reverse()) {
                const timeKey = new Date(key);
                if (!cutOff) {
                    cutOff = timeKey;
                }
                if (timeKey >= cutOff) {
                    graphLabels.push(key);
                    graphData.push(parseFloat(value['4. close']));
                }
            }
        }

        return {
            labels: graphLabels,
            datasets: [
                {
                    backgroundColor: (context:any) => {
                        if (!context.chart.chartArea) {
                            return;
                        }
                        const {ctx, data, chartArea: {top, bottom}} = context.chart,
                            gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                        gradientBg.addColorStop(0, graphShadow);
                        gradientBg.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        return gradientBg;
                    },
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round',
                    borderWidth: 5,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBorderWidth: 0,
                    pointHoverRadius: 0,
                    data: graphData,
                    fill: true,
                    borderColor: graphColor,
                    tension: 0.3
                }
            ]
        }
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        animation: {
            duration: 3000,
            easing: 'easeInOutQuint',
            delay: 0
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                bodyFont: {
                    size: 18,
                    weight: 'bold'
                },
                displayColors: false,
                yAlign: 'bottom',
                caretPadding: 10,
                caretSize: 0,
                backgroundColor: `${lightSwitch ? '#0c0a09' : '#f5f5f4'}`,
                titleFont: {
                    weight: 'lighter',
                    size: 12
                },
                titleColor: '#a8a29e',
                bodyColor: `${lightSwitch ? '#f5f5f4' : '#0c0a09'}`,
                padding: 10,
            }
        },
        scales: {
            x: {
                type: 'time',
                border: {
                    display: false
                },
                time: {
                    unit: unit,
                },
                grid: {
                    display: false
                },
                ticks: {
                    padding: 25,
                    font: {
                        size: 12
                    },
                    color: '#a8a29e',
                }
            },
            y: {
                border: {
                    display: false
                },
                grid: {
                    display: false
                },
                ticks: {
                    padding: 25,
                    font: {
                        size: 12
                    },
                    color: '#a8a29e'
                }
            }
        }
    };

    return (
        <div className={`w-full h-full ${primaryBackgroundColor} px-[5vh] py-[3vh] rounded-[1.25vh] flex-center display-mode-transition`}>
            <Line data={graphData} options={options} className={'w-full'} />
        </div>
    )
}

export default Graph;