var assert = require('assert');

var influxmock =  {
  send: function() {}
};

var timed = require('gauge')(influxmock);

exports.timed_should_send_valid_object = function(done) {
  timed('testKey', {route: '/api/test'}, 100, function(err, data) {
    assert.ok(!err);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testKey');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, 100);
    assert.equal(data.tags.route, '/api/test');
    done();
  });
};
