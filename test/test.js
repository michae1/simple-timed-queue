var assert = require("assert"),
    TimedQueue = require("../index");

describe('TimedQueue', function() {
    it('should drop 5 items in 0.1 second, so we will have 1', function (done) {
        var q = new TimedQueue(100);

        for (var i = 0; i < 5; i++)
            q.enqueue(i);
            
    
        setTimeout(function(){
            q.enqueue(i);
            assert.equal(q.getLength(), 1);
            done();
        }, 200);
        
    });
});    