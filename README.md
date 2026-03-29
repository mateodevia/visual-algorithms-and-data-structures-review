# Visual Algorithms & Data Structures Review

A hands-on **TypeScript** refresher for algorithms and data structures — with AI-assisted step-by-step visual representations built into every implementation.

Rather than just reading theory, you run each algorithm or data structure from the terminal and watch it execute in real time with ASCII visualizations that make the logic click.

---

## What makes this different

Most DSA repos are collections of code snippets. This one is built for **actual understanding**:

- Every algorithm and data structure ships with an **interactive CLI visualizer**
- You see pointer positions, comparisons, swaps, and state changes at each step
- Visualizations were generated with AI assistance, letting the focus stay on the algorithms themselves

---

## Contents

### Data Structures
| Structure | File |
|-----------|------|
| Dynamic Array | [data_structures/array.ts](data_structures/array.ts) |
| Fixed-size List | [data_structures/list.ts](data_structures/list.ts) |
| Circular Queue | [data_structures/queue.ts](data_structures/queue.ts) |

### Sorting Algorithms
| Algorithm | File |
|-----------|------|
| Bubble Sort | [algorithms/sorting/bubble_sort.ts](algorithms/sorting/bubble_sort.ts) |
| Insertion Sort | [algorithms/sorting/insertion_sort.ts](algorithms/sorting/insertion_sort.ts) |
| Merge Sort | [algorithms/sorting/merge_sort.ts](algorithms/sorting/merge_sort.ts) |
| Quick Sort | [algorithms/sorting/quick_sort.ts](algorithms/sorting/quick_sort.ts) |

### Challenges
| Problem | Category | File |
|---------|----------|------|
| Remove item from sorted array | Arrays | [challenges/arrays/0_remove_item_from_ordered_array.ts](challenges/arrays/0_remove_item_from_ordered_array.ts) |
| Rotate array | Arrays | [challenges/arrays/1_rotate_array.ts](challenges/arrays/1_rotate_array.ts) |
| Factorial | Recursion | [challenges/recursion/1_factorial.ts](challenges/recursion/1_factorial.ts) |
| Reverse string | Recursion | [challenges/recursion/2_reverse_string.ts](challenges/recursion/2_reverse_string.ts) |
| Coin change | Greedy | [challenges/greedy/1_coin_change.ts](challenges/greedy/1_coin_change.ts) |

---

## Visualization examples

**Bubble Sort** — sorted region grows from the right, pointer positions shown at each pass:
```
[ 3  1  4  1  5  9  2 ]
   ↑           ↑
   i           j        comparing → swap

[ 1  3  4  1  5  9  2 ]  ✅ ✅ ✅
```

**Circular Queue** — front/rear pointers tracked across the buffer:
```
[ _  _  3  7  2  _  _ ]
         ↑        ↑
         F        R
```

**Coin Change** — full recursion tree with path annotations:
```
change(11)
  change(6)   [coin=5]
    change(1)   [coin=5]
    change(0)   [coin=6] ← new best!
  change(5)   [coin=6]
    change(0)   [coin=5] ← new best!
```

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Run any file directly with tsx
npx tsx algorithms/sorting/bubble_sort.ts
npx tsx data_structures/queue.ts
npx tsx challenges/greedy/1_coin_change.ts
```

Interactive visualizers accept commands at the prompt — each command prints the updated state automatically.

---

## Stack

- **TypeScript** 5.x with strict mode
- **tsx** for zero-config execution (no build step needed)
- **Node.js** ESM modules

---

## Project philosophy

The algorithm and data structure implementations are written by hand — that's the whole point. AI is used exclusively for the **visualization layer**: the ASCII rendering, pointer alignment, and CLI framework that makes each step observable. This separation keeps the learning honest while removing the friction of building debug tooling from scratch.
