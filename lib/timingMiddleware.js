var gauge = require('./gauge');
var InfluxUdp = require('./sender');
var _ = require('lodash');

module.exports = function(component, metrics_conf) {
  return function(req, res, next) {
    if (metrics_conf.enabled) {
      var timeFunc = gauge(new InfluxUdp(metrics_conf));
      var start = Date.now();
      res._end = res.end;
      res.end = function(data, encoding, callback) {
        res._end(data, encoding, callback);
        var timeTaken = Date.now() - start;

        var route = req.permissionpath || req.route || req.path || req.url;
        if (_.isObject(route)) {
          route = route.path;
        }
        if ('string' === typeof route) {
          timeFunc(component + '_api_timing', {route: route}, timeTaken);
        } else {
          console.error("failed to determine route cannot gauge timing : fh-component-metrics");
        }
      };
      return next();
    } else {
      return next();
    }
  };
};
