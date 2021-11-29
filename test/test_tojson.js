'use strict';

const assert = require('assert').strict;
const ueberdb = require('../index');
const util = require('util');

describe(__filename, function () {
  let db = null;

  before(async function () {
    const udb = new ueberdb.Database('memory', {}, {});
    db = {};
    for (const fn of ['init', 'close', 'set', 'get']) db[fn] = util.promisify(udb[fn].bind(udb));
    await db.init();
  });

  after(async function () {
    await db.close();
  });

  it('no .toJSON method', async function () {
    await db.set('key', {prop: 'value'});
    assert.deepEqual(await db.get('key'), {prop: 'value'});
  });

  it('direct', async function () {
    await db.set('key', {toJSON: (arg) => `toJSON ${arg}`});
    assert.equal(await db.get('key'), 'toJSON ');
  });

  it('object property', async function () {
    await db.set('key', {prop: {toJSON: (arg) => `toJSON ${arg}`}});
    assert.deepEqual(await db.get('key'), {prop: 'toJSON prop'});
  });

  it('array entry', async function () {
    await db.set('key', [{toJSON: (arg) => `toJSON ${arg}`}]);
    assert.deepEqual(await db.get('key'), ['toJSON 0']);
  });
});