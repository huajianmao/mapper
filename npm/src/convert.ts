import _ from 'lodash';

export const convert = <F extends object, T extends object>(
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
) => {
  const mapper = mappers[name];

  mapper?.mappings?.forEach((_mapping) => {
    const mapping = formatMapping(_mapping);

    const fromValue = getFromValue(from, mapping);
    if (fromValue === undefined || fromValue === null) {
      return;
    }

    const action = actions[mapping.action];
    if (action) {
      action(mapping, from, to, mappers, name);
    }
  });
};

const actions: MappingHandler<any, any> = {
  constant: (mapping, from, to) => {
    _.set(to, mapping.to, mapping.from);
  },
  direct: (mapping, from, to) => {
    const fromValue = getFromValue(from, mapping);
    _.set(to, mapping.to, fromValue);
  },
  one2one: (mapping, from, to, mappers, name) => {
    throwErrorIfNoActRef(mapping, name);

    const fromValue = getFromValue(from, mapping);
    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, {});
    }
    const toObj = _.get(to, mapping.to);
    convert(fromValue, toObj, mappers, mapping.actRef! as string);
  },
  one2many: (mapping, from, to, mappers, name) => {
    throwErrorIfNoActRef(mapping, name);

    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, []);
    }

    const fromValue = getFromValue(from, mapping);
    const toArray = _.get(to, mapping.to);
    const toObj = {};
    toArray.push(toObj);
    convert(fromValue, toObj, mappers, mapping.actRef! as string);
  },
  many2many: (mapping, from, to, mappers, name) => {
    throwErrorIfNoActRef(mapping, name);

    if (!_.get(to, mapping.to)) {
      _.set(to, mapping.to, []);
    }
    const toArray = _.get(to, mapping.to);
    const fromValue = getFromValue(from, mapping);
    fromValue.forEach((item: any) => {
      const toObj = {};
      toArray.push(toObj);
      convert(item, toObj, mappers, mapping.actRef! as string);
    });
  },
};

const getFromValue = <F extends object>(from: F, mapping: Mapping) => {
  if (mapping.action !== 'constant') {
    return mapping.from === '__THIS__' ? from : _.get(from, mapping.from);
  } else {
    return mapping.from;
  }
};

const throwErrorIfNoActRef = (mapping: Mapping, mapperName: string) => {
  if (!mapping.actRef) {
    throw new Error(`FIXME: Missing actRef in mapper(${mapperName})>${JSON.stringify(mapping)}`);
  }
};

const formatMapping = (mapping: Mapping) => {
  const result = {
    from: mapping?.from?.trim(),
    to: mapping?.to?.trim(),
    actRef: mapping?.actRef?.trim(),
    action: mapping?.action?.trim() as MappingAction,
  };

  if (!result.action) {
    result.action = result.actRef ? 'one2one' : 'direct';
  }

  return result;
};
