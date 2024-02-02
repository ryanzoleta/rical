export const RE_OPERATORS = /(?<operator>\+|-|\*|\/|\^)/m;
export const RE_ARITHMETIC =
  /(?<per> *(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)%)|(?<num>(([a-zA-Z]*\$)|(CN¥)|(¥)|₩|€|£|₱|₹)? *(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?))|(?<op>\+|-|\*|\/|\^)|(?<paren>\(|\))|(?<of>of)|(?<var>[A-Za-z0-9_]+)/gm;

export const RE_CURRENCY_SYMBOLS = /(([a-zA-Z]*\$)|(CN¥)|(¥)|₩|€|£|₱|₹)/m;

export const RE_ASSIGN = /^([A-Za-z0-9_]+)( *)=(.*)$/m;
export const RE_COMMENT = /^#(.*)$/m;
export const RE_MEASUREMENT =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)(?<unit>[a-zA-Z0-9_]+) *$/m;
export const RE_JUST_PERCENTAGE = /^(?<per>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)%) *$/m;

export const RE_CONVERSION =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)?(?<src>[a-zA-Z0-9_]+) +(to|in) (?<dest>[a-zA-Z]+)$/gm;
