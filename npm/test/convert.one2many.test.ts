import { convert } from '../src/convert';

describe('one2many convert function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mappers = {
    testMapper: {
      name: 'testMapper',
      mappings: [
        { from: 'addresses', to: 'addressList', action: 'one2many', actRef: 'addressMapper' },
      ] as any[],
    },
    addressMapper: {
      name: 'addressMapper',
      mappings: [
        { from: 'street', to: 'street', action: 'direct' },
        { from: 'city', to: 'city', action: 'direct' },
        { from: 'state', to: 'state', action: 'direct' },
        { from: 'zip', to: 'zipCode', action: 'direct' },
      ] as any[],
    },
  };

  it('should convert a single address from "from" to "to"', () => {
    const from = {
      addresses: { street: '123 Main St.', city: 'Anytown', state: 'CA', zip: '12345' },
    };
    const to = {};
    const name = 'testMapper';
    convert(from, to, mappers, name);
    expect(to).toEqual({
      addressList: [{ street: '123 Main St.', city: 'Anytown', state: 'CA', zipCode: '12345' }],
    });
  });

  it('should handle missing "from" property and not modify "to"', () => {
    const from = {};
    const to = {};
    const name = 'testMapper';

    convert(from, to, mappers, name);
    expect(to).toEqual({});
  });

  it('should handle null value for "from" and not modify "to"', () => {
    const from = {
      addresses: null,
    };
    const to = {};
    const name = 'testMapper';

    convert(from, to, mappers, name);
    expect(to).toEqual({});
  });

  it('should handle undefined value for "from" and not modify "to"', () => {
    const from = {
      addresses: undefined,
    };
    const to = {};
    const name = 'testMapper';

    convert(from, to, mappers, name);
    expect(to).toEqual({});
  });

  it('should handle empty array for "from" and modify "to"', () => {
    const from = {
      addresses: {},
    };
    const to = {};
    const name = 'testMapper';

    convert(from, to, mappers, name);
    expect(to).toEqual({ addressList: [{}] });
  });
});
