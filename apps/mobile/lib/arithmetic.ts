import { isCurrency } from './conversions';
import { Variable } from './types';

const RE_OPERATORS = /(?<operator>\+|-|\*|\/|\^)/m;
const RE_ARITHMETIC =
  /(?<per>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)%)|(?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?))|(?<op>\+|-|\*|\/|\^)|(?<paren>\(|\))|(?<of>of)|(?<var>[A-Za-z0-9_]+)/gm;
type Operator = '+' | '-' | '*' | '/' | '^';

export function tokenizeArithmetic(
  input: string,
  variables: Variable[],
): [(string | number)[], Variable[]] {
  const matches = [];
  const variablesFound = [];
  let match;
  let variable;

  while ((match = RE_ARITHMETIC.exec(input)) !== null) {
    if (match?.groups && match.groups['num']) {
      matches.push(parseFloat(match[0].replace(',', '')));
    } else if (match?.groups && (match.groups['op'] || match.groups['paren'])) {
      matches.push(match[0]);
    } else if (match?.groups && match.groups['var']) {
      const token = match[0] as string;
      if (isCurrency(token)) {
        matches.push(token.toUpperCase());
      } else {
        variable = variables.find((v) => v.name === token);
        matches.push(variable?.value.raw as number);
        variablesFound.push({ ...variable } as Variable);
      }
    } else if (match?.groups && match.groups['per']) {
      matches.push(parseFloat(match[0].replace(',', '').replace('%', '')) / 100);
    } else if (match?.groups && match.groups['of']) {
      matches.push('*');
    }
  }

  return [matches, variablesFound];
}

/**
 * Converts arithmetic expression in infix notation to postfix notation
 * @param tokens - infix expression
 * @returns postfix expression
 */
export function shuntingYard(tokens: (string | number)[]) {
  const outputQueue = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (typeof token === 'number') {
      outputQueue.push(token);
    } else if (RE_OPERATORS.test(token)) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        precedence(operatorStack[operatorStack.length - 1], token)
      ) {
        outputQueue.push(operatorStack.pop() as string);
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      if (operatorStack.length > 0) {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop() as string);
        }
        if (operatorStack[operatorStack.length - 1] === '(') {
          operatorStack.pop();
        }
      }
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop() as string);
  }

  return outputQueue;
}

/**
 * Evaluates the result of an arithmetic expression in postfix notation
 * @param tokens
 * @returns
 */
export function evaluateRpn(tokens: (string | number)[]) {
  console.log('evaluateRpn START, tokens =', tokens);

  const stack: number[] = [];

  for (const token of tokens) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      const op2 = stack.pop();
      const op1 = stack.pop();

      if (!op1 && !op2) return 0;
      if (!op1) return op2 as number;
      if (!op2) return op1 as number;

      stack.push(evalArithmetic(op1, op2, token as Operator));
    }
  }
  +console.log('evaluateRpn START, stack =', stack);
  return stack[0];
}

/**
 * Returns true if A has greater precedence over B, false if B has greater precedence, and true if both have the same precedence
 * @param A - an operator
 * @param B - an operator
 * @returns
 */
function precedence(A: string, B: string): boolean {
  const higherPrecedence = ['^'];
  const highPrecedence = ['*', '/'];
  const lowPrecedence = ['+', '-'];

  return (
    (higherPrecedence.includes(A) && !higherPrecedence.includes(B)) ||
    (highPrecedence.includes(A) && lowPrecedence.includes(B)) ||
    highPrecedence.includes(A) === highPrecedence.includes(B)
  );
}

function evalArithmetic(op1: number, op2: number, operator: Operator) {
  switch (operator) {
    case '+':
      return op1 + op2;
    case '-':
      return op1 - op2;
    case '*':
      return op1 * op2;
    case '/':
      return op1 / op2;
    case '^':
      return op1 ** op2;
    default:
      throw new Error(`unsupported operator ${operator}`);
  }
}
