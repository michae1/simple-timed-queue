[![Build Status][travis-badge]][travis-url]
[![NPM Version][npm-image]][npm-url]

# simple-timed-queue
Queue data structure with expiration

## Usage
``` javascript
var q = new TimedQueue(100); // entries ttl

q.enqueue('text1');
q.dequeue();
// test1
q.enqueue('text2');
...
// 0.1 second here
...
q.dequeue();
// undefined
```

[travis-badge]: https://travis-ci.org/michae1/simple-timed-queue.svg?branch=master
[travis-url]: https://travis-ci.org/michae1/simple-timed-queue
[npm-image]: https://img.shields.io/npm/v/simple-timed-queue.svg
[npm-url]: https://npmjs.com/package/simple-timed-queue
