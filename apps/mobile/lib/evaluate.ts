import { tokenize, shuntingYard, evaluateRpn } from './arithmetic';
import { Result, Variable } from './types';

export const RE_ASSIGN = /^([A-Za-z0-9]+)( *)=(.*)$/m;

const RE_CURRENCY_CONVERSION =
  /^(((?<amount>[0-9]+)( *)(?<currency1>usd|php))|((?<currency1>\$|\₱)(?<amount>[0-9]+)))( *)(in)( *)(?<currency2>usd|php)$/gm;

export function evaluate(input: string, variables: Variable[]) {
  let tokens = tokenize(input, variables);
  let rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  return { raw: result, formatted: result?.toString() } as Result;
}

export function isAssignment(input: string) {
  return RE_ASSIGN.test(input);
}
