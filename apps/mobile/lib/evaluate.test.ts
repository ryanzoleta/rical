import { evaluate, isAssignment, isComment } from './evaluate';

test('Comments', () => {
  const result = isComment('# this is a comment');
  expect(result).toBe(true);
});

describe('Arithmetic Expressions', () => {
  test('Addition', () => {
    const result = evaluate('3 + 5', [], {});
    expect(result.raw).toBe(8);
  });

  test('Subtraction', () => {
    const result = evaluate('3 - 5', [], {});
    expect(result.raw).toBe(-2);
  });

  test('Multiplication', () => {
    const result = evaluate('3 * 5', [], {});
    expect(result.raw).toBe(15);
  });

  test('Division', () => {
    const result = evaluate('3 / 5', [], {});
    expect(result.raw).toBe(0.6);
  });

  test('Compound Expression', () => {
    const result = evaluate('20 - 4 * 3', [], {});
    expect(result.raw).toBe(8);
  });

  test('Parentheses', () => {
    const result = evaluate('(20 - 4) * 3', [], {});
    expect(result.raw).toBe(48);
  });

  test('Exponentiation', () => {
    const result = evaluate('2 ^ 3', [], {});
    expect(result.raw).toBe(8);
  });

  test('Exponentiation Compound', () => {
    const result = evaluate('2^2 * 3', [], {});
    expect(result.raw).toBe(12);
  });
});

describe('Assignments', () => {
  test('Simple', () => {
    const result = evaluate('x = 2', [], {});
    expect(result.raw).toBe(2);
    expect(isAssignment('x = 2')).toBe(true);
  });

  test('With Arithmetic Expression', () => {
    const result = evaluate('x = 2 + 3', [], {});
    expect(result.raw).toBe(5);
  });

  test('With Variable', () => {
    const result = evaluate('5 * a', [{ name: 'a', value: { raw: 10, formatType: 'number' } }], {});
    expect(result.raw).toBe(50);
  });
});

describe('Conversions', () => {
  test('Single Value With Unit', () => {
    const result = evaluate('5 m', [], {});
    expect(result.raw).toBe(5);
    expect(result.unit).toBe('m');
  });

  test('Measurement', () => {
    const result = evaluate('5 m to cm', [], {});
    expect(result.raw).toBe(500);
    expect(result.unit).toBe('cm');
    expect(result.formatType).toBe('measurement');
  });

  test('Temperature C to F', () => {
    const result = evaluate('5 C to F', [], {});
    expect(result.raw).toBe(41);
  });

  test('Temperature F to C', () => {
    const result = evaluate('5 F to C', [], {});
    expect(result.raw).toBe(-15);
  });

  test('Temperature K to C', () => {
    const result = evaluate('5 K to C', [], {});
    expect(result.raw).toBe(-268.15);
  });

  test('Temperature C to K', () => {
    const result = evaluate('5 C to K', [], {});
    expect(result.raw).toBe(278.15);
  });

  test('Temperature F to K', () => {
    const result = evaluate('5 F to K', [], {});
    expect((result.raw as number).toFixed(2)).toBe('258.15');
  });

  test('Temperature K to F', () => {
    const result = evaluate('5 K to F', [], {});
    expect(result.raw).toBe(-450.67);
  });
});

