declare type MappingAction = 'constant' | 'direct' | 'one2one' | 'one2many' | 'many2many';

declare type Mapping = {
  from: string;
  to: string;
  action?: MappingAction;
  actRef?: string;
};

declare type Mapper = {
  name: string;
  source?: string;
  model?: string;
  mappings: Mapping[];
};

declare type MapperIndex = Record<string, Mapper>;

declare type ConvertFunction<F extends object, T extends object> = (
  mapping: Mapping,
  from: F,
  to: T,
  mappers: MapperIndex,
  name: string,
) => void;

type MappingHandler<F extends object, T extends object> = {
  [K in MappingAction]: ConvertFunction<F, T>;
};
