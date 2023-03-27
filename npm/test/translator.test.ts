import _ from 'lodash';

import checkups from '../examples/data/checkup.json';
import items from '../examples/data/raw.json';
import checkup2personalMappers from '../examples/schema/checkup2personal.json';
import withConstantMappers from '../examples/schema/checkupraw2checkup.json';
import raw2checkupMappers from '../examples/schema/raw2checkup.json';
import { translate } from '../src';

describe('translate', () => {
  it('raw2checkup', () => {
    const records = translate(items, raw2checkupMappers as any);
    expect(records).not.toBeUndefined();
    expect(records.length).toBe(2);
  });
  it('checkup2personal', () => {
    const records = translate(checkups, checkup2personalMappers as any);
    expect(records).not.toBeUndefined();
    expect(records.length).toBe(1);
    const personal = records[0];
    expect(_.has(personal, 'undefined')).toBe(false);
  });
  it('checkup2personalWithConstant', () => {
    const records = translate(checkups, withConstantMappers as any);
    expect(records).not.toBeUndefined();
    expect(records.length).toBe(1);
    const personal = records[0];
    expect(_.has(personal, 'undefined')).toBe(false);
    expect(_.get(personal, 'constant')).toBe('骨折');
  });

  // Test cases from ChatPGT
  it('should return an empty array when no items passed in and no mappers', () => {
    const result = translate([], []);
    expect(result).toEqual([]);
  });

  it('should return an empty array when no items passed in', () => {
    const mappers = [{ name: 'mapper1', mappings: [] }];
    const result = translate([], mappers);
    expect(result).toEqual([]);
  });

  it('converts items to target format using mapper with blank in mappings', () => {
    const items = [{ name: 'Alice' }, { name: 'Bob' }];
    const mappers = [
      {
        name: 'personToUser',
        mappings: [{ from: ' name ', to: ' firstName ', action: ' direct ' }] as any[],
      },
    ];

    const expected = [{ firstName: 'Alice' }, { firstName: 'Bob' }];

    const result = translate(items, mappers);
    expect(result).toEqual(expected);
  });

  it('converts items to target format using mapper', () => {
    const items = [
      { name: 'Alice', age: 30, ok: true },
      { name: 'Bob', age: 25, ok: false },
    ];
    const mappers = [
      {
        name: 'personToUser',
        mappings: [
          { from: ' name ', to: ' firstName ', action: ' direct ' },
          { from: 'age', to: 'age' },
          { from: 'ok', to: 'passed' },
        ] as any[],
      },
    ];

    const expected = [
      { firstName: 'Alice', age: 30, passed: true },
      { firstName: 'Bob', age: 25, passed: false },
    ];

    const result = translate(items, mappers);
    expect(result).toEqual(expected);
  });

  it('handles nested objects in items', () => {
    const items = [
      { person: { name: 'Alice', age: 30, ok: true } },
      { person: { name: 'Bob', age: 25, ok: false } },
    ];
    const mappers = [
      {
        name: 'personToUser',
        mappings: [
          { from: 'person.name', to: 'firstName', action: 'direct' },
          { from: 'person.age', to: 'age', action: 'direct' },
          { from: 'person.ok', to: 'passed.ok', action: 'direct' },
        ] as any[],
      },
    ];

    const expected = [
      { firstName: 'Alice', age: 30, passed: { ok: true } },
      { firstName: 'Bob', age: 25, passed: { ok: false } },
    ];

    const result = translate(items, mappers);
    expect(result).toEqual(expected);
  });
});
