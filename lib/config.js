var util = require('util');
module.exports = function(config) {
  var BASE_ERROR = "invalid config expected %s";
  return {
    "getConfig": function() {
      return config;
    },
    "getHost": function() {
      if (!config || !config.host) {
        throw new Error(util.format(BASE_ERROR, "host"));
      }
      return config.host;
    },
    "getPort": function() {
      if (! config || ! config.port) {
        throw new Error(util.format(BASE_ERROR, "port"));
      }
      return config.port;
    },
    "enabled": function() {
      return config.enabled === true || config.enabled === 'true';
    }
  };
};
