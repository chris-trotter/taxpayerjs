const config = {
    "DEFAULT_TAX_YEAR": "2015/2016",
    "ERRORS": {
        "MISSING_ATTRIBUTES": "Tax payer attributes must be provided.",
        "INVALID_TAX_YEAR": "A valid tax year was not provided."
    },
    "2015/2016": {
        "incomeTax": {
            "personalAllowance": 10600,
            "personalAllowanceIncomeLimit": 100000,
            "taxRate": 0.3
        }
    },
    "2014/2015": {
        "incomeTax": {
            "personalAllowance": 12000,
            "personalAllowanceIncomeLimit": 100000,
            "taxRate": 0.3
        }
    },
    "2013/2014": {
        "incomeTax": {
            "personalAllowance": 12000,
            "personalAllowanceIncomeLimit": 100000,
            "taxRate": 0.3
        }
    },
}

export default config;