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
    it('should emit expire event', function (done) {
        var q = new TimedQueue(10);

        q.on('expired', function(item){
            assert.equal(item, 13);
            done();
        })

        q.enqueue(13);
    
        setTimeout(function(){
            // For expiration
        }, 12);
    });
    it('should not emit expire event if configured', function (done) {
        var q = new TimedQueue(10, null, true);

        q.on('expired', function(item){
            assert(false, 'Event should never fired but it was');
            done();
        })

        q.enqueue(13);
    
        setTimeout(function(){
            assert(true);
            done();
        }, 12);
    });
});    