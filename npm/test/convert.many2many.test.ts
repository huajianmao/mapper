import { convert } from '../src/convert';
describe('many2many mapping', () => {
  it('should map many-to-many with valid actRef', () => {
    const from = {
      students: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ],
    };
    const to = {};
    const mappers = {
      studentMapper: {
        name: 'studentMapper',
        mappings: [
          { from: 'students', to: 'students', actRef: 'studentMapping', action: 'many2many' },
        ] as any[],
      },
      studentMapping: {
        name: 'studentMapping',
        mappings: [
          { from: 'id', to: 'id', action: 'direct' },
          { from: 'name', to: 'fullName', action: 'direct' },
        ] as any[],
      },
    };
    convert(from, to, mappers, 'studentMapper');

    expect(to).toEqual({
      students: [
        { id: 1, fullName: 'John' },
        { id: 2, fullName: 'Jane' },
      ],
    });
  });

  it('should skip empty array for many-to-many with missing actRef', () => {
    const from = { students: [] };
    const to = {};
    const mappers = {
      studentMapper: {
        name: 'studentMapper',
        mappings: [{ from: 'students', to: 'students', action: 'many2many' }] as any[],
      },
    };
    const name = 'studentMapper';
    expect(() => {
      convert(from, to, mappers, name);
    }).toThrowError();

    expect(to).toEqual({});
  });

  it('should skip undefined value for many-to-many with missing actRef', () => {
    const from = {};
    const to = {};
    const mappers = {
      studentMapper: {
        name: 'studentMapper',
        mappings: [{ from: 'students', to: 'students', action: 'many2many' }] as any[],
      },
    };
    const name = 'studentMapper';
    convert(from, to, mappers, name);
    expect(to).toEqual({});
  });
});
