const quotes = require('./lib/quotes')
const financials = require('./lib/financials')

const main = async () => {
    console.log(await quotes.overview('AAPL'))
    console.log(await financials.income().annual('AAPL'))
    console.log(await financials.income().quarterly('AAPL'))
}

main()