# barchart-dot-com

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C1DI4VL)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/samgozman/barchart-dot-com/barchart-dot-com%20Node.js)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fb9a28f06d204b008206eab9ff169c3b)](https://www.codacy.com/gh/samgozman/barchart-dot-com/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=samgozman/barchart-dot-com&amp;utm_campaign=Badge_Grade)
[![npm](https://img.shields.io/npm/v/barchart-dot-com)](https://www.npmjs.com/package/barchart-dot-com)
![npm bundle size](https://img.shields.io/bundlephobia/min/barchart-dot-com)
![NPM](https://img.shields.io/npm/l/barchart-dot-com)

Fetching data from the barchart.com

## Installation

Install package from NPM

```bash
npm install barchart-dot-com
```

## Features

Fetch stock data from barchart-dot-com.com such as:

* Financial income
* Financial Cash Flow
* Financial Balance Sheet
* Overview: last price, options, analytics etc.

## Usage

Use **barchart-dot-com** in async functionsю

Most of the financial data is available in annual and quarterly formats. In total, each data format contains 5 periods (years / months).
Results sorted from closest date

### Financials: income

Annual or Quarterly Income Statements.

```javascript
const { financials } = require('barchart-dot-com')

const main = async () => {
  const stock = await financials.income('aapl').annual()
  console.log(stock.netIncome)
  console.log(stock.ebitda)
}

main()
```

*Returns:*

* [ 57411000000, 55256000000, 59531000000, 48351000000, 45687000000 ]
* [ 77344000000, 76477000000, 81801000000, 71501000000, 70529000000 ]

### Financials: Cash Flow

The Cash Flow report is used to assess the quality of a company's income.

```javascript
const { financials } = require('barchart-dot-com')

const main = async () => {
  const stock = await financials.cashFlow('aapl').quarterly()
  console.log(stock.freeCashFlow.freeFlow)
}

main()
```

*Returns:*

* [ 35263000000, 73365000000, 54573000000, 39867000000, 28409000000 ]

### Financials: Balance Sheet

A Balance Sheet is a financial statement that summarizes a company's assets, liabilities and shareholders' equity.

```javascript
const { financials } = require('barchart-dot-com')

const main = async () => {
  const stock = await financials.balanceSheet('aapl').annual()
  console.log(stock.assets.total)
  console.log(stock.liabilities.total)
  console.log(stock.totalLiabilitiesAndEquity)
}

main()
```

*Returns:*

* [ 323888000000, 338516000000, 365725000000, 375319000000, 321686000000 ]
* [ 258549000000, 248028000000, 258578000000, 241272000000, 193437000000 ]
* [ 323888000000, 338516000000, 365725000000, 375319000000, 321686000000 ]

### Quotes: overview

The Quote Overview gives you a snapshot view for a specific symbol.

```javascript
const { quotes } = require('barchart-dot-com')

const main = async () => {
  const stock = await quotes.overview('aapl')
  console.log(stock.exchange)
  console.log(stock.overview.previousPrice)
  console.log(stock.fundamentals.beta60Month)
  console.log(stock.technicals)
}

main()
```

*Returns:*

* 'NASDAQ'
* 120.09
* 1.25
* { opinion: 'Sell', power: 8 }

## Disclaimer

This is not an official NPM package. Always check the received data from the corresponding page on the barchart.com.
