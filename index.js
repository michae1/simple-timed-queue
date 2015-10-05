/* jshint node: true */
/* Based on queue implementation by Stephen Morley - http://code.stephenmorley.org/ */
'use strict';

module.exports = function (ttl, delta) {

    this.queue  = []; // elements
    this.offset = 0;

    this.delta = delta || 5; // default approximation
    this.timer = null; // inner timer object
    this.ttl = ttl;
    this.timeouts = []; // timings
    this.length = 0;

    this.isEmpty = function () {
        return (this.queue.length === 0);
    };

    this.enqueue = function (item) {
        var self = this;
        if (!this.timer && this.ttl) {
            this.timer = setTimeout(self.expireItem.bind(self), this.ttl);
        }

        this.queue.push(item);
        this.timeouts.push(Date.now() + this.ttl);
        this.length = this.queue.length - this.offset;
    };

    this.dequeue = function (withTimeLeft) {
        // if the queue is empty, return immediately
        if (this.queue.length === 0) {
            return undefined;
        }

        // store the item at the front of the queue
        var item = this.queue[this.offset],
            timer = this.timeouts[this.offset],
            oldShift = this._getLastTimer(),
            self = this,
            newShift = null;
        // increment the offset and remove the free space if necessary
        this.removeItem();

        newShift = this._getLastTimer();
        if (this.timer && ( !newShift || ( oldShift != newShift && newShift - oldShift > this.delta) ) ){
            
            clearTimeout(this.timer);

            newShift = this._getLastTimer() - Date.now();
            if (newShift)
                this.timer = setTimeout(self.expireItem.bind(self), newShift);
            else
                this.timer = null;
        }
        if (withTimeLeft)
            return [item, timer - Date.now()];
        return item;

    };

    this.removeItem = function () {
        if (++ this.offset * 2 >= this.queue.length){
            this.queue  = this.queue.slice(this.offset);
            this.timeouts = this.timeouts.slice(this.offset);
            this.offset = 0;
        }
        this.length = this.queue.length - this.offset;
    };

    this.expireItem = function () {
        
        var self = this,
            currShift = this._getLastTimer();

        var removeNum = 1;
        for (var i = this.offset + 1; i <= this.queue.length; i++){
            // We will also expire all items with same timeout
            if (this.timeouts[i] == currShift){
                removeNum++;
            } else {
                // we have greater timeout, stop
                break;
            }
        }

        for (var j = 0; j<removeNum;j++)
            this.removeItem();

        clearTimeout(this.timer);

        var newShift = this._getLastTimer() - Date.now(); 

        if (newShift)
            this.timer = setTimeout(self.expireItem.bind(self), newShift);
        else
            this.timer = null;
    };

    // Returns the item at the front of the queue (without dequeuing it). If the
    // queue is empty then undefined is returned.
    this.peek = function (){
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    };

    // Get oldest element timestamp
    this._getLastTimer = function (){
        return (this.timeouts.length > 0 ? this.timeouts[this.offset] : undefined);
    };

};