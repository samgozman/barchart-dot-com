const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')

const income = () => {
    try {
        this.annual = async (ticker = '') => {
            const html = await getpage(ticker, 'income-statement/annual')
            const $ = cheerio.load(html, {
                xmlMode: false
            })

            const table = $('tbody').find('tr')

            let annualObj = {}

            Array.prototype.map.call(table, (line) => {
                const elements = $(line).find('td')
                const $tr = $(line)

                if (!$tr.hasClass('bc-financial-report__row-dates')) {
                    // Set keys for annual object
                    const obj_key = elements.first().text()
                    annualObj[obj_key] = []

                    // Iterate table elements
                    elements.each((i, td) => {
                        // Skip labels
                        const value = $(td).text()
                        if (value !== obj_key) {
                            annualObj[obj_key].push(fixValues(value))
                        }
                    })
                }

            })

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj
        }

        this.quarterly = async (ticker = '') => {
            return ticker
        }

        return {
            annual: this.annual,
            quarterly: this.quarterly
        }

    } catch (error) {
        return {
            error: error.message
        }
    }

}

module.exports = {
    income
}