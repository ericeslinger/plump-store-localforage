import { ModelSchema, RelationshipSchema, Model, ModelData, RelationshipItem } from 'plump';
export declare const ChildrenSchema: RelationshipSchema;
export declare const ValenceChildrenSchema: RelationshipSchema;
export declare const TestSchema: ModelSchema;
export interface PermRelationshipItem extends RelationshipItem {
    meta: {
        perm: number;
    };
}
export interface TestData extends ModelData {
    type: 'tests';
    id: number;
    attributes?: {
        id: number;
        name: string;
        otherName: string;
        extended: {
            [key: string]: any;
        };
    };
    relationships?: {
        children: RelationshipItem[];
        parents: RelationshipItem[];
        valenceChildren: PermRelationshipItem[];
        valenceParents: PermRelationshipItem[];
    };
}
export declare class TestType extends Model<TestData> {
    static type: string;
}
