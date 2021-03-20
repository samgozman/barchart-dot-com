const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')


const _iterateTableWithGroups = (table = [], $ = cheerio.load()) => {

    let obj = {}
    let group = undefined

    Array.prototype.map.call(table, (line) => {
        const elements = $(line).find('td')
        const $tr = $(line)

        if (!$tr.hasClass('bc-financial-report__row-dates') && !$tr.hasClass('bc-financial-report__row-separator')) {
            // Set keys for object
            let obj_key = !$tr.hasClass('bc-financial-report__row-group-label') ? elements.first().text() : undefined

            // Setup group name
            group = $tr.hasClass('bc-financial-report__row-group-label') ? $tr.find('td').first().text() : group

            // ! Fix 'Free Cash Flow' case (not unic key)
            obj_key = obj_key === ' Free Cash Flow ' ? 'Free Flow' : obj_key

            // camelCase for obj_key
            obj_key = fixKeys(obj_key)

            // Define array
            if (group && obj_key && group !== obj_key) {
                // camelCase for group
                group = fixKeys(group)

                obj[group] = {
                    ...obj[group],
                    ...{
                        [obj_key]: []
                    }
                }
            } else if (obj_key) {
                obj[obj_key] = []
            } else {
                return
            }

            // Iterate table elements
            elements.each((i, td) => {
                // Skip labels
                const value = $(td).text()
                if (obj_key && value && value !== obj_key) {
                    let fixedValue = fixValues(value)

                    // If key is not starts with 'EPS' - multiply it by 1000
                    fixedValue = obj_key.match(/EPS/g) ? fixedValue : fixedValue * 1000

                    if (group) {
                        obj[group][obj_key].push(fixedValue)
                    } else {
                        obj[obj_key].push(fixedValue)
                    }

                }
            })
        } else if ($tr.hasClass('bc-financial-report__row-dates')) {
            // Set number of steps (periods)
            obj.periods = (elements.length || 0) - 1
            obj.startsWith = elements.first().next().text().trim()
        }

    })

    return obj
}

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
                            const fixedValue = fixValues(value)
                            // If key is not starts with 'EPS' - multiply it by 1000
                            obj[obj_key].push(obj_key.match(/EPS/g) ? fixedValue : fixedValue * 1000)
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

const cashFlow = () => {
    try {

        this.annual = async (ticker = '') => {
            const html = await getpage(ticker, 'cash-flow/annual')
            const $ = cheerio.load(html, {
                xmlMode: false
            })

            const table = $('tbody').find('tr')

            let annualObj = _iterateTableWithGroups(table, $)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj

        }

        this.quarterly = async (ticker = '') => {
            const html = await getpage(ticker, 'cash-flow/quarterly')
            const $ = cheerio.load(html, {
                xmlMode: false
            })

            const table = $('tbody').find('tr')

            let quarterlyObj = _iterateTableWithGroups(table, $)

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
    income,
    cashFlow
}