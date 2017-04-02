# taxpayer.js
A javascript library to perform UK personal taxation calculations

## What is it
Taxpayer.js peforms common personal taxation calculations that are relevant under UK law. This project is likely to be useful for those developing applications that require an estimate of an individual's personal taxation liabilities for a particular tax year.

## How do I configure this with my website?
This library is compatible with both browsers and node.js. Although the code, located in the `src` folder, has been written in in ES6, the library has been bundled using ES5 to ensure wide compatibility.

### node.js usage
```javascript
const Taxpayer = require('build/taxpayer.js');

```

### Browser based usage
```javascript
// Assuming ES5 as compatible with all environments
<script type="text/javascript" src="build/taxpayer.js"></script>
```

## Instantiating a new taxpayer object
```javascript
  // Ensure that taxpayer.js library has been imported to your environment.
  
<script>
  // Basic example - Instantiate a new taxpayer with a salary of 50000
  var john = new Taxpayer(50000);
  
  // Assign john's tax liability to a new variable called liability
  var liability1 = john.taxPayable;
  
  // More detailed - configuring with detailed attributes (see attributes section below)
  var johnAttributes = {
  age: 30,
  grossSalary: 50000,
  giftAid: 2000,
  studentLoanRepayments: true
  pensionSacrificePercent: 0.05
  }
  
  var sarah = new Taxpayer(sarahAttributes);
  var liability2 = sarah.taxPayable;
  
</script>
```

## Default attributes
When instantiating a new taxpayer object, the library will make assumptions about the taxpayer which may be overwritten.

```javascript
// Default attributes
    age: 40,
    grossSalary: 0.0,
    benefitsInKind: 0.0,
    giftAid: 0.0,
    studentLoanRepayments: false, 
    studentLoanRepaymentsPlan: 1,
    pensionSacrificePercent: 0.00
```

To override these defaults, you can either amend the configuration on instantiation or override the property after instantiation.

```javascript
var johnAttributes = {
  grossSalary: 170000,
  age: 30
};

var john = new Taxpayer(johnAttributes);
john.giftAid = 30000;

// Calculate John's additional rate tax liability
var additionalTax = john.additionalRateTax;
```

## Available methods

| Method name | Description | Usage |
| ---         | ---         | ---   |
| personalAllowance     | Calculates the personal allowance allowance to be used by the taxpayer     | john.personalAllowance    |
| studentLoanRepayment | Calculates the student loan payments due from the tax payer (if applicable). | john.studentLoanRepayment |
| taxableIncome | Calculates the total amount of income that will be deemed taxable under UK tax law. For example, this may be less than gross salary if the tax payer has pension deductions. | john.taxableIncome | 
| basicRateUsage | Calculates usage of the basic rate band | john.basicRateUsage
| basicRateTax | Calculates basic rate tax liability | john.basicRateTax
| higherRateUsage | Calculates usage of the higher rate band | john.higherRateUsage
| higherRateTax | Calculates higher rate tax liability | john.higherRateTax
| additionalRateTax | Calculates additional rate tax liability | john.additionalRateTax
| additionalRateUsage | Calculates usage of the additional rate tax band | john.additionalRateUsage
| taxPayable | Calculates total income tax liability | john.taxPayable
| takeHomePay | Calculates income to be kept by the taxpayer after deduction of taxes, loan repayments, national insurance and pension sacrifice | john.takeHomePay
| nationalInsurance | Calculates total national insurance liability |  john.nationalInsurance

## What if the tax payer is paid weekly/monthly or another period?
By the default the library assumes that all amounts entered represent annual remuneration. This may be changed by setting the payPeriod attribute on the taxpayer to `daily`, `weekly` or `monthly`. This will ensure that rules are adjusted to match the period.

```javascript
john.payPeriod = 'Monthly'

var weeklyLiability = john.taxPayable;
```

## How does it work
The library allows for the instantiation of a taxpayer that is configured with the taxpayer's relevant financial information for a tax year. Using the taxpayer's financial attributes, and the relevant tax rules for a particular tax year, the library generates taxation information.

## Which tax years are supported?
- 2017/2016
- 2016/2015
- 2015/2014
- 2014/2013

## How do I change the tax year the library is using?
By default the library will use the tax year that is configured in the `DEFAULT_TAX_YEAR` key in the config.js file. This references an object in the config.js file which contains relevant tax rules. You may change the tax year when instantiating a new taxpayer object by passing in a string, representing the tax year, as the second arguement. For example
```javascript
var john = new Taxpayer({grossSalary: 50000}, '2014/2015');
```

Any tax calculations performed will be made using the tax rules for the passed tax year.

## How do I add a new tax year?
Provided the structure of personal taxation rules in the UK do not change in future tax years, rules for tax years may be amended by adding an additional object in the `insert` file. By default the library uses the most recently configured tax year.

## Future features
-  Add ability to add multiple jobs to enable correct national insurance payments
-  Add additional edge cases
-  Add GUI demo case
