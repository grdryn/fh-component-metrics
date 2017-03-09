var BaseClient = require('./base');
var util = require('util');
var types = require('../types');
var _ = require('lodash');
var dgram = require('dgram');

var STATS_TYPES = {};
STATS_TYPES[types.C] = 'c';
STATS_TYPES[types.G] = 'g';
STATS_TYPES[types.T] = 'ms';

var KEY_DELIMITER = "-";

function sanatizeInput(input) {
  //Replace characters that may cause problems here (:| are used by statsd, and cannot be included in the name)
  return (input + '').replace(/[\s:|=<.]+/g, '');
}

/**
 * A client that can send metrics data to a statsd backend
 * @param {Object} opts options about the statsd backend
 * @param {String} opts.host the host of the statsd server. Default is 127.0.0.1.
 * @param {Number} opts.port the port of the statsd server. Default is 8125.
 */
function StatsdClient(opts) {
  BaseClient.apply(this, arguments);
  opts = opts || {};
  this.host = opts.host || '127.0.0.1';
  this.port = opts.port || 8125;
  this.socket = dgram.createSocket('udp4');
}

util.inherits(StatsdClient, BaseClient);

//statsd only allows one value per message. If the data contains multiple fields, each of the field will be converted to a message
//also it doesn't support tags. So we will embed tags into the key. Each message will be constructed like this:
// <key>-<tagKey><tagValue>...-<fieldName>:<fieldValue>|<type>
//For example, given this data:
// {type: 'gauge', key: 'memory', tags: {host: localhost, workerId:1}, fields: {used: 800, total: 1000}}
// it will be converted to:
// ['memory-hostlocalhost-workerId1-used:800|g', 'memory-hostlocalhost-workerId1-total:1000|g']
StatsdClient.prototype.buildMessages = function(data) {
  var keys = [];
  var statsIdentifier = STATS_TYPES[data.type] || 'g';
  if (data.key) {
    keys.push(data.key);
  }
  //statsd doesn't really support tags, so we just add them as part of the key.
  if (data.tags) {
    var tags = _.map(data.tags, function(tagValue, tagKey) {
      return tagKey + '=' + tagValue;
    });
    keys = keys.concat(tags);
  }
  var keyPrefix = keys.join(KEY_DELIMITER);
  var messages = [];
  if (data.fields) {
    //each field value will be mapped to a message
    messages = _.map(data.fields, function(fieldValue, fieldName) {
      var key = sanatizeInput(keyPrefix + KEY_DELIMITER + fieldName);
      return key + ':' + fieldValue + '|' + statsIdentifier;
    });
  }
  return messages;
};

StatsdClient.prototype.transport = function(message, options, cb) {
  this.socket.send(message, 0, message.length, this.port, this.host, cb);
};

module.exports = {
  init: function(statsdConfig) {
    return new StatsdClient(statsdConfig);
  }
};

