'use strict';

import {expect} from 'chai';
import Taxpayer from '../src/Taxpayer';
import CONFIG from '../src/config';

describe('Taxpayer class', () => {
    describe('instantiation', () => {
        it('throws an error if not provided with attributes', () => {
            // http://stackoverflow.com/questions/21587122/mocha-chai-expect-to-throw-not-catching-thrown-errors
            expect(function() {
                let john = new Taxpayer();
            }).to.throw(CONFIG.ERRORS.MISSING_ATTRIBUTES);
        });

        it('throws an error if invalid tax year provided', () => {
            expect(function(){
                let john = new Taxpayer({}, '7d7h');
            }).to.throw(CONFIG.ERRORS.INVALID_TAX_YEAR);
            
            expect(function(){
                let john = new Taxpayer({}, 'blah');
            }).to.throw(CONFIG.ERRORS.INVALID_TAX_YEAR);

            expect(function(){
                let john = new Taxpayer({}, '--28282');
            }).to.throw(CONFIG.ERRORS.INVALID_TAX_YEAR);
        });

        it('reverts to default tax year if none provided', () => {
            let john = new Taxpayer({});
            expect(john.taxYear).to.equal(CONFIG.DEFAULT_TAX_YEAR);
        })

        it('instance can retrieve a taxpayer attribute', () => {
            const attributes = {
                grossSalary: 50000
            };
            let john = new Taxpayer(attributes);
            expect(john.grossSalary).to.equal(50000);
        });

        it('instance can set a tax year on instantiation', () => {
            let john = new Taxpayer({}, '2013/2014');
            expect(john.taxYear).to.equal('2013/2014');
        });

        it('can set a tax year after instantiation', () => {
            let john = new Taxpayer({});
            john.taxYear = '2015/2016';
            expect(john.taxYear).to.equal('2015/2016');
        });

        it('changing tax year results in change in tax rules base', () => {
            let john = new Taxpayer({});
            john.taxYear = '2014/2015';
            expect(john.rules).to.equal(CONFIG['2014/2015']);
            john.taxYear = '2013/2014';
            expect(john.rules).to.equal(CONFIG['2013/2014']);
        });

        it('should add default tax payer attributes', () => {
            let john = new Taxpayer({});
            expect(john.age).to.equal(40);
        });

        it('default tax payer attributes should be overwritten by user defined attributes', () => {
            let john = new Taxpayer({age: 50});
            expect(john.age).to.equal(50);
        });
    });
    describe('Personal allowance', () => {
        it('should be reduced if gross salary is over PA Income Limit', () => {            
            let john = new Taxpayer({age: 50});
            let {personalAllowanceIncomeLimit} = john.rules.incomeTax;
            john.grossSalary = personalAllowanceIncomeLimit + 5000;

            expect(john.personalAllowance)
                .to.be.lessThan(john.rules.incomeTax.personalAllowance)
                .and.to.be.at.least(0);
        });

        it('should remain unchanged if gross salary is below the PA Income Limit', () => {
            let john = new Taxpayer({age: 50});
            let {personalAllowanceIncomeLimit} = john.rules.incomeTax;
            john.grossSalary = personalAllowanceIncomeLimit - 5000;

            expect(john.personalAllowance)
                .to.equal(john.rules.incomeTax.personalAllowance);
        });

        it('should be nil if gross salary is double PA Income Limit', () => {            
            let john = new Taxpayer({age: 50});
            let {personalAllowanceIncomeLimit} = john.rules.incomeTax;
            john.grossSalary = personalAllowanceIncomeLimit * 2;

            expect(john.personalAllowance).to.equal(0);
        });

    })
});