import { Injectable } from 'danet/mod.ts';
import { OnAppBootstrap, OnAppClose } from 'danet/src/hook/interfaces.ts';

@Injectable()
export class KvService implements OnAppBootstrap, OnAppClose {
  constructor() {}

  public kvClient!: Deno.Kv;

  async onAppBootstrap() {
    this.kvClient = await Deno.openKv();
  }

  client() {
    return this.kvClient;
  }

  async onAppClose() {
    await this.kvClient.close();
  }
}
