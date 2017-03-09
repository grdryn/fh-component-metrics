var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');

var inc = sinon.spy();
var dec = sinon.spy();
var gauge = sinon.spy();
var memory = sinon.spy();
var cpu = sinon.spy();

var counter = function() {
  return {
    inc: inc,
    dec: dec
  };
};

var mockGauge = function() {
  return gauge;
};
var mockMemory = function() {
  return memory;
};
var mockCpu = function() {
  return cpu;
};

var metrics = proxyquire('../../index.js', {
  './lib/counter': counter,
  './lib/cpu': mockCpu,
  './lib/memory': mockMemory,
  './lib/gauge': mockGauge
});

function checkMetric(m, shouldCalled) {
  assert.equal(typeof m.cpu, 'function');
  assert.equal(typeof m.memory, 'function');
  assert.equal(typeof m.gauge, 'function');
  assert.equal(typeof m.inc, 'function');
  assert.equal(typeof m.dec, 'function');
  m.cpu();
  assert.equal(cpu.called, shouldCalled);
  m.memory();
  assert.equal(memory.called, shouldCalled);
  m.gauge();
  assert.equal(gauge.called, shouldCalled);
  m.inc();
  assert.equal(inc.called, shouldCalled);
  m.dec();
  assert.equal(dec.called, shouldCalled);
}

function reset () {
  cpu.reset();
  memory.reset();
  gauge.reset();
  inc.reset();
  dec.reset();
}

exports.test_metricsEnabled = function(done) {
  var m = metrics({enabled: true, host: 'localhost'});
  checkMetric(m, true);
  done();
};

exports.test_metricsDisabled = function(done) {
  reset();
  var m = metrics({enabled: false});
  checkMetric(m, false);
  done();
};