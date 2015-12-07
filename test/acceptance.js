var requireDefined = (typeof( require ) !== 'undefined');
var expect = (requireDefined? require('expect.js') : window.expect);
var PusherTestStub = window.PusherTestStub;
var Pusher = window.Pusher

describe('Pusher', function(){
  
  it('should have been overridden by the test stub', function() {
    expect(Pusher).to.be(PusherTestStub)
  })
  
  describe('#constructor()', function(){
    it('should create a new test pusher instance', function(){
        var pusher = new Pusher();
        expect(pusher).to.be.ok();
    });
  });
  
  describe('#subscribe()', function(){
    it('should return a channel object', function(){
        var pusher = new Pusher();
        var channel = pusher.subscribe('channel');
        expect(channel).to.be.ok();
    });
    
    it('should return a channel object with a name property', function(){
        var pusher = new Pusher();
        var channel = pusher.subscribe('channel');
        expect(channel.name).to.be('channel');
    });
  });
  
  describe('#channel()', function(){
    it('should return the expected channel object', function(){
        var pusher = new Pusher();
        var subChannel = pusher.subscribe('channel');
        var fetchedChannel = pusher.channel('channel');
        
        expect(subChannel).to.be(fetchedChannel);
    });
    
    it('should not return an unsubscribed channel', function() {
      var pusher = new Pusher();
      var subChannel = pusher.subscribe('channel');
      var fetchedChannel = pusher.channel('channel');
      
      expect(subChannel).to.be(fetchedChannel);
      
      pusher.unsubscribe('channel');
      
      fetchedChannel = pusher.channel('channel');
      expect(fetchedChannel).to.be(undefined);
    });
  });
  
  describe('#allChannels()', function(){
    it('should return and Array of channel names', function(){
        var pusher = new Pusher();
        pusher.subscribe('channel');
        pusher.subscribe('channel2');
        var channels = pusher.allChannels();
        
        expect(channels.length).to.be(2);
    });
  });
  
  describe('pusher:subscription_succeeded', function() {
    it('should be possible to emit the succeeded event on a channel', function() {
      var pusher = new Pusher();
      var channel = pusher.subscribe('channel');
      
      var succeeded = false;
      channel.bind('pusher:subscription_succeeded', function() {
        succeeded = true;
      });
      
      channel.emit('pusher:subscription_succeeded', {});
      
      expect(succeeded).to.be(true);
    });
  });
  
});
