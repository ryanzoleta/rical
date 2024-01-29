// import { getLocales } from 'expo-localization';
import { Result, Variable } from './types';

export const RE_ASSIGN = /^([A-Za-z0-9]+)( *)=(.*)$/m;
export const RE_COMMENT = /^#(.*)$/m;
export const RE_CONVERSION =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)?(?<src>[a-zA-Z]+) +(to|in) (?<dest>[a-zA-Z]+)$/m;
const RE_OPERATORS = /(?<operator>\+|-|\*|\/)/m;
const RE_ARITHMETIC =
  /(?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?))|(?<op>\+|-|\*|\/)|(?<paren>\(|\))|(?<var>[A-Za-z0-9]+)/gm;
type Operator = '+' | '-' | '*' | '/';

// export const RE_CURRENCY =
//   /((\$|₱) *[0-9]+)|( *[0-9]+ *(\$|₱))|([a-zA-Z]{3} *[0-9]+)|([0-9]+ *[a-zA-Z]{3})/m;
// const RE_CURRENCY_CONVERSION =
//   /^(((?<amount>[0-9]+)( *)(?<currency1>usd|php))|((?<currency1>\$|\₱)(?<amount>[0-9]+)))( *)(in)( *)(?<currency2>usd|php)$/gm;

// const locales = getLocales();
// const locale = locales.slice(-1)[0].regionCode ?? 'US';

export function evaluate(input: string, variables: Variable[]) {
  // const formatType: FormatType = determineOutputFormat(input);

  if (isConversion(input)) {
    const tokens = tokenizeConversion(input, variables);
    console.log('conversion tokens', tokens);
    return { raw: 'conv', formatted: 'conv' } as Result;
  }

  const tokens = tokenizeArithmetic(input, variables);
  const rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  return { raw: result, formatted: result?.toString() } as Result;
}

// function determineOutputFormat(input: string): FormatType {
//   if (isCurrency(input)) {
//     return 'currency';
//   }
//   return 'regular-number';
// }

// function format(result: string | number, format: FormatType) {
//   if (!result) {
//     return;
//   }

//   switch (format) {
//     case 'regular-number':
//       if (typeof result === 'number') {
//         return Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(result);
//       }
//     case 'currency':
//       if (typeof result === 'number')
//         return Intl.NumberFormat(locale, {
//           currency: 'usd',
//           style: 'currency',
//           currencyDisplay: 'narrowSymbol',
//           maximumFractionDigits: 2,
//           minimumFractionDigits: 0,
//         }).format(result);
//   }
// }

export function isAssignment(input: string) {
  return RE_ASSIGN.test(input);
}

export function isComment(input: string) {
  return RE_COMMENT.test(input);
}

export function isConversion(input: string) {
  return RE_CONVERSION.test(input);
}

// export function isCurrency(input: string) {
//   return RE_CURRENCY.test(input);
// }

function tokenizeConversion(input: string, variables: Variable[]) {
  const matches = [];
  let match;

  while ((match = RE_CONVERSION.exec(input)) !== null) {
    if (match?.groups && match.groups['num']) {
      matches.push(parseFloat(match[0].replace(',', '')));
    } else if (match?.groups && match.groups['dest']) {
      matches.push(match[0]);
    } else if (match?.groups && match.groups['src']) {
      const token = match[0] as string;
      if (variables.find((v) => v.name === token)) {
        matches.push(variables.find((v) => v.name === token)?.value as number);
      } else {
        matches.push(match[0]);
      }
    }
  }

  return matches;
}

function tokenizeArithmetic(input: string, variables: Variable[]) {
  const matches = [];
  let match;

  while ((match = RE_ARITHMETIC.exec(input)) !== null) {
    if (match?.groups && match.groups['num']) {
      matches.push(parseFloat(match[0].replace(',', '')));
    } else if (match?.groups && (match.groups['op'] || match.groups['paren'])) {
      matches.push(match[0]);
    } else if (match?.groups && match.groups['var']) {
      const token = match[0] as string;
      matches.push(variables.find((v) => v.name === token)?.value as number);
    }
  }

  return matches;
}

/**
 * Converts arithmetic expression in infix notation to postfix notation
 * @param tokens - infix expression
 * @returns postfix expression
 */
function shuntingYard(tokens: (string | number)[]) {
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
function evaluateRpn(tokens: (string | number)[]) {
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
  const highPrecedence = ['*', '/'];
  const lowPrecedence = ['+', '-'];

  return (
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
    default:
      throw new Error(`unsupported operator ${operator}`);
  }
}
