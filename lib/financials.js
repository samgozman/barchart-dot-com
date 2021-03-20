const cheerio = require('cheerio')

const getpage = require('./utils/getpage'),
    {
        fixKeys,
        fixValues
    } = require('./utils/objfix')


const _iterateTableWithGroups = (table = [], $ = cheerio.load()) => {
    let obj = {},
        group = undefined

    Array.prototype.map.call(table, (line) => {
        const elements = $(line).find('td'),
            $tr = $(line),
            label = elements.first().text()

        if (!$tr.hasClass('bc-financial-report__row-dates') && !$tr.hasClass('bc-financial-report__row-separator')) {
            // Set keys for object
            let key = !$tr.hasClass('bc-financial-report__row-group-label') ? label : undefined

            // Setup group name
            group = $tr.hasClass('bc-financial-report__row-group-label') ? $tr.find('td').first().text() : group

            // ! Fix 'Free Cash Flow' case (not unic key)
            key = key === ' Free Cash Flow ' ? 'Free Flow' : key

            // camelCase for obj_key
            key = fixKeys(key)

            // Define array
            if (group && key && group !== key) {
                // camelCase for group
                group = fixKeys(group)

                obj[group] = {
                    ...obj[group],
                    ...{
                        [key]: []
                    }
                }
            } else if (key) {
                obj[key] = []
            } else {
                return
            }

            // Iterate table elements
            elements.each((i, td) => {
                // Skip labels
                const value = $(td).text()
                if (key && value && value !== label) {
                    let fixedValue = fixValues(value)

                    // If key is not starts with 'EPS' - multiply it by 1000
                    fixedValue = key.match(/^eps/g) ? fixedValue : fixedValue * 1000

                    if (group) {
                        obj[group][key].push(fixedValue)
                    } else {
                        obj[key].push(fixedValue)
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
        this.annual = async (ticker = '') => {
            const html = await getpage(ticker, 'income-statement/annual')
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
            const html = await getpage(ticker, 'income-statement/quarterly')
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