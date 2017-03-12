import config from './config';

class Taxpayer {
    constructor(attributes) {
        Object.assign(this, attributes);
    }
    getSalary(){
        return this.salary;
    }
}

export default Taxpayer;