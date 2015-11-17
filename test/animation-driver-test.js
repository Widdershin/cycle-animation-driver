/* globals describe, it */

import Rx from 'rx';
import makeAnimationDriver from '../src/driver';

import assert from 'assert';

describe('Animation driver', () => {
  it('provides an observable of requestAnimationFrame events', (done) => {
    const driver = makeAnimationDriver();

    const responses = driver(Rx.Observable.empty());

    responses.subscribe(val => assert.equal(typeof val, 'number'));

    done();
  });
});

