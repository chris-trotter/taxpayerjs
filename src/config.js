const config = {
    "DEFAULT_TAX_YEAR": "2015/2016",
    "ERRORS": {
        "MISSING_ATTRIBUTES": "Tax payer attributes must be provided.",
        "INVALID_TAX_YEAR": "A valid tax year was not provided."
    },
    "2015/2016": {
        "incomeTax": {
            "studentLoanRepayments": {
                "plan1": {
                    "threshold": "17495",
                    "rate": 0.09
                },
                "plan2": {
                    "threshold": "21000",
                    "rate": 0.09
                }
            },
            "personalAllowance": {
                "standard": 10600,
                "incomeLimit": 100000
            },
            "bands": [
                {
                    "lowerLimit": 0,
                    "upperLimit": 31785,
                    "rate": 0.2
                },
                {   
                    "lowerLimit": 31785,
                    "upperLimit": 150000,
                    "rate": 0.40
                },
                {
                    "lowerLimit": 150000,
                    "rate": 0.45
                }
            ]
        }
    },
    "2014/2015": {
        "incomeTax": {
            "studentLoanRepayments": {
                "plan1": {
                    "threshold": "17495",
                    "rate": 0.09
                },
                "plan2": {
                    "threshold": "21000",
                    "rate": 0.09
                }
            },
            "personalAllowance": {
                "standard": 10600,
                "incomeLimit": 150000
            },
            "bands": [
                {
                    "lowerLimit": 0,
                    "upperLimit": 31865,
                    "rate": 0.2
                },
                {
                    "lowerLimit": 31865,
                    "upperLimit": 150000,
                    "rate": 0.40
                },
                {
                    "lowerLimit": 150000,
                    "rate": 0.45
                }
            ]
        }
    },
    "2013/2014": {
        "incomeTax": {
            "studentLoanRepayments": {
                "plan1": {
                    "threshold": "17495",
                    "rate": 0.09
                },
                "plan2": {
                    "threshold": "21000",
                    "rate": 0.09
                }
            },
            "personalAllowance": {
                "standard": 10600,
                "incomeLimit": 100000
            },
            "bands": [
                {
                    "lowerLimit": 0,
                    "upperLimit": 32010,
                    "rate": 0.2
                },
                {
                    "lowerLimit": 0,
                    "upperLimit": 150000,
                    "rate": 0.40
                },
                {
                    "lowerLimit": 150000,
                    "rate": 0.45
                }
            ]
        }
    },
}

export default config;