export type Ease = (t: number) => number; // t = number 0-1

export const linear: Ease = (t: number) => t;

export const outQuad: Ease = (t: number) => Math.pow(t, 2);
export const outCubic: Ease = (t: number) => Math.pow(t, 3);
export const outQuart: Ease = (t: number) => Math.pow(t, 4);
export const outQuint: Ease = (t: number) => Math.pow(t, 5);
export const outCirc: Ease = (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2));
export const inSine: Ease = (t: number) => Math.sin(t * Math.PI / 2);

function inverse(ease: Ease, t: number): number {
  return 1 - Math.abs(ease(t - 1));
}

function inverser(ease: Ease): Ease {
  return (t: number) => inverse(ease, t);
}

export const inQuad = inverser(outQuad);
export const inCubic = inverser(outCubic);
export const inQuart = inverser(outQuart);
export const inQuint = inverser(outQuint);
export const inCirc = inverser(outCirc);
export const outSine = inverser(inSine);

// tpmt is two power minus ten times t scaled to [0,1] (from D3)
const A = Math.pow(2, -10);
const B = 1 / (1 - A);
function tpmt(x: number): number {
  return (Math.pow(2, -10 * x) - A) * B;
}

export const inExpo = (t: number) => tpmt(1 - t);
export const outExpo = (t: number) => 1 - tpmt(t);
