var os = require('os');

module.exports = function(influxclient) {

  return function(key, tag, value, cb) {
    var data = {};
    data.key = key;
    data.tags = tag || {};
    data.tags.hostname = os.hostname();
    data.tags.workerId = process.env.metricsId || 'master';
    data.fields = {value: value};
    influxclient.send(data);

    if ('function' === typeof cb) {
      cb(null, data);
    }
  };
};
