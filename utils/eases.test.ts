import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import * as eases from './eases';

describe('eases.ts', () => {
  it('all get value of 0 back', () => {
    for (let i in eases) {
      assert.equal(0, eases[i](0));
    }
  })

  it('all get value of 1 back', () => {
    for (let i in eases) {
      assert.equal(1, eases[i](1));
    }
  })

  it('all other values return between 0-1', () => {
    for (let i in eases) {
      const t = Math.random();
      const actualValue = eases[i](t)
      assert.ok(actualValue < 1, 'actualValue should be less than 1');
      assert.ok(actualValue > 0, 'actualValue should be more than 0');
    }
  })
})