const FinancialData = require('./utils/FinancialData')

/**
 * Financial data. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} FinancialIncome
 * @property {Number} periods Number of periods (years / quarters) in the array
 * @property {Number} startsWith The closest start date. Annual step is 1 year, quarterly - 3 months
 * @property {Array.<Number>} netIncome How much revenue exceeds the expenses of an organization
 * @property {Array.<Number>} ebitda EBITDA, or earnings before interest, taxes, depreciation, and amortization
 */

const income = (ticker) => {
    const instance = new FinancialData(ticker, 'income-statement')

    /**
     * Object with annual Financial Income
     * @return {Promise<FinancialIncome>} Object
     */
    const annual = () => instance.annual()

    /**
     * Object with quarterly Financial Income
     * @return {Promise<FinancialIncome>} Object
     */
    const quarterly = () => instance.quarterly()

    return {
        annual,
        quarterly
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

const cashFlow = (ticker) => {
    const instance = new FinancialData(ticker, 'cash-flow')

    /**
     * Object with annual cash flow
     * @return {Promise<CashFlow>} Object
     */
    const annual = () => instance.annual()

    /**
     * Object with quarterly cash flow
     * @return {Promise<CashFlow>} Object
     */
    const quarterly = () => instance.quarterly()

    return {
        annual,
        quarterly
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

const balanceSheet = (ticker) => {
    const instance = new FinancialData(ticker, 'balance-sheet')

    /**
     * Object with annual Balance Sheet
     * @return {Promise<BalanceSheet>} Object
     */
    const annual = () => instance.annual()

    /**
     * Object with quarterly Balance Sheet
     * @return {Promise<BalanceSheet>} Object
     */
    const quarterly = () => instance.quarterly()

    return {
        annual,
        quarterly
    }
}

module.exports = {
    income,
    cashFlow,
    balanceSheet
}