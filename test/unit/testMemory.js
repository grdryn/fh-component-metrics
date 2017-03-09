var assert = require('assert');
var proxyquire = require('proxyquire');
var os = require('os');

var mocks = {
  './lib/clients': function() {
    this.send = function() {};
  }
};

var metrics = proxyquire('index.js', mocks)({enabled: true, host: '127.0.0.1'});

exports.mem_should_send_valid_object = function(finish) {

  var called = false;
  metrics.memory('testComponent', {interval: 10}, function(err, data) {
    assert.ok(!err);
    assert.ok(data.hasOwnProperty('key'));
    assert.equal(data.key, 'testComponent_memory');
    assert.ok(data.hasOwnProperty('fields'));

    assert.ok(data.fields.hasOwnProperty('heapUsed'));
    assert.ok(data.fields.hasOwnProperty('heapTotal'));
    assert.ok(data.fields.hasOwnProperty('rss'));

    assert.ok(data.hasOwnProperty('tags'));
    assert.equal(data.tags.hostname, os.hostname());
    assert.equal(data.tags.workerId, 'master');
    if (!called) {
      called = true;
      finish();
    }
  });
};

exports.mem_should_not_send_twice_to_same_series = function(finish) {
  metrics.memory('testComponent', {interval: 10}, function(err) {
    assert.ok(err);
    finish();
  });
};
