var deps = require('./PusherDependencies');
var Connection = require('./Connection');
var Channel = require('./Channel');
var PrivateChannel = require('./PrivateChannel');
var PresenceChannel = require('./PresenceChannel');

/**
 * Create a new instance of the test stub.
 *
 * @param {String} key the Pusher application key
 * @param {Object} options additional config options
 */
function PusherTestStub(key, options) {
  this.key = key;
  this.connection = new Connection();
  
  this._channels = {};
  
  PusherTestStub.singleton = this;
  PusherTestStub.instances.push(this);
}
deps.Util.extend(PusherTestStub.prototype, deps.EventDispatcher.prototype);

PusherTestStub.IS_STUB = true;
PusherTestStub.singleton = null;
PusherTestStub.instances = [];
PusherTestStub.Util = deps.Util;

PusherTestStub.prototype.subscribe = function(channelName, options) {
  var channel = this._channels[ channelName ];
  
  if(channel === undefined) {
    channel = this._channelFactory(channelName, options);
    this._channels[ channelName ] = channel;
  }
  
  return channel;
};

/** @private **/
PusherTestStub.prototype._channelFactory = function(channelName, options) {
  var channel = null;

  if(channelName.indexOf('private-') == 0) {
    channel = new PrivateChannel(name);
  }
  else if(channelName.indexOf('presence-') === 0) {
    channel = new PresenceChannel(channelName);
  }
  else {
    channel = new Channel(channelName);
  }
  
  return channel;
};

PusherTestStub.prototype.unsubscribe = function(channelName) {
  delete this._channels[channelName];
};

PusherTestStub.prototype.channel = function(channelName) {
  return this._channels[channelName]
};

PusherTestStub.prototype.allChannels = function() {
  var channels = [];
  for(var name in this._channels) {
    channels.push(name);
  }
  return channels;
};

PusherTestStub.prototype.connect = function() {
  
};

PusherTestStub.prototype.disconnect = function() {
  
};

/**
 * Helper function for triggering events on channels.
 *
 * @param {String} channelName the name of the channel to trigger an event on
 * @param {String} eventName the event to be triggered on the channel
 * @param {Object} eventData the event data payload to be associated with the event
 */
PusherTestStub.prototype.trigger = function(channelName, eventName, eventData) {
  this.channel(channelName).emit(eventName, eventData);
};

window.Pusher = PusherTestStub;

module.exports = PusherTestStub;
