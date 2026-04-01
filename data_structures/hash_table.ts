import { MyArray } from "./array.js";
import MyList from "./list.js";

class MyHashTable<T> {

    private data: MyList<MyArray<[string, T]>>;

    constructor(size: number, enableLogs?: boolean) {
        this.data = new MyList(size, enableLogs)
    }

    private _hash(key: string): number {
        let hash = 0;
        for (let i=0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.data.getSize();
        }
        return hash;
    }

    set(key: string, value: T) {
        const index = this._hash(key);
        if (!this.data.get(index)) {
            const newArray = new MyArray();
            newArray.push([key, value])
            this.data.set(index, newArray);
        } else {
            this.data.get(index)?.push([key, value])
        }
    }

    get(key: string): T | undefined {
        const index = this._hash(key);
        const colisions = this.data.get(index)
        
        if (!colisions) return undefined
        
        const keyValue = colisions.find(kv => kv?.[0]===key);
        return keyValue?.[1]
    }

    keys(): MyArray<string> {
        const result = new MyArray<string>();
        this.data.forEach(address => {
            if(address) {
                address.forEach(kv => result.push(kv![0]))
            }
        })
        return result;
    }

}