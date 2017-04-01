# taxpayerjs
A javascript library to perform UK personal taxation calculations

## What is it
Taxpayer.js peforms common personal taxation calculations that are relevant under UK law. This project is likely to be useful for those developing applications that require an estimate of an individual's personal taxation liabilities for a particular tax year.

## How do I configure this with my website?
`<script type="text/javascript" src="taxpayer.js"></script>
// Assuming ES5 as this is supported by all environments
<script>
var john = new Taxpayer(50000);
var taxLiability = john.taxLiability;
</script>`

## How does it work
The library allows for the instantiation of a taxpayer that is configured with the taxpayer's relevant financial information for a tax year. Using the taxpayer's financial attributes, and the relevant tax rules for a particular tax year, the library generates taxation information.

## Which tax years are supported?
- 2017/2016
- 2016/2015
- 2015/2014
- 2014/2013

## How do I add a new tax year?
Provided the structure of personal taxation rules in the UK do not change in future tax years, rules for tax years may be amended by adding an additional object in the `insert` file. By default the library uses the most recently configured tax year.

