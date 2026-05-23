/// <reference types="vitest/globals" />
import { ɵgetCleanupHook as getCleanupHook, getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

const ANGULAR_TESTBED_SETUP = Symbol.for('@angular/cli/testbed-setup');

if (!(globalThis as any)[ANGULAR_TESTBED_SETUP]) {
  (globalThis as any)[ANGULAR_TESTBED_SETUP] = true;

  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: false },
  });
}

beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));
