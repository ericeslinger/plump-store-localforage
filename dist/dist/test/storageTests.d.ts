declare global  {
    namespace Chai {
        interface Assertion {
            nested: Assertion;
        }
    }
}
export declare function testSuite(context: any, storeOpts: any): void;
export {};
