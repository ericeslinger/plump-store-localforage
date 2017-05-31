import { KeyValueStore, ModelData, ModelSchema, StorageOptions } from 'plump';
export declare class LocalForageStore extends KeyValueStore {
    private localforage;
    constructor(opts?: StorageOptions & {
        name?: string;
        storeName?: string;
    });
    addSchema(t: {
        type: string;
        schema: ModelSchema;
    }): Promise<void>;
    _keys(type: string): Promise<string[]>;
    _get(k: string): Promise<ModelData>;
    _set(k: string, v: ModelData): Promise<any>;
    _del(k: string): Promise<ModelData>;
}
