var deps = require('./PusherDependencies');
var Channel = require('./Channel');

function PrivateChannel(name) {
  Channel.call(this, name);
}
deps.Util.extend(PrivateChannel.prototype, Channel.prototype);

PrivateChannel.prototype.trigger = function(eventName, eventData) {
  
};

module.exports = PrivateChannel;
