var assert = require('assert');
var proxyquire = require('proxyquire');

var messageSent = false;
var influxdbClient = proxyquire('lib/clients/influxdb.js', {
  dgram: {
    createSocket: function() {
      return {
        send: function(message, start, length, port, host, cb) {
          assert.ok(message);
          assert.ok(start !== null);
          assert.ok(length !== null);
          assert.ok(port !== null);
          assert.ok(host !== null);
          messageSent = true;
          return cb();
        }
      };
    }
  }
});

exports.test_buildMessages = function(done) {
  var influxUpd = influxdbClient.init({});
  var ts = new Date().getTime();
  var data = {
    key: 'testKey',
    tags: {
      'a,b': 'tag1',
      'c d': 'tag2',
      'e,f ': 'tag3',
      'k': ['1 2'],
      'l': 'value=value1'
    },
    fields: {
      'g': 1,
      'h,i': 3.4,
      'j': '"testvalue"'
    },
    timestamp: ts
  };

  var messages = influxUpd.buildMessages(data);
  var expected = 'testKey,a\\,b=tag1,c\\ d=tag2,e\\,f\\ =tag3,k=1\\ 2,l=value\\=value1 g=1,h\\,i=3.4,j="\\"testvalue\\"" ' + ts + '\n';
  assert.equal(messages[0], expected);
  done();
};

exports.test_send = function(done) {
  var influxUpd = influxdbClient.init({});
  influxUpd.send({key:'testKey', fields:{'a': 1}});
  setTimeout(function() {
    assert.ok(messageSent);
    done();
  }, 10);
};