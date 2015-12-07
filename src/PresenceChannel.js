var deps = require('./PusherDependencies');
var PrivateChannel = require('./PrivateChannel');

function PresenceChannel(name) {
  PrivateChannel.call(this, name);
  
  this.members = new deps.Members();
}
deps.Util.extend(PresenceChannel.prototype, PrivateChannel.prototype);

module.exports = PresenceChannel;
