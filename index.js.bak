var batch = require('./lib/batch'),
    EE    = require('./lib/ee');

function process(context) {
  if (!context.queue.length) return;
  batch(context, context.transform || context.emit.bind(undefined, 'data'), context.queue);
  context.queue = [];
}

var proto = {
  finished    : false,
  writable    : true,
  transform   : false,
  queue       : [],

  end: function(chunk) {
    if ('undefined' !== chunk) this.write(chunk);
    if (!this.finished) {
      this.write(null);
      this.finished = true;
      this.emit('end');
    }
  },
  write: function(chunk) {
    this.queue.push(chunk);
    process(this);
  },
  pipe: function(destination) {
    switch(typeof destination) {
      case 'function':
        return this.pipe(upipe(destination));
      case 'object':
        if (!destination.writable) return this;
        this.on('data', function(chunk) {
          if ( null === chunk ) return destination.end();
          destination.write(chunk);
        });
        return destination;
    }
    return this;
  }
};

var upipe = module.exports = function(data) {
  var out = EE(Object.create(proto));
  setTimeout(process.bind(undefined,out),0);
  out.on('end', function() {
    if(!this.finished) {
      this.write(null);
      this.finished = true;
    }
  });
  if ( 'function' === typeof data ) {
    out.transform = data;
  } else if ( 'undefined' !== typeof data ) {
    if (Array.isArray(data)) {
      out.queue.push.apply(out.q,data);
    } else {
      out.queue.push(data);
    }
  }
  return out;
};
