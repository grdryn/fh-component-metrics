var dgram = require('dgram');
var _ = require('lodash');
var async = require('async');

var InfluxUdp = function influxUdp(opts) {
  opts = opts || {};
  var self = this;
  this.host = opts.host || '127.0.0.1';
  this.port = opts.port || 4444;
  this.socket = dgram.createSocket('udp4');
  this.sendQConcurrency = opts.sendQueueConcurrency || 10;
  this.sendQ = async.queue(function(data, cb) {
    self.doSend(data, cb);
  }, this.sendQConcurrency);
};

//keys or tag keys & values need to escapce space and comma
function escapeKey(value) {
  if (_.isString(value)) {
    return value.replace(/([,\s=])/g, '\\$1');
  } else {
    return value;
  }
}

function escapeField(value) {
  if (_.isString(value)) {
    //string need to be wrapped in '"'
    return '"' + value.replace(/(["=])/g, '\\$1') + '"';
  } else {
    return value;
  }
}

InfluxUdp.prototype.buildMessage = function(data) {
  var keys = [];
  var fields = [];
  if (data.key) {
    keys.push(escapeKey(data.key));
  }
  if (data.tags) {
    var tagKeys = _.chain(data.tags).keys().sortBy().value();
    _.each(tagKeys, function(tagKey) {
      if (data.tags[tagKey]) {
        keys.push(escapeKey(tagKey) + '=' + escapeKey(data.tags[tagKey] + ''));
      }
    });
  }
  _.each(data.fields, function(value, key) {
    fields.push(escapeKey(key) + '=' + escapeField(value));
  });
  var message = [keys.join(','), fields.join(',')];
  if (data.timestamp) {
    message.push(data.timestamp);
  }
  return message.join(' ') + '\n';
};

InfluxUdp.prototype.doSend = function(message, cb) {
  try {
    this.socket.send(message, 0, message.length, this.port, this.host, cb);
  } catch (e) {
    //purposely ignored
    return cb();
  }
};

//use line protocol to send the data via UDP, see https://docs.influxdata.com/influxdb/v0.10/write_protocols/line/
InfluxUdp.prototype.send = function influxSend(data) {
  var message = this.buildMessage(data);
  message = new Buffer(message);
  this.sendQ.push(message);
  return message;
};

module.exports = InfluxUdp;