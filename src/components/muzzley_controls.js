Crafty.c("MuzzleyControls", {
    _speed: 3,

  _keydown: function (e) {
        debugger
        if (this._keys[e.key]) {
            this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1000) / 1000;
            this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1000) / 1000;
            this.trigger('NewDirection', this._movement);
        }
    },

  _keyup: function (e) {
        if (this._keys[e.key]) {
            this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000;
            this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000;
            this.trigger('NewDirection', this._movement);
        }
    },

  _enterframe: function () {
        if (this.disableControls) return;

        if (this._movement.x !== 0) {
            this.x += this._movement.x;
            this.trigger('Moved', { x: this.x - this._movement.x, y: this.y });
        }
        if (this._movement.y !== 0) {
            this.y += this._movement.y;
            this.trigger('Moved', { x: this.x, y: this.y - this._movement.y });
        }
    },

    /**@
    * #.multiway
    * @comp Multiway
    * @sign public this .multiway([Number speed,] Object keyBindings )
    * @param speed - Amount of pixels to move the entity whilst a key is down
    * @param keyBindings - What keys should make the entity go in which direction. Direction is specified in degrees
    * Constructor to initialize the speed and keyBindings. Component will listen to key events and move the entity appropriately.
    *
    * When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
    * When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
    *
    * @example
    * ~~~
    * this.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
    * this.multiway({x:3,y:1.5}, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
    * this.multiway({W: -90, S: 90, D: 0, A: 180});
    * ~~~
    */
    muzzleyControls: function (speed, keys, id) {
        this._keyDirection = {};
        this._keys = {};
        this._id = id;
        this._movement = { x: 0, y: 0 };
        this._speed = { x: 3, y: 3 };

        if (keys) {
            if (speed.x && speed.y) {
                this._speed.x = speed.x;
                this._speed.y = speed.y;
            } else {
                this._speed.x = speed;
                this._speed.y = speed;
            }
        } else {
            keys = speed;
        }

        this._keyDirection = keys;
        this.speed(this._speed);

        this.disableControl();
        this.enableControl();

        //Apply movement if key is down when created
        for (var k in keys) {
            if (Crafty.keydown[Crafty.keys[k]]) {
                this.trigger("JostickPress"+id, { key: Crafty.keys[k] });
            }
        }

        return this;
    },

    /**@
    * #.enableControl
    * @comp Multiway
    * @sign public this .enableControl()
    *
    * Enable the component to listen to key events.
    *
    * @example
    * ~~~
    * this.enableControl();
    * ~~~
    */
  enableControl: function() {
        this.bind("JostickPress"+this._id, this._keydown)
        .bind("JostickRelease"+this._id, this._keyup)
        .bind("EnterFrame", this._enterframe);
        return this;
  },

    /**@
    * #.disableControl
    * @comp Multiway
    * @sign public this .disableControl()
    *
    * Disable the component to listen to key events.
    *
    * @example
    * ~~~
    * this.disableControl();
    * ~~~
    */

  disableControl: function() {
        this.unbind("JostickPress"+this._id, this._keydown)
        .unbind("JostickRelease"+this._id, this._keyup)
        .unbind("EnterFrame", this._enterframe);
        return this;
  },

    speed: function (speed) {
        for (var k in this._keyDirection) {
            var keyCode = k;
            this._keys[keyCode] = {
                x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.x) / 1000,
                y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.y) / 1000
            };
        }
        return this;
    }
});

