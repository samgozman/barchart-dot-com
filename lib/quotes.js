const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')

const overview = async (ticker = '') => {
    try {
        ticker = ticker.trim().toUpperCase()

        const html = await getpage(ticker, 'overview')
        const $ = cheerio.load(html, {
            xmlMode: false
        })

        const barchartInline = JSON.parse($('#barchart-www-inline-data').html())[ticker]
        const overview = JSON.parse($('.bc-quote-overview').attr('data-ng-init').valueOf().match(/\{(.*?)\}/gm)[2] + '}')

        let overviewObj = {
            ticker: ticker.toLocaleUpperCase(),
            name: $('.symbol-name > h1 > .symbol').first().text(),
            exchange: barchartInline.instrument.exchange,
            overview,
            fundamentals: {},
            options: {},
            technicals: {
                opinion: $('.technical-opinion-description > p > b').first().text().split(' ')[1],
                power: $('.technical-opinion-description > p > b').first().text().split(' ')[0]
            },
            analytics: {},
            estimates: {
                quarter: $('.bc-rating-and-estimates__header.second > h5').text().split(' ')[5]
            }
        }

        // Set fundamentals data from stock overview page
        $('.symbol-data').first().find('div > ul').find('li').toArray().forEach(element => {
            overviewObj.fundamentals[$(element).find('.left').first().text()] = $(element).find('.right').first().text()
        })

        // Set options data from stock overview page
        $('.symbol-data').last().find('div > ul').find('li').toArray().forEach(element => {
            overviewObj.options[$(element).find('.left').first().text()] = $(element).find('.right').first().text()
        })

        // Set analytics data from stock overview page
        const analytics = JSON.parse($('analyst-rating-pie').attr('data-content').valueOf())
        for (const [key, value] of Object.entries(analytics)) {
            overviewObj.analytics[key] = value.value
        }
        // Set earnings estimates data from stock overview page
        $('.bc-rating-and-estimates__content').last().find('ul > li').toArray().forEach(element => {
            overviewObj.estimates[$(element).find('.left').first().text()] = $(element).find('.right').first().text()
        })

        // Fix object keys
        overviewObj.overview = fixValues(fixKeys(overviewObj.overview))
        overviewObj.fundamentals = fixValues(fixKeys(overviewObj.fundamentals))
        overviewObj.options = fixValues(fixKeys(overviewObj.options))
        overviewObj.analytics = fixValues(fixKeys(overviewObj.analytics))
        overviewObj.estimates = fixValues(fixKeys(overviewObj.estimates))
        overviewObj.technicals = fixValues(fixKeys(overviewObj.technicals))
        overviewObj = fixValues(overviewObj)


        return overviewObj

    } catch (error) {
        return {
            error: error.message
        }
    }
}

module.exports = {
    overview
}