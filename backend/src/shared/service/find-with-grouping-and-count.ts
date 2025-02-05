import {
  DataSource,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { Paging } from './paging';
import { pick } from 'lodash';

// todo: test (при тестировании можно использовать любые сущности, например, fruits: apple, pear)
/**
 * Получает сгруппированные сущности с учётом количества повторений в группе.
 *
 * ### Логика работы:
 * 1. На первом этапе выбираются id представителей групп, используя `MIN(id)`, а также вычисляется количество элементов в группе (`COUNT(*)`).
 * 2. Затем по найденным id загружаются полные сущности.
 * 3. Если группа содержит только один элемент, возвращается сама сущность.
 *    В противном случае возвращается объект с атрибутами группы и количеством элементов в ней.
 *
 * ### Почему используется два этапа?
 * Простая группировка не позволяет получить все атрибуты сущности, так как они требуют агрегации.
 * Разделение запроса на два этапа позволяет сначала определить представителей групп, а затем загрузить их полностью.
 *
 * @param dataSource - Источник данных (например, экземпляр `DataSource` TypeORM).
 * @param entityClass - Класс сущности, для которой выполняется запрос.
 * @param groupAttributes - Атрибуты, по которым выполняется группировка.
 * @param paging - Объект пагинации.
 * @param where - Опциональное условие фильтрации.
 * @param order - Опциональная сортировка.
 * @returns Кортеж `[items, totalCount]`, где:
 *   - `items` — массив сгруппированных сущностей или объектов `{ ...групповые атрибуты, count }`, если в группе несколько элементов.
 *   - `totalCount` — общее количество уникальных групп.
 */
export async function findWithGroupingAndCount<
  T extends ObjectLiteral & { id: number },
  GAttr extends string,
>({
  dataSource,
  entityClass,
  groupAttributes,
  paging,
  where,
  order,
}: {
  dataSource: DataSource;
  entityClass: EntityTarget<T>;
  groupAttributes: GAttr[];
  paging: Paging;
  where?: FindOptionsWhere<T>;
  order?: Parameters<SelectQueryBuilder<T>['orderBy']>[0];
}) {
  return dataSource.transaction(async (manager) => {
    const findItems = async () => {
      const builder = manager
        .createQueryBuilder(entityClass, 'row')
        .select(['MIN(row.id) as id', 'COUNT(*) as repetitions_count']);

      groupAttributes.forEach((attr) => {
        builder.addGroupBy(`row.${attr}`);
      });

      if (where) {
        builder.where(where);
      }

      if (order) {
        builder.orderBy(order);
      }

      const rawResults = await builder
        .skip(paging.offset)
        .take(paging.limit)
        .getRawMany();

      const ids = rawResults.map((result) => result.id);
      const entities = await manager.find(entityClass, {
        where: { id: In(ids) } as FindOptionsWhere<T>,
        order: order as FindOptionsOrder<T>,
      });

      return entities.map((entity, index) => {
        const count = parseInt(rawResults[index].repetitions_count, 10);

        return count === 1
          ? entity
          : { ...pick(entity, groupAttributes), count };
      });
    };

    const getTotalCount = async () => {
      const builder = manager
        .createQueryBuilder(entityClass, 'row')
        .select([
          `COUNT(DISTINCT ROW(${groupAttributes.map((attr) => `row.${attr}`).join(', ')})) as count`,
        ]);

      if (where) {
        builder.where(where);
      }

      return parseInt((await builder.getRawOne()).count, 10);
    };

    const [items, totalCount] = await Promise.all([
      findItems(),
      getTotalCount(),
    ]);

    return [items, totalCount] as const;
  });
}
