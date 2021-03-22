const {
    quotes
} = require('..')

test('Should get stock response from barchart/quotes/overview', async () => {
    let stock = await quotes.overview('AaPl')

    // Assert that response is not error
    expect(stock.error).toBeUndefined()

    // Check main features
    expect(stock.ticker).toBe('AAPL')
    expect(stock.exchange).toBe('NASDAQ')
    expect(stock.name).toBe('Apple Inc')
})

test('Should get error on empty request', async () => {
    let stock = await quotes.overview('')
    expect(stock.error).toBeDefined()
})

test('Should get error on wrong ticker', async () => {
    let stock = await quotes.overview('KEK')
    expect(stock.error).toBeDefined()
})