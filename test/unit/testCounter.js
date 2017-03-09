var assert = require('assert');
var types = require('../../lib/types');

var clientsMock =  {
  send: function() {}
};

var counter = require('counter')(clientsMock);

exports.inc_should_send_plus_one = function(done) {
  counter.inc('testKey', null, function(err, data) {
    assert.ok(!err);
    assert.ok(data.type, types.C);
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
    assert.ok(data.type, types.C);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testKey');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, -1);
    done();
  });
};