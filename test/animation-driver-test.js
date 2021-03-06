/* globals describe, it */

import Rx from 'rx';
import {makeAnimationDriver} from '../src/driver';
import rxAdapter from '@cycle/rx-adapter';

import assert from 'assert';

describe('Animation driver', () => {
  it('provides an observable of requestAnimationFrame events', (done) => {
    const driver = makeAnimationDriver();

    const responses = driver(Rx.Observable.empty(), rxAdapter);

    let firstTimeValue;

    let index = 0;

    responses.take(2).pluck('timestamp').subscribe(val => {
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

  it('can be disposed', (done) => {
    const driver = makeAnimationDriver();
    const responses = driver(Rx.Observable.empty(), rxAdapter);

    responses.take(1).subscribe(val => {
      responses.dispose();

      setTimeout(done, 50);
    });
  });

  it('have interval method', (done) => {
    const driver = makeAnimationDriver();
    const responses = driver(Rx.Observable.empty(), rxAdapter);
    const intervals = responses.interval(50);

    intervals.take(1).subscribe(val => {
      setTimeout(done, 10);
    });
  });
});
