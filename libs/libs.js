/**
 * @namespace
 * Top-level namespace to stop namespace clutter.
 */
if(!window["com"]) {
  window["com"] = {};
}

// create pusher ns
if(!com.pusher) {
  com.pusher = {};
}

/**
 * Ensures that a namespace exists.
 * @param {String} namespace The namespace to check for and create if required.
 *
 * @return {Object} The existing or new namespace.
 */
com.pusher.namespace = function(namespace) {
  var parts = namespace.split(".");
  var context = window;
  var nsPath = "";
  for(var i = 0, l = parts.length; i < l; ++i) {
    var name = parts[i];
    if(!context[name]) {
      context[name] = {};
      context[name].__namespace = name;
    }
    nsPath += name + ".";
    context = context[name];
    if(!context.__namespace) {
      context.__namespace = nsPath.substring(0, nsPath.length-1); // trim off '.'
    }
  }
  return context;
};

/**
 * Provides a way of defining variables, functions and classes within a closure
 * and choosing how to exports them on to a namespace.
 *
 * Example:
 *
 * com.pusher.namespace("com.pusher.util", function(exports) {
 * var MyClass = function() {
 *    // do stuff
 *  };
 *
 *  var myOtherClass = function() {
 *  };
 *
 *  exports.MyClass = MyClass;
 *  exports.Dave = myOtherClass;
 * };
 *
 * var myClassInstance = new com.pusher.util.MyClass();
 * var daveInstance = new com.pusher.util.Dave();
 *
 * @param {String} namespace The namespace to be defined if it does not already exist.
 * @param {Function} definition The function to be called that defines the variables,
 *                  functions and classes to be exportsed and added to the namespace.
 */
com.pusher.define = function(namespace, definition) {
  var exports = {};
  definition(exports);

  var nsObject = com.pusher.namespace(namespace);
  for(var thingToexports in exports) {
    nsObject[thingToexports] = exports[thingToexports];
  }
};

/**
 * Extend the subsclass with the superclass
 *
 * @param {Object} subclass The subclass to be extended.
 * @param {Object} supercalss The object to extend the subclass with.
 */
com.pusher.extend = function(subclass, superclass){
    var firstInheritance = true;

    // see if the base classes prototype is currently empty
    for (var x in subclass.prototype) {
        firstInheritance = false;
        break;
    }

    if (firstInheritance) {
        // single inheritance
        var intermediateClass = new Function();

        // instead of inheriting directly from the super class and causing the constructor to be fired with zero
        // arguments, we use an intermediate class with the same prototype as the super class so that the object
        // constructor is avoided altogether
        intermediateClass.prototype = superclass.prototype;
        subclass["prototype"] = new intermediateClass(); // don't use fSubClass.prototype to keep jsdoc happy
    }
    else {
        // multiple inheritance
        for (x in superclass.prototype) {
            subclass.prototype[x] = superclass.prototype[x];
        }
    }
};

// TODO: consider moving this to a utility method
if (typeof Function.prototype.scopedTo === 'undefined') {
  Function.prototype.scopedTo = function(context, args) {
    var f = this;
    return function() {
      return f.apply(context, Array.prototype.slice.call(args || [])
        .concat(Array.prototype.slice.call(arguments)));
    };
  };
}
;(function() {
/* Abstract event binding
Example:

    var MyEventEmitter = function(){};
    MyEventEmitter.prototype = new Pusher.EventsDispatcher;

    var emitter = new MyEventEmitter();

    // Bind to single event
    emitter.bind('foo_event', function(data){ alert(data)} );

    // Bind to all
    emitter.bind_all(function(event_name, data){ alert(data) });

--------------------------------------------------------*/
  function EventsDispatcher() {
    this.callbacks = {};
    this.global_callbacks = [];
  }

  EventsDispatcher.prototype.bind = function(event_name, callback, data) {
    this.callbacks[event_name] = this.callbacks[event_name] || [];
    this.callbacks[event_name].push(function() {
      callback.apply(data, arguments);
    });
    return this;// chainable
  };

  EventsDispatcher.prototype.unbind = function(event_name, callback) {
    callbackIndex = this.callbacks[event_name] && this.callbacks[event_name].indexOf(callback);
    if ((callbackIndex != undefined) && (callbackIndex > -1))
      this.callbacks[event_name].splice(callbackIndex, 1);
    return this;// chainable
  };

  EventsDispatcher.prototype.emit = function(event_name, data) {
    this.dispatch_global_callbacks(event_name, data);
    this.dispatch(event_name, data);
    return this;
  };

  EventsDispatcher.prototype.bind_all = function(callback) {
    this.global_callbacks.push(callback);
    return this;
  };

  EventsDispatcher.prototype.dispatch = function(event_name, event_data) {
    var callbacks = this.callbacks[event_name];

    if (callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](event_data);
      }
    } else {
      // Log is un-necessary in case of global channel or connection object
      if (!(this.global || this instanceof Pusher.Connection || this instanceof Pusher.Machine)) {
        Pusher.debug('No callbacks for ' + event_name, event_data);
      }
    }
  };

  EventsDispatcher.prototype.dispatch_global_callbacks = function(event_name, data) {
    for (var i = 0; i < this.global_callbacks.length; i++) {
      this.global_callbacks[i](event_name, data);
    }
  };

  EventsDispatcher.prototype.dispatch_with_all = function(event_name, data) {
    this.dispatch(event_name, data);
    this.dispatch_global_callbacks(event_name, data);
  };

  this.EventsDispatcher = EventsDispatcher; // com.pusher.EventsDispatcher
}).call(com.pusher.namespace("com.pusher"));

if(window["Pusher"]){ // backwards compatibility
  Pusher.EventsDispatcher = com.pusher.EventsDispatcher;
}
