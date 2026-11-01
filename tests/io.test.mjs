import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeImport} from '../src/io.js';import {getExample} from '../src/examples.js';import {evaluateScenario} from '../src/engine.js';
test('JSON import round-trip preserves example outcomes',()=>{for(const key of 'abcde'){const raw=JSON.parse(JSON.stringify(getExample(key)));const normalized=normalizeImport(raw);assert.equal(evaluateScenario(normalized).disposition,evaluateScenario(raw).disposition);}});
test('JSON import blocks unsupported versions',()=>assert.throws(()=>normalizeImport({schemaVersion:'future'}),/Only SVG-0.1/));
test('JSON import strips unrecognized fields',()=>{const raw=getExample('e');raw.__proto__={attack:'yes'};raw.models[0].extraneous='bad';const x=normalizeImport(raw);assert.equal(Object.hasOwn(x.models[0],'extraneous'),false);});
test('JSON import caps list sizes',()=>{const raw=getExample('e');raw.models=Array(41).fill(raw.models[0]);assert.throws(()=>normalizeImport(raw),/oversized/);});
test('JSON import does not accept string numeric scores',()=>{const raw=getExample('e');raw.priority.influence='5';const x=normalizeImport(raw);assert.equal(evaluateScenario(x).priority,null);});
