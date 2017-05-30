
import { LocalForageStore } from '../src/index';
import { testSuite } from './storageTests';
import { TestType } from './testType';
import * as localforage from 'localforage';

import * as chai from 'chai';
const expect = chai.expect;

testSuite({
  describe, it, before, after,
}, {
  ctor: LocalForageStore,
  opts: {
    terminal: true,
    name: 'Plump TEST Storage',
    storeName: 'localCache',
  },
  name: 'Plump Localforage Store',
  before: () => {
    localforage.config({
      name: 'Plump TEST Storage',
      storeName: 'localCache',
    });
    return localforage.clear();
  },
  after: () => {
    return localforage.clear();
  },
});

describe('localforage-specific functionality', () => {
  it('should pre-allocate id values based on the store contents', () => {
    localforage.config({
      name: 'Plump TEST Storage',
      storeName: 'localCache',
    });
    const testStore = new LocalForageStore({
      terminal: true,
      name: 'Plump TEST Storage',
      storeName: 'localCache',
    });
    return localforage.clear()
    .then(() => localforage.setItem(testStore.keyString({ type: TestType.type, id: 1 }), 'foo'))
    .then(() => localforage.setItem(testStore.keyString({ type: TestType.type, id: 7 }), 'foo'))
    .then(() => testStore.addSchema(TestType))
    .then(() => testStore.allocateId(TestType.type))
    .then((n) => expect(n).to.equal(8))
    .then(() => testStore.allocateId(TestType.type))
    .then((n) => expect(n).to.equal(9));
  });
});

require('./model.spec'); // tslint:disable-line no-require-imports
