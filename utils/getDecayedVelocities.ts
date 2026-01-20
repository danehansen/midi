const getVelocity = (start: number, decay: number, iterations: number) => Math.round(start * Math.pow(decay, iterations));

export default function getDecayedVelocities(start: number, decay: number): number[] {
  const velocities: number[] = [];
  let i = 1;
  while (getVelocity(start, decay, i)) {
    velocities.push(getVelocity(start, decay, i));
    i++;
  }
  return velocities;
}
