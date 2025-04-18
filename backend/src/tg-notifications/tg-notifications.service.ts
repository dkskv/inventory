import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
import createTriggerInsertLogSql from './sql/create-trigger-insert-log.sql';
import dropTriggerSql from './sql/drop-trigger.sql';
import { InventoryLogService } from 'src/entities/inventory/inventory-log/inventory-log.service';
import { debounce, isInteger } from 'lodash';
import { formatLogs } from './format-logs';
import * as TelegramBot from 'node-telegram-bot-api';
import { EnvVariables } from 'shared/env-validation';

// todo: подключать модуль условно?
@Injectable()
export class TgNotificationsService {
  private bot: TelegramBot | undefined;
  private client: Client;
  private bufferedIds = new Set<number>();

  constructor(
    private dataSource: DataSource,
    private inventoryLogService: InventoryLogService,
    private configService: ConfigService<EnvVariables, true>,
  ) {}

  private async createTrigger() {
    await this.dataSource.query(createTriggerInsertLogSql);
    console.log('Triggers on inventory_log created successfully');
  }

  private async deleteTrigger() {
    await this.dataSource.query(dropTriggerSql);
    console.log('Triggers on inventory_log deleted successfully');
  }

  private sendMessage(message: string) {
    const chatId = this.configService.get('TG_CHAT_ID');

    if (!chatId || !this.bot) {
      return;
    }

    this.bot.sendMessage(chatId, message);
  }

  async run() {
    const apiKey = this.configService.get('TG_BOT_API_KEY');
    const chatId = this.configService.get('TG_CHAT_ID');

    if (!apiKey || !chatId) {
      return;
    }

    this.bot = new TelegramBot(apiKey);

    this.createTrigger();

    this.client = new Client({
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      user: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
    });

    await this.client.connect();

    this.client.query('LISTEN event_insert_inventory_log');

    this.client.on('notification', async ({ payload }) => {
      const id = Number(payload);

      if (!isInteger(id)) {
        throw new Error('Invalid id');
      }

      this.bufferedIds.add(id);
      this.flushLogs();
    });
  }

  private flushLogs = debounce(async () => {
    if (this.bufferedIds.size === 0) {
      return;
    }

    const ids = Array.from(this.bufferedIds);
    this.bufferedIds.clear();

    const logs = await this.inventoryLogService.findAllItemsOrGroups(
      { limit: ids.length, offset: 0 },
      { ids },
    );

    const messages = formatLogs(logs);

    messages.forEach((message) => {
      this.sendMessage(message);
    });

    messages.forEach((m) => console.log(m));
  }, 1000);

  async dispose() {
    const promises = [this.deleteTrigger(), this.bot?.close()];

    if (this.client) {
      promises.push(this.client.end());
    }

    await Promise.allSettled(promises);
  }
}
