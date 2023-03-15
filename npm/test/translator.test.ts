import _ from 'lodash';

import checkups from '../examples/data/checkup.json';
import items from '../examples/data/raw.json';
import checkup2personalMappers from '../examples/schema/checkup2personal.json';
import withConstantMappers from '../examples/schema/checkupraw2checkup.json';
import raw2checkupMappers from '../examples/schema/raw2checkup.json';
import { translate } from '../src';

describe('translator', () => {
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
  });
});
