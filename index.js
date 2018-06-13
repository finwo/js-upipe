var upipe = module.exports = (function() {
  function dq(ctx) {
    if(!ctx.q.length) return;
    ctx.q = ctx.q.filter(function(dat) {
        (ctx.t||ctx.emit.bind(undefined,'data'))(dat);
    });
  }
  function EE(sub) {
    var l={};sub=sub||this;
    if((global||window)===sub) return EE({});
    return Object.assign(sub,{
      on: (n,h)=>((l[n]=l[n]||[]).push(h),sub),
      emit: function(n,a) {
        a=[].slice.call(arguments);n=a.shift();
        (l[n]||[]).forEach((f)=>f.apply(sub,a));
      }
    });
  }
  var p = {
    writable : true,
    t        : false,
    q        : [],
    end: function(chunk) {
      if('undefined'!==typeof chunk) this.write(chunk);
      if(this.writable) {
        this.write(null);
        this.writable = false;
        this.emit('end');
      }
    },
    write: function(chunk) {
      this.q.push(chunk);
      dq(this);
    },
    pipe: function( dest ) {
      switch(typeof dest) {
        case 'function': return this.pipe(upipe(dest));
        case 'object':
          if(!dest.writable) return this;
          this.on('data', function(chunk) {
            if ( null === chunk ) return dest.end();
            if ( dest.writable ) dest.write(chunk);
          });
          return dest;
      }
      return this;
    }
  };
  return function(dat) {
    var out = EE(Object.create(p));
    out.q = [];
    setTimeout(dq.bind(undefined,out),0);
    out.on('end',function() {
      if(this.writable) {
        this.write(null);
        this.writable = false;
      }
    });
    if ( 'function' === typeof dat ) {
      out.t = dat;
    } else if ( 'undefined' !== typeof dat ) {
      if (Array.isArray(dat)) {
        out.q.push.apply(out.q,dat);
      } else {
        out.q.push(dat);
      }
    }
    return out;
  }
})();
