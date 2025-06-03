import { useEffect, useState } from "react";
import { GetCandles, GetCryptoInfo, GetLiveCandle } from "./api/binanceApi";
import type { ICandleStick } from "./types/candle";
import { useWebSocket } from "./hooks/useWebSocket";
import CandleChart from "./components/CandleChart";
import TimeFrameSelector from "./components/TimeFrameSelector";
import "./styles/theme.css"; // Thêm file theme

function App() {
  const [candles, setCandles] = useState<ICandleStick[]>([]);
  const [timeFrame, setTimeFrame] = useState("1m");
  const [coin, setCoin] = useState("BTCUSDT");

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Áp dụng theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    GetCandles(timeFrame, coin).then(setCandles);
  }, [timeFrame, coin]);

  useEffect(() => {
    const interval = setInterval(() => {
      GetCryptoInfo(coin).then((res) => {
        console.log("📈 Giá hiện tại:", res.data);
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [coin]);

  useWebSocket(GetLiveCandle(timeFrame, coin), (data) => {
    const k = data.k;
    setCandles((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v),
      };
      return updated;
    });
  });

  return (
    <div className="app">
      <div className="header">
        <h1>Biểu đồ Bitcoin</h1>
      <button
        onClick={() => setIsDark((prev) => !prev)}
        style={{
        fontSize: "24px",
        background: "none",
        border: "none",
        cursor: "pointer",
        }}
        aria-label="Toggle theme"
>
        {isDark ? "🌙" : "☀️"}
</button>
      </div>
      <TimeFrameSelector currentTimeFrame={timeFrame} onChange={setTimeFrame} />
      <CandleChart data={candles} />
    </div>
  );
}

export default App;
