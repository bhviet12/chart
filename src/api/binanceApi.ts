import axios from "axios";
import type { ICandleStick } from "../utils/api";

export const GetCandles = async (currentTimeFrame: string, currentCoin: string): Promise<ICandleStick[]> => {
  try {
    const res = await axios.get<any[][]>(`https://api.binance.com/api/v3/klines?symbol=${currentCoin}&interval=${currentTimeFrame}`); // specify the correct type and URL
    const mappedData: ICandleStick[] = res.data.map(item => ({
      openTime: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: item[5],
      closeTime: item[6],
      quoteAssetVolume: item[7],
      numberOfTrades: item[8],
      takerBuyBaseAssetVolume: item[9],
      takerBuyQuoteAssetVolume: item[10],
      ignore: item[11],
      baseAssetVolume: item[5], // Assuming baseAssetVolume is the same as volume
      takerBuyVolume: item[9]   // Assuming takerBuyVolume is the same as takerBuyBaseAssetVolume
    }));
    return mappedData;
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

export const GetCryptoInfo = (currentCoin: string) => {
  return axios.get(`https://api.binance.com/api/v3/ticker?symbol=${currentCoin}`);
};

export const GetLiveCandle = (currentTimeFrame: string, currentCoin: string) => {
  return `wss://stream.binance.com:9443/ws/${currentCoin.toLowerCase()}@kline_${currentTimeFrame}`;
};
