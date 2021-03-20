const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')

const income = () => {
    try {
        this.iterateTable = (table = [], $ = cheerio.load()) => {
            
            let obj = {}

            Array.prototype.map.call(table, (line) => {
                const elements = $(line).find('td')
                const $tr = $(line)

                if (!$tr.hasClass('bc-financial-report__row-dates')) {
                    // Set keys for object
                    const obj_key = elements.first().text()
                    obj[obj_key] = []

                    // Iterate table elements
                    elements.each((i, td) => {
                        // Skip labels
                        const value = $(td).text()
                        if (value !== obj_key) {
                            obj[obj_key].push(fixValues(value))
                        }
                    })
                } else {
                    // Set number of steps (periods)
                    obj.periods = (elements.length || 0) - 1
                    obj.startsWith = elements.first().next().text().trim()
                }
            })

            return obj
        }

        this.annual = async (ticker = '') => {
            const html = await getpage(ticker, 'income-statement/annual')
            const $ = cheerio.load(html, {
                xmlMode: false
            })

            const table = $('tbody').find('tr')

            let annualObj = this.iterateTable(table, $)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj
        }

        this.quarterly = async (ticker = '') => {
            const html = await getpage(ticker, 'income-statement/quarterly')
            const $ = cheerio.load(html, {
                xmlMode: false
            })

            const table = $('tbody').find('tr')

            let quarterlyObj = this.iterateTable(table, $)

            // Fix keys
            quarterlyObj = fixKeys(quarterlyObj)

            return quarterlyObj
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