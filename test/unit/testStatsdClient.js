var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var types = require('lib/types');

var messageSent = false;
var socketStub = sinon.stub();
var statsdClient = proxyquire('lib/clients/statsd.js', {
  dgram: {
    createSocket: function() {
      return {
        send: socketStub
      };
    }
  }
});

exports.test_buildMessages = function(done) {
  var client = statsdClient.init({});
  var data = {
    type: types.G,
    key: 'testKey',
    tags: {
      'a': 'b'
    },
    fields: {
      'c': 1,
      'd': 2
    }
  };

  var messages = client.buildMessages(data);
  assert.equal(messages.length, 2);
  assert.ok(messages.indexOf('testKey-ab-c:1|g') > -1);
  assert.ok(messages.indexOf('testKey-ab-d:2|g') > -1);
  done();
};

exports.test_send = function(done) {
  socketStub.yieldsAsync();
  var client = statsdClient.init({});
  client.send({key:'testKey', fields:{'a': 1}});
  setTimeout(function() {
    assert.ok(socketStub.calledOnce);
    done();
  }, 10);
};