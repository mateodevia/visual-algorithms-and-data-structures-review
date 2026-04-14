import { executeMain, runCLI } from "../cli.js";
import MyArray from "./array.js";
import MyList from "./list.js";

class MyAdjacentListGraph {

    private numberOfNodes: number;
    private adjacentList: Record<number, MyArray<number>>;

    private enableLogs: boolean;

    /**
     * @param enableLogs - When true, logs an initial empty visualization.
     */
    constructor(enableLogs?: boolean) {

        this.numberOfNodes = 0;
        this.adjacentList = {};

        this.enableLogs = enableLogs ?? false;

        if (enableLogs) {
            console.log("Initialized binary search tree:");
            this.printVisualRepresentation();
        }
    }

    addEdge(node1: number, node2: number) {
        if (this.enableLogs) console.log(`Adding connection between ${node1} and ${node2}...`);
        const node1Links = this.adjacentList[node1];

        const existingLink = node1Links?.find(node => node === node2);

        if (existingLink) {
            console.warn('Edge already exists');
            return;
        }

        const node2Links = this.adjacentList[node2];

        node1Links.push(node2);
        node2Links.push(node1);
    }

    addVertex(value: number) {
        if (this.enableLogs) console.log(`Adding ${value}...`);

        const existingNode = this.adjacentList[value];

        if (existingNode) {
            console.warn('Node already exists');
            return;
        }
        this.adjacentList[value] = new MyArray<number>();
        this.numberOfNodes ++;
    }

    /**
     * Lines like `// 0-->1 2` for each vertex (sorted by vertex id).
     * Neighbor order follows the underlying adjacency lists.
     */
    getVisualElements(): string[] {
        const vertexIds = Object.keys(this.adjacentList)
            .map(Number)
            .sort((a, b) => a - b);

        return vertexIds.map((v) => {
            const links = this.adjacentList[v];
            const neighbors: string[] = [];
            links?.forEach((n) => neighbors.push(String(n)));
            return ` ${v}-->${neighbors.join(" ")}`;
        });
    }

    printVisualRepresentation() {
        for (const line of this.getVisualElements()) {
            console.log(line);
        }
    }
}

executeMain("adjacent_list_graph.ts", () => {
    runCLI(
        {
            v: ([value], graph) => graph.addVertex(Number(value)),
            e: (args, graph) => graph.addEdge(Number(args[0]), Number(args[1])),
        },
        () => {
            const graph = new MyAdjacentListGraph(true);
            graph.printVisualRepresentation();
 
            return graph;
        }
    );
});

export default MyAdjacentListGraph;