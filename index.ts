import {readFile, writeFileSync} from 'fs';
import {generateGraph, GraphDependency, parseName} from "./lib";
export interface Graph {
    data: {trees: GraphDependency[]}
}
readFile(process.argv[process.argv.length - 1], 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    const parsedJson: Graph = JSON.parse(data);
    const g = generateGraph(parsedJson.data.trees);
    writeFileSync('plop.dot', g);
});