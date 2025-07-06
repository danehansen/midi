export default function getNormalized(low: number, high: number, value: number): number {
  return (value - low) / (high - low);
}