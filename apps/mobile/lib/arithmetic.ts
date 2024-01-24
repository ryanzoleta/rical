const RE_OPERATORS = /(?<operator>\+|-|\*|\/)/m;
const RE_ARITHMETIC = /(?<number>[0-9]+)|(?<operator>\+|-|\*|\/)/gm;

export function tokenize(input: string) {
  const matches = [];
  let match;

  while ((match = RE_ARITHMETIC.exec(input)) !== null) {
    if (match?.groups && match.groups['number']) {
      matches.push(parseFloat(match[0]));
    } else if (match?.groups && match.groups['operator']) {
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
      while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop() as string);
      }
      operatorStack.push(token);
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

      if (!op1 || !op2) throw new Error('syntax error i think');

      switch (token) {
        case '+':
          stack.push(op1 + op2);
          break;
        case '-':
          stack.push(op1 - op2);
          break;
        case '*':
          stack.push(op1 * op2);
          break;
        case '/':
          stack.push(op1 / op2);
          break;
        default:
          throw new Error(`unsupported operator ${token}`);
      }
    }
  }

  console.log('evaluateRpn START, stack =', stack);
  return stack[0];
}
