import { bundle } from 'https://deno.land/x/emit@0.24.0/mod.ts';
const result = await bundle(new URL('./run.ts', import.meta.url), {
  compilerOptions: { emitDecoratorMetadata: true },
  importMap: '../import_map.json',
});

const { code } = result;
console.log(code);
