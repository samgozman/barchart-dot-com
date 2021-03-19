const _ = require('lodash')

// Fix keys names 
const fixKeys = (obj = {}) => {
    let resultObj = {}
    Object.keys(obj).forEach((key) => {
        let newKey = key

        //! INVIDUAL FIX
        newKey = newKey === '60-Month Beta' ? 'Beta 60 Month' : newKey
        newKey = newKey.replace(/ttm/gm, '')

        // 'Dividend %' => 'Dividend Percent'
        newKey = newKey.replace(/%/gi, 'Percent')

        // 'Shares Outstanding, $K' => 'Shares Outstanding, K'
        newKey = newKey.replace(/\$/g, '')

        if (typeof (obj[key]) !== 'object') {
            // Add multiplicator to the value: 'Shares Outstanding, K' = '10000' => 'Shares Outstanding, K' = '10000 K'
            const containsMult = newKey.match(/( M$)|( K$)|( B$)|( T$)/gm)
            obj[key] = containsMult ? obj[key] + containsMult.toString().trim() : obj[key]
        }

        // 'Shares Outstanding, K' => 'Shares Outstanding'
        newKey = newKey.replace(/,.*/gm, '')

        // '52W High' => ' High52W'
        const startsWithNumber = newKey.match(/^([0-9]{2}[A-Z]{1})/mg)
        if (startsWithNumber) {
            newKey = newKey.replace(/^([0-9]{2}[A-Z]{1})/mg, '')
            newKey += startsWithNumber[0]
        }
        // 'RSI (14)' => 'RSI 14'
        newKey = newKey.replace(/(\()|(\))/g, '')
        // 'P/C' => 'PC', 'P/FCF' => 'P/CF' || 'EPS Q/Q' => 'EPS QQ'
        if (newKey.match(/(^[A-z]{1}\/)|(\s[A-z]{1}\/)/g)) {
            newKey = newKey.replace(/\//g, '')
        }
        // 'Debt/Eq' => 'Debt Eq'
        newKey = newKey.replace(/\//g, ' ')

        // To camel case 'Rel Volume' => 'relVolume'
        newKey = _.camelCase(newKey)

        if (newKey !== '') {
            resultObj[newKey] = obj[key]
        }
    })

    return resultObj
}

// Fix values
const fixValues = (obj = {}) => {

    // Date keys that need to be processed separately
    // ex: '04/29/21'
    const dates = [
        'quarter',
        'nextEarningsDate'
    ]

    // ex: '1.68 on 01/27/21'
    const range_date = [
        'ivLow',
        'ivHigh',
        'mostRecentDividend',
        'mostRecentEarnings'
    ]

    const string_values = [
        'ticker',
        'opinion',
        'name',
        'exchange'
    ]

    Object.keys(obj).forEach((key) => {
        let newValue = obj[key]

        // Return if value is an object
        if (typeof (newValue) === 'object') {
            return
        }

        // Trim left/right
        newValue = String(newValue).trim()

        // Replace multiple spaces with single
        newValue = newValue.replace(/ {2,}/g, ' ')

        if (!dates.includes(key) && !range_date.includes(key) && !string_values.includes(key)) {
            // '+58%' => '58', '100,222,444' => '100222444', '54 (+3%)' => '54 '
            newValue = newValue.replace(/(%)|(,)|(\+)|\((.*?)\)/g, '')
            // '54 ' => '54'
            newValue = String(newValue).trimRight()


            // Find suffix
            const suffixArray = String(newValue).split(/\s+/g)
            const suffix = suffixArray[suffixArray.length - 1]

            // '100 K' => 100
            newValue = Number.parseFloat(newValue.replace(/( M$)|( K$)|( B$)|( T$)/gm, ''))

            // Fix value if it ends with K/M/B/T
            switch (suffix) {
                case 'K':
                    newValue *= 1.0e+3
                    break
                case 'M':
                    newValue *= 1.0e+6
                    break
                case 'B':
                    newValue *= 1.0e+9
                    break
                case 'T':
                    newValue *= 1.0e+12
                    break
            }
        }

        obj[key] = newValue || null
    })

    return obj
}

module.exports = {
    fixKeys,
    fixValues
}