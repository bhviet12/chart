interface Props {
  currentTimeFrame: string;
  onChange: (value: string) => void;
}

const TimeFrameSelector = ({ currentTimeFrame, onChange }: Props) => {
  const options = ["1m", "5m", "30m", "1h", "4h", "1d"];

  return (
    <select value={currentTimeFrame} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default TimeFrameSelector;
