export class Token {
    constructor(public symbol: string) {

    }
}

export class Constant extends Token {
    constructor(symbol: string, public value: number) {
        super(symbol);
    }
}

export class Operator extends Token {
    constructor(symbol: string, public precedence: number, public numOfArgs: number, public associativity: Associativity, public action: (args: number[]) => number) {
        super(symbol);
    }
}

export class Parenthesis extends Token {
    constructor(symbol: string, public direction: ParenDirection) {
        super(symbol);
    }
}

export enum Associativity {
    Left, Right
}

export enum ParenDirection {
    Left, Right
}

export const EXP: Operator = new Operator('^', 0, 2, Associativity.Right, function(args: number[]): number {
        if(args[0] === 0 && args[1] === 0) {
            throw Error("0^0 is undefined.");
        }
        else {
            return Math.pow(args[0], args[1]);
        }
    }
);

export const MULTIPLY: Operator = new Operator('*', 1, 2, Associativity.Left, function(args: number[]): number {
        return args[0] * args[1];
    }
);

export const DIVIDE: Operator = new Operator('/', 1, 2, Associativity.Left, function(args: number[]): number {
        if(args[1] === 0) {
            // 0 / 0 is NotANumber.
            if(args[0] === 0) {
                return NaN;
            }
            else {
                throw Error("Division by zero.");
            }
        }
        else {
            return args[0] / args[1];
        }
    }
);

export const ADD: Operator = new Operator('+', 2, 2, Associativity.Left, function(args: number[]): number {
        return args[0] + args[1];
    }
);
export const SUBTRACT: Operator = new Operator('-', 2, 2, Associativity.Left, function(args: number[]): number {
        return args[0] - args[1];
    }
);
