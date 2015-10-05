var assert = require("assert"),
    TimedQueue = require("../index");

describe('TimedQueue', function() {
    it('should accept 5 items, drop 3, accept 2 and got length 4', function () {
        var q = new TimedQueue(100);

        for (var i = 0; i < 5; i++)
            q.enqueue(i);
        
        for (var i = 0; i < 3; i++)
            q.dequeue();

        for (var i = 0; i < 2; i++)
            q.enqueue(i);        
    
        assert.equal(q.length, 4);
        
    });
    it('should drop 5 items in 0.1 second, so we will have 1', function (done) {
        var q = new TimedQueue(10);

        for (var i = 0; i < 5; i++)
            q.enqueue(i);
            
    
        setTimeout(function(){
            q.enqueue(i);
            assert.equal(q.length, 1);
            done();
        }, 20);
        
    });
    it('should return timeleft', function (done) {
        var q = new TimedQueue(10);

        q.enqueue(10);
    
        setTimeout(function(){
            var result = q.dequeue(true);
            assert.equal(result.length, 2);
            done();
        }, 2);
    });
});    