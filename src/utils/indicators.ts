import { RSI, EMA } from "technicalindicators";

export function calcRSI(closes: number[], period = 14): (number | undefined)[] {
  const arr = Array(closes.length).fill(undefined);
  const rsi = RSI.calculate({ values: closes, period });
  for (let i = 0; i < rsi.length; ++i) arr[i + period] = rsi[i];
  return arr;
}

export function calcEMA(closes: number[], period = 21): (number | undefined)[] {
  const arr = Array(closes.length).fill(undefined);
  const ema = EMA.calculate({ values: closes, period });
  for (let i = 0; i < ema.length; ++i) arr[i + period - 1] = ema[i];
  return arr;
}
