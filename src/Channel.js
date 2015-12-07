var deps = require('./PusherDependencies');

function Channel(name) {
  deps.EventDispatcher.call(this, function(event, data) {
      console.log('No callbacks on ' + name + ' for ' + event);
  });
  
  this.name = name;
  this.subscribed = false;
}
deps.Util.extend(Channel.prototype, deps.EventDispatcher.prototype);

module.exports = Channel;