describe('Currency Conversions', () => {
  test('USD to EUR', () => {
    const result = evaluate('5 USD to EUR', [], { EUR: 0.85 });
    expect(result.raw).toBe(4.25);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('EUR');
  });

  test('EUR to USD', () => {
    const result = evaluate('5 EUR to USD', [], { EUR: 0.85 });
    expect(parseFloat(result.raw.toString()).toFixed(2)).toBe('5.88');
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('USD');
  });

  test('PHP to EUR', () => {
    const result = evaluate('5000 PHP to EUR', [], { EUR: 0.925216, PHP: 56.288502 });
    expect(parseFloat(result.raw.toString()).toFixed(2)).toBe('82.19');
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('EUR');
  });

  test('With Variable', () => {
    const result = evaluate(
      'hourly in php',
      [
        {
          name: 'hourly',
          value: { raw: 10, formatType: 'currency', unit: 'USD' },
        },
      ],
      { PHP: 56.288502 },
    );
    expect(parseFloat(result.raw.toString()).toFixed(2)).toBe('562.89');
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });

  test('Arithmetic Expression with Currency', () => {
    const result = evaluate('10 * 5 php', [], {});
    expect(result.raw).toBe(50);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });

  test('Conversion With Arithmetic Expression', () => {
    const result = evaluate('10 * 5 usd to php', [], { PHP: 56.288502 });
    expect((result.raw as number).toFixed(2)).toBe('2814.43');
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });

  test('With Arithmetic Expression and Variable', () => {
    const result = evaluate(
      '10 * hourly in php',
      [
        {
          name: 'hourly',
          value: { raw: 28, formatType: 'currency', unit: 'USD' },
        },
      ],
      { PHP: 56.288502 },
    );
    expect(result.raw).toBe(15760.78);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });

  test('With Currency Symbols', () => {
    const result = evaluate('$10', [], {});
    expect(result.raw).toBe(10);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('USD');
  });

  test('With Currency Symbols (₱)', () => {
    const result = evaluate('₱10 * 4', [], {});
    expect(result.raw).toBe(40);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });

  test('With Currency Symbols and Arithmetic Expression', () => {
    const result = evaluate('$10 * 5', [], {});
    expect(result.raw).toBe(50);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('USD');
  });

  test('With Currency Symbols and Arithmetic Expression and Variable', () => {
    const result = evaluate(
      '$10 * 5 - fee',
      [{ name: 'fee', value: { raw: 8, formatType: 'number' } }],
      {},
    );
    expect(result.raw).toBe(42);
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('USD');
  });

  test('Conversion with Currency Symbol', () => {
    const result = evaluate('$10 to php', [], { PHP: 56.288502 });
    expect((result.raw as number).toFixed(2)).toBe('562.89');
    expect(result.formatType).toBe('currency');
    expect(result.unit).toBe('PHP');
  });
});

describe('Percentages', () => {
  test('Single Value', () => {
    const result = evaluate('30% of 300', [], {});
    expect(result.raw).toBe(90);
    expect(result.formatType).toBe('number');
  });

  test('Single Value Assignment', () => {
    const result = evaluate('25%', [], {});
    expect(result.raw).toBe(0.25);
    expect(result.formatType).toBe('percentage');
  });

  test('With Variable', () => {
    const result = evaluate(
      '35% of x',
      [{ name: 'x', value: { raw: 500, formatType: 'number' } }],
      {},
    );
    expect(result.raw).toBe(175);
    expect(result.formatType).toBe('number');
  });

  test('With Arithmetic Expression (using "of")', () => {
    const result = evaluate('25% of 100 * 2', [], {});
    expect(result.raw).toBe(50);
    expect(result.formatType).toBe('number');
  });

  test('With Arithmetic Expression', () => {
    const result = evaluate('100 * 2 * 25%', [], {});
    expect(result.raw).toBe(50);
    expect(result.formatType).toBe('number');
  });

  test('With Variable and Arithmetic Expression', () => {
    const result = evaluate(
      '25% of x * 2',
      [{ name: 'x', value: { raw: 100, formatType: 'number' } }],
      {},
    );
    expect(result.raw).toBe(50);
    expect(result.formatType).toBe('number');
  });

  test('Variable as Percentage', () => {
    const result = evaluate(
      'rate of 100',
      [{ name: 'rate', value: { raw: 0.2, formatType: 'percentage' } }],
      {},
    );
    expect(result.raw).toBe(20);
    expect(result.formatType).toBe('number');
  });

  test('Variable as Percentage in Arithmetic Expression', () => {
    const result = evaluate(
      'rate of 100 * 2',
      [{ name: 'rate', value: { raw: 0.2, formatType: 'percentage' } }],
      {},
    );
    expect(result.raw).toBe(40);
    expect(result.formatType).toBe('number');
  });
});
