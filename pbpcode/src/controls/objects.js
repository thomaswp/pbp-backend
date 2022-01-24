import { v4 as uuid } from 'uuid';

export class Loop {
    constructor(makeIterator) {
        this.makeIterator = makeIterator;
        this.history = [];
        this.lastContext = null;
        this.startHandlers = [];
        this.loopHandlers = [];
        this.finished = new Map();
    }

    iterator(parentContext) {
        const next = this.makeIterator(parentContext);
        const iterHistory = [];
        this.history.push(iterHistory);
        this.finished.set(parentContext, false);
        this.lastContext = parentContext;
        let i = 0;
        this.startHandlers.forEach(h => h(parentContext));
        const iter = {
            next: () => {
                const iterContext = new IterContext(parentContext, i);
                const n = next(iterContext);
                if (n === undefined) {
                    this.finished.set(parentContext, true);
                    return undefined;
                }
                iterHistory.push(n);
                this.loopHandlers.forEach(h => h(n, i, iterContext));
                i++;
                return n;
            },
        }
        return iter;
    }

    addLoopHandler(handler) {
        this.loopHandlers.push(handler);
    }

    addStartHandler(handler) {
        this.startHandlers.push(handler);
    }

    ensureRun(context) {
        if (this.history.length > 0) {
            if (context == null || this.lastContext == context) {
                // console.log('Already run for: ', context);
                return;
            }
        }
        this.#run(context);
    }

    isFinished(context) {
        return this.finished.get(context) || false;
    }

    #run(context) {
        const iterator = this.iterator(context);
        const list = [];
        let item;
        while ((item = iterator.next()) !== undefined) {
            list.push(item);
        }
        return list;
    }
}

export class ValueGenerator {
    constructor(generator, lazy) {
        this.generator = generator;
        this.history = [];
        this.lastContext = null;
        this.lazy = lazy | false;
    }

    get(context) {
        if (this.history.length > 0) {
            if (context == null || this.lastContext == context) {
                // console.log('Already gotten: ', context);
                // I don't think there's ever a reason to check more than
                // the last context
                return this.history[this.history.length - 1];
            }
        }
        const val = this.generator(context);
        this.lastContext = context;
        // TODO: Should probably be storing context somewhere for preview
        this.history.push(val);
        return val;
    }
}

export class Context {
    constructor(parent) {
        this.parent = parent;
        this.id = uuid();
    }

    // push() {
    //     return new Context(this);
    // }

    // pop() {
    //     return this.parent;
    // }

    // copy() {
    //     // TODO: is deep copy needed?
    //     return new Context(this.parent, this.id);
    // }
}

export class IterContext extends Context {
    constructor(parent, iteration) {
        super(parent);
        this.iteration = iteration;
    }
}