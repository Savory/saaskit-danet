import { Injectable } from 'danet/mod.ts';
import { OnAppBootstrap, OnAppClose } from 'danet/src/hook/interfaces.ts';
import { Client } from 'postgres/mod.ts';

@Injectable()
export class PostgresService implements OnAppBootstrap, OnAppClose {
  constructor() {}

  public client!: Client;

  async onAppBootstrap() {
    this.client = new Client({
      user: Deno.env.get('DB_USERNAME'),
      password: Deno.env.get('DB_PASSWORD'),
      database: Deno.env.get('DB_NAME'),
      hostname: Deno.env.get('DB_HOST'),
    });
    await this.client.connect();
  }

  async onAppClose() {
    await this.client.end();
  }
}
