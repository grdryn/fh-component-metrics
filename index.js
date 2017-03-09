var MetricsClients = require('./lib/clients');

module.exports = function metrics(conf) {
  //configure config module
  var config = require('./lib/config')(conf);
  var confEnabled = config.enabled();
  var clients = new MetricsClients(config.getConfig());
  var counter = require('./lib/counter')(clients);
  var nothing = function() {};

  return {
    "cpu": confEnabled ? require('./lib/cpu')(clients) : nothing,
    "memory": confEnabled ? require('./lib/memory')(clients) : nothing,
    "gauge": confEnabled ? require('./lib/gauge')(clients) : nothing,
    "inc": confEnabled ? counter.inc : nothing,
    "dec": confEnabled ? counter.dec : nothing
  };
};

module.exports.timingMiddleware = require('./lib/timingMiddleware');