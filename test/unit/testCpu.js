var assert = require('assert');
var proxyquire = require('proxyquire');
var os = require('os');

var mocks = {
  './lib/sender': function() {
    this.send = function() {};
  }
};

var metrics = proxyquire('index.js', mocks)({enabled: true});
var component = 'testComponent';

var customGetUsage = function(cb) {
  var data = "2987 (inet_gethost) S 2986 2986 2986 0 -1 4202560 170 0 0 0 0 0 0 0 20 0 1 0 4250 9691136 168 18446744073709551615 1 1 0 0 0 0 0 69760 0 18446744073709551615 0 0 17 0 0 0 0 0 0";
  var elems = data.toString().split(' ');
  var utime = parseInt(elems[13]);
  var stime = parseInt(elems[14]);

  cb(undefined,utime + stime);
};

exports.afterEach = function(done) {
  metrics.cpu(component, {stop: true}, done);
};

exports.cpu_should_send_valid_object = function(finish) {
  var called = false;

  metrics.cpu(component, {interval: 10, period: 5,"getUsage": customGetUsage}, function(err, data) {
    assert.ok(!err);
    assert.ok(data.hasOwnProperty('key'));
    assert.equal(data.key, 'testComponent_cpu');
    assert.ok(data.hasOwnProperty('fields'));
    assert.ok(data.fields.hasOwnProperty('cpuUsed'));
    assert.equal(typeof data.fields.cpuUsed, 'number');
    assert.ok(data.hasOwnProperty('tags'));
    assert.equal(data.tags.hostname, os.hostname());
    assert.equal(data.tags.workerId, 'master');
    if (!called) {
      called = true;
      finish();
    }
  });
};

exports.cpu_should_not_send_twice_to_same_series = function(finish) {
  metrics.cpu(component, {interval: 10, period: 5,"getUsage": customGetUsage}, function(err, data) {
    assert.ok(!err, err);
    metrics.cpu(component, {interval: 10, period: 5, getUsage:customGetUsage}, function(err) {
      assert.ok(err);
      finish();
    });
  });
};

exports.cpu_should_calculate_percentage_usage = function(finish) {
  var first = true;
  function getUsage(cb) {
    if (first) {
      first = false;
      return cb(null, 0);
    }
    return cb(null, 60);
  }

  metrics.cpu(component, {interval: 10, period: 5,"getUsage": getUsage}, function(err, data) {
    assert.ok(!err);
    assert.equal(data.fields.cpuUsed, 0.6);
    finish();
  });
};