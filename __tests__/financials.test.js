const {
    financials
} = require('..')

test('Should get stock response from barchart income-statement/annual', async () => {
    let stock = await financials.income('aapl').annual()

    // Assert that response is not error
    expect(stock.error).toBeUndefined()

    expect(stock.periods).toBe(5)

    // Assert that netIncome and ebitda is an array of numbers
    expect(stock.netIncome).toEqual(expect.any(Array))
    expect(stock.netIncome).toContainEqual(expect.any(Number))
    expect(stock.ebitda).toEqual(expect.any(Array))
    expect(stock.ebitda).toContainEqual(expect.any(Number))
})

test('Should get stock response from barchart cash-flow/annual', async () => {
    let stock = await financials.cashFlow('aapl').annual()

    expect(stock.periods).toBe(5)

    // Assert that basic properties are an arrays of numbers
    expect(stock.cashFlowsFromOperatingActivities.total).toEqual(expect.any(Array))
    expect(stock.cashFlowsFromOperatingActivities.total).toContainEqual(expect.any(Number))

    expect(stock.cashFlowsFromInvestingActivities.total).toEqual(expect.any(Array))
    expect(stock.cashFlowsFromInvestingActivities.total).toContainEqual(expect.any(Number))

    expect(stock.cashFlowsFromFinancingActivities.total).toEqual(expect.any(Array))
    expect(stock.cashFlowsFromFinancingActivities.total).toContainEqual(expect.any(Number))

    expect(stock.freeCashFlow.freeFlow).toEqual(expect.any(Array))
    expect(stock.freeCashFlow.freeFlow).toContainEqual(expect.any(Number))
})

test('Should get stock response from barchart balance-sheet/annual', async () => {
    let stock = await financials.balanceSheet('aapl').annual()

    expect(stock.periods).toBe(5)

    // Assert that basic properties are an arrays of numbers
    expect(stock.assets.total).toEqual(expect.any(Array))
    expect(stock.assets.total).toContainEqual(expect.any(Number))

    expect(stock.liabilities.total).toEqual(expect.any(Array))
    expect(stock.liabilities.total).toContainEqual(expect.any(Number))

    expect(stock.shareholdersEquity.total).toEqual(expect.any(Array))
    expect(stock.shareholdersEquity.total).toContainEqual(expect.any(Number))

    expect(stock.totalLiabilitiesAndEquity).toEqual(expect.any(Array))
    expect(stock.totalLiabilitiesAndEquity).toContainEqual(expect.any(Number))
})


test('Should get error on empty request', async () => {
    const finia = await financials.income('').annual(),
        finiq = await financials.income('').quarterly(),
        finca = await financials.cashFlow('').annual(),
        fincq = await financials.cashFlow('').quarterly(),
        finbsa = await financials.balanceSheet('').annual(),
        finbsq = await financials.balanceSheet('').quarterly()

    expect(finia.error).toBeDefined()
    expect(finiq.error).toBeDefined()
    expect(finca.error).toBeDefined()
    expect(fincq.error).toBeDefined()
    expect(finbsa.error).toBeDefined()
    expect(finbsq.error).toBeDefined()
})