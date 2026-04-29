import { executeMain, runCLI } from "../cli.js";

class MyList<T> {

    private items: (T | undefined)[];
    
    private size: number;

    constructor(pSize: number, enableLogs?: boolean) {
        this.items = new Array(pSize).fill(undefined);
        this.size = pSize;
        if (enableLogs) {
            console.log("List Initialized:");
            this.printVisualRepresentation();
        }
    }

    get(index: number) {
        return this.items[index];
    }

    set(index: number, value: any) {
        this.items[index] = value;
    }

    getLength() {
        return this.size;
    }

    getSubList (firstIndex: number, lastIndex: number): MyList<T> {
        const subList = new MyList<T>(lastIndex - firstIndex + 1);
        for (let i = firstIndex; i <= lastIndex; i++) {
            subList.set(i-firstIndex, this.items[i]);
        }
        return subList;
    }

    find(callback: (item?: T) => boolean): T | undefined {
        let found = false;
        for (let i = 0 ; i < this.size; i++) {
            found = callback(this.items[i])
            if (found) return this.items[i]
        }
        return undefined
    }

    forEach(callback: (item?: T, i?: number) => void): void {
        for (let i = 0 ; i < this.size; i++) {
            callback(this.items[i], i);
        }
    }

    printVisualRepresentation(): void {
        const visual = this.items.map(item => item === undefined ? "_" : String(item));
        console.log(`[ ${visual.join(", ")} ]`);
    }

    getVisualElements(): string[] {
        return Array.from({ length: this.getLength() }, (_, k) => {
            const val = this.get(k);
            return val === undefined ? "_" : String(val);
        });
    }
}

executeMain('list.ts', () => {
    runCLI({
        s: ([index, value], list) => list.set(Number(index), Number(value)),
        g: ([index], list) => console.log('Retrieved value', list.get(Number(index))),
    }, () => new MyList(5, true))
});

export default MyList;