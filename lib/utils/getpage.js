const got = require('got')

/**
 * Get html page for chosen quote
 * 
 * @param {String} ticker Stock ticker (exp: 'AAPL')
 * @param {String} page Page of the barchart.com stock (exp: 'overview')
 * @returns 
 */
const getPage = async (ticker = '', page = 'overview') => {
    try {
        if (ticker === '') {
            throw new Error('You must provide a ticker!')
        }

        const response = await got(`https://www.barchart.com/stocks/quotes/${ticker}/${page}`)
        return response.body
    } catch (error) {
        return {
            error: error.message
        }
    }
}

module.exports = getPage