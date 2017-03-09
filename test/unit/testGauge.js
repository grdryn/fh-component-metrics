var assert = require('assert');
var types = require('../../lib/types');

var clientsMock =  {
  send: function() {}
};

var timed = require('gauge')(clientsMock, types.G);

exports.timed_should_send_valid_object = function(done) {
  timed('testKey', {route: '/api/test'}, 100, function(err, data) {
    assert.ok(!err);
    assert.equal(data.type, types.G);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testKey');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, 100);
    assert.equal(data.tags.route, '/api/test');
    done();
  });
};
