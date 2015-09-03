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
