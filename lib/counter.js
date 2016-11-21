var gauge = require('./gauge');

module.exports = function(influxclient) {

  var g = gauge(influxclient);

  return {
    'inc': function(key, tags, cb) {
      g(key, tags, 1, cb);
    },
    'dec': function(key, tags, cb) {
      g(key, tags, -1, cb);
    }
  };
};