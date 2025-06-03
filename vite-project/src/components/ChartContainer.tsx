import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, UTCTimestamp } from "lightweight-charts";
import { ICandleStick } from "../utils/api";

type Props = {
  data: ICandleStick[];
  rsi?: (number | undefined)[];
  ema?: (number | undefined)[];
  theme: "light" | "dark";
};

export default function ChartContainer({ data, rsi, ema, theme }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Xóa chart cũ
    if (chartInstance.current) {
      chartInstance.current.remove();
      chartInstance.current = null;
    }

    // Tạo chart mới
    const chart = createChart(chartRef.current, {
      height: 400,
      layout: {
        background: { color: theme === "dark" ? "#131722" : "#FFFFFF" },
        textColor: theme === "dark" ? "#D9D9D9" : "#191919",
      },
      grid: {
        vertLines: { color: theme === "dark" ? "#363c4e" : "#eee" },
        horzLines: { color: theme === "dark" ? "#363c4e" : "#eee" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.3 } },
    });

    // Candlestick
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(
      data.map((k) => ({
        time: Math.floor(k.openTime / 1000) as UTCTimestamp,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      }))
    );

    // Volume
    const volumeSeries = chart.addHistogramSeries({
      color: "#2962FF",
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.7, bottom: 0 },
    });
    volumeSeries.setData(
      data.map((k) => ({
        time: Math.floor(k.openTime / 1000) as UTCTimestamp,
        value: k.volume,
        color: k.close > k.open ? "#26a69a" : "#ef5350",
      }))
    );

    // EMA
    if (ema && ema.length) {
      const emaSeries = chart.addLineSeries({
        color: "#FFA500",
        lineWidth: 1.5,
      });
      emaSeries.setData(
        data.map((k, i) => ({
          time: Math.floor(k.openTime / 1000) as UTCTimestamp,
          value: ema[i] || undefined,
        }))
      );
    }

    // RSI - (Xem chú thích cuối)
    // Lightweight-charts chỉ support 1 pane, nếu muốn pane phụ (RSI) thì custom thêm dưới hoặc dùng bản pro

    chartInstance.current = chart;

    // Responsive
    const handleResize = () => {
      if (chartRef.current) {
        chart.resize(chartRef.current.clientWidth, 400);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, theme, rsi, ema]);

  return (
    <div className="w-full h-[400px] bg-white dark:bg-neutral-900 border rounded-2xl shadow-lg overflow-hidden">
      <div ref={chartRef} className="w-full h-[400px]" />
    </div>
  );
}
