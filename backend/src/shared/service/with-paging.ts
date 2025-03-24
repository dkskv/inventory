import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Paging } from './paging';
import { escapeAttr } from './escape-attr';

/**
 * Выполнить запрос с пагинацией, рассчитав общее количество отдельным запросом.
 * В отличии от builder.getCount(), учитывает groupBy.
 */
export const withPaging = async <T extends ObjectLiteral>(
  builder: SelectQueryBuilder<T>,
  paging: Paging,
) => {
  const totalBuilder = builder.clone();

  const getTotalCount = async () => {
    const { groupBys } = totalBuilder.expressionMap;

    if (groupBys.length === 0) {
      return builder.getCount();
    }

    totalBuilder
      .select(
        `COUNT(DISTINCT ROW(${groupBys.map(
          escapeAttr(totalBuilder),
        )}))::integer`,
        'count',
      )
      // Удаление ненужных частей запроса
      .groupBy()
      .orderBy()
      .limit()
      .take();

    return (await totalBuilder.getRawOne()).count;
  };

  const [items, totalCount] = await Promise.all([
    builder.skip(paging.offset).take(paging.limit).getRawMany(),
    getTotalCount(),
  ]);

  return { items, totalCount } as const;
};
