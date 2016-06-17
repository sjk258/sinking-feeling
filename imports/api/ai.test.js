import { assert } from 'meteor/practicalmeteor:chai';
import * as AI from './ai.js';

describe('AI handler', function() {
    describe('method getNames', function() {
        it('returns an array', function() {
            const names = AI.getNames();
            assert.isArray(names);
        });
        it('contains sue', function() {
            const names = AI.getNames();
            assert.include(names, 'sue');
        });
    });
    describe('attribute default_name', function() {
        it('is a string', function() {
            assert.isString(AI.default_name);
        });
    });
    describe('method getPlayer', function() {
        it('returns an object', function() {
            const ai = AI.getPlayer('sue');
            assert.isObject(ai);
        });
        it('returns an object with string attribute "name"', function() {
            const ai = AI.getPlayer('sue');
            assert.isObject(ai);
            assert.property(ai, 'name');
            assert.isString(ai.name);
        });
        it('returns an object with method makeMove', function() {
            const ai = AI.getPlayer('sue');
            assert.isObject(ai);
            assert.property(ai, 'makeMove');
            assert.isFunction(ai.makeMove);
        });
        it('invalid name does not cause failure', function() {
            const ai = AI.getPlayer('invalid-name');
            assert.isObject(ai);
        });
        it('falls back to default with an invalid name', function() {
            const ai = AI.getPlayer('invalid-name');
            assert.isObject(ai);
            assert(ai.name, AI.default_name);
        });
        it('treats name without case sensitivity', function() {
            const ai = AI.getPlayer('SuE');
            assert.isObject(ai);
            assert(ai.name, 'sue');
        });
    });
});