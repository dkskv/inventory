import { curry } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';

export const escapeAttr = curry(
  (qb: SelectQueryBuilder<object>, attr: string) => {
    const parts = attr.split('.');

    return parts.map((part) => qb.escape(part)).join('.');
  },
);
