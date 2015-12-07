/* globals describe, it */

import Rx from 'rx';
import makeAnimationDriver from '../src/driver';

import raf from 'raf';

import assert from 'assert';

global.requestAnimationFrame = raf;

describe('Animation driver', () => {
  it('provides an observable of requestAnimationFrame events', (done) => {
    const driver = makeAnimationDriver();

    const responses = driver(Rx.Observable.empty());

    let firstTimeValue;

    let index = 0;

    responses.take(2).subscribe(val => {
      if (index === 0) {
        firstTimeValue = val;

        assert.equal(typeof val, 'number');
      }

      if (index === 1) {
        assert(
          val > firstTimeValue,
          `Expected ${val} to be > ${firstTimeValue}`
        );

        done();
      }

      index += 1;
    });
  });
});

