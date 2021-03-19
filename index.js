const quotes = require('./lib/quotes')

const main = async () => {
    console.log(await quotes.overview('AAPL'))
}

main()