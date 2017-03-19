const config = {
    "DEFAULT_TAX_YEAR": "2015/2016",
    "ERRORS": {
        "MISSING_ATTRIBUTES": "Tax payer attributes must be provided.",
        "INVALID_TAX_YEAR": "A valid tax year was not provided."
    },
    "PAY_PERIODS": {
        "annual": 1,
        "year": 1,
        "month": 12,
        "monthly": 12,
        "week": 52,
        "weekly": 52,
        "fortnight": 26,
        "fortnightly": 26,
        "day": 365,
        "daily": 365
    },
    "2015/2016": {
        "nationalInsurance": {
            "pensionAge": 65,
            "bands": [
                {
                    "lowerLimit": 8064,
                    "upperLimit": 42996,
                    "rate": 0.12
                },
                {
                    "lowerLimit": 42996,
                    "rate": 0.02
                }
            ]
        },
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
        "incomeTax": {
            "personalAllowance": {
                "blindTopup": 2290,
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
        "nationalInsurance": {
            "pensionAge": 65,
            "bands": [
                {
                    "lowerLimit": 8064,
                    "upperLimit": 42996,
                    "rate": 0.12
                },
                {
                    "lowerLimit": 42996,
                    "rate": 0.02
                }
            ]
        },
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
        "incomeTax": {
            "personalAllowance": {
                "blindTopup": 2230,
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
        "nationalInsurance": {
            "pensionAge": 65,
            "bands": [
                {
                    "lowerLimit": 8064,
                    "upperLimit": 42996,
                    "rate": 0.12
                },
                {
                    "lowerLimit": 42996,
                    "rate": 0.02
                }
            ]
        },
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
        "incomeTax": {
            "personalAllowance": {
                "blindTopup": 2160,
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