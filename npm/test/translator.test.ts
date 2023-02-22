import items from '../examples/data/checkup.json';
import mappers from '../examples/schema/checkup.json';
import { translate } from '../src';

describe('translator', () => {
  describe('translate', () => {
    it('correct', () => {
      const records = translate(items, mappers as any);
      expect(records).not.toBeUndefined();
      expect(records.length).toBe(2);
    });
  });
});
