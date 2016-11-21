var assert = require('assert');

var influxmock =  {
  send: function() {}
};

var counter = require('counter')(influxmock);

exports.inc_should_send_plus_one = function(done) {
  counter.inc('testKey', null, function(err, data) {
    assert.ok(!err);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testKey');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, 1);
    done();
  });
};

exports.inc_should_send_minus_one = function(done) {
  counter.dec('testKey', null, function(err, data) {
    assert.ok(!err);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testKey');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, -1);
    done();
  });
};