'use strict';

import {expect} from 'chai';
import Taxpayer from '../src/Taxpayer';
import CONFIG from '../src/config';

describe('Taxpayer class', () => {
    describe('Instantiation', () => {
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

        it('treats number only on instantiation as gross salary', () => {
            let john = new Taxpayer(50000);
            expect(john.grossSalary).to.equal(50000);
        })

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
    describe('Maximum Personal allowance', () => {

        it('should be reduced if gross salary is over PA Income Limit', () => {            
            let john = new Taxpayer({age: 50});
            let {incomeLimit} = john.rules.incomeTax.personalAllowance;
            john.grossSalary = incomeLimit + 5000;

            expect(john.maxPersonalAllowance)
                .to.be.lessThan(john.rules.incomeTax.personalAllowance.standard)
                .and.to.be.at.least(0);
        });

        it('should remain unchanged if gross salary is below the PA Income Limit', () => {
            let john = new Taxpayer({age: 50});
            let {incomeLimit} = john.rules.incomeTax.personalAllowance;
            john.grossSalary = incomeLimit - 5000;

            expect(john.maxPersonalAllowance)
                .to.equal(john.rules.incomeTax.personalAllowance.standard);
        });

        it('should be nil if gross salary is double PA Income Limit', () => {            
            let john = new Taxpayer({age: 50});
            let {incomeLimit} = john.rules.incomeTax.personalAllowance;
            john.grossSalary = incomeLimit * 2;

            expect(john.maxPersonalAllowance).to.equal(0);
        });
    });

    describe('Personal allowance', () => {
        it('should match gross salary if below maximum personal allowance', () => {
            let john = new Taxpayer({});
            let grossSalary = john.rules.incomeTax.personalAllowance.standard - 1000;
            john.grossSalary = grossSalary;

            expect(john.personalAllowance).to.equal(grossSalary);
        });

        it('should be above nil if salary is below maximum income level', () => {
            let john = new Taxpayer({grossSalary: 70000});

            expect(john.personalAllowance).to.be.greaterThan(0);
        });

        it('should match tax code attribute if provided', () => {
            let john = new Taxpayer({grossSalary: 50000, taxCode: '700L'});

            expect(john.personalAllowance).to.equal(7000);
        });

        it('should apply upper limit to tax code attribute if provided', () => {
            let john = new Taxpayer({grossSalary: 150000, taxCode: '700L'});

            expect(john.personalAllowance).to.equal(0);
        });

        it('should equal maximum personal allowance if gross salary over maximum personal allowance', () => {
            let john = new Taxpayer({});
            let grossSalary = john.rules.incomeTax.personalAllowance.standard + 1000;
            john.grossSalary = grossSalary;

            expect(john.personalAllowance).to.equal(john.maxPersonalAllowance);
        })
    });

    describe('Pension sacrifice', () => {
        it('should calculate no pension sacrifice when no percentage set', () => {
            let johnSettings = {
                grossSalary: 50000.00
            };

            let john = new Taxpayer(johnSettings);

            expect(john.pensionSacrifice).to.equal(0);
        });

        it('should calculate correct pension sacrifice when set', () => {
            let johnSettings = {
                grossSalary: 50000.00,
                pensionSacrificePercent: 0.05
            };

            let john = new Taxpayer(johnSettings);

            expect(john.pensionSacrifice).to.equal(2500);
        });
    });

    describe('Student loan repayments', () => {
        it('should have nil repayments if not opted in to student loan repayments', () => {
            let johnSettings = {
                grossSalary: 50000,
                studentLoanRepayments: false,
                studentLoanRepaymentsPlan: 1
            };

            let sarahSettings = {
                grossSalary: 50000,
                studentLoanRepayments: false,
                studentLoanRepaymentsPlan: 2
            };

            let john = new Taxpayer(johnSettings);
            let sarah = new Taxpayer(sarahSettings);

            expect(john.studentLoanRepayment).to.equal(0);
            expect(sarah.studentLoanRepayment).to.equal(0);
        });

        it('should have nil repayments if earning below threshold', () => {
            let johnSettings = { 
                studentLoanRepayments: true, 
                studentLoanRepaymentsPlan: 1,
            };

            let sarahSettings = { 
                studentLoanRepayments: true, 
                studentLoanRepaymentsPlan: 2,
            };

            let john = new Taxpayer(johnSettings);
            let sarah = new Taxpayer(sarahSettings);

            john.grossSalary = john.rules.incomeTax.studentLoanRepayments.plan1.threshold - 1000;
            sarah.grossSalary = sarah.rules.incomeTax.studentLoanRepayments.plan2.threshold - 1000;
            
            expect(john.studentLoanRepayment).to.equal(0);
            expect(sarah.studentLoanRepayment).to.equal(0);
        });

         it('should have student loan repayments if earning double the threshold', () => {
            let johnSettings = { 
                studentLoanRepayments: true, 
                studentLoanRepaymentsPlan: 1,
            };

            let sarahSettings = { 
                studentLoanRepayments: true, 
                studentLoanRepaymentsPlan: 2,
            };

            let john = new Taxpayer(johnSettings);
            let sarah = new Taxpayer(sarahSettings);

            john.grossSalary = john.rules.incomeTax.studentLoanRepayments.plan1.threshold * 2;
            sarah.grossSalary = sarah.rules.incomeTax.studentLoanRepayments.plan2.threshold * 2;

            expect(john.studentLoanRepayment).to.be.greaterThan(0);
            expect(sarah.studentLoanRepayment).to.be.greaterThan(0);
        });
    });

    describe('Taxable income', () => {
        it('should be nil if gross Salary is below the personal allowance', () => {
            let john = new Taxpayer({});
            let grossSalary = john.rules.incomeTax.personalAllowance.standard - 1000;
            john.grossSalary = grossSalary;

            expect(john.taxableIncome).to.equal(0);
        });

        it('should equal gross salary is above personal allowance income limit', () => {
            let john = new Taxpayer({grossSalary: 140000});
            expect(john.taxableIncome).to.equal(140000);
        });
    });

    describe('Basic rate band', () => {
        it('should be nil if grossSalary is maximum below personal allowance', () => {
            let john = new Taxpayer({});
            let grossSalary = john.rules.incomeTax.personalAllowance.standard - 1000;
            john.grossSalary = grossSalary;

            expect(john.basicRateTax).to.equal(0);
        });

        it('should be equal to range * rate if salary is higher than the band and PA', () => {
            let john, expectedTax;

            john = new Taxpayer({});

            let {upperLimit, rate} = john.rules.incomeTax.bands[0],
                {standard} = john.rules.incomeTax.personalAllowance;

            john.grossSalary = standard + upperLimit;
            expectedTax = upperLimit * rate;

            expect(john.basicRateTax).to.equal(expectedTax);
        });
    });

    describe('Higher rate band', () => {
        it('should be nil if income is below higher rate lower limit', () => {
            let john, expectedHigherRateTax;
            john = new Taxpayer({});
            let {lowerLimit} = john.rules.incomeTax.bands[1];

            john.grossSalary = lowerLimit - 1000;
            expectedHigherRateTax = 0;
            
            expect(john.higherRateTax).to.equal(expectedHigherRateTax);
        });

        it('should be equal to range * rate if salary is double the upper limit', () => {
            let john, expectedHigherRateTax;
            john = new Taxpayer({});
            let {lowerLimit, upperLimit, rate} = john.rules.incomeTax.bands[1];
            
            john.grossSalary = upperLimit * 2;
            expectedHigherRateTax = (upperLimit - lowerLimit) * rate;

            expect(john.higherRateTax).to.equal(expectedHigherRateTax);
        });
    });

    describe('Additional rate band', () => {
        it('should should be nil if income is below higher rate lower limit', () => {
            let john, expectedAdditionalRateTax;
            john = new Taxpayer({});
            let {lowerLimit} = john.rules.incomeTax.bands[2];

            john.grossSalary = lowerLimit - 1000;
            expectedAdditionalRateTax = 0;

            expect(john.additionalRateTax).to.equal(expectedAdditionalRateTax);
        });

        it('should result in higher tax for every additional unit of income over the lower limit', () => {
            let john, sarah, expectedTaxDifference, rate;
            john = new Taxpayer({});
            sarah = new Taxpayer({});

            let johnLowerLimit  = john.rules.incomeTax.bands[2].lowerLimit, 
                johnRate        = john.rules.incomeTax.bands[2].rate, 
                sarahLowerLimit  = sarah.rules.incomeTax.bands[2].lowerLimit, 
                sarahRate        = sarah.rules.incomeTax.bands[2].rate;
            
            rate = (johnRate === sarahRate) ? johnRate : 0;

            john.grossSalary = johnLowerLimit + 3000;
            sarah.grossSalary = sarahLowerLimit + 1000;

            expectedTaxDifference = (john.grossSalary - sarah.grossSalary) * rate;

            expect(john.additionalRateTax - sarah.additionalRateTax).to.equal(expectedTaxDifference);
        });
    });

    describe('Income tax payable', () => {
        it('should equal the sum of the parts', () => {
            let john = new Taxpayer({salary: 50000});
            let {basicRateTax, higherRateTax, additionalRateTax} = john;
            let taxPayable = basicRateTax + higherRateTax + additionalRateTax;

            expect(john.taxPayable).to.equal(taxPayable);
        });

        it('should equal nil if taxpayer has no income', () => {
            let john = new Taxpayer({});
            expect(john.taxPayable).to.equal(0);
        });
    });
});