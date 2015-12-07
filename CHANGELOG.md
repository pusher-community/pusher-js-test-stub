# CHANGELOG

## 2.0.0

* **REMOVED** `dispatch` no longer available. Please use `emit`
* **REMOVED** `Pusher.emit` has been removed. Please use `Pusher.singleton.trigger`
* **ADDED** `Pusher.singleton` access last created `Pusher` instance
* **ADDED** `Pusher.singleton.trigger(channelName, eventName, eventData)` to trigger
and event with payload on a given channel

## 1.0.0

Please see the [Pusher Test Stub blog post](http://blog.pusher.com/2011/9/2/testing-your-integration-with-the-pusher-javascript-library) for more information.
