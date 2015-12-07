# Pusher Test Stub

Stubs out the `Pusher` object with a fake object that can be manipulated for
testing purposes.

## Quick Start

Install Pusher and the test stub.

```
$ bower install pusher
$ bower install pusher-test-stub
```

When in test mode inject the test stub and execute tests.

```html
<html>
<body>
  <script src="./bower_components/pusher/dist/pusher.min.js"></script>
  <!-- ONLY include in test mode -->
  <script src="./bower_components/pusher-test-stub/dist/pusher-test-stub.js"></script>
  <script>
    var MyApp = {
      messages: [],
      init: function() {
        var pusher = new Pusher('key');
        var channel = pusher.subscribe('messages');
        channel.bind('new-message', function(message) {
          this.messages.push(message);
        }.bind(this));
      }
    };
    
    MyApp.init();
  </script>
  <script>
    // Define your tests - probably in a separate file that injected in test mode
    describe('Message Collection', function() {
      it('should be updated with a new message when new-message is triggered', function() {
        var channel = Pusher.singleton.channel('messages');
        channel.emit('new-message', { text: 'test stub message'});
        
        expect(MyApp.messages.length).to.be(1);
        expect(MyApp.messages[0].text).to.be('test stub message');
      });
    });
  </script>
</body>
</html>
```

## Installation

```
bower install pusher-test-stub
```

Include the `dist/pusher-test-stub.js` file after `pusher.js` script.

```html
<script src="//js.pusher.com/3.0/pusher.min.js"></script>
<script src="bower_components/dist/pusher-test-stub.js"></script>
```

The `Pusher` definition will then be overwritten by the `PusherTestStub`
definition.

## Supported API

The public API offers everything that pusher-js supports.

### EventsDispacher

The `EventsDispacher` is used by `Pusher`, `Connection`, `Channel`, 
`PrivateChannel` and `PresenceChannel` (all channel types). The functions on
include:

* `obj.bind( eventName, callback )` - bind to all events with an event name: 
* `obj.unbind( eventName[, callback] )` - Unbind to all events with a given name
* `obj.bind_all( callback )` - Bind to all absolutely all events. *I'd be interested if anybody uses this*
* `obj.unbind_all( callback )` - Unbind the all callback handler. *I'd be interested if anybody uses this*

### Pusher

Static variables:

* `Pusher.instances` -  Array of instances of `Pusher` objects instances

Constructor:

* `new Pusher( key[, options] )` - Constructor

Functions:

* `pusher.subscribe( channelName )`
* `pusher.unsubscribe( channelName )`
* `pusher.channel( channelName )` - get a channel by name
* `pusher.allChannels()`
* `pusher.connect()`
* `pusher.disconnect()`

Ones I'm hoping we can ignore:

* `pusher.bind( eventName, callback )` - Bind to all events with an event name: 
* `pusher.bind_all( callback )` - Bind to all absolutely all events

Properties:

* `pusher.key` - The current app key: 

### Pusher.Connection

Inherits from `EventsDispacher`.

* `connection.state` - Connection state

### Public Channel

The basic channel type which inherits from `EventsDispacher`. It doesn't offer any other functions other than those exposed by the object it inherits from.

However, there are a few properties:

* `channel.subscribed` - Subscription state
* `channel.name` - Channel name

### Private Channel

Inherits from the public channel and as such inherits `EventsDispacher`.

* `channel.trigger( eventName, data )` - the ability to trigger client events on the channel.

### Presence Channel

Inherits from the private channel and as such inherits `EventsDispacher` and the private channel properties. Also offers access to some presence state variables.

* `channel.members` - Members on the channel. An instance of `Pusher.Members`

### Members

Functions:

* `members.get( memberId )` - get a member with a given ID
* `members.each( callback )` - used to iterate members

Properties:

* `members.count` - the number of members on the channel
* `members.me` - a reference to the current user on the channel

### Member

Not represented as an object anywhere, but the structure is:

* `member.id` - a unique user id
* `member.info` - application specific user information

## Helpers

### `Pusher.singleton`

Reference the last instance of `Pusher` that was created. Since you generally only
want to create a single `Pusher` instance this can come in handy.

### `Pusher.singleton.trigger(channelName, eventName, eventData)`

Trigger an event on the given channel.

```js
Pusher.singleton.trigger('channel', 'my-event', {});
```

## Development

```
$ npm install
```

### Build

The build process uses [gulp](http://gulpjs.com/) and
[webpack](http://webpack.github.io/)..

```
$ gulp build
```

A new build will be created in `dist/pusher-test-stub.js`.

### Tests

Tests are defined in `test/acceptance.js` and run via `test/runner.html`.

*Note: `Pusher` assumes it's running in a browser and has a hard dependency
on it at the moment. So the Pusher Test Stub is also restricted by that
dependency*

To run the tests:

```
$ gulp serve
```

Navigate to http://localhost:8000/test/runner.html

## CHANGELOG

See [CHANGELOG.md](CHANGELOG.md).
