import { bootstrap } from '../src/bootstrap.ts';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from 'https://deno.land/std@0.140.0/testing/bdd.ts';
import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.140.0/testing/asserts.ts';
import { Todo } from '../src/todo/class.ts';
import { TodoService } from '../src/todo/service.ts';
import { DanetApplication } from 'danet/mod.ts';

let app: DanetApplication;
let server;
let todoService: TodoService;
let port: number;
const payload: Omit<Todo, '_id'> = {
  title: 'my todo',
  content: 'long enough content for passing validation',
};
describe('Todo', () => {
  beforeAll(async () => {
    app = await bootstrap();
    server = await app.listen(0);
    todoService = await app.get<TodoService>(TodoService);
    port = server.port;

    // we need this to make oak listen outside of any test to not leak
    const res = await fetch(`http://localhost:${port}`);
    await res.text();
  });

  afterEach(async () => {
    await todoService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  it('simple todo creation', async () => {
    const res = await fetch(`http://localhost:${port}/todo`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const returnedData: Todo = await res.json();
    assertExists(returnedData._id);
    assertEquals(returnedData.title, payload.title);
    assertEquals(returnedData.content, payload.content);
  });

  it('get an HTTP 400 error is body is not well formatted', async () => {
    const res = await fetch(`http://localhost:${port}/todo`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'my todo',
        content: 'tooshortcontent',
      }),
    });
    const returnedData: { reasons: unknown[] } = await res.json();
    assertArrayIncludes(returnedData.reasons, [{
      'property': 'content',
      'errorMessage': 'Length must be greater than 20',
      'constraints': [
        20,
      ],
    }]);
  });

  it('get all todos', async () => {
    const firstAdded = await todoService.create({
      title: 'first todo',
      content: 'first content',
    });
    const secondAdded = await todoService.create({
      title: 'second todo',
      content: 'second content',
    });

    const res = await fetch(`http://localhost:${port}/todo`, {
      method: 'GET',
    });

    const returnedData: Todo[] = await res.json();
    assertEquals(returnedData.length, 2);
    const plainArray = JSON.parse(JSON.stringify([firstAdded, secondAdded]));
    assertArrayIncludes(returnedData, plainArray);
  });

  it('get one todo by id', async () => {
    const firstAdded = await todoService.create({
      title: 'first todo',
      content: 'first content',
    });

    const res = await fetch(`http://localhost:${port}/todo/${firstAdded._id}`, {
      method: 'GET',
    });
    const returnedTodo: Todo = await res.json();
    const plainObject = JSON.parse(JSON.stringify(firstAdded));

    assertEquals(returnedTodo, plainObject);
  });

  it('update one todo by id', async () => {
    const firstAdded = await todoService.create({
      title: 'first todo',
      content: 'content is long enough for validation again',
    });
    await (await fetch(`http://localhost:${port}/todo/${firstAdded._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'newtitle',
        content: 'content is long enough for validation again',
      }),
    })).text();
    const returnedTodo =
      await (await fetch(`http://localhost:${port}/todo/${firstAdded._id}`, {
        method: 'GET',
      })).json();

    assertEquals(returnedTodo.title, 'newtitle');
  });

  it('delete one todo', async () => {
    const firstAdded = await todoService.create({
      title: 'first todo',
      content: 'first content',
    });

    const res = await fetch(`http://localhost:${port}/todo/${firstAdded._id}`, {
      method: 'DELETE',
    });
    await res.text();

    assertEquals(await todoService.getById(firstAdded._id), undefined);
  });
});
