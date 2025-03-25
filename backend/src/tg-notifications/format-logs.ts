import { InventoryLogService } from 'src/entities/inventory/inventory-log/inventory-log.service';

type Attribute =
  | 'locationId'
  | 'responsibleId'
  | 'description'
  | 'serialNumber';

type Logs = Awaited<ReturnType<InventoryLogService['findAllItemsOrGroups']>>;

const attributeIcons: Record<Attribute, string> = {
  locationId: '🏠',
  responsibleId: '🧑‍💼',
  description: '📄',
  serialNumber: '🏷️',
};

const unknownValue = '❓';

const getFormattedAttributeValue = (
  attribute: Attribute,
  value: unknown,
  logs: Awaited<ReturnType<InventoryLogService['findAllItemsOrGroups']>>,
): string | undefined => {
  if (!value) return unknownValue;

  if (attribute === 'serialNumber' || attribute === 'description') {
    return String(value);
  }

  if (attribute === 'responsibleId') {
    return (
      logs.usedResponsibles.find(({ id }) => id === value)?.name ?? unknownValue
    );
  }

  if (attribute === 'locationId') {
    return (
      logs.usedLocations.find(({ id }) => id === value)?.name ?? unknownValue
    );
  }
};

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
            value &&
            attributeIcons[attribute as Attribute] +
              getFormattedAttributeValue(attribute as Attribute, value, logs),
        )
        .filter(Boolean)
        .join('\n');
    }
  } else {
    if (item.attribute) {
      if (item.prevValue) {
        message += attributeIcons[item.attribute as Attribute];
        message += getFormattedAttributeValue(
          item.attribute as Attribute,
          item.prevValue && JSON.parse(item.prevValue),
          logs,
        );
        message += ' ➡️ ';
      }

      message += attributeIcons[item.attribute as Attribute];
      message += getFormattedAttributeValue(
        item.attribute as Attribute,
        item.nextValue && JSON.parse(item.nextValue),
        logs,
      );
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
