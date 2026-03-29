import { runCLI } from "../cli.js";

class List {
    constructor(pSize: number, enableLogs?: boolean) {
        this.items = new Array(pSize).fill(undefined);
        this.size = pSize;
        if (enableLogs) {
            console.log("List Initialized:");
            this.printVisualRepresentation();
        }
    }

    private items: (number | undefined)[] = [];
    
    private size: number;

    get(index: number) {
        return this.items[index];
    }

    set(index: number, value: any) {
        this.items[index] = value;
    }

    getSize() {
        return this.size;
    }

    getSubList (firstIndex: number, lastIndex: number) {
        const subList = new List(lastIndex - firstIndex + 1);
        for (let i = firstIndex; i <= lastIndex; i++) {
            subList.set(i-firstIndex, this.items[i]);
        }
        return subList;
    }

    printVisualRepresentation(): void {
        const visual = this.items.map(item => item === undefined ? "_" : String(item));
        console.log(`[ ${visual.join(", ")} ]`);
    }

    getVisualElements(): string[] {
        return Array.from({ length: this.getSize() }, (_, k) => {
            const val = this.get(k);
            return val === undefined ? "_" : String(val);
        });
    }
}

function main() {
    const list = new List(5, true)
    return list;
}

const isMain = process.argv[1]?.endsWith("list.js");
if (isMain) {
    runCLI({
        s: ([index, value], l) => l.set(Number(index), Number(value)),
    }, main);
}

export default List;