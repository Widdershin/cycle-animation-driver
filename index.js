import {run} from '@cycle/core';
import {makeDOMDriver, div, input} from '@cycle/dom';
import {makeAnimationDriver} from './lib/driver';
import _ from 'lodash';

const maxSpeed = 500;
const maxHeight = 100;

function nodes (timestamp, speed, height) {
  return (
    div('.nodes', _.range(1, 50).map(i =>
      div('.node', {
        style: {
          left: (i * 15) + 'px',
          top: (Math.sin(i + timestamp / (maxSpeed - speed)) * height + 150).toString() + 'px'
        }
      }, '.')
    ))
  );
}

function main ({DOM, animation}) {
  const speed$ = DOM
    .select('.speed')
    .events('input')
    .map(ev => ev.target.value)
    .startWith(maxSpeed / 2);

  const height$ = DOM
    .select('.height')
    .events('input')
    .map(ev => ev.target.value)
    .startWith(maxHeight / 2);

  return {
    DOM: animation.withLatestFrom(speed$, height$, (timestamp, speed, height) =>
      div('.time', [
        nodes(timestamp, speed, height),
        'Speed',
        input('.speed', {type: 'range', min: 1, max: maxSpeed, value: speed}),
        'Height',
        input('.height', {type: 'range', min: 1, max: maxHeight, value: height})
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('.app'),
  animation: makeAnimationDriver()
};

const {sinks, sources} = run(main, drivers);

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    sinks.dispose();
  });
}
