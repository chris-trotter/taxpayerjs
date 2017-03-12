import CONFIG from './config';

class Taxpayer {
    constructor(attributes, taxYear = CONFIG.DEFAULT_TAX_YEAR) {

        // Throw error if no attributes provided
        if (!attributes) {
            throw Error (CONFIG.ERRORS.MISSING_ATTRIBUTES);
        }

        this.taxYear = taxYear;

        // Assign tax payer's attributes to the base of the instantiated object
        // This creates a simple API for users
        Object.assign(this, attributes);


    }
    get taxYear(){
        return this._taxYear;
    }
    set taxYear(taxYear){
        // Lookup provided tax year and assign the appropriate configuration
        this._taxYear = taxYear;

        switch (taxYear) {
            case '2015/2016': {
                this.rules = CONFIG[taxYear];
                break;
            }
            case '2014/2015': {
                this.rules = CONFIG[taxYear];
                break;
            }
            case '2013/2014': {
                this.rules = CONFIG[taxYear];
                break;
            }
            default: {
                throw Error (CONFIG.ERRORS.INVALID_TAX_YEAR);
                break;
            }
        }
        
    }
    getSalary(){
        return this.salary;
    }
}

export default Taxpayer;