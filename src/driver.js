import Rx from 'rx';

import now from 'performance-now';
import requestAnimationFrame from 'raf';

function makeAnimationDriver () {
  return function animationDriver () {
    const animation$ = new Rx.Subject();

    let previousTime = now();

    function tick (timestamp) {
      animation$.onNext({
        timestamp,
        delta: timestamp - previousTime
      });

      previousTime = timestamp;

      requestAnimationFrame(tick);
    }

    tick(previousTime);

    return animation$;
  };
}

module.exports = {
  makeAnimationDriver
};
