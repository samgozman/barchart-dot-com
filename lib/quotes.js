const cheerio = require('cheerio')

const getpage = require('./utils/getpage')

const overview = async (ticker = '') => {
    try {
        const html = await getpage(ticker, 'overview')
        const $ = cheerio.load(html, {xmlMode: false} )
        const barchartInline = JSON.parse($('#barchart-www-inline-data').html())[ticker]
        const overview = JSON.parse($('.bc-quote-overview').attr('data-ng-init').valueOf().match(/\{(.*?)\}/gm)[2]+'}')
        const fundamentals = $('.symbol-data > div > ul').first().find('li')

        return {
            ticker: ticker.toLocaleUpperCase(),
            name: $('.symbol-name > h1 > .symbol').first().text(),
            exchange: barchartInline.instrument.exchange,
            overview,
            fundamentals

        }
    } catch (error) {
        return {
            error: error.message
        }
    }
}

const main = async () => {
    console.log(await overview('AAPL'))
}

main()