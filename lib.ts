import {Digraph, digraph, INode, toDot} from "ts-graphviz";

export interface GraphDependency {
    name: string;
    children?: GraphDependency[];
    hint?: null;
    color?: null;
    depth?: number;
}

export interface Dependency {
    name: string;
    version: string;
}

export const parseName = (name: string): Dependency => {
    const indexOfVersion = name.lastIndexOf('@')
    return {
        name: name.substr(0, indexOfVersion),
        version: name.substr(indexOfVersion + 1),
    }
}

const children = (topLevelDependency: GraphDependency, nodes: Map<string, INode>, links: Set<string>, g: Digraph) => {
    const parent = parseName(topLevelDependency.name)
    const parentNode = nodes.get(parent.name);
    if (parentNode !== undefined) {
        topLevelDependency.children?.map(child => {
            const childDependency = parseName(child.name)
            const childNode = nodes.get(childDependency.name);
            if (childNode !== undefined) {
                if (parent.name === childDependency.name) {
                    console.log('dependency on itself...', topLevelDependency.name, childDependency.name);
                } else {
                    let link = `${parent.name}-${child.name}`;
                    if (!links.has(link)){
                        links.add(link);
                        g.createEdge([parentNode, childNode])
                    }
                }
            } else {
                console.log('child node unknown', child.name)
            }
            if (child.children?.length ?? 0 >= 0) {
                children(child, nodes, links, g);
            }
        })
    } else {
        console.error('no parent node');
    }
}

export const generateGraph = (graphDependency: GraphDependency[]): string => {
    const nodes = new Map<string, INode>();
    const links = new Set<string>();
    const g = digraph('G');
    graphDependency.map(tree => {
        const dependency = parseName(tree.name)
        nodes.set(dependency.name, g.createNode(dependency.name));
    });
    graphDependency.map(topLevelDependency => {
        children(topLevelDependency, nodes, links, g);
    });
    return toDot(g);
}