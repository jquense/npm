import test from 'ava';
import {appendFile} from 'fs-extra';
import tempy from 'tempy';
import getRegistry from '../lib/get-registry';

// Save the current working diretory
const cwd = process.cwd();

test.beforeEach(() => {
  // Change current working directory to a temp directory
  process.chdir(tempy.directory());
});

test.afterEach.always(() => {
  // Restore the current working directory
  process.chdir(cwd);
});

test.serial('Get default registry', async t => {
  const registry = await getRegistry({}, 'package-name');

  t.is(registry, 'https://registry.npmjs.org/');
});

test.serial('Get the registry configured in ".npmrc" and normalize trailing slash', async t => {
  await appendFile('./.npmrc', 'registry = https://custom1.registry.com');
  const registry = await getRegistry({}, 'package-name');

  t.is(registry, 'https://custom1.registry.com/');
});

test.serial('Get the registry configured from "publishConfig"', async t => {
  const registry = await getRegistry({registry: 'https://custom2.registry.com/'}, 'package-name');

  t.is(registry, 'https://custom2.registry.com/');
});

test.serial('Get the registry configured in ".npmrc" for scoped package', async t => {
  await appendFile('./.npmrc', '@scope:registry = https://custom3.registry.com');
  const registry = await getRegistry({}, '@scope/package-name');

  t.is(registry, 'https://custom3.registry.com/');
});
