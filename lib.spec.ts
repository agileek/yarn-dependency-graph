import {Dependency, generateGraph, GraphDependency, parseName} from "./lib";

describe('parseName', () => {
    test('should parse dependency name', async () => {
        expect(parseName("unicode-canonical-property-names-ecmascript@1.0.4")).toEqual({
            name: "unicode-canonical-property-names-ecmascript",
            version: "1.0.4"
        })
        expect(parseName("@babel/helper-explode-assignable-expression@7.7.4")).toEqual({
            name: "@babel/helper-explode-assignable-expression",
            version: "7.7.4"
        })
    });
});

describe('generateGraph', () => {
    const firstDependency: GraphDependency = {name: "firstDep@version", children: []};
    const secondDependency: GraphDependency = {name: "secondDep@otherversion", children: []};
    test('no child dependency', async () => {
        expect(generateGraph([firstDependency, secondDependency])).toEqual(`digraph "G" {
  "firstDep";
  "secondDep";
}`);
    });
    test('one level dependency', async () => {
        expect(generateGraph([firstDependency, {...secondDependency, children: [firstDependency]}])).toEqual(`digraph "G" {
  "firstDep";
  "secondDep";
  "secondDep" -> "firstDep";
}`);
    });
    test('two levels', async () => {
        const thirdDependency: GraphDependency = {name: "thirdDep@thirdVersion", children: []};
        expect(generateGraph([{...firstDependency, children: [{...secondDependency, children: [thirdDependency]}]}, secondDependency, thirdDependency])).toEqual(`digraph "G" {
  "firstDep";
  "secondDep";
  "thirdDep";
  "firstDep" -> "secondDep";
  "secondDep" -> "thirdDep";
}`);
    });
});