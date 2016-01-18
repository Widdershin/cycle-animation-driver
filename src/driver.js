import Rx from 'rx';

import now from 'performance-now';
import requestAnimationFrame from 'raf';

function makeAnimationDriver () {
  return function animationDriver () {
    const animation$ = new Rx.Subject();

    let previousTime = now();
    let frameHandle;

    function tick (timestamp) {
      if (animation$.isDisposed) {
        requestAnimationFrame.cancel(frameHandle);
        return;
      }

      animation$.onNext({
        timestamp,
        delta: timestamp - previousTime
      });

      previousTime = timestamp;

      frameHandle = requestAnimationFrame(tick);
    }

    tick(previousTime);

    return animation$;
  };
}

module.exports = {
  makeAnimationDriver
};
