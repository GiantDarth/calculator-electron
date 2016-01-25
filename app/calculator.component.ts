import {Component} from 'angular2/core';
import {Token, Constant, Operator, ADD, SUBTRACT, MULTIPLY, DIVIDE} from './token';
import {Arithmetic} from './arithmetic';

@Component({
    selector: 'calculator',
    templateUrl: 'app/calculator.html'
})
export class Calculator {
    numbers: Constant[] = [
        new Constant('7', 7),
        new Constant('8', 8),
        new Constant('9', 9),
        new Constant('4', 4),
        new Constant('5', 5),
        new Constant('6', 6),
        new Constant('1', 1),
        new Constant('2', 2),
        new Constant('3', 3),
        new Constant('0', 0)
    ];
    sign: Token = new Token('±');
    period: Token = new Token('.');
    ops: Operator[] = [
        MULTIPLY,
        DIVIDE,
        ADD,
        SUBTRACT
    ]

    registeredTokens: Token[] = [];
    display: string = "";
    hasError: boolean = false;
    periodSet: boolean = false;
    result: number = null;

    onError() {
        this.registeredTokens = [];
        this.display = "";
        this.hasError = false;
    }

    onNumber(e, token: Constant) {
        if(this.hasError) {
            this.onError();
        }

        let lastToken = this.registeredTokens[this.registeredTokens.length - 1];
        if(lastToken instanceof Constant) {
            if(lastToken.symbol.includes('.')) {
                this.registeredTokens[this.registeredTokens.length - 1] = new Constant(lastToken.symbol + token.symbol, parseFloat(lastToken.symbol + token.symbol));
            }
            else {
                this.registeredTokens[this.registeredTokens.length - 1] = new Constant(lastToken.symbol + token.symbol, parseInt(lastToken.symbol + token.symbol));
            }

        }
        else {
            this.registeredTokens.push(token);
        }
        this.parseDisplay();
    }

    onPeriod(e) {
        let lastToken = this.registeredTokens[this.registeredTokens.length - 1];
        if(lastToken instanceof Operator) {
            this.registeredTokens.push(new Constant('0.', 0.0));
        }
        else if(lastToken instanceof Constant) {
            if(!lastToken.symbol.includes('.')) {
                this.registeredTokens[this.registeredTokens.length - 1] = new Constant(lastToken.symbol + '.', lastToken.value);
            }
        }
        this.parseDisplay();
    }

    onSign(e) {
        let lastToken = this.registeredTokens[this.registeredTokens.length - 1];
        if(lastToken instanceof Constant) {
            let value = -lastToken.value;
            this.registeredTokens[this.registeredTokens.length - 1] = new Constant(value.toString(), value);
        }
        this.parseDisplay();
    }

    onOp(e, token: Operator) {
        if(this.hasError) {
            this.onError();
        }
        let lastToken: Token = this.registeredTokens[this.registeredTokens.length - 1];
        if(lastToken instanceof Operator && token !== this.sign) {
            this.registeredTokens[this.registeredTokens.length - 1] = token;
        }
        else if(lastToken instanceof Constant) {
            if(token === this.sign) {
                let value = token.action([ (<Constant>lastToken).value ]);
                this.registeredTokens[this.registeredTokens.length - 1] = new Constant(value.toString(), value);
            }
            else {
                this.registeredTokens.push(token);
            }
        }
        this.parseDisplay();
    }

    parseDisplay() {
        let text = "";
        console.log(this.registeredTokens);
        for(let i = 0; i < this.registeredTokens.length; i++) {
            let token = this.registeredTokens[i];
            if(token instanceof Operator) {
                text += ' ' + this.registeredTokens[i].symbol + ' ';
            }
            else {
                text += token.symbol;
            }
        }

        this.display = text;
    }

    onClear(e) {
        this.registeredTokens = [];
        this.display = "";
    }

    onEnter(e) {
        if(this.hasError) {
            return;
        }

        this.result = Arithmetic.eval(Arithmetic.toPolishNotation(this.registeredTokens));
        this.display = this.result.toString();
        this.registeredTokens = [ new Constant(this.result.toString(), this.result) ];
    }
}
