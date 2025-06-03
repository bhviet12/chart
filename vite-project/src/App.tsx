import React, { useCallback, useEffect, useState } from "react";
import ChartContainer from "./components/ChartContainer";
import TimeframeSelector from "./components/TimeFrameSelector";
import IndicatorToggle from "./components/IndicatorToggle";
import ThemeToggle from "./components/ThemeToggle";
import PriceButton from "./components/PriceButton";
import CoinSelector from "./components/CoinSelector";
import { useBinanceWS } from "./hooks/useBinanceWS";    
import { calcRSI, calcEMA } from "./utils/indicators";
import { GetCandles, ICandleStick } from "./utils/api";

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];

const DEFAULT_COIN = "BTCUSDT";

function App() {
  // State quản lý theme (dark/light)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // State quản lý coin và timeframe
  const [coin, setCoin] = useState<string>(DEFAULT_COIN);
  const [interval, setInterval] = useState<string>("1m");

  // State lưu dữ liệu nến
  const [klines, setKlines] = useState<ICandleStick[]>([]);

  // State quản lý indicator
  const [indicators, setIndicators] = useState<{ rsi: boolean; ema: boolean }>({
    rsi: true,
    ema: true,
  });

  // Fetch nến lịch sử (REST API) khi đổi coin hoặc timeframe
  const loadInitKlines = useCallback(async (tf: string, c: string) => {
    const result = await GetCandles(tf, c);
    setKlines(result);
  }, []);

  useEffect(() => {
    loadInitKlines(interval, coin);
  }, [interval, coin, loadInitKlines]);

  // Lắng nghe dữ liệu realtime qua WebSocket, chỉ cập nhật nếu có nến mới hoặc nến hiện tại thay đổi
  useBinanceWS(interval, coin, (newCandle: ICandleStick) => {
    setKlines((prev) => {
      if (!prev.length) return [newCandle];
      // Nếu nến cuối cùng là cùng timestamp thì replace, ngược lại thì thêm vào
      if (prev[prev.length - 1].openTime === newCandle.openTime) {
        return [...prev.slice(0, -1), newCandle];
      } else {
        return [...prev.slice(-199), newCandle];
      }
    });
  });

  // Tính toán indicator theo yêu cầu
  const closes = klines.map((k) => k.close);
  const rsiData = indicators.rsi ? calcRSI(closes) : undefined;
  const emaData = indicators.ema ? calcEMA(closes) : undefined;

  // Đồng bộ theme cho <html>
  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : "";
  }, [theme]);

 return (
    <div className="min-h-screen flex flex-col items-center py-4 transition-colors duration-300">
      <div className="w-full max-w-3xl space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Crypto Chart</span>
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              Realtime - Binance
            </span>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </header>
        {/* Bộ chọn coin, timeframe, indicator, giá */}
        <div className="flex gap-2 flex-wrap items-center">
          <CoinSelector current={coin} setCurrent={setCoin} />
          <TimeframeSelector
            current={interval}
            setCurrent={setInterval}
            timeframes={TIMEFRAMES}
          />
          <PriceButton coin={coin} interval={interval} />
          <IndicatorToggle indicators={indicators} setIndicators={setIndicators} />
        </div>
        {/* Biểu đồ */}
        <ChartContainer
          data={klines}
          rsi={rsiData}
          ema={emaData}
          theme={theme}
        />
      </div>
      <footer className="pt-6 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} | Crypto Realtime Chart | Powered by Binance API
      </footer>
    </div>
  );
}

export default App;