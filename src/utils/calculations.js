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

  // Fisher equation: exact real return instead of nominal − inflation approximation
  const realCAGR = ((1 + portfolioCAGR / 100) / (1 + inflation / 100) - 1) * 100;
  const safetyRealCAGR = Math.max(1.0, realCAGR);

  const targetCorpus = annualExpense / (safetyRealCAGR / 100);
  const swrMultiplier = 100 / safetyRealCAGR;
  // Standard FIRE savings rate: % of income not spent on living expenses
  const savingsRate = salary > 0 ? ((salary - totalExpense) / salary) * 100 : 0;
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

  // Calculate final corpus (from projection) and ISR with inflation-adjusted expense
  const finalCorpus = projection[projection.length - 1]?.corpus || targetCorpus;
  const yearsAtFI = yearsToFI || 0;

  // Inflation-adjust the annual expense to the FI year
  const futureAnnualExpense = annualExpense * Math.pow(1 + inflation / 100, yearsAtFI);
  const isr = finalCorpus / futureAnnualExpense;

  // Categorize assets by explicit bucket assignment
  const bucket1Assets = portfolioAssets.filter(a => a.alloc > 0 && (a.bucket === 1 || a.bucket === undefined && a.ret <= 10));
  const bucket2Assets = portfolioAssets.filter(a => a.alloc > 0 && (a.bucket === 2 || (a.bucket === undefined && a.ret > 10 && a.ret <= 16)));
  const bucket3Assets = portfolioAssets.filter(a => a.alloc > 0 && (a.bucket === 3 || (a.bucket === undefined && a.ret > 16)));

  const bucket1Alloc = bucket1Assets.reduce((sum, a) => sum + a.alloc, 0);
  const bucket2Alloc = bucket2Assets.reduce((sum, a) => sum + a.alloc, 0);
  const bucket3Alloc = bucket3Assets.reduce((sum, a) => sum + a.alloc, 0);

  // Bucket 1: Assets assigned to bucket 1 to cover 3 years of future expenses
  const bucket1TargetValue = futureAnnualExpense * 3;
  let bucket1Value = (finalCorpus * bucket1Alloc) / 100;

  // If bucket 1 alone isn't enough, supplement from bucket 2
  if (bucket1Value < bucket1TargetValue && bucket2Alloc > 0) {
    const needed = bucket1TargetValue - bucket1Value;
    const maxFromBucket2 = (finalCorpus * bucket2Alloc) / 100;
    bucket1Value += Math.min(needed, maxFromBucket2);
  }

  // Bucket 2: Hybrid assets (+ remainder if bucket 1 needed supplement)
  let bucket2Value = 0;
  const remainingBucket2 = (finalCorpus * bucket2Alloc) / 100 - Math.max(0, bucket1TargetValue - (finalCorpus * bucket1Alloc) / 100);
  bucket2Value = Math.max(0, remainingBucket2);

  // If Bucket 1 is over target, recalculate to be exactly 3 years
  if (bucket1Value > bucket1TargetValue) {
    bucket1Value = bucket1TargetValue;
    // Return the excess to bucket 2
    bucket2Value += (finalCorpus * bucket1Alloc) / 100 - bucket1TargetValue;
  }

  // Bucket 3: Growth assets + remainder
  let bucket3Value = finalCorpus - bucket1Value - bucket2Value;

  // Ensure we don't have negative values
  bucket1Value = Math.max(0, Math.min(bucket1Value, finalCorpus));
  bucket2Value = Math.max(0, Math.min(bucket2Value, finalCorpus - bucket1Value));
  bucket3Value = Math.max(0, finalCorpus - bucket1Value - bucket2Value);

  const buckets = [
    {
      name: 'Bucket 1: Low Risk / Cash Flow',
      value: bucket1Value,
      alloc: (bucket1Value / finalCorpus) * 100,
      color: '#10B981',
      description: '3 years of expenses for withdrawal',
      assets: bucket1Assets.map(a => a.name),
    },
    {
      name: 'Bucket 2: Hybrid',
      value: bucket2Value,
      alloc: (bucket2Value / finalCorpus) * 100,
      color: '#F59E0B',
      description: 'Gains move to Bucket 1 in good years',
      assets: bucket2Assets.map(a => a.name),
    },
    {
      name: 'Bucket 3: Compounder',
      value: bucket3Value,
      alloc: (bucket3Value / finalCorpus) * 100,
      color: '#3B82F6',
      description: 'Gains move to Bucket 2 in good years',
      assets: bucket3Assets.map(a => a.name),
    },
  ];

  return {
    remainingCorpus,
    totalExpense,
    annualExpense,
    futureAnnualExpense,
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
    finalCorpus,
    isr,
    buckets,
  };
}
