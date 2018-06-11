module.exports = function batch(context, destination, args) {
  args.forEach(function (arg) {
    destination.apply(context, arg);
  });
};
