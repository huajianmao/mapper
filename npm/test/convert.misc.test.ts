import { actions, convert } from '../src/convert';

describe('convert function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call action for each mapping', () => {
    // Arrange
    const from = { foo: 'bar' };
    const to = {};
    const mappers = {
      mapper1: {
        name: 'mapper1',
        mappings: [{ from: 'foo', to: 'baz', action: 'direct' }] as any[],
      },
    };
    const name = 'mapper1';
    const spyAction = jest.spyOn(actions, 'direct');

    // Act
    convert(from, to, mappers, name);

    // Assert
    expect(spyAction).toHaveBeenCalledWith(
      { from: 'foo', to: 'baz', action: 'direct' },
      from,
      to,
      mappers,
      name,
    );
  });

  it('should handle null or undefined from value', () => {
    // Arrange
    const from = { foo: null };
    const to = {};
    const mappers = {
      mapper1: {
        name: 'mapper1',
        mappings: [{ from: 'foo', to: 'baz', action: 'direct' }] as any[],
      },
    };
    const name = 'mapper1';
    const spyAction = jest.spyOn(actions, 'direct');

    // Act
    convert(from, to, mappers, name);

    // Assert
    expect(spyAction).not.toHaveBeenCalled();
  });

  it('should handle constant mappings', () => {
    // Arrange
    const from = {};
    const to = {};
    const mappers = {
      mapper1: {
        name: 'mapper1',
        mappings: [{ from: '42', to: 'foo', action: 'constant' }] as any[],
      },
    };
    const name = 'mapper1';

    // Act
    convert(from, to, mappers, name);

    // Assert
    expect(to).toEqual({ foo: '42' });
  });

  it('should handle one2one mappings', () => {
    // Arrange
    const from = { foo: { bar: 'baz' } };
    const to = {};
    const mappers = {
      mapper1: {
        name: 'mapper1',
        mappings: [
          {
            from: 'foo',
            to: 'abc',
            action: 'one2one',
            actRef: 'mapper2',
          },
        ] as any[],
      },
      mapper2: {
        name: 'mapper2',
        mappings: [{ from: 'bar', to: 'xyz', action: 'direct' }] as any[],
      },
    };
    const name = 'mapper1';

    // Act
    convert(from, to, mappers, name);

    // Assert
    expect(to).toEqual({ abc: { xyz: 'baz' } });
  });
});
