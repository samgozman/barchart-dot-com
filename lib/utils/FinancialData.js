
const cheerio = require('cheerio')
const getpage = require('./getpage'),
    {
        fixKeys,
        fixValues
    } = require('./objfix')

const _iterateTableWithGroups = ($ = cheerio.load(), table = []) => {
    table = $('tbody').find('tr')
    let obj = {},
        group = undefined,
        subgroup = undefined

    Array.prototype.map.call(table, (line) => {
        const elements = $(line).find('td'),
            $tr = $(line),
            label = elements.first().text()

        // Clear subgroup after separator
        subgroup = $tr.hasClass('bc-financial-report__row-separator') ? undefined : subgroup

        if (!$tr.hasClass('bc-financial-report__row-dates') && !$tr.hasClass('bc-financial-report__row-separator')) {
            // Set keys for object
            let key = !$tr.hasClass('bc-financial-report__row-group-label') && !$tr.hasClass('bc-financial-report__row-subgroup-label') ? label : undefined

            // Setup group name
            group = $tr.hasClass('bc-financial-report__row-group-label') ? $tr.find('td').first().text() : group
            subgroup = $tr.hasClass('bc-financial-report__row-subgroup-label') ? $tr.find('td').first().text() : subgroup

            // ! Fix 'Free Cash Flow' case (not unic key)
            key = key === ' Free Cash Flow ' ? 'Free Flow' : key

            // ! Fix 'Total Liabilities And Equity' key (no group)
            group = label === 'Total Liabilities And Equity' ? undefined : group

            key = $tr.hasClass('bc-financial-report__row-group-total') && group ? 'total' : fixKeys(key)

            // Define array
            if (subgroup && group && key) {
                group = fixKeys(group)
                subgroup = fixKeys(subgroup)

                const prevSub = obj[group] && obj[group][subgroup] ? {
                    ...obj[group][subgroup]
                } : {}

                obj[group] = {
                    ...obj[group],
                    ...{
                        [subgroup]: {
                            ...prevSub,
                            [key]: []
                        }
                    }
                }

            } else if (group && key && group !== key && !subgroup) {
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
                    if (group && subgroup) {
                        obj[group][subgroup][key].push(fixedValue)
                    } else if (group) {
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


class FinancialData {
    constructor(ticker, page) {
        this.ticker = ticker
        this.page = page
    }

    async annual() {
        try {
            // cash-flow
            const $ = await getpage(this.ticker, `${this.page}/annual`)
            let annualObj = _iterateTableWithGroups($)

            // Fix keys
            annualObj = fixKeys(annualObj)

            return annualObj

        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    async quarterly() {
        try {
            const $ = await getpage(this.ticker, `${this.page}/quarterly`)
            let quarterlyObj = _iterateTableWithGroups($)

            // Fix keys
            quarterlyObj = fixKeys(quarterlyObj)

            return quarterlyObj
        } catch (error) {
            return {
                error: error.message
            }
        }
    }
}

module.exports = FinancialData