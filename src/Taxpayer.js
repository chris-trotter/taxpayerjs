'use strict';

import CONFIG from './config';
import DEFAULT_ATTRIBUTES from './default-attributes';
import has from 'lodash/has';

class Taxpayer {
    constructor(attributes, taxYear = CONFIG.DEFAULT_TAX_YEAR) {

        // If a number is passed as attributes, this is treated as
        // the taxpayer's gross salary
        if (typeof(attributes) === 'number') {
            Object.assign(this, 
                DEFAULT_ATTRIBUTES, 
                {grossSalary: attributes}
            );
        }

        // If an object is passed as attributes,
        // these are applied as instantiated properties
        if (typeof(attributes) === 'object') {
            Object.assign(this, 
                DEFAULT_ATTRIBUTES, 
                attributes
            );
        }

        // Throw error if no attributes provided
        if (!attributes) {
            throw Error (CONFIG.ERRORS.MISSING_ATTRIBUTES);
        }

        this.taxYear = taxYear;
    }

    get taxYear(){
        return this._taxYear;
    }

    set taxYear(taxYear){
        // Lookup provided tax year and assign the appropriate configuration
        this._taxYear = taxYear;

        if (has(CONFIG, taxYear)) {
            this.rules = CONFIG[taxYear];
        } else {
            throw Error (CONFIG.ERRORS.INVALID_TAX_YEAR);
        }
    }

    taxCodePA() {
        // If a taxpayer is created with a tax code then the
        // personal allowance should be extracted.

        let personalAllowance,
            {taxCode} = this;
        
        if (taxCode) {
            personalAllowance = Number(taxCode.match(/\d+/)[0]) * 10;
        }

        return personalAllowance;
    }

    get basePersonalAllowance() {
        // If the user has a tax code, then this will override
        // the statutory personal allowance.
        let base = 0, additionalAllowances = 0,
            {standard, blindTopup} = this.rules.incomeTax.personalAllowance,
            {blind} = this,
            taxCodePA = this.taxCodePA();

        // If tax payer is blind, they are entitled to the blind top-up
        if (blind) {
            additionalAllowances += blindTopup;
        }
        
        base = standard + additionalAllowances;

        return taxCodePA || base;
    }

    get maxPersonalAllowance(){
        // Return the revised maximum personal allowance 
        // after considering user's tax circumstances.

        let modifier,
            {incomeLimit} = this.rules.incomeTax.personalAllowance,
            {grossSalary, basePersonalAllowance} = this;
        
        let lowest  = 0,
            highest = basePersonalAllowance;
        
        modifier = Math.max(
            Math.min(
                ((grossSalary - incomeLimit) / 2), 
                highest
            ),
            lowest
        );

        return basePersonalAllowance - modifier;
    }

    get personalAllowance() {
        let {grossSalary, maxPersonalAllowance} = this;
        return Math.min(grossSalary, maxPersonalAllowance);
    }

    get pensionSacrifice() {
        let {grossSalary, 
            pensionSacrificePercent} = this;
        
        return grossSalary * pensionSacrificePercent;
    }
    
    get studentLoanRepayment() {
        let {grossSalary, studentLoanRepayments, studentLoanRepaymentsPlan} = this;
        let {threshold, rate} = this.rules.studentLoanRepayments['plan' + studentLoanRepaymentsPlan],
            rateableSalary, repayment = 0;
        
        if (studentLoanRepayments) {
            rateableSalary = Math.max(grossSalary - threshold, 0);
            repayment = rateableSalary * rate;
        }

        return repayment;
    }

    get totalIncome() {
        let income,
            {grossSalary, benefitsInKind} = this;

        income = grossSalary + benefitsInKind;

        return income;
    }

    get incomeDeductions() {
        let deductions = 0,
            {pensionSacrifice, giftAid} = this;

        deductions = pensionSacrifice + giftAid;
        
        return deductions;
    }

    get taxableIncome() {
        let {totalIncome, incomeDeductions, personalAllowance} = this;

        return (totalIncome - incomeDeductions) - personalAllowance;
    }

    get basicRateUsage() {
        let range,
            {taxableIncome} = this,
            {upperLimit} = this.rules.incomeTax.bands[0];
        
        range = Math.min(taxableIncome, upperLimit);

        return range;
    }

    get basicRateTax() {
        let tax,
            {basicRateUsage} = this,
            {rate} = this.rules.incomeTax.bands[0];
        
        tax = basicRateUsage * rate;

        return tax;
    }

    get higherRateUsage() {
        let range, tax,
            {taxableIncome, basicRateUsage} = this,
            {lowerLimit, upperLimit, rate} = this.rules.incomeTax.bands[1];

        range = Math.min(   upperLimit - lowerLimit, 
                            taxableIncome - basicRateUsage);
                            
        return range;
    }

    get higherRateTax() {
        let tax,
            {higherRateUsage} = this,
            {rate} = this.rules.incomeTax.bands[1];
        
        tax = higherRateUsage * rate;

        return tax;
    }

    get additionalRateUsage() {
        let range, tax,
            {taxableIncome, basicRateUsage, higherRateUsage} = this,
            {rate} = this.rules.incomeTax.bands[2];

        range = taxableIncome - (higherRateUsage + basicRateUsage);
                            
        return range;
    }

    get additionalRateTax() {
        let tax,
            {additionalRateUsage} = this,
            {rate} = this.rules.incomeTax.bands[2];
        
        tax = additionalRateUsage * rate;

        return tax;
    }

    get taxPayable() {
        let  {basicRateTax, higherRateTax, additionalRateTax} = this;
        
        return  basicRateTax + 
                higherRateTax + 
                additionalRateTax;
    }

    get takeHomePay() {
        let {grossSalary, pensionSacrifice, studentLoanRepayment, taxPayable,
            nationalInsurance} = this;
        
        return grossSalary - (pensionSacrifice + studentLoanRepayment + taxPayable + nationalInsurance);
    }

    get natInsPtUsage() {
        let usage, taxableSalary,
            {grossSalary, age} = this,
            {pensionAge} = this.rules.nationalInsurance,
            {lowerLimit, upperLimit} = this.rules.nationalInsurance.bands[0];
        
        // Deduct NI tax free amount prior to determining liability
        taxableSalary = Math.max(grossSalary - lowerLimit, 0);
        usage = Math.min(taxableSalary, upperLimit - lowerLimit);

        // No NI Liability if pensionable age
        if (age >= pensionAge) {
            usage = 0;
        }

        return usage;
    }

    get natInsPtTax() {
        let tax,
            {natInsPtUsage} = this,
            {rate} = this.rules.nationalInsurance.bands[0];
        
        // Deduct NI tax free amount prior to determining liability
        tax = natInsPtUsage * rate;

        return tax;
    }

    get natInsUelUsage() {
        let usage, taxableSalary,
            {grossSalary, age} = this,
            {pensionAge} = this.rules.nationalInsurance,
            {lowerLimit} = this.rules.nationalInsurance.bands[1];
        
        taxableSalary = grossSalary - lowerLimit;
        usage = Math.max(taxableSalary, 0);

        // No NI Liability if pensionable age
        if (age >= pensionAge) {
            usage = 0;
        }

        return usage;
    }

    get natInsUelTax() {
        let tax,
            {natInsUelUsage} = this,
            {rate} = this.rules.nationalInsurance.bands[1];
        
        // Deduct NI tax free amount prior to determining liability
        tax = natInsUelUsage * rate;

        return tax;
    }

    get nationalInsurance() {
        let {natInsPtTax, natInsUelTax} = this;

        return natInsPtTax + natInsUelTax;
    }

}

export default Taxpayer;