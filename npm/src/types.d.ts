declare type Mapping = {
  from: string;
  to: string;
  action?: 'constant' | 'direct' | 'one2one' | 'one2many' | 'many2many';
  actRef?: string;
};

declare type Mapper = {
  name: string;
  source?: string;
  model?: string;
  mappings: Mapping[];
};
