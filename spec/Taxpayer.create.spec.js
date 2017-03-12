'use strict';

import {expect} from 'chai';
import Taxpayer from '../src/Taxpayer';

describe('Taxpayer class', () => {
    it('instance can be created', () => {
        let john = new Taxpayer();
        expect(john).to.exist;
    });

    it('instance can retrieve a taxpayer attribute', () => {
        const attributes = {
            salary: 50000
        };
        let john = new Taxpayer(attributes);
        expect(john.getSalary()).to.equal(50000);
    });
    
});