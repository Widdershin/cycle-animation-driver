import {run} from '@cycle/core';
import {makeDOMDriver, div, input} from '@cycle/dom';
import {makeAnimationDriver} from './lib/driver';
import _ from 'lodash';

const maxSpeed = 500;
const maxHeight = 100;
const maxWidth = 15 * 50;
const maxNodeCount = 100;

function fancyColor (timestamp, i, offset) {
  return Math.abs(Math.round((timestamp + (offset * 100) + (i * 20)) % 512) - 255);
}

function nodes (timestamp, speed, height, nodeCount) {
  const increment = maxWidth / nodeCount;

  return (
    div('.nodes', _.range(1, nodeCount).map(i =>
      div('.node', {
        key: i,
        style: {
          color: `rgb(${fancyColor(timestamp, i, 0)}, ${fancyColor(timestamp, i, 1)}, ${fancyColor(timestamp, i, 2)})`,
          left: (increment * i) + 'px',
          top: (Math.sin((increment * i) + timestamp / (maxSpeed - speed)) * height + 150).toString() + 'px'
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

  const nodeCount$ = DOM
    .select('.node-count')
    .events('input')
    .map(ev => ev.target.value)
    .startWith(45);

  return {
    DOM: animation.pluck('timestamp').withLatestFrom(speed$, height$, nodeCount$, (timestamp, speed, height, nodeCount) =>
      div('.time', [
        nodes(timestamp, speed, height, nodeCount),
        'Speed',
        input('.speed', {type: 'range', min: 1, max: maxSpeed, value: speed}),
        'Height',
        input('.height', {type: 'range', min: 1, max: maxHeight, value: height}),
        'Nodes',
        input('.node-count', {type: 'range', min: 1, max: maxNodeCount, value: nodeCount}),
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
