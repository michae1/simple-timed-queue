[![Build Status][travis-badge]][travis-url]

# simple-timed-queue
Queue data structure with expiration

## Usage
``` javascript
var q = new TimedQueue(100);

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

[travis-badge]: https://travis-ci.org/michae1/simple-timed-queue.svg
[travis-url]: https://travis-ci.org/michae1/simple-timed-queue