// Based on queue implementation by Stephen Morley - http://code.stephenmorley.org/

exports = module.exports = function(ttl /* element TTL */, delta /* Possible delta for approximations */ ){

    this.queue  = []; // elements
    this.offset = 0;

    this.delta = delta || 5; // default approximation
    this.timer = null; // inner timer object
    this.ttl = ttl;
    this.timeouts = []; // timings

    this.getLength = function(){
        return (this.queue.length - this.offset);
    }

    this.isEmpty = function(){
        return (this.queue.length == 0);
    }

    this.enqueue = function(item){
        var self = this;
        if (!this.timer && this.ttl)
            this.timer = setTimeout(self.expireItem.bind(self), this.ttl);
        
        this.queue.push(item);
        this.timeouts.push(Date.now() + this.ttl);
    }

    this.dequeue = function(){
        var self = this;
        // if the queue is empty, return immediately
        if (this.queue.length == 0) return undefined;

        // store the item at the front of the queue
        var item = this.queue[this.offset],
            timer = this.timeouts[this.offset],
            oldShift = this.getLastTimer();

        // increment the offset and remove the free space if necessary
        this.removeItem();

        var newShift = this._getLastTimer();
        if (this.timer && ( !newShift || ( oldShift != newShift && newShift - oldShift > this.delta) ) ){
            
            clearTimeout(this.timer);

            var newShift = this._getLastTimer() - Date.now();
            if (newShift)
                this.timer = setTimeout(self.expireItem.bind(self), newShift);
            else
                this.timer = null;
        }

        return item;

    }
    this.removeItem = function(){
        if (++ this.offset * 2 >= this.queue.length){
            this.queue  = this.queue.slice(this.offset);
            this.timeouts = this.timeouts.slice(this.offset);
            this.offset = 0;
        }
    }
    this.expireItem = function(){
        
        var self = this;
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
    }

    // Returns the item at the front of the queue (without dequeuing it). If the
    // queue is empty then undefined is returned.
    this.peek = function(){
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    }

    // Get oldest element timestamp
    this._getLastTimer = function(){
        return (this.timeouts.length > 0 ? this.timeouts[this.offset] : undefined);
    }

}