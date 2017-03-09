var assert = require('assert');
var proxyquire = require('proxyquire');


var mockReq = {
  url: '/api/test'
};



var mockRoute = {
  "path":"/api/test"
};
exports.testTimingMiddlewareURL = function(finish) {
  var mockRes = {
    end: function() {

    }
  };
  var timingMiddleware = proxyquire('lib/timingMiddleware', {
    './gauge': function() {
      return function(key, tag, value) {
        assert.ok(typeof value === 'number');
        assert.equal(tag.route, mockReq.url);
      };
    },
    './clients': function() {

    }
  });

  timingMiddleware('test', {enabled: true})(mockReq, mockRes, function() {});

  mockRes.end();
  finish();
};


exports.testTimingMiddlewareRoute = function(finish) {
  var mockRes = {
    end: function() {

    }
  };
  var timingMiddleware = proxyquire('lib/timingMiddleware', {
    './gauge': function() {
      return function(key, tag, value) {
        assert.ok(typeof value === 'number');
        assert.equal(tag.route, mockReq.url);
      };
    },
    './clients': function() {

    }
  });

  timingMiddleware('test', {enabled: true})(mockRoute, mockRes, function() {});
  mockRes.end();
  finish();
};


exports.testTimingMiddlewareRouteNonString = function(finish) {
  var mockRes = {
    end: function() {

    }
  };

  var mockRoute = {
    "permissionpath":{}
  };
  var timingMiddleware = proxyquire('lib/timingMiddleware', {
    './gauge': function() {
      return function(/*key, tag, value*/) {
        console.log("called gague");
        assert.fail("should not be called");
      };
    },
    './clients': function() {

    }
  });

  timingMiddleware('test', {enabled: true})(mockRoute, mockRes, function() {});
  mockRes.end();
  finish();

};
