var test = require("test");
test.setup();

var coroutine = require('coroutine');

var e = require("../src/index.js");

var v1, v2;

function t1(a1, a2) {
	v1 = v1 + a1 - a2 + 1234;
}

function t2(a1, a2) {
	v2 = v2 + a1 - a2 + 4321;
}

function t3() {
	coroutine.sleep(100);	
}

function t4() {
	coroutine.sleep(100);	
}

describe('trigger', function() {
	it("on", function() {
		v1 = v2 = 0;
		e.on('test', t1);
		e.trigger('test', 200, 100);
		assert.equal(0, v1);
		assert.equal(0, v2);
		coroutine.sleep(10);
		assert.equal(1334, v1);
		assert.equal(0, v2);

		e.on('test', t2);
		e.trigger('test', 2000, 1000);
		coroutine.sleep(10);
		assert.equal(3568, v1);
		assert.equal(5321, v2);
	});

	it("fib", function() {
		e.on('fib', t3);
		e.on('fib', t4);
		e.trigger('fib');
		coroutine.sleep(10);
		assert.equal(e.fib(), 2);
	});

	it("off", function() {
		e.off('test', t1);
		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(3568, v1);
		assert.equal(9652, v2);
	});

	it("once", function() {
		e.once('test', t1);
		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(4812, v1);
		assert.equal(13983, v2);
	});

	it("off all", function() {
		e.off('test', t2);
		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(4812, v1);
		assert.equal(13983, v2);
	});

	it("on({...})", function() {
		e.on({
			test: t1,
			test1: t2
		});
		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(6056, v1);
		assert.equal(13983, v2);
		e.trigger('test1', 20, 10);
		coroutine.sleep(10);
		assert.equal(6056, v1);
		assert.equal(18314, v2);
	});

	it("off({...})", function() {
		e.off({
			test: t1,
			test1: t2
		});
		e.trigger('test', 20, 10);
		e.trigger('test1', 20, 10);
		coroutine.sleep(10);
		assert.equal(6056, v1);
		assert.equal(18314, v2);
	});

	it("overwrite", function() {
		e.on('test', t1);
		e.once('test', t1);
		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(7300, v1);
		assert.equal(18314, v2);

		e.trigger('test', 20, 10);
		coroutine.sleep(10);
		assert.equal(7300, v1);
		assert.equal(18314, v2);
	});

	it("triggerSync", function() {
		e.off();
		v1 = v2 = 0;
		e.on('test', t1);
		e.triggerSync('test', 200, 100);
		assert.equal(1334, v1);
		assert.equal(0, v2);

		e.on('test', t2);
		e.triggerSync('test', 2000, 1000);
		assert.equal(3568, v1);
		assert.equal(5321, v2);
	});
});

test.run();