const quotes = require('./lib/quotes')
const financials = require('./lib/financials')

// const main = async () => {
//     console.log(await quotes.overview('AAPL'))
//     console.log(await financials.income().annual('AAPL'))
//     console.log(await financials.income().quarterly('AAPL'))
//     console.log(await financials.cashFlow().annual('AAPL'))
//     console.log(await financials.cashFlow().quarterly('AAPL'))
//     console.log(await financials.balanceSheet().annual('AAPL'))
//     console.log(await financials.balanceSheet().quarterly('AAPL'))
// }

// main()

module.exports = {
    quotes,
    financials
}