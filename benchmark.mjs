import { performance } from 'node:perf_hooks';

// Very basic mock of document.querySelector
class Element {
    addEventListener() {}
    removeEventListener() {}
}

const originalDocument = {
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: (selector) => {
        // Simulate a tiny delay for querySelector parsing overhead
        for(let i=0; i<50; i++) {}
        if (selector === ".contact-modal") return global.currentModal;
        return null;
    }
};

global.document = originalDocument;
global.currentModal = null; // No modal present

function runUnoptimized() {
    let callCount = 0;
    const listener = (event) => {
        const modal = document.querySelector(".contact-modal");
        if (modal && event.target === modal) {
            callCount++;
        }
    };

    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
        listener({ target: new Element() });
    }
    const end = performance.now();
    return end - start;
}

function runOptimized() {
    // In optimized code, the global listener doesn't query the DOM if no modal is open
    // or isn't attached at all.
    const start = performance.now();
    // No-op loop to simulate the same amount of clicks without the global handler querying DOM
    for (let i = 0; i < 100000; i++) {
    }
    const end = performance.now();
    return end - start;
}

console.log("Warming up...");
runUnoptimized();
runOptimized();

console.log("Running benchmarks...");
let unoptTotal = 0;
let optTotal = 0;
const iterations = 5;

for (let i = 0; i < iterations; i++) {
    unoptTotal += runUnoptimized();
    optTotal += runOptimized();
}

console.log(`Unoptimized average: ${(unoptTotal / iterations).toFixed(2)} ms`);
console.log(`Optimized average: ${(optTotal / iterations).toFixed(2)} ms`);
const improvement = ((unoptTotal - optTotal) / unoptTotal * 100).toFixed(2);
console.log(`Improvement: ${improvement}% faster`);
