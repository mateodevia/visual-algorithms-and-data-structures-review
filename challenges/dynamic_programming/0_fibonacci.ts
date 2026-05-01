import { executeMain } from "../../cli.js";

const fibonacci = (n: number): number => {
    const cache: Record<number, number> = {};
    const fib = (n: number): number => {
        if (cache[n]) return cache[n];
        console.log('Calculating fib of', n)

        if (n<2) return n;
    
        cache[n] = fib(n-1) + fib(n-2);
        return cache[n];
    }
    return fib(n);
}

executeMain("0_fibonacci.ts", () => {

    console.log(fibonacci(10));
});