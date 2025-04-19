import { formatLogs, PartialLogs, icons } from './format-logs';

describe('formatLogs', () => {
  const usedEntities: PartialLogs['usedEntities'] = {
    locations: [
      { id: 1, name: 'Location 1' },
      { id: 2, name: 'Location 2' },
    ],
    responsibles: [
      { id: 1, name: 'Responsible 1' },
      { id: 2, name: 'Responsible 2' },
    ],
    statuses: [
      { id: 1, name: 'Status 1' },
      { id: 2, name: 'Status 2' },
    ],
  };

  const formatLog = (log: PartialLogs['items'][number]) =>
    formatLogs({ items: [log], usedEntities })[0]!;

  const baseLog = {
    author: { username: 'testuser' },
    asset: { name: 'Test Asset' },
    count: 1,
    serialNumbers: ['SN123', 'SN456'],
  } satisfies Partial<PartialLogs['items'][number]>;

  it('действие CREATE', () => {
    const result = formatLog({
      ...baseLog,
      action: 'CREATE',
      attribute: null,
      prevValue: null,
      nextValue: JSON.stringify({
        locationId: 1,
        responsibleId: 1,
        description: 'Test description',
        serialNumber: 'SN123',
      }),
    });

    expect(result).toContain(`${icons.user}testuser`);
    expect(result).toContain(icons.newRecord);
    expect(result).toContain(`${icons.location}Location 1`);
    expect(result).toContain(`${icons.responsible}Responsible 1`);
    expect(result).toContain(`${icons.description}Test description`);
    expect(result).toContain(`${icons.asset} Test Asset`);
    expect(result).toContain(`${icons.serialNumber}SN123`);
  });

  it('изменение locationId', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'locationId',
      prevValue: JSON.stringify(1),
      nextValue: JSON.stringify(2),
    });

    expect(result).toContain(
      `<s>${icons.location}Location 1</s>\n${icons.transition}\n${icons.location}Location 2`,
    );
  });

  it('изменение responsibleId', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'responsibleId',
      prevValue: JSON.stringify(1),
      nextValue: JSON.stringify(2),
    });

    expect(result).toContain(
      `<s>${icons.responsible}Responsible 1</s>\n${icons.transition}\n${icons.responsible}Responsible 2`,
    );
  });

  it('изменение description', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'description',
      prevValue: JSON.stringify('Old description'),
      nextValue: JSON.stringify('New description'),
    });

    expect(result).toContain(
      `<s>${icons.description}Old description</s>\n${icons.transition}\n${icons.description}New description`,
    );
  });

  it('изменение serialNumber', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'serialNumber',
      prevValue: JSON.stringify('test 1'),
      nextValue: JSON.stringify('test 2'),
    });

    expect(result).toContain(
      `<s>${icons.serialNumber}test 1</s>\n${icons.transition}\n${icons.serialNumber}test 2`,
    );
  });

  it('удаление serialNumber', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'serialNumber',
      prevValue: JSON.stringify('test 1'),
      nextValue: null,
    });

    expect(result).toContain(`<s>${icons.serialNumber}test 1</s>`);
  });

  it('удаление description', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'description',
      prevValue: JSON.stringify('test 1'),
      nextValue: null,
    });

    expect(result).toContain(`<s>${icons.description}test 1</s>`);
  });

  it('удаление статуса', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'statusId',
      prevValue: JSON.stringify(1),
      nextValue: null,
    });

    expect(result).toContain(`<s>${icons.status}Status 1</s>`);
    expect(result).toContain(`${icons.asset} Test Asset`);
  });

  it('добавление статуса', () => {
    const result = formatLog({
      ...baseLog,
      action: 'UPDATE',
      attribute: 'statusId',
      prevValue: null,
      nextValue: JSON.stringify(1),
    });

    expect(result).toContain(`${icons.status}Status 1`);
    expect(result).toContain(`${icons.asset} Test Asset`);
  });

  it('одиночное обновление с серийным номером', () => {
    const result = formatLog({
      ...baseLog,
      count: 1,
      serialNumbers: ['SN123'],
      action: 'UPDATE',
      attribute: 'description',
      prevValue: null,
      nextValue: null,
    });

    expect(result).toContain(`${icons.asset} Test Asset`);
    expect(result).toContain(`${icons.serialNumber}SN123`);
    expect(result).not.toContain(`(x`);
  });

  it('одиночное обновление без серийного номера', () => {
    const result = formatLog({
      ...baseLog,
      count: 1,
      serialNumbers: [],
      action: 'UPDATE',
      attribute: 'description',
      prevValue: null,
      nextValue: null,
    });

    expect(result).toContain(`${icons.asset} Test Asset`);
    expect(result).not.toContain(`(x`);
  });

  it('массовое обновление', () => {
    const result = formatLog({
      ...baseLog,
      count: 4,
      action: 'UPDATE',
      attribute: 'description',
      prevValue: null,
      nextValue: null,
    });

    expect(result).toContain(`${icons.asset} Test Asset (x4)`);
    expect(result).toContain(`${icons.serialNumber}SN123`);
    expect(result).toContain(`${icons.serialNumber}SN456`);
  });

  it('обработка неизвестных значений', () => {
    const result = formatLog({
      ...baseLog,
      author: null,
      action: 'UPDATE',
      attribute: 'locationId',
      prevValue: JSON.stringify(100),
      nextValue: JSON.stringify(1),
    });

    expect(result).toContain(`${icons.user}${icons.unknownValue}`);

    expect(result).toContain(
      `<s>${icons.location}${icons.unknownValue}</s>\n${icons.transition}\n${icons.location}Location 1`,
    );
  });
});
