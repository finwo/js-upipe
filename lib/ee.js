// Derived from https://npmjs.com/package/simple-ee
module.exports = function EE(subject) {
  subject = subject || this;
  if ( (global||window) === subject ) return new EE({});
  var l = {}, p = {
    on   : function (name, handler) {
      (l[name]=l[name]||[]).push(handler);
      return subject;
    },
    emit : function (name, ...args) {
      args = [].slice.call(arguments);
      name = args.shift();
      (l[name]||[]).forEach(function (handler) {
        handler.apply(subject, args);
      });
      return subject;
    }
  };
  Object.assign(subject, p);
};
