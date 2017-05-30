import * as localforage from 'localforage';
import { KeyValueStore, ModelData, ModelSchema, StorageOptions } from 'plump';

function saneNumber(i) {
  return ((typeof i === 'number') && (!isNaN(i)) && (i !== Infinity) && (i !== -Infinity));
}

export class LocalForageStore extends KeyValueStore {

  private localforage;

  constructor(opts: StorageOptions & {name?: string, storeName?: string} = {}) {
    super(opts);
    this.localforage = localforage.createInstance({
      name: opts.name || 'Plump Storage',
      storeName: opts.storeName || 'localCache',
    });
  }

  addSchema(t: {type: string, schema: ModelSchema}) {
    return super.addSchema(t)
    .then(() => {
      return this._keys(t.type)
      .then((keyArray) => {
        if (keyArray.length === 0) {
          return 0;
        } else {
          return keyArray.map((k) => k.split(':')[1])
          .map((k) => parseInt(k, 10))
          .filter((i) => saneNumber(i))
          .reduce((max, current) => (current > max) ? current : max, 0);
        }
      }).then((n) => {
        this.maxKeys[t.type] = n;
      });
    });
  }


  _keys(type: string): Promise<string[]> {
    return Promise.resolve(this.localforage.keys())
    .then((keyArray) => keyArray.filter((k) => k.indexOf(`${type}:`) === 0));
  }

  _get(k: string): Promise<ModelData> {
    return Promise.resolve(this.localforage.getItem(k)) as Promise<ModelData>;
  }

  _set(k: string, v: ModelData) {
    return Promise.resolve(this.localforage.setItem(k, v));
  }

  _del(k: string): Promise<ModelData> {
    return Promise.resolve(this.localforage.removeItem(k)).then(() => null) as Promise<ModelData>;
  }
}
