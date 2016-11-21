var InfluxUdp = require('./lib/sender');

module.exports = function metrics(conf) {
  //configure config module
  var config = require('./lib/config')(conf);
  var confEnabled = config.enabled();
  var influxclient = new InfluxUdp(config.getConfig());
  var counter = require('./lib/counter')(influxclient);
  var nothing = function() {};

  return {
    "cpu": confEnabled ? require('./lib/cpu')(influxclient) : nothing,
    "memory": confEnabled ? require('./lib/memory')(influxclient) : nothing,
    "gauge": confEnabled ? require('./lib/gauge')(influxclient) : nothing,
    "inc": confEnabled ? counter.inc : nothing,
    "dec": confEnabled ? counter.dec : nothing
  };
};

module.exports.timingMiddleware = require('./lib/timingMiddleware');
