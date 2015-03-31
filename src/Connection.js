var deps = require('./PusherDependencies');

function Connection() {
  deps.EventDispatcher.call(this, function(event, data) {
      console.log('No callbacks on connection for ' + event);
  });
  
  this.state = 'disconnected';
}
deps.Util.extend(Connection.prototype, deps.EventDispatcher.prototype);

module.exports = Connection;
