import _ from 'lodash';

export const translate = <S extends object, B>(items: S[], mappers: Mapper[]): B[] => {
  if (mappers?.length > 0) {
    const name = mappers[0].name;
    const mapperIndex = _.mapKeys(mappers, (m) => m.name);

    const records: B[] = [];
    items.forEach((item) => {
      const record = {};
      convert(item, record, mapperIndex, name);
      records.push(record as B);
    });
    return records;
  } else {
    return [] as B[];
  }
};

const convert = <F extends object, T extends object>(
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
) => {
  const mapper = mappers[name];

  mapper?.mappings?.forEach((mapping) => {
    const fromValue = getFromValue(from, mapping);

    if (_.isEmpty(fromValue)) {
      return;
    }

    if (!mapping.action) {
      if (mapping.actRef) {
        mapping.action = 'one2one';
      } else {
        mapping.action = 'direct';
      }
    }

    switch (mapping.action) {
      case 'constant':
        _.set(to, mapping.to, mapping.from);
        break;
      case 'direct':
        _.set(to, mapping.to, fromValue);
        break;
      case 'one2one':
        one2one(from, to, mappers, name, mapping);
        break;
      case 'one2many':
        one2many(from, to, mappers, name, mapping);
        break;
      case 'many2many':
        many2many(from, to, mappers, name, mapping);
        break;
    }
  });
};

const one2one = <F extends object, T extends object>(
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
  mapping: Mapping,
) => {
  if (mapping.actRef) {
    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, {});
    }
    const fromValue = getFromValue(from, mapping);
    const toObj = _.get(to, mapping.to);
    convert(fromValue, toObj, mappers, mapping.actRef);
  } else {
    alert(`FIXME: error in mapper(${name})>${JSON.stringify(mapping)}`);
  }
};

const one2many = <F extends object, T extends object>(
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
  mapping: Mapping,
) => {
  if (mapping.actRef) {
    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, []);
    }

    const fromValue = getFromValue(from, mapping);
    const toArray = _.get(to, mapping.to);
    const toObj = {};
    toArray.push(toObj);
    convert(fromValue, toObj, mappers, mapping.actRef);
  } else {
    alert(`FIXME: error in mapper(${name})>${JSON.stringify(mapping)}`);
  }
};

const many2many = <F extends object, T extends object>(
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
  mapping: Mapping,
) => {
  if (mapping.actRef) {
    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, []);
    }
    const toArray = _.get(to, mapping.to);
    const fromValue = getFromValue(from, mapping);
    fromValue.forEach((item: any) => {
      const toObj = {};
      toArray.push(toObj);
      if (mapping.actRef !== undefined) {
        convert(item, toObj, mappers, mapping.actRef);
      }
    });
  } else {
    alert(`FIXME: error in mapper(${name})>${JSON.stringify(mapping)}`);
  }
};

const getFromValue = <F extends object>(from: F, mapping: Mapping) => {
  if (mapping.action !== 'constant') {
    return mapping.from === '__THIS__' ? from : _.get(from, mapping.from);
  } else {
    return mapping.from;
  }
};

declare type MapperIndex = { [key: string]: Mapper };
