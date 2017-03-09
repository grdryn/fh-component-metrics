var os = require('os');
var types = require('./types');

module.exports = function(metricsClient, type) {

  return function(key, tag, value, cb) {
    var data = {};
    //the type of the metric
    data.type = type || types.G;
    data.key = key;
    data.tags = tag || {};
    data.tags.hostname = os.hostname();
    data.tags.workerId = process.env.metricsId || 'master';
    data.fields = {value: value};
    metricsClient.send.call(metricsClient, data);

    if ('function' === typeof cb) {
      cb(null, data);
    }
  };
};
