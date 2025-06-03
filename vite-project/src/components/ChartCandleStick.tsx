// import { ColorType, createChart } from "lightweight-charts";
// import { useEffect, useRef } from "react";
// import { GetCandles } from "../api/binanceApi"; // dùng đường dẫn ngắn
// import type { ICandleStick } from "../api/binanceApi";

// function ChartCandleStick() {
//   const chartContainerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     let chart: ReturnType<typeof createChart> | null = null;

//     const fetchDataAndRenderChart = async () => {
//       console.log("📦 Chart container ref:", chartContainerRef.current);
//       try {
//         const candleData: ICandleStick[] = await GetCandles("1d", "BTCUSDT");
//          console.log("📈 Candle data:", candleData);
//         const formattedData = candleData.map((item) => {
//           const date = new Date(item.openTime);
//           const yyyy = date.getUTCFullYear();
//           const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
//           const dd = String(date.getUTCDate()).padStart(2, '0');

//           return {
//             time: `${yyyy}-${mm}-${dd}` as const, // required format
//             open: item.open,
//             high: item.high,
//             low: item.low,
//             close: item.close,
//           };
//         });

//         if (chartContainerRef.current) {
//           chart = createChart(chartContainerRef.current, {
//             layout: {
//               background: { type: ColorType.Solid, color: "#000000" },
//               textColor: "#ffffff",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 500,
//           });

//           const newSeries = chart.addCandlestickSeries({
//             upColor: "red",
//             downColor: "green",
//             borderVisible: false,
//             wickUpColor: "red",
//             wickDownColor: "green",
//           });

//           newSeries.setData(formattedData);
//         }
//       } catch (error) {
//         console.error("Error fetching or rendering chart:", error);
//       }
//     };

//     fetchDataAndRenderChart();

//     return () => {
//       chart?.remove();
//     };
//   }, []);

//   return <div ref={chartContainerRef} className="h-[500px]" />;
// }

// export default ChartCandleStick;
