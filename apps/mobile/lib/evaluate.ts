import { tokenize, shuntingYard, evaluateRpn } from './arithmetic';

const RE_CURRENCY_CONVERSION =
  /^(((?<amount>[0-9]+)( *)(?<currency1>usd|php))|((?<currency1>\$|\₱)(?<amount>[0-9]+)))( *)(in)( *)(?<currency2>usd|php)$/gm;

export function evaluate(input: string) {
  let tokens = tokenize(input);
  let rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  return result.toString();
}
