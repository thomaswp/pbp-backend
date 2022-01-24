/**
 * Sums up the items in the given array.
 * Pattern: Accumulator
 * @returns The sum of the items.
 */
function sum(items) {
    let total = 0;                              // Solution
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        total += item;                          // Solution
    }
    return total;                               // Solution
}

sum($$items)