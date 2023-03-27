import _ from 'lodash';

import { convert } from './convert';

export const translate = <S extends object, B>(items: S[], mappers: Mapper[]): B[] => {
  if (!mappers || mappers.length === 0) {
    return [] as B[];
  }

  const mapperIndex = _.mapKeys(mappers, (m) => m.name);

  const records: B[] = [];
  items.forEach((item) => {
    const record = {};
    convert(item, record, mapperIndex, mappers[0].name);
    records.push(record as B);
  });
  return records;
};
