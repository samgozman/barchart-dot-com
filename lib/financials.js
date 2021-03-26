const cheerio = require('cheerio')
const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')

const _iterateTableWithGroups = ($ = cheerio.load(), table = []) => {
    table = $('tbody').find('tr')
    let obj = {},
        group = undefined,
        subgroup = undefined

    Array.prototype.map.call(table, (line) => {
        const elements = $(line).find('td'),
            $tr = $(line),
            label = elements.first().text()

        // Clear subgroup after separator
        subgroup = $tr.hasClass('bc-financial-report__row-separator') ? undefined : subgroup

        if (!$tr.hasClass('bc-financial-report__row-dates') && !$tr.hasClass('bc-financial-report__row-separator')) {
            // Set keys for object
            let key = !$tr.hasClass('bc-financial-report__row-group-label') && !$tr.hasClass('bc-financial-report__row-subgroup-label') ? label : undefined

            // Setup group name
            group = $tr.hasClass('bc-financial-report__row-group-label') ? $tr.find('td').first().text() : group
            subgroup = $tr.hasClass('bc-financial-report__row-subgroup-label') ? $tr.find('td').first().text() : subgroup

            // ! Fix 'Free Cash Flow' case (not unic key)
            key = key === ' Free Cash Flow ' ? 'Free Flow' : key

            // ! Fix 'Total Liabilities And Equity' key (no group)
            group = label === 'Total Liabilities And Equity' ? undefined : group

            key = $tr.hasClass('bc-financial-report__row-group-total') && group ? 'total' : fixKeys(key)

            // Define array
            if (subgroup && group && key) {
                group = fixKeys(group)
                subgroup = fixKeys(subgroup)

                const prevSub = obj[group] && obj[group][subgroup] ? {
                    ...obj[group][subgroup]
                } : {}

                obj[group] = {
                    ...obj[group],
                    ...{
                        [subgroup]: {
                            ...prevSub,
                            [key]: []
                        }
                    }
                }

            } else if (group && key && group !== key && !subgroup) {
                group = fixKeys(group)

                obj[group] = {
                    ...obj[group],
                    ...{
                        [key]: []
                    }
                }
            } else if (key) {
                obj[key] = []
            } else {
                return
            }

            // Iterate table elements
            elements.each((i, td) => {
                // Skip labels
                const value = $(td).text()
                if (key && value && value !== label) {
                    let fixedValue = fixValues(value)

                    // If key is not starts with 'EPS' - multiply it by 1000
                    fixedValue = key.match(/^eps/g) ? fixedValue : fixedValue * 1000
                    if (group && subgroup) {
                        obj[group][subgroup][key].push(fixedValue)
                    } else if (group) {
                        obj[group][key].push(fixedValue)
                    } else {
                        obj[key].push(fixedValue)
                    }

                }
            })
        } else if ($tr.hasClass('bc-financial-report__row-dates')) {
            // Set number of steps (periods)
            obj.periods = (elements.length || 0) - 1
            obj.startsWith = elements.first().next().text().trim()
        }

    })

    return obj
}


/**
 * Financial data. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} FinancialIncome
 * @property {Number} periods Number of periods (years / quarters) in the array
 * @property {Number} startsWith The closest start date. Annual step is 1 year, quarterly - 3 months
 * @property {Array.<Number>} netIncome How much revenue exceeds the expenses of an organization
 * @property {Array.<Number>} ebitda EBITDA, or earnings before interest, taxes, depreciation, and amortization
 */

const income = () => {
    /**
     * Returns annual income for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {FinancialIncome} Object of parsed data
     */
    this.annual = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'income-statement/annual')
            let annualObj = _iterateTableWithGroups($)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj
        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    /**
     * Returns quarterly income for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {FinancialIncome} Object of parsed data
     */
    this.quarterly = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'income-statement/quarterly')
            let quarterlyObj = _iterateTableWithGroups($)

            // Fix keys
            quarterlyObj = fixKeys(quarterlyObj)

            return quarterlyObj

        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    return {
        annual: this.annual,
        quarterly: this.quarterly
    }
}

/**
 * Default data type: object with arrays + total. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} ObjectWithTotal
 * @property {Array.<Numbers>} total 
 */

/**
 * Free cash flow property object.
 *
 * @typedef {Object} freeCashFlow
 * @property {Array.<Numbers>} operatingCashFlow 
 * @property {Array.<Numbers>} capitalExpenditure 
 * @property {Array.<Numbers>} freeFlow 
 */

/**
 * Financial data for cash flow. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} CashFlow
 * @property {Number} periods Number of periods (years / quarters) in the array
 * @property {Number} startsWith The closest start date. Annual step is 1 year, quarterly - 3 months
 * @property {ObjectWithTotal} cashFlowsFromOperatingActivities 
 * @property {ObjectWithTotal} cashFlowsFromInvestingActivities 
 * @property {ObjectWithTotal} cashFlowsFromFinancingActivities 
 * @property {freeCashFlow} freeCashFlow 
 */

const cashFlow = () => {
    /**
     * Returns quarterly cash flow for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {CashFlow} Object of parsed data
     */
    this.annual = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'cash-flow/annual')
            let annualObj = _iterateTableWithGroups($)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj

        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    /**
     * Returns quarterly cash flow for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {CashFlow} Object of parsed data
     */
    this.quarterly = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'cash-flow/quarterly')
            let quarterlyObj = _iterateTableWithGroups($)

            // Fix keys
            quarterlyObj = fixKeys(quarterlyObj)

            return quarterlyObj
        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    return {
        annual: this.annual,
        quarterly: this.quarterly
    }
}

/**
 * Financial data for balance sheet. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} BalanceSheet
 * @property {Number} periods Number of periods (years / quarters) in the array
 * @property {Number} startsWith The closest start date. Annual step is 1 year, quarterly - 3 months
 * @property {ObjectWithTotal} assets 
 * @property {ObjectWithTotal} liabilities 
 * @property {ObjectWithTotal} shareholdersEquity 
 * @property {Array.<Number>} totalLiabilitiesAndEquity 
 */

const balanceSheet = () => {
    /**
     * Returns annual balance sheet for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {BalanceSheet} Object of parsed data
     */
    this.annual = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'balance-sheet/annual')
            let annualObj = _iterateTableWithGroups($)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj

        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    /**
     * Returns quarterly balance sheet for chosen stock
     * 
     * @param {String} ticker Stock quote
     * @return {BalanceSheet} Object of parsed data
     */
    this.quarterly = async (ticker = '') => {
        try {
            const $ = await getpage(ticker, 'balance-sheet/quarterly')
            let quarterlyObj = _iterateTableWithGroups($)

            // Fix keys
            quarterlyObj = fixKeys(quarterlyObj)

            return quarterlyObj

        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    return {
        annual: this.annual,
        quarterly: this.quarterly
    }
}

module.exports = {
    income,
    cashFlow,
    balanceSheet
}