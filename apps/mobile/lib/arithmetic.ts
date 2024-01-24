const RE_OPERATORS = /(?<operator>\+|-|\*|\/)/m;
const RE_ARITHMETIC = /(?<number>[0-9]+)|(?<operator>\+|-|\*|\/)|(?<paren>\(|\))/gm;

type Operator = '+' | '-' | '*' | '/';

export function tokenize(input: string) {
  const matches = [];
  let match;

  while ((match = RE_ARITHMETIC.exec(input)) !== null) {
    if (match?.groups && match.groups['number']) {
      matches.push(parseFloat(match[0]));
    } else if (match?.groups && (match.groups['operator'] || match.groups['paren'])) {
      matches.push(match[0]);
    }
  }

  return matches;
}

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

export function evaluateRpn(tokens: (string | number)[]) {
  console.log('evaluateRpn START, tokens =', tokens);

  const stack: number[] = [];

  for (const token of tokens) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      let op2 = stack.pop();
      let op1 = stack.pop();

      if (!op1 && !op2) return 0;
      if (!op1) return op2 as number;
      if (!op2) return op1 as number;

      stack.push(evaluate(op1, op2, token as Operator));
    }
  }

  console.log('evaluateRpn START, stack =', stack);
  return stack[0];
}

/**
 * Returns true if A has greater precedence over B, false if B has greater precedence, and true if both have the same precedence
 * @param A - an operator
 * @param B - an operator
 * @returns
 */
function precedence(A: string, B: string): boolean {
  const highPrecedence = ['*', '/'];
  const lowPrecedence = ['+', '-'];

  return (
    (highPrecedence.includes(A) && lowPrecedence.includes(B)) ||
    highPrecedence.includes(A) === highPrecedence.includes(B)
  );
}

function evaluate(op1: number, op2: number, operator: Operator) {
  switch (operator) {
    case '+':
      return op1 + op2;
    case '-':
      return op1 - op2;
    case '*':
      return op1 * op2;
    case '/':
      return op1 / op2;
    default:
      throw new Error(`unsupported operator ${operator}`);
  }
}
