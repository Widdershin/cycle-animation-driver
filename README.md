# cycle-animation-driver
A Cycle driver for requestAnimationFrame

Installation
---

```bash
npm install cycle-animation-driver --save
```

Usage
---

`cycle-animation-driver` uses requestAnimationFrame to provide a stream of timestamps, as fast and smooth as the browser will allow.

```js
import {run} from 'cycle-core';
import {makeDOMDriver, div} from '@cycle/dom';
import {makeAnimationDriver} from 'cycle-animation-driver';

function main ({DOM, animation}) {
  return {
    DOM: animation.pluck('timestamp').map(timestamp => div('.time', timestamp.toString()))
  }
}

const drivers = {
  DOM: makeDOMDriver('.app'),
  animation: makeAnimationDriver()
}

run(main, drivers);
```

Example
---

Check out the live example at [widdersh.in/cycle-animation-driver](http://widdersh.in/cycle-animation-driver/).

The source code for that example can be found [here](https://github.com/Widdershin/cycle-animation-driver/blob/gh-pages/index.js).
