import Rx from 'rx';

function makeAnimationDriver () {
  return function animationDriver () {
    const animation$ = new Rx.Subject();

    function tick (timestamp) {
      animation$.onNext(timestamp);
      requestAnimationFrame(tick);
    }

    tick(new Date().valueOf());

    return animation$;
  };
}

module.exports = {
  makeAnimationDriver
};
