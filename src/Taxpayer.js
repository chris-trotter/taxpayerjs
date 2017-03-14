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

    get basicRateTax() {
        let range, tax,
            {taxableIncome} = this,
            {upperLimit, rate} = this.rules.incomeTax.bands[0];
        
        range = Math.min(taxableIncome, upperLimit);
        tax = range * rate;

        return tax;
    }
}

export default Taxpayer;