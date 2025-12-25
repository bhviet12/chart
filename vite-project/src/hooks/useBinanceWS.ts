// hooks/useBinanceWS.ts
import { useEffect, useRef } from "react";
import type { ICandleStick } from "../utils/api";
import { GetLiveCandle } from "../utils/api";

export function useBinanceWS(
  interval: string,
  coin: string,
  onNewData: (data: ICandleStick) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsURL = GetLiveCandle(interval, coin);
    const ws = new WebSocket(wsURL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      const k = json.k;
      if (!k) return;
      const candle: ICandleStick = {
        openTime: k.t,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v),
        closeTime: k.T,
        baseAssetVolume: parseFloat(k.q),
        numberOfTrades: k.n,
        takerBuyVolume: parseFloat(k.V),
        takerBuyBaseAssetVolume: parseFloat(k.Q),
        ignore: 0,
      };
      onNewData(candle);
    };

    ws.onerror = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [interval, coin, onNewData]);
}
