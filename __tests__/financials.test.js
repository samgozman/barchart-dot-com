const {
    financials
} = require('..')

test('Should get stock response from barchart income-statement/annual', async () => {
    let stock = await financials.income().annual('aapl')

    // Assert that response is not error
    expect(stock.error).toBeUndefined()

    // Check main features

    expect(stock.periods).toBe(5)

    // Assert that netIncome and ebitda is an array of numbers
    expect(stock.netIncome).toEqual(expect.any(Array))
    expect(stock.netIncome).toContainEqual(expect.any(Number))
    expect(stock.ebitda).toEqual(expect.any(Array))
    expect(stock.ebitda).toContainEqual(expect.any(Number))
})

test('Should get error on empty request', async () => {
    const finia = await financials.income().annual(''),
        finiq = await financials.income().quarterly(''),
        finca = await financials.cashFlow().annual(''),
        fincq = await financials.cashFlow().quarterly(''),
        finba = await financials.cashFlow().annual(''),
        finbq = await financials.cashFlow().quarterly('')

    expect(finia.error).toBeDefined()
    expect(finiq.error).toBeDefined()
    expect(finca.error).toBeDefined()
    expect(fincq.error).toBeDefined()
    expect(finba.error).toBeDefined()
    expect(finbq.error).toBeDefined()
})