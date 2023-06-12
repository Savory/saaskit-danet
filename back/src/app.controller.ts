import { Controller, Get } from 'danet/mod.ts';

@Controller('')
export class AppController {
  constructor() {
  }

  @Get()
  helloWorld() {
    return 'Hello World';
  }
}
