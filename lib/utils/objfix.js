const _ = require('lodash')

// Fix keys names 
const fixKeys = (obj = {}) => {
    let resultObj = {}
    Object.keys(obj).forEach((key) => {
        let newKey = key

        //! INVIDUAL FIX
        newKey = newKey === '60-Month Beta' ? 'Beta 60 Month' : newKey

        // 'Dividend %' => 'Dividend Percent'
        newKey = newKey.replace(/%/gi, 'Percent')

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
        resultObj[newKey] = obj[key]
    })

    return resultObj
}

module.exports = {
    fixKeys
}