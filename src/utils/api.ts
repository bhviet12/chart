import axios from "axios";

export type ICandleStick = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  baseAssetVolume: number;
  numberOfTrades: number;
  takerBuyVolume: number;
  takerBuyBaseAssetVolume: number;
  ignore: number;
};

export const GetCandles = async (
  currentTimeFrame: string,
  currentCoin: string
): Promise<ICandleStick[]> => {
  try {
    const response = await axios.get<
      [number, string, string, string, string, string, number, string, number, string, string, string][]
    >(
      `https://api.binance.com/api/v3/klines?symbol=${currentCoin}&interval=${currentTimeFrame}&limit=200`
    );
    return response.data.map((item) => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
      closeTime: item[6],
      baseAssetVolume: parseFloat(item[7]),
      numberOfTrades: item[8],
      takerBuyVolume: parseFloat(item[9]),
      takerBuyBaseAssetVolume: parseFloat(item[10]),
      ignore: parseFloat(item[11]),
    }));
  } catch (error) {
    console.error("Error fetching candlestick data:", error);
    return [];
  }
};

export const GetCryptoInfo = (currentCoin: string) => {
  return axios.get(`https://api.binance.com/api/v3/ticker?symbol=${currentCoin}`);
};

export const GetLiveCandle = (currentTimeFrame: string, currentCoin: string) => {
  return `wss://stream.binance.com:9443/ws/${currentCoin.toLowerCase()}@kline_${currentTimeFrame}`;
};

export const cryptoCoins = [
  { cryptoName: "BTCUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" },
  { cryptoName: "ETHUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" },
  { cryptoName: "SOLUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png" },
  { cryptoName: "DOTUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png" },
  { cryptoName: "BNBUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" },
  { cryptoName: "LINKUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png" },
  { cryptoName: "CAKEUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png" },
  { cryptoName: "MATICUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
  { cryptoName: "OMUSDT", cryptoImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
];

export const getCryptoImage = (getCoin: string) => {
  const coin = cryptoCoins.find((crypto) => crypto.cryptoName === getCoin);
  return coin ? coin.cryptoImage : null;
};

export const unixToDate = (unix: number) => {
  return new Date(unix).toLocaleString();
};
