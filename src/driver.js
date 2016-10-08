import Rx from 'rx';

import now from 'performance-now';
import requestAnimationFrame from 'raf';

function makeAnimationDriver () {
  return function animationDriver (sink$, streamAdapter) {
    const {observer, stream} = streamAdapter.makeSubject();

    let previousTime = now();
    let frameHandle;

    function tick (timestamp) {
      observer.next({
        timestamp,
        delta: timestamp - previousTime
      });

      previousTime = timestamp;

      frameHandle = requestAnimationFrame(tick);
    }

    tick(previousTime);

    stream.interval = function (period) {
      return Rx.Observable.interval(period);
    };

    stream.dispose = function () {
      requestAnimationFrame.cancel(frameHandle);
    };

    return stream;
  };
}

module.exports = {
  makeAnimationDriver
};
