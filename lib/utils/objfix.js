const _ = require('lodash')

// Fix keys names 
const fixKeys = (data) => {

    this.fix = (key = '') => {
        let newKey = key

        //! INVIDUAL FIX
        newKey = newKey === '60-Month Beta' ? 'Beta 60 Month' : newKey
        newKey = newKey.replace(/ttm/gm, '')

        // 'Dividend %' => 'Dividend Percent'
        newKey = newKey.replace(/%/gi, 'Percent')

        // 'Shares Outstanding, $K' => 'Shares Outstanding, K'
        newKey = newKey.replace(/\$/g, '')

        if (typeof (data[key]) !== 'object') {
            // Add multiplicator to the value: 'Shares Outstanding, K' = '10000' => 'Shares Outstanding, K' = '10000 K'
            const containsMult = newKey.match(/( M$)|( K$)|( B$)|( T$)/gm)
            data[key] = containsMult ? data[key] + containsMult.toString().trim() : data[key]
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

        return newKey
    }

    if (typeof (data) === 'object') {
        Object.keys(data).forEach((key) => {
            let newKey = this.fix(key)
            if (newKey !== '') {
                data[newKey] = data[key]
                if (newKey !== key) {
                    delete data[key]
                }
            }
        })
    }

    if (typeof (data) === 'string') {
        data = this.fix(data)
    }
    
    return data
}

// Fix values
const fixValues = (data) => {

    // Date keys that need to be processed separately
    // Example: '04/29/21'
    const dates = [
        'quarter',
        'nextEarningsDate'
    ]

    // Example: '1.68 on 01/27/21'
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

    this.fix = (value = '', key = '') => {
        // Trim left/right
        value = String(value).trim()

        // Replace multiple spaces with single
        value = value.replace(/ {2,}/g, ' ')

        // '$24242442' => '24242442'
        value = value.replace(/\$/g, '')

        if (!dates.includes(key) && !range_date.includes(key) && !string_values.includes(key)) {
            // '+58%' => '58', '100,222,444' => '100222444', '54 (+3%)' => '54 '
            value = value.replace(/(%)|(,)|(\+)|\((.*?)\)/g, '')
            // '54 ' => '54'
            value = String(value).trimRight()

            // Find suffix
            const suffixArray = String(value).split(/\s+/g)
            const suffix = suffixArray[suffixArray.length - 1]

            // '100 K' => 100
            value = Number.parseFloat(value.replace(/( M$)|( K$)|( B$)|( T$)/gm, ''))

            // Fix value if it ends with K/M/B/T
            switch (suffix) {
                case 'K':
                    value *= 1.0e+3
                    break
                case 'M':
                    value *= 1.0e+6
                    break
                case 'B':
                    value *= 1.0e+9
                    break
                case 'T':
                    value *= 1.0e+12
                    break
            }
        }

        return value
    }

    // If given data is an object - iterate
    if (typeof (data) === 'object') {
        Object.keys(data).forEach((key) => {
            let newValue = data[key]

            // Return if value is an object
            if (typeof (newValue) === 'object') {
                return
            }

            newValue = this.fix(newValue, key)

            data[key] = newValue || null
        })
    }

    // If given data is a string
    if (typeof (data) === 'string') {
        data = this.fix(data)
    }
    return data
}

module.exports = {
    fixKeys,
    fixValues
}