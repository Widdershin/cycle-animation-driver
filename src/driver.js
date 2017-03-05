import * as Rx from 'rxjs';
import {adapt} from '@cycle/run/lib/adapt';

import now from 'performance-now';
import requestAnimationFrame from 'raf';

function makeAnimationDriver () {
  return function animationDriver (sink$) {
    const subject = new Rx.Subject();

    let previousTime = now();
    let frameHandle;

    function tick (timestamp) {
      subject.next({
        timestamp,
        delta: timestamp - previousTime
      });

      previousTime = timestamp;

      frameHandle = requestAnimationFrame(tick);
    }

    tick(previousTime);

    subject.interval = function (period) {
      return Rx.Observable.interval(period);
    };

    subject.dispose = function () {
      requestAnimationFrame.cancel(frameHandle);
    };

    return adapt(subject);
  };
}

module.exports = {
  makeAnimationDriver
};
