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

    get personalAllowance(){
        // Return the revised personal allowance after considering user's tax levels
        let modifier,
            {personalAllowance, personalAllowanceIncomeLimit} = this.rules.incomeTax,
            {grossSalary} = this;

        modifier = Math.max(
            Math.min(
                ((grossSalary - personalAllowanceIncomeLimit) / 2), 
                personalAllowance
            ), 
            0
        );

        return personalAllowance - modifier;
    }

    get pensionSacrifice() {
        let {grossSalary, 
            pensionSacrificePercent} = this;
        
        return grossSalary * pensionSacrificePercent;
    }
    
}

export default Taxpayer;