const {
    quotes
} = require('..')

jest.setTimeout(15000)

test('Should get stock response from barchart/quotes/overview', async () => {
    const stock = await quotes.overview('AaPl')

    // Assert that response is not error
    expect(stock.error).toBeUndefined()

    // Check main features
    expect(stock.ticker).toBe('AAPL')
    expect(stock.exchange).toBe('NASDAQ')
    expect(stock.name).toBe('Apple Inc')
    expect(stock.overview).toBeDefined()
    expect(stock.fundamentals).toBeDefined()
    expect(stock.options).toBeDefined()
    expect(stock.technicals).toBeDefined()
    expect(stock.technicals.opinion).toBeDefined()
    expect(stock.technicals.power).toBeDefined()
    expect(stock.analytics).toBeDefined()
    expect(stock.estimates).toBeDefined()
    expect(stock.estimates.quarter).toBeDefined()
})

test('Should get error on empty request', async () => {
    const stock = await quotes.overview('')
    expect(stock.error).toBeDefined()
})

test('Should get error on wrong ticker', async () => {
    const stock = await quotes.overview('KEK')
    expect(stock.error).toBeDefined()
})