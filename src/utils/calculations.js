export function runCalculations(inputs, portfolioAssets, compoundingMode) {
  const { age, salary, sip, inflation, totalCorpus, expenses } = inputs;

  const totalExpense = Object.values(expenses).reduce((sum, v) => sum + v, 0);
  const annualExpense = totalExpense * 12;
  const remainingCorpus = totalCorpus;

  let totalAlloc = 0;
  let totalWeightedReturn = 0;
  portfolioAssets.forEach(asset => {
    totalAlloc += asset.alloc;
    totalWeightedReturn += (asset.alloc / 100) * asset.ret;
  });
  const portfolioCAGR = totalWeightedReturn;

  const realCAGR = portfolioCAGR - inflation;
  const safetyRealCAGR = Math.max(1.0, realCAGR);

  const targetCorpus = annualExpense / (safetyRealCAGR / 100);
  const swrMultiplier = 100 / safetyRealCAGR;
  const savingsRate = salary > 0 ? (sip / salary) * 100 : 0;
  const progressPct = targetCorpus > 0 ? (totalCorpus / targetCorpus) * 100 : 0;

  const activeCompoundingCAGR = compoundingMode === 'real' ? realCAGR : portfolioCAGR;
  const safetyCompoundingCAGR = Math.max(0.5, activeCompoundingCAGR);
  const monthlyRate = Math.pow(1 + safetyCompoundingCAGR / 100, 1 / 12) - 1;

  let investedPortion = remainingCorpus;
  let timelineCorpus = totalCorpus;
  let years = 0;
  let cumulativeInvested = totalCorpus;

  const projection = [{
    year: 0,
    age,
    contribution: 0,
    returnEarned: 0,
    corpus: totalCorpus,
    invested: totalCorpus,
  }];

  while (years < 40) {
    if (timelineCorpus >= targetCorpus && years >= 10) break;

    let yearlySipInput = 0;
    let returnsForYear = 0;

    for (let m = 0; m < 12; m++) {
      const startOfMonth = investedPortion;
      const endOfMonth = startOfMonth * (1 + monthlyRate);
      returnsForYear += endOfMonth - startOfMonth;
      investedPortion = endOfMonth + sip;
      yearlySipInput += sip;
    }

    timelineCorpus = investedPortion;
    cumulativeInvested += yearlySipInput;
    years++;

    projection.push({
      year: years,
      age: age + years,
      contribution: yearlySipInput,
      returnEarned: returnsForYear,
      corpus: timelineCorpus,
      invested: cumulativeInvested,
    });
  }

  let yearsToFI = null;
  let metTarget = false;

  if (totalCorpus >= targetCorpus) {
    yearsToFI = 0;
    metTarget = true;
  } else {
    for (let i = 0; i < projection.length; i++) {
      if (projection[i].corpus >= targetCorpus) {
        yearsToFI = projection[i].year;
        metTarget = true;
        break;
      }
    }
  }

  return {
    remainingCorpus,
    totalExpense,
    annualExpense,
    portfolioCAGR,
    realCAGR,
    safetyRealCAGR,
    targetCorpus,
    swrMultiplier,
    savingsRate,
    progressPct,
    projection,
    yearsToFI,
    metTarget,
    totalAlloc,
  };
}
