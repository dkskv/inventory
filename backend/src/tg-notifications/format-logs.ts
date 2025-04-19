import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { User } from 'src/entities/user/user.entity';
import { InventoryLogService } from 'src/entities/inventory/inventory-log/inventory-log.service';

type Attribute =
  | 'locationId'
  | 'responsibleId'
  | 'statusId'
  | 'description'
  | 'serialNumber';

type FullLogs = Awaited<
  ReturnType<InventoryLogService['findAllItemsOrGroups']>
>;

export type PartialLogs = {
  items: (Omit<
    FullLogs['items'][number],
    'id' | 'timestamp' | 'asset' | 'author'
  > & {
    asset: Pick<Asset, 'name'>;
    author: Pick<User, 'username'> | null;
  })[];
  usedEntities: {
    readonly locations: { id: number; name: string }[];
    readonly responsibles: { id: number; name: string }[];
    readonly statuses: { id: number; name: string }[];
  };
};

export const icons = {
  unknownValue: '❓',
  newRecord: '🆕',
  user: '👤',
  asset: '🛠️',
  transition: '⬇️',
  location: '🏙️',
  responsible: '👷',
  status: '#️⃣',
  description: '💬',
  serialNumber: '🏷️',
};

export const attributeIcons: Record<Attribute, string> = {
  locationId: icons.location,
  responsibleId: icons.responsible,
  statusId: icons.status,
  description: icons.description,
  serialNumber: icons.serialNumber,
};

const formatAttributeValue = (
  attribute: Attribute,
  value: unknown,
  logs: PartialLogs,
): string | undefined => {
  if (!value) return icons.unknownValue;

  const icon = attributeIcons[attribute];

  if (attribute === 'serialNumber' || attribute === 'description') {
    return icon + String(value);
  }

  const entityMap = {
    responsibleId: 'responsibles',
    locationId: 'locations',
    statusId: 'statuses',
  } as const;

  if (attribute in entityMap) {
    const entityType = entityMap[attribute];
    return (
      icon +
      (logs.usedEntities[entityType].find(({ id }) => id === value)?.name ??
        icons.unknownValue)
    );
  }
};

function buildAttributeRow(
  item: PartialLogs['items'][0],
  logs: PartialLogs,
): string {
  let result = '';

  if (item.prevValue) {
    result += `<s>${formatAttributeValue(
      item.attribute as Attribute,
      JSON.parse(item.prevValue),
      logs,
    )}</s>`;
  }

  if (item.prevValue && item.nextValue) {
    result += `\n${icons.transition}\n`;
  }

  if (item.nextValue) {
    result += formatAttributeValue(
      item.attribute as Attribute,
      JSON.parse(item.nextValue),
      logs,
    );
  } else {
    result = `<s>${result}</s>`;
  }

  return result;
}

const formatLogAction = (
  item: PartialLogs['items'][0],
  logs: PartialLogs,
  message: string,
): string => {
  if (item.action === 'CREATE') {
    if (item.nextValue) {
      const { locationId, responsibleId, description } = JSON.parse(
        item.nextValue,
      );
      message += `${icons.newRecord}\n\n`;

      message += Object.entries({ locationId, responsibleId, description })
        .map(
          ([attribute, value]) =>
            value && formatAttributeValue(attribute as Attribute, value, logs),
        )
        .filter(Boolean)
        .join('\n');
    }
  } else {
    if (item.attribute) {
      message += buildAttributeRow(item, logs);
    }
  }

  return message;
};

const createSeparator = () =>
  `\n\n${Array.from({ length: 40 }, () => '-').join('')}\n\n`;

export const formatLogs = (logs: PartialLogs): string => {
  const formattedLogs = logs.items.map((item) => {
    let message = `${icons.user}${item.author?.username ?? icons.unknownValue}\n\n`;

    message = formatLogAction(item, logs, message);

    message += `\n\n${icons.asset} ${item.asset.name}`;
    if (item.count > 1) message += ` (x${item.count})`;

    if (item.serialNumbers.length > 0 && item.attribute !== 'serialNumber') {
      message +=
        '\n' +
        item.serialNumbers.map((n) => `${icons.serialNumber}${n}`).join('\n');
    }

    return message;
  });

  return formattedLogs.join(formattedLogs.length <= 1 ? '' : createSeparator());
};
