import { InventoryLogService } from 'src/entities/inventory/inventory-log/inventory-log.service';

type Attribute =
  | 'locationId'
  | 'responsibleId'
  | 'statusId'
  | 'description'
  | 'serialNumber';

type Logs = Awaited<ReturnType<InventoryLogService['findAllItemsOrGroups']>>;

const attributeIcons: Record<Attribute, string> = {
  locationId: '🏙️',
  responsibleId: '👷',
  statusId: '#️⃣',
  description: '💬',
  serialNumber: '🏷️',
};

const unknownValue = '❓';

const formatAttributeValue = (
  attribute: Attribute,
  value: unknown,
  logs: Awaited<ReturnType<InventoryLogService['findAllItemsOrGroups']>>,
): string | undefined => {
  if (!value) return unknownValue;

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
        unknownValue)
    );
  }
};

function buildAttributeRow(item: Logs['items'][0], logs: Logs): string {
  let result = '';

  if (item.prevValue) {
    result += formatAttributeValue(
      item.attribute as Attribute,
      JSON.parse(item.prevValue),
      logs,
    );
  }

  if (item.prevValue && item.nextValue) {
    result += ' ➡️ ';
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
  item: Logs['items'][0],
  logs: Logs,
  message: string,
): string => {
  if (item.action === 'CREATE') {
    if (item.nextValue) {
      const { locationId, responsibleId, description } = JSON.parse(
        item.nextValue,
      );
      message += '🆕\n\n';

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

export const formatLogs = (
  logs: Awaited<ReturnType<InventoryLogService['findAllItemsOrGroups']>>,
) => {
  return logs.items.map((item) => {
    let message = '👤' + (item.author?.username ?? unknownValue) + '\n\n';

    message = formatLogAction(item, logs, message);

    message += '\n\n🛠️' + ' ' + item.asset.name;
    if (item.count > 1) message += ` (x${item.count})`;

    if (item.serialNumbers.length > 0 && item.attribute !== 'serialNumber') {
      message += '\n' + item.serialNumbers.map((n) => `🏷️${n}`).join('\n');
    }

    return message;
  });
};
