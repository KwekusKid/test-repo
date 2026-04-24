const simulations = {
  wealthGrowth: [
    {
      id: "rent-vs-buy",
      title: "Buying Property vs Renting + REITs",
      description: "Compare the financial outcomes of property ownership versus renting and investing in REITs",
      type: "comparison",
      priorities: ["wealthGrowth", "financialFreedom"],
      concepts: ["Property Ownership", "REIT Investing"],
      miniSimulation: {
        inputs: [
          { name: "propertyPrice", label: "Property Price (ZAR)", type: "number", placeholder: "e.g. 1500000" },
          { name: "monthlyRent", label: "Monthly Rent (ZAR)", type: "number", placeholder: "e.g. 12000" },
          { name: "years", label: "Years to Compare", type: "number", placeholder: "e.g. 10" }
        ],
        outputs: [
          { key: "buyingEquity", label: "Estimated Equity Built (Buying)", format: "currency" },
          { key: "rentingWealth", label: "Estimated Wealth (Renting + REITs)", format: "currency" },
          { key: "winner", label: "Better Path After X Years", format: "text" }
        ],
        assumptions: "Assumes 7% property appreciation, 10% REIT annual return, 10% deposit, and prime+2% bond rate.",
        calculate: ({ propertyPrice, monthlyRent, years }) => {
          const deposit = propertyPrice * 0.1;
          const bondAmount = propertyPrice - deposit;
          const monthlyRate = 0.1175 / 12;
          const months = years * 12;
          const bondRepayment = bondAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
          const propertyValue = propertyPrice * Math.pow(1.07, years);
          const totalBondPaid = bondRepayment * months;
          const buyingEquity = propertyValue - (bondAmount - (totalBondPaid - bondAmount * (Math.pow(1 + monthlyRate, months) - 1)));

          const reitMonthlyContribution = bondRepayment - monthlyRent;
          const reitRate = 0.10 / 12;
          const rentingWealth = reitMonthlyContribution > 0
            ? reitMonthlyContribution * ((Math.pow(1 + reitRate, months) - 1) / reitRate)
            : 0;

          return {
            buyingEquity: Math.max(0, propertyValue - bondAmount * 0.6),
            rentingWealth: Math.round(rentingWealth),
            winner: buyingEquity > rentingWealth ? "Buying Property" : "Renting + REITs"
          };
        }
      },
      prosCons: {
        left: {
          title: "Buying Property",
          pros: [
            {
              id: 1,
              title: "Builds equity through 'forced saving'",
              description: "Monthly bond payments gradually increase your ownership in a tangible asset instead of paying rent."
            },
            {
              id: 2,
              title: "Protection against inflation",
              description: "Property values tend to rise over time, helping preserve your purchasing power."
            },
            {
              id: 3,
              title: "Stability and control",
              description: "Owning a home gives you long-term security and the freedom to modify your living space."
            },
            {
              id: 4,
              title: "Long-term asset value",
              description: "Over time, property can contribute significantly to your overall wealth if held for the long term."
            },
            {
              id: 5,
              title: "Practical lifestyle value",
              description: "A home provides essential day-to-day utility (shelter), not just financial returns."
            }
          ],
          cons: []
        },
        right: {
          title: "Renting + Investing in REITs",
          pros: [],
          cons: [
            {
              id: 1,
              title: "Sensitive to interest rates",
              description: "REIT performance can drop when interest rates rise, as borrowing becomes more expensive and profits shrink."
            },
            {
              id: 2,
              title: "Exposed to economic and political conditions",
              description: "South Africa's economic shifts and political stability directly impact property demand and, in turn, REIT returns."
            },
            {
              id: 3,
              title: "Higher tax on earnings",
              description: "REIT distributions are taxed at your marginal income rate, which can reduce overall returns compared to other investments."
            },
            {
              id: 4,
              title: "Regulatory uncertainty",
              description: "Changes in tax laws or REIT regulations can affect dividends and long-term investment value."
            },
            {
              id: 5,
              title: "Increased market competition",
              description: "As the REIT market grows, competition for quality properties can reduce rental yields and investment returns."
            },
            {
              id: 6,
              title: "No access to leverage",
              description: "Unlike buying property, you typically cannot use borrowed money (like a bond) to amplify your investment in REITs."
            }
          ]
        }
      },
      inputs: [
        { name: "monthlyRent", label: "Monthly Rent", type: "number" },
        { name: "propertyPrice", label: "Property Price", type: "number" }
      ]
    },

    {
      id: "ra-vs-tfsa",
      title: "Retirement Annuity vs Tax-Free Savings Account",
      description: "Compare tax savings, flexibility, and long-term growth between an RA and TFSA",
      type: "comparison",
      priorities: ["wealthGrowth", "financialFreedom"],
      concepts: ["Retirement Annuity", "Tax-Free Savings Account"],
      miniSimulation: {
        inputs: [
          { name: "monthlyContribution", label: "Monthly Contribution (ZAR)", type: "number", placeholder: "e.g. 3000" },
          { name: "monthlyIncome", label: "Monthly Income (ZAR)", type: "number", placeholder: "e.g. 30000" },
          { name: "years", label: "Years to Grow", type: "number", placeholder: "e.g. 20" }
        ],
        outputs: [
          { key: "raBalance", label: "Projected RA Balance (after tax at withdrawal)", format: "currency" },
          { key: "tfsaBalance", label: "Projected TFSA Balance (tax-free)", format: "currency" },
          { key: "winner", label: "Better Option", format: "text" }
        ],
        assumptions: "Assumes 10% annual return, 27.5% RA tax deduction, and 18% tax on RA withdrawals. Based on average assumptions.",
        calculate: ({ monthlyContribution, monthlyIncome, years }) => {
          const annualIncome = monthlyIncome * 12;
          const marginalRate = annualIncome > 782200 ? 0.45 : annualIncome > 512800 ? 0.41 : annualIncome > 370500 ? 0.39 : annualIncome > 237100 ? 0.36 : annualIncome > 132000 ? 0.31 : annualIncome > 95750 ? 0.26 : 0.18;

          const monthlyRate = 0.10 / 12;
          const months = years * 12;
          const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

          const taxRefundPerMonth = monthlyContribution * marginalRate;
          const raEffectiveCost = monthlyContribution - taxRefundPerMonth;
          const raGross = raEffectiveCost * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
          const raBalance = raGross * (1 - 0.18);

          const tfsaBalance = futureValue;

          return {
            raBalance: Math.round(raBalance),
            tfsaBalance: Math.round(tfsaBalance),
            winner: raBalance > tfsaBalance ? "Retirement Annuity" : "TFSA"
          };
        }
      },
      prosCons: {
        left: {
          title: "Retirement Annuity (RA)",
          pros: [
            {
              id: 1,
              title: "Immediate tax refund",
              description: "Reduce taxable income by up to 27.5%, generating a refund you can reinvest."
            },
            {
              id: 2,
              title: "Forces long-term discipline",
              description: "Funds are locked until age 55, preventing unnecessary withdrawals."
            },
            {
              id: 3,
              title: "Emergency access (limited)",
              description: "Two-pot system allows partial yearly withdrawals for emergencies."
            },
            {
              id: 4,
              title: "Built-in diversification",
              description: "Regulation 28 ensures a balanced and risk-managed portfolio."
            }
          ],
          cons: [
            {
              id: 5,
              title: "Restricted access",
              description: "Most funds cannot be accessed until retirement age."
            },
            {
              id: 6,
              title: "Limited investment freedom",
              description: "Cannot fully invest in offshore or high-growth assets."
            },
            {
              id: 7,
              title: "Tax on withdrawal",
              description: "Retirement income is taxed when withdrawn."
            }
          ]
        },
        right: {
          title: "Tax-Free Savings Account (TFSA)",
          pros: [
            {
              id: 1,
              title: "Completely tax-free growth",
              description: "No tax on capital gains, dividends, or interest."
            },
            {
              id: 2,
              title: "Full flexibility",
              description: "Withdraw funds anytime for any purpose."
            },
            {
              id: 3,
              title: "No investment restrictions",
              description: "You can invest fully in offshore or high-growth assets."
            },
            {
              id: 4,
              title: "Low barrier to entry",
              description: "Start investing with small amounts early in your career."
            }
          ],
          cons: [
            {
              id: 5,
              title: "No upfront tax benefit",
              description: "You invest with after-tax income."
            },
            {
              id: 6,
              title: "Contribution limits",
              description: "Capped at R36,000 annually and R500,000 lifetime."
            },
            {
              id: 7,
              title: "Irreversible withdrawals",
              description: "Withdrawals permanently reduce your contribution allowance."
            },
            {
              id: 8,
              title: "Penalty risk",
              description: "Exceeding limits results in a 40% tax penalty."
            }
          ]
        }
      },
      inputs: [
        { name: "monthlyContribution", label: "Monthly Contribution", type: "number" },
        { name: "income", label: "Monthly Income", type: "number" }
      ]
    }
  ],

  financialFreedom: [
    {
      id: "local-vs-remote",
      title: "Local Corporate Ladder vs Remote International Employment",
      description: "Compare building your career within South Africa versus earning globally while living locally",
      type: "comparison",
      priorities: ["financialFreedom", "wealthGrowth"],
      concepts: ["Local Corporate Career", "Remote International Work"],
      miniSimulation: {
        inputs: [
          { name: "localIncome", label: "Local Monthly Income (ZAR)", type: "number", placeholder: "e.g. 45000" },
          { name: "remoteIncome", label: "Remote Monthly Income (USD)", type: "number", placeholder: "e.g. 4000" },
          { name: "exchangeRate", label: "Exchange Rate (ZAR per USD)", type: "number", placeholder: "e.g. 18.5" }
        ],
        outputs: [
          { key: "localTakeHome", label: "Local Net Monthly Take-Home (ZAR)", format: "currency" },
          { key: "remoteTakeHome", label: "Remote Net Monthly Take-Home (ZAR)", format: "currency" },
          { key: "annualGap", label: "Annual Wealth Gap", format: "currency" }
        ],
        assumptions: "Assumes 25% effective tax rate on local income and 30% on remote income (foreign income + compliance costs). Based on average assumptions.",
        calculate: ({ localIncome, remoteIncome, exchangeRate }) => {
          const localTakeHome = Math.round(localIncome * 0.75);
          const remoteInZAR = remoteIncome * exchangeRate;
          const remoteTakeHome = Math.round(remoteInZAR * 0.70);
          const annualGap = Math.abs((remoteTakeHome - localTakeHome) * 12);

          return {
            localTakeHome,
            remoteTakeHome,
            annualGap
          };
        }
      },
      prosCons: {
        left: {
          title: "Local Corporate Ladder",
          pros: [
            {
              id: 1,
              title: "Strong local earning potential",
              description: "High starting salaries in industries like law, finance, and accounting provide a solid income base early in your career."
            },
            {
              id: 2,
              title: "Shared-value benefits",
              description: "Programs like Vitality can significantly reduce healthcare and insurance costs through rewards and cash-backs."
            },
            {
              id: 3,
              title: "Structured career growth",
              description: "Clear promotion pathways and defined progression systems in large organisations."
            },
            {
              id: 4,
              title: "Corporate lifestyle perks",
              description: "Access to benefits such as healthcare, subsidised meals, and wellness programs."
            },
            {
              id: 5,
              title: "Mentorship and networking",
              description: "Opportunities to connect with senior professionals and participate in leadership development programs."
            }
          ],
          cons: [
            {
              id: 6,
              title: "Exposure to local economic risk",
              description: "Income and opportunities are tied to South Africa's economic and political conditions."
            },
            {
              id: 7,
              title: "Lower global buying power",
              description: "Earning in ZAR limits your ability to spend, travel, or invest internationally."
            },
            {
              id: 8,
              title: "Limited global opportunities",
              description: "Career growth may be slower compared to accessing international markets."
            }
          ]
        },
        right: {
          title: "Remote International Employment",
          pros: [
            {
              id: 1,
              title: "Higher earning potential",
              description: "International roles often offer significantly higher salaries compared to local equivalents."
            },
            {
              id: 2,
              title: "International buying power",
              description: "Earning in USD or EUR increases your ability to travel, invest, and operate globally."
            },
            {
              id: 3,
              title: "Flexible lifestyle",
              description: "Remote work enables a location-independent or 'laptop lifestyle'."
            },
            {
              id: 4,
              title: "Access to global investing",
              description: "Easier access to international platforms and global financial markets."
            }
          ],
          cons: [
            {
              id: 5,
              title: "Tax and administrative complexity",
              description: "Managing foreign income introduces additional tax and compliance requirements."
            },
            {
              id: 6,
              title: "Loss of local benefits",
              description: "You miss out on corporate perks and shared-value programs like Vitality."
            },
            {
              id: 7,
              title: "Isolation from local networks",
              description: "Reduced access to mentorship, networking, and in-person career growth opportunities."
            },
            {
              id: 8,
              title: "Global uncertainty risk",
              description: "Income and contracts may be affected by international regulations or market changes."
            }
          ]
        }
      },
      inputs: [
        { name: "monthlyIncomeLocal", label: "Local Monthly Income (ZAR)", type: "number" },
        { name: "monthlyIncomeGlobal", label: "Global Monthly Income (USD/EUR)", type: "number" },
        { name: "exchangeRate", label: "Exchange Rate", type: "number" }
      ],
      verdict: "Local careers provide stability and integrated benefits, while remote international work offers higher earning potential and global flexibility. The best choice depends on whether you prioritise security or international buying power."
    },

    {
      id: "income-growth-vs-frugality",
      title: "Aggressive Income Growth vs Extreme Frugality",
      description: "Compare increasing your earning power through career growth versus aggressively cutting expenses to accelerate financial freedom",
      type: "comparison",
      priorities: ["financialFreedom"],
      concepts: ["Income Growth", "Extreme Frugality"],
      miniSimulation: {
        inputs: [
          { name: "monthlyIncome", label: "Monthly Income (ZAR)", type: "number", placeholder: "e.g. 35000" },
          { name: "monthlyExpenses", label: "Monthly Expenses (ZAR)", type: "number", placeholder: "e.g. 25000" },
          { name: "targetSavingsRate", label: "Target Savings Rate (%)", type: "number", placeholder: "e.g. 40" }
        ],
        outputs: [
          { key: "incomeGrowthFIYears", label: "Years to FI (Income Growth Path)", format: "years" },
          { key: "frugalityFIYears", label: "Years to FI (Frugality Path)", format: "years" },
          { key: "monthlyInvestable", label: "Current Monthly Investable Amount", format: "currency" }
        ],
        assumptions: "Assumes 10% annual investment return, income growth path increases income by 10% annually, frugality path cuts expenses to match target savings rate. FI = 25x annual expenses (4% rule). Based on average assumptions.",
        calculate: ({ monthlyIncome, monthlyExpenses, targetSavingsRate }) => {
          const currentSavings = monthlyIncome - monthlyExpenses;
          const monthlyInvestable = Math.max(0, currentSavings);
          const annualExpenses = monthlyExpenses * 12;
          const fiTarget = annualExpenses * 25;
          const annualReturn = 0.10;

          // Income growth path: income grows 10% annually, expenses stay flat
          let incomeGrowthWealth = 0;
          let incomeGrowthFIYears = 0;
          let currentIncomeGrowth = monthlyIncome;
          for (let year = 1; year <= 50; year++) {
            currentIncomeGrowth *= 1.10;
            const yearlySavings = Math.max(0, (currentIncomeGrowth - monthlyExpenses) * 12);
            incomeGrowthWealth = incomeGrowthWealth * (1 + annualReturn) + yearlySavings;
            if (incomeGrowthWealth >= fiTarget && incomeGrowthFIYears === 0) {
              incomeGrowthFIYears = year;
            }
          }

          // Frugality path: cut expenses so savings rate = target, income stays flat
          const frugalityMonthlySavings = monthlyIncome * (targetSavingsRate / 100);
          const frugalityMonthlyExpenses = monthlyIncome - frugalityMonthlySavings;
          const frugalityFITarget = frugalityMonthlyExpenses * 12 * 25;
          let frugalityWealth = 0;
          let frugalityFIYears = 0;
          for (let year = 1; year <= 50; year++) {
            frugalityWealth = frugalityWealth * (1 + annualReturn) + frugalityMonthlySavings * 12;
            if (frugalityWealth >= frugalityFITarget && frugalityFIYears === 0) {
              frugalityFIYears = year;
            }
          }

          return {
            incomeGrowthFIYears: incomeGrowthFIYears || "50+",
            frugalityFIYears: frugalityFIYears || "50+",
            monthlyInvestable
          };
        }
      },
      prosCons: {
        left: {
          title: "Aggressive Income Growth",
          pros: [
            {
              id: 1,
              title: "Prevents long-term salary stagnation",
              description: "Negotiating higher salaries early avoids needing to 'catch up' later in your career."
            },
            {
              id: 2,
              title: "High earning potential",
              description: "Careers in law, finance, and engineering can reach R400K–R670K+ early on."
            },
            {
              id: 3,
              title: "Leverages high-value skills",
              description: "Upskilling in areas like AI can significantly increase earning potential."
            },
            {
              id: 4,
              title: "Multiple income opportunities",
              description: "Higher earners can expand into freelancing or side businesses."
            },
            {
              id: 5,
              title: "Access to corporate benefits",
              description: "Employer benefits like medical aid or wellness programs can reduce long-term costs."
            }
          ],
          cons: [
            {
              id: 6,
              title: "Difficult salary negotiations",
              description: "Negotiating pay can be uncomfortable and requires confidence and skill."
            },
            {
              id: 7,
              title: "Automation risk",
              description: "AI may replace repetitive high-paying tasks, requiring constant upskilling."
            },
            {
              id: 8,
              title: "Skill obsolescence",
              description: "Fast-changing industries require continuous learning to stay competitive."
            },
            {
              id: 9,
              title: "Does not control spending",
              description: "Higher income alone does not lead to wealth if expenses increase alongside it."
            }
          ]
        },
        right: {
          title: "Extreme Frugality",
          pros: [
            {
              id: 1,
              title: "Attacks financial freedom from both sides",
              description: "Lower expenses increase savings while reducing the total wealth needed to retire."
            },
            {
              id: 2,
              title: "Lower financial independence target",
              description: "Spending less means you need significantly less capital to stop working."
            },
            {
              id: 3,
              title: "Fast path to independence",
              description: "Savings rates of 70% can lead to financial independence in under a decade."
            },
            {
              id: 4,
              title: "Immediate financial impact",
              description: "Cutting expenses has a faster short-term effect than increasing income."
            },
            {
              id: 5,
              title: "Builds strong financial discipline",
              description: "Encourages mindful spending and resistance to unnecessary purchases."
            }
          ],
          cons: [
            {
              id: 6,
              title: "Severe lifestyle limitations",
              description: "Requires sacrificing comfort, convenience, and many lifestyle expenses."
            },
            {
              id: 7,
              title: "Perceived as deprivation",
              description: "Others may view extreme saving as overly restrictive or unsustainable."
            },
            {
              id: 8,
              title: "Certain costs cannot be reduced",
              description: "Expenses like healthcare increase over time and are difficult to cut."
            },
            {
              id: 9,
              title: "Difficult with dependents",
              description: "Maintaining extreme frugality becomes much harder with family responsibilities."
            },
            {
              id: 10,
              title: "Social and status trade-offs",
              description: "Requires rejecting social norms tied to spending and lifestyle status."
            }
          ]
        }
      },
      inputs: [
        { name: "monthlyIncome", label: "Monthly Income", type: "number" },
        { name: "monthlyExpenses", label: "Monthly Expenses", type: "number" }
      ],
      verdict: "Income growth increases your earning ceiling, while frugality lowers your financial needs. The most effective strategy combines both: grow income while maintaining controlled expenses."
    },

    {
      id: "emergency-fund",
      title: "Emergency Fund Builder",
      description: "Calculate how your monthly obligation builds your emergency safety net over time",
      type: "calculator",
      priorities: ["financialFreedom"],
      concepts: ["Emergency Fund", "Financial Safety Net", "Liquidity"],
      miniSimulation: {
        inputs: [
          { name: "monthlyObligation", label: "Monthly Obligation Amount (ZAR)", type: "number", placeholder: "e.g. 2000" },
          { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 3" }
        ],
        outputs: [
          { key: "totalSaved", label: "Total Amount Saved", format: "currency" },
          { key: "yearlyBreakdown", label: "Year-by-Year Growth", format: "table" }
        ],
        assumptions: "Simple calculation with no interest applied. Add a savings account interest rate for a more accurate projection.",
        calculate: ({ monthlyObligation, years }) => {
          const months = years * 12;
          const totalSaved = monthlyObligation * months;
          const yearlyBreakdown = Array.from({ length: years }, (_, i) => ({
            year: i + 1,
            amount: monthlyObligation * 12 * (i + 1)
          }));

          return {
            totalSaved,
            yearlyBreakdown
          };
        }
      },
      inputs: [
        { name: "monthlyObligation", label: "Monthly Obligation Amount (ZAR)", type: "number" },
        { name: "years", label: "Number of Years", type: "number" }
      ]
    }
  ],
};

export const simulationHistory = [
  {
    id: "rent-vs-buy",
    title: "Buying Property vs Renting + REITs",
    description: "Compared 5 properties with different REIT portfolios",
    date: "2026-04-20",
    priority: "wealthGrowth"
  },
  {
    id: "savings-rate",
    title: "Savings Rate Impact Analysis",
    description: "Analyzed 15% vs 25% savings rates",
    date: "2026-04-18",
    priority: "financialFreedom"
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund Planning",
    description: "Calculated 6-month emergency fund needed",
    date: "2026-04-15",
    priority: "financialFreedom"
  }
];

export const recommendedSimulation = {
  id: "rent-vs-buy",
  title: "Buying Property vs Renting + REITs",
  subheading: "Popular simulation for wealth building",
  description: "Compare the financial outcomes of property ownership versus renting and investing in REITs",
  tags: ["wealth", "property", "investment"]
};

export default simulations;
