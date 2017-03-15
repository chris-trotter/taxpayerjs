import CONFIG from './config';
import DEFAULT_ATTRIBUTES from './default-attributes';
import has from 'lodash/has';

class Taxpayer {
    constructor(attributes, taxYear = CONFIG.DEFAULT_TAX_YEAR) {

        // Throw error if no attributes provided
        if (!attributes) {
            throw Error (CONFIG.ERRORS.MISSING_ATTRIBUTES);
        }

        this.taxYear = taxYear;

        // Assign tax payer's attributes to the base of the instantiated object
        // This creates a simple API for users
        Object.assign(this, DEFAULT_ATTRIBUTES, attributes);

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

    get maxPersonalAllowance(){
        // Return the revised maximum personal allowance after considering user's tax levels
        let modifier,
            {base, incomeLimit} = this.rules.incomeTax.personalAllowance,
            {grossSalary} = this;

        modifier = Math.max(
            Math.min(
                ((grossSalary - incomeLimit) / 2), 
                base
            ), 
            0
        );

        return base - modifier;
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
        let {threshold, rate} = this.rules.incomeTax.studentLoanRepayments['plan' + studentLoanRepaymentsPlan],
            rateableSalary, repayment = 0;
        
        if (studentLoanRepayments) {
            rateableSalary = Math.max(grossSalary - threshold, 0);
            repayment = rateableSalary * rate;
        }

        return repayment;
    }

    get taxableIncome() {
        let {grossSalary, personalAllowance} = this;

        return grossSalary - personalAllowance;
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
}

export default Taxpayer;