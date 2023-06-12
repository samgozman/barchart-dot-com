const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')

/**
 * Template for technicals object
 *
 * @typedef {Object} Technicals
 * @property {String} opinion Buy, Sell or Hold 
 * @property {Number} power Confidence in this judgment in terms of technical analysis (0 to 100%)
 */

/**
 * Template for Overview.overview
 *
 * @typedef {Object} Overview.overview
 * @property {Number} previousPrice
 * @property {Number} volume
 * @property {Number} averageVolume
 * @property {Number} weightedAlpha
 * @property {Object} raw - object of daily high/low price, volume etc.
 * @property {Number} stochasticK14D
 * @property {Number} priceChange5D
 * @property {Number} lowPrice1Y
 * @property {Number} highPrice1Y
 */

/**
 * Financial data for overview page. The number and set of optional properties differ between stocks
 *
 * @typedef {Object} Overview
 * @property {Number} periods Number of periods (years / quarters) in the array
 * @property {Number} startsWith The closest start date. Annual step is 1 year, quarterly - 3 months
 * @property {String} ticker 
 * @property {String} name 
 * @property {String} exchange 
 * @property {Overview.overview} overview 
 * @property {Object} fundamentals 
 * @property {Object} options 
 * @property {Technicals} technicals 
 * @property {Object} analytics 
 * @property {Object} estimates 
 */

const findOverviewValues = (ticker = '', $ = cheerio.load()) => {
    const barchartInline = JSON.parse($('#barchart-www-inline-data').html())[ticker]
    const overview = JSON.parse($('.bc-quote-overview').attr('data-ng-init').valueOf().match(/\{(.*?)\}/gm)[2] + '}')

    let overviewObj = {
        ticker: ticker.toLocaleUpperCase(),
        name: $('.symbol-name .symbol').first().text(),
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
}

/**
 * Returns data from quotes overview page
 *
 * @param {String} ticker Stock quote
 * @return {Promise<Overview>} Object of parsed data
 */
const overview = async (ticker = '') => {
    try {
        ticker = ticker.trim().toUpperCase()
        const $ = await getpage(ticker, 'overview')

        return findOverviewValues(ticker, $)

    } catch (error) {
        return {
            error: error.message
        }
    }
}

module.exports = {
    overview
}