export interface Tool {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  category: string;
  implemented: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "math",
    name: "Math & Calculators",
    description: "Essential math tools for everyday and advanced calculations",
    color: "bg-blue-500",
    bgColor: "from-blue-500 to-cyan-400",
    tools: [
      { slug: "percentage-calculator", title: "Percentage Calculator", description: "Calculate percentages, increases, and decreases instantly.", metaDescription: "Free online percentage calculator. Find what percent X is of Y, percentage increase, decrease, and more.", category: "Math & Calculators", implemented: true },
      { slug: "fraction-to-decimal-calculator", title: "Fraction to Decimal Calculator", description: "Convert any fraction to its decimal equivalent instantly.", metaDescription: "Convert fractions to decimals easily. Free fraction to decimal converter online.", category: "Math & Calculators", implemented: true },
      { slug: "decimal-to-fraction-calculator", title: "Decimal to Fraction Calculator", description: "Convert decimals to simplified fractions in one click.", metaDescription: "Convert decimal numbers to fractions. Free online decimal to fraction calculator.", category: "Math & Calculators", implemented: true },
      { slug: "ratio-calculator", title: "Ratio Calculator", description: "Simplify ratios and solve ratio proportions easily.", metaDescription: "Calculate, simplify, and solve ratios with this free online ratio calculator.", category: "Math & Calculators", implemented: true },
      { slug: "average-calculator", title: "Average Calculator", description: "Find the mean, median, and mode of any set of numbers.", metaDescription: "Calculate the average (mean) of any set of numbers. Free online average calculator.", category: "Math & Calculators", implemented: true },
      { slug: "online-scientific-calculator", title: "Scientific Calculator", description: "Advanced scientific calculator with trigonometry and exponents.", metaDescription: "Free online scientific calculator with advanced math functions, trig, logs, and more.", category: "Math & Calculators", implemented: true },
      { slug: "online-standard-deviation-calculator", title: "Standard Deviation Calculator", description: "Calculate standard deviation and variance for datasets.", metaDescription: "Calculate standard deviation, variance, and mean for any dataset online.", category: "Math & Calculators", implemented: true },
      { slug: "square-root-calculator", title: "Square Root Calculator", description: "Find the square root of any number instantly.", metaDescription: "Calculate square roots of any number. Free online square root calculator.", category: "Math & Calculators", implemented: true },
      { slug: "cube-root-calculator", title: "Cube Root Calculator", description: "Compute the cube root of any positive or negative number.", metaDescription: "Find the cube root of any number with this free online calculator.", category: "Math & Calculators", implemented: true },
      { slug: "power-calculator", title: "Power Calculator", description: "Calculate any base raised to any exponent (power).", metaDescription: "Calculate powers and exponents. Raise any number to any power online.", category: "Math & Calculators", implemented: true },
      { slug: "logarithm-calculator", title: "Logarithm Calculator", description: "Compute log, ln, and log base n for any value.", metaDescription: "Calculate logarithms (log10, natural log, custom base) with this free online tool.", category: "Math & Calculators", implemented: true },
      { slug: "factorial-calculator", title: "Factorial Calculator", description: "Calculate the factorial of any non-negative integer.", metaDescription: "Find the factorial of any number. Free online factorial calculator.", category: "Math & Calculators", implemented: true },
      { slug: "prime-number-checker", title: "Prime Number Checker", description: "Check if a number is prime or composite instantly.", metaDescription: "Check if any number is prime. Free online prime number checker tool.", category: "Math & Calculators", implemented: true },
      { slug: "online-lcm-calculator", title: "LCM Calculator", description: "Find the Least Common Multiple of two or more numbers.", metaDescription: "Calculate the LCM (Least Common Multiple) of multiple numbers online.", category: "Math & Calculators", implemented: true },
      { slug: "online-gcd-calculator", title: "GCD Calculator", description: "Find the Greatest Common Divisor of any set of numbers.", metaDescription: "Calculate GCD (Greatest Common Divisor) or HCF of numbers. Free online tool.", category: "Math & Calculators", implemented: true },
      { slug: "random-number-generator", title: "Random Number Generator", description: "Generate random numbers within any range you specify.", metaDescription: "Generate random numbers between any min and max value. Free online random number generator.", category: "Math & Calculators", implemented: true },
      { slug: "mean-median-mode-calculator", title: "Mean Median Mode Calculator", description: "Calculate mean, median, and mode of any dataset.", metaDescription: "Find the mean, median, and mode of any set of numbers. Free statistics calculator.", category: "Math & Calculators", implemented: true },
      { slug: "rounding-numbers-calculator", title: "Rounding Numbers Calculator", description: "Round numbers to any decimal place or significant figures.", metaDescription: "Free online Rounding Numbers Calculator. Round numbers to any decimal place or significant figures. No signup required.", category: "Math & Calculators", implemented: true },
      { slug: "exponents-calculator", title: "Exponents Calculator", description: "Calculate any base raised to any exponent quickly.", metaDescription: "Free online Exponents Calculator. Calculate any base raised to any exponent quickly. No signup required.", category: "Math & Calculators", implemented: true },
      { slug: "variance-calculator", title: "Variance Calculator", description: "Calculate variance for any dataset of numbers.", metaDescription: "Free online Variance Calculator. Calculate variance for any dataset of numbers. No signup required.", category: "Math & Calculators", implemented: true },
      { slug: "number-sequence-generator", title: "Number Sequence Generator", description: "Generate arithmetic, geometric, or custom sequences.", metaDescription: "Free online Number Sequence Generator. Generate arithmetic, geometric, or custom sequences. No signup required.", category: "Math & Calculators", implemented: true },
      { slug: "divisibility-checker", title: "Divisibility Checker", description: "Check if a number is divisible by another number.", metaDescription: "Free online Divisibility Checker. Check if a number is divisible by another number. No signup required.", category: "Math & Calculators", implemented: true },
      { slug: "online-matrix-calculator", title: "Matrix Calculator", description: "Perform matrix operations including addition, multiplication, and inverse.", metaDescription: "Free online matrix calculator. Add, multiply, transpose, and find inverse of matrices.", category: "Math & Calculators", implemented: true },
      { slug: "online-quadratic-equation-solver", title: "Quadratic Equation Solver", description: "Solve any quadratic equation and find roots instantly.", metaDescription: "Free quadratic equation solver. Find roots of ax² + bx + c = 0 online.", category: "Math & Calculators", implemented: true },
      { slug: "permutation-calculator", title: "Permutation Calculator", description: "Calculate permutations for any set of objects.", metaDescription: "Free online permutation calculator. Calculate nPr permutations instantly.", category: "Math & Calculators", implemented: true },
      { slug: "combination-calculator", title: "Combination Calculator", description: "Calculate combinations for any set of objects.", metaDescription: "Free online combination calculator. Calculate nCr combinations instantly.", category: "Math & Calculators", implemented: true },
      { slug: "modulo-calculator", title: "Modulo Calculator", description: "Calculate the remainder of division between two numbers.", metaDescription: "Free modulo calculator. Find remainder of any division online.", category: "Math & Calculators", implemented: true },
      { slug: "proportion-calculator", title: "Proportion Calculator", description: "Solve proportions and find the missing value.", metaDescription: "Free proportion calculator. Solve for unknown in proportions online.", category: "Math & Calculators", implemented: true },
      { slug: "percentage-error-calculator", title: "Percentage Error Calculator", description: "Calculate the percentage error between observed and true values.", metaDescription: "Free online percentage error calculator.", category: "Math & Calculators", implemented: true },
      { slug: "fraction-calculator", title: "Fraction Calculator", description: "Simplify, compare, and calculate with fractions instantly.", metaDescription: "Free online fraction calculator. Simplify fractions and perform fraction addition, subtraction, multiplication, and division.", category: "Math & Calculators", implemented: true },
    ]
  },
  {
    id: "finance",
    name: "Finance & Cost",
    description: "Money calculators for loans, interest, budgeting and more",
    color: "bg-green-500",
    bgColor: "from-green-500 to-emerald-400",
    tools: [
      { slug: "online-simple-interest-calculator", title: "Simple Interest Calculator", description: "Calculate simple interest on any principal amount.", metaDescription: "Calculate simple interest easily. Free online simple interest calculator for any principal, rate, and time.", category: "Finance & Cost", implemented: true },
      { slug: "online-compound-interest-calculator", title: "Compound Interest Calculator", description: "Find compound interest with any compounding frequency.", metaDescription: "Calculate compound interest with monthly, yearly or custom compounding. Free online calculator.", category: "Finance & Cost", implemented: true },
      { slug: "online-loan-emi-calculator", title: "Loan EMI Calculator", description: "Calculate monthly EMI for any loan amount and tenure.", metaDescription: "Calculate your monthly loan EMI online. Free loan EMI calculator for home, car, and personal loans.", category: "Finance & Cost", implemented: true },
      { slug: "discount-calculator", title: "Discount Calculator", description: "Calculate the final price after any percentage discount.", metaDescription: "Find the discounted price of any item instantly. Free online discount calculator.", category: "Finance & Cost", implemented: true },
      { slug: "profit-margin-calculator", title: "Profit Margin Calculator", description: "Calculate gross, net, and operating profit margins.", metaDescription: "Calculate profit margin percentage online. Free profit margin calculator for businesses.", category: "Finance & Cost", implemented: true },
      { slug: "markup-calculator", title: "Markup Calculator", description: "Calculate selling price from cost and markup percentage.", metaDescription: "Find selling price with markup percentage. Free online markup calculator.", category: "Finance & Cost", implemented: true },
      { slug: "break-even-calculator", title: "Break Even Calculator", description: "Find the break-even point for your business or product.", metaDescription: "Calculate your business break-even point. Free break-even analysis calculator.", category: "Finance & Cost", implemented: true },
      { slug: "online-roi-calculator", title: "ROI Calculator", description: "Calculate return on investment for any amount.", metaDescription: "Calculate ROI (Return on Investment) percentage. Free online investment calculator.", category: "Finance & Cost", implemented: true },
      { slug: "savings-calculator", title: "Savings Calculator", description: "Project your savings growth with interest over time.", metaDescription: "Calculate how much your savings will grow. Free online savings calculator with interest.", category: "Finance & Cost", implemented: true },
      { slug: "online-cagr-calculator", title: "CAGR Calculator", description: "Calculate compound annual growth rate from start value, end value, and years.", metaDescription: "Free online CAGR calculator. Find annualized compound growth rate for investments and business metrics.", category: "Finance & Cost", implemented: true },
      { slug: "online-debt-to-income-calculator", title: "Debt-to-Income Calculator", description: "Calculate debt-to-income ratio using monthly debt and gross income.", metaDescription: "Free online debt-to-income calculator. Compute DTI ratio for loan and mortgage planning.", category: "Finance & Cost", implemented: true },
      { slug: "online-loan-to-value-calculator", title: "Loan-to-Value Calculator", description: "Calculate loan-to-value ratio and equity from loan amount and property value.", metaDescription: "Free online loan-to-value calculator. Calculate LTV ratio for mortgage and refinance decisions.", category: "Finance & Cost", implemented: true },
      { slug: "tip-calculator", title: "Tip Calculator", description: "Calculate the right tip amount and split bills easily.", metaDescription: "Calculate tip amount and split bills between people. Free online tip calculator.", category: "Finance & Cost", implemented: true },
      { slug: "online-salary-calculator", title: "Salary Calculator", description: "Convert between hourly, monthly, and annual salary.", metaDescription: "Convert your salary between hourly, monthly and yearly. Free salary calculator online.", category: "Finance & Cost", implemented: true },
      { slug: "online-tax-calculator", title: "Tax Calculator", description: "Estimate income tax based on earnings and deductions.", metaDescription: "Estimate your income tax. Free online tax calculator for quick tax estimates.", category: "Finance & Cost", implemented: true },
      { slug: "online-mortgage-payment-calculator", title: "Mortgage Payment Calculator", description: "Estimate your monthly mortgage payment and amortization.", metaDescription: "Calculate monthly mortgage payments. Free mortgage calculator for home buyers.", category: "Finance & Cost", implemented: true },
      { slug: "online-gst-calculator", title: "GST Calculator", description: "Add or remove GST from any price amount quickly.", metaDescription: "Calculate GST (Goods and Services Tax) on any price. Free online GST calculator.", category: "Finance & Cost", implemented: true },
      { slug: "online-inflation-calculator", title: "Inflation Calculator", description: "Calculate the impact of inflation on purchasing power.", metaDescription: "Calculate inflation impact on money over time. Free inflation rate calculator online.", category: "Finance & Cost", implemented: true },
      { slug: "commission-calculator", title: "Commission Calculator", description: "Calculate sales commission based on rate and earnings.", metaDescription: "Calculate sales commission amount. Free online commission calculator for any rate.", category: "Finance & Cost", implemented: true },
      { slug: "online-investment-growth-calculator", title: "Investment Growth Calculator", description: "Project how your investments will grow over time.", metaDescription: "Calculate investment growth over time with returns. Free online investment growth calculator.", category: "Finance & Cost", implemented: true },
      { slug: "online-budget-calculator", title: "Budget Calculator", description: "Plan and track your monthly budget and expenses.", metaDescription: "Create a monthly budget plan. Free budget calculator to manage income and expenses.", category: "Finance & Cost", implemented: true },
      { slug: "expense-calculator", title: "Expense Calculator", description: "Track and calculate total expenses by category.", metaDescription: "Free online Expense Calculator. Track and calculate total expenses by category. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "cost-per-unit-calculator", title: "Cost Per Unit Calculator", description: "Calculate the cost per unit for any quantity.", metaDescription: "Free online Cost Per Unit Calculator. Calculate the cost per unit for any quantity. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "price-per-unit-calculator", title: "Price Per Unit Calculator", description: "Compare prices per unit across different products.", metaDescription: "Free online Price Per Unit Calculator. Compare prices per unit across different products. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "payback-period-calculator", title: "Payback Period Calculator", description: "Calculate how long it takes to recoup an investment.", metaDescription: "Free online Payback Period Calculator. Calculate how long it takes to recoup an investment. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "loan-interest-calculator", title: "Loan Interest Calculator", description: "Calculate total interest paid on any loan.", metaDescription: "Free online Loan Interest Calculator. Calculate total interest paid on any loan. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "savings-goal-calculator", title: "Savings Goal Calculator", description: "Plan savings needed to reach a financial goal.", metaDescription: "Free online Savings Goal Calculator. Plan savings needed to reach a financial goal. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "revenue-calculator", title: "Revenue Calculator", description: "Estimate total revenue from price and volume.", metaDescription: "Free online Revenue Calculator. Estimate total revenue from price and volume. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "cost-split-calculator", title: "Cost Split Calculator", description: "Split costs evenly or proportionally among people.", metaDescription: "Free online Cost Split Calculator. Split costs evenly or proportionally among people. No signup required.", category: "Finance & Cost", implemented: true },
      { slug: "depreciation-calculator", title: "Depreciation Calculator", description: "Calculate asset depreciation using various methods.", metaDescription: "Free depreciation calculator. Calculate straight-line, declining balance depreciation online.", category: "Finance & Cost", implemented: true },
      { slug: "net-worth-calculator", title: "Net Worth Calculator", description: "Calculate your total net worth from assets and liabilities.", metaDescription: "Free net worth calculator. Track assets minus liabilities online.", category: "Finance & Cost", implemented: true },
      { slug: "online-retirement-calculator", title: "Retirement Calculator", description: "Plan your retirement savings and estimate future income.", metaDescription: "Free retirement calculator. Plan savings needed for retirement online.", category: "Finance & Cost", implemented: true },
      { slug: "online-car-loan-calculator", title: "Car Loan Calculator", description: "Calculate monthly payments for auto loans.", metaDescription: "Free car loan calculator. Estimate monthly auto loan payments online.", category: "Finance & Cost", implemented: true },
      { slug: "credit-card-payoff-calculator", title: "Credit Card Payoff Calculator", description: "Calculate how long to pay off credit card debt.", metaDescription: "Free credit card payoff calculator. Estimate time to pay off credit card debt.", category: "Finance & Cost", implemented: true },
      { slug: "down-payment-calculator", title: "Down Payment Calculator", description: "Calculate the down payment needed for any purchase.", metaDescription: "Free down payment calculator. Calculate home or car down payment amounts.", category: "Finance & Cost", implemented: true },
      { slug: "online-amortization-calculator", title: "Amortization Calculator", description: "Generate a full amortization schedule for any loan.", metaDescription: "Free amortization calculator. See full loan payment schedule online.", category: "Finance & Cost", implemented: true },
      { slug: "stock-profit-calculator", title: "Stock Profit Calculator", description: "Calculate profit or loss from stock trades.", metaDescription: "Free stock profit calculator. Calculate gains and losses from stock trades.", category: "Finance & Cost", implemented: true },
      { slug: "dividend-calculator", title: "Dividend Calculator", description: "Calculate dividend income from your stock investments.", metaDescription: "Free dividend calculator. Estimate dividend income from stocks online.", category: "Finance & Cost", implemented: true },
      { slug: "online-currency-exchange-calculator", title: "Currency Exchange Calculator", description: "Convert between world currencies with live rates.", metaDescription: "Free currency exchange calculator. Convert currencies with live rates online.", category: "Finance & Cost", implemented: true },
      { slug: "hourly-to-salary-calculator", title: "Hourly to Salary Calculator", description: "Convert hourly wage to annual salary and vice versa.", metaDescription: "Free hourly to salary calculator. Convert hourly pay to yearly salary online.", category: "Finance & Cost", implemented: true },
    ]
  },
  {
    id: "conversion",
    name: "Conversion Tools",
    description: "Convert between any units of measurement instantly",
    color: "bg-purple-500",
    bgColor: "from-purple-500 to-violet-500",
    tools: [
      { slug: "online-length-converter", title: "Length Converter", description: "Convert between meters, feet, inches, kilometers, and more.", metaDescription: "Convert length units: meters, feet, inches, cm, km, miles. Free online length converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-weight-converter", title: "Weight Converter", description: "Convert between kilograms, pounds, ounces, grams, and more.", metaDescription: "Convert weight units: kg, lbs, oz, grams, tons. Free online weight converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-temperature-converter", title: "Temperature Converter", description: "Convert between Celsius, Fahrenheit, and Kelvin.", metaDescription: "Convert temperatures between Celsius, Fahrenheit and Kelvin. Free online temperature converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-area-converter", title: "Area Converter", description: "Convert between square meters, acres, hectares, and more.", metaDescription: "Convert area units: sq meters, acres, hectares, sq feet. Free online area converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-volume-converter", title: "Volume Converter", description: "Convert liters, gallons, milliliters, and fluid ounces.", metaDescription: "Convert volume units: liters, gallons, ml, cups, fluid oz. Free online volume converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-speed-converter", title: "Speed Converter", description: "Convert between mph, km/h, m/s, knots, and more.", metaDescription: "Convert speed units: mph, km/h, m/s, knots. Free online speed converter.", category: "Conversion Tools", implemented: true },
      { slug: "color-converter", title: "Color Converter", description: "Convert colors between HEX, RGB, HSL, and CMYK.", metaDescription: "Convert colors between HEX, RGB, HSL formats. Free online color converter tool.", category: "Conversion Tools", implemented: true },
      { slug: "online-binary-to-decimal-converter", title: "Binary to Decimal Converter", description: "Convert binary numbers to decimal format instantly.", metaDescription: "Convert binary to decimal numbers. Free online binary to decimal converter.", category: "Conversion Tools", implemented: true },
      { slug: "decimal-to-binary-converter", title: "Decimal to Binary Converter", description: "Convert decimal numbers to binary representation.", metaDescription: "Convert decimal to binary numbers. Free online decimal to binary converter.", category: "Conversion Tools", implemented: true },
      { slug: "hex-to-decimal-converter", title: "Hex to Decimal Converter", description: "Convert hexadecimal values to decimal numbers.", metaDescription: "Convert hex to decimal numbers. Free online hexadecimal to decimal converter.", category: "Conversion Tools", implemented: true },
      { slug: "online-roman-numeral-converter", title: "Roman Numeral Converter", description: "Convert numbers to Roman numerals and vice versa.", metaDescription: "Convert numbers to Roman numerals. Free online Roman numeral converter.", category: "Conversion Tools", implemented: true },
      { slug: "data-storage-converter", title: "Data Storage Converter", description: "Convert between bytes, KB, MB, GB, TB, and more.", metaDescription: "Convert data storage units: bytes, KB, MB, GB, TB. Free online data storage converter.", category: "Conversion Tools", implemented: true },
      { slug: "energy-converter", title: "Energy Converter", description: "Convert joules, calories, watts, kWh, and other energy units.", metaDescription: "Convert energy units: joules, calories, kWh, BTU. Free online energy converter.", category: "Conversion Tools", implemented: true },
      { slug: "pressure-converter", title: "Pressure Converter", description: "Convert between PSI, bar, pascal, atmosphere, and more.", metaDescription: "Convert pressure units: PSI, bar, pascal, atm. Free online pressure converter.", category: "Conversion Tools", implemented: true },
      { slug: "time-converter", title: "Time Converter", description: "Convert between seconds, minutes, hours, and days.", metaDescription: "Free online Time Converter. Convert between seconds, minutes, hours, and days. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "angle-converter", title: "Angle Converter", description: "Convert between degrees, radians, and gradians.", metaDescription: "Free online Angle Converter. Convert between degrees, radians, and gradians. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "frequency-converter", title: "Frequency Converter", description: "Convert between Hz, kHz, MHz, GHz, and RPM.", metaDescription: "Free online Frequency Converter. Convert between Hz, kHz, MHz, GHz, and RPM. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "fuel-efficiency-converter", title: "Fuel Efficiency Converter", description: "Convert between MPG, km/L, and L/100km.", metaDescription: "Free online Fuel Efficiency Converter. Convert between MPG, km/L, and L/100km. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "number-to-words-converter", title: "Number to Words Converter", description: "Convert any number into its word representation.", metaDescription: "Free online Number to Words Converter. Convert any number into its word representation. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "words-to-number-converter", title: "Words to Number Converter", description: "Convert number words back to numeric digits.", metaDescription: "Free online Words to Number Converter. Convert number words back to numeric digits. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "base-converter", title: "Base Converter", description: "Convert numbers between any bases (2-36).", metaDescription: "Free online Base Converter. Convert numbers between any bases (2-36). No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "binary-to-hex-converter", title: "Binary to Hex Converter", description: "Convert binary numbers to hexadecimal format.", metaDescription: "Free online Binary to Hex Converter. Convert binary numbers to hexadecimal format. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "hex-to-binary-converter", title: "Hex to Binary Converter", description: "Convert hexadecimal numbers to binary format.", metaDescription: "Free online Hex to Binary Converter. Convert hexadecimal numbers to binary format. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "octal-converter", title: "Octal Converter", description: "Convert between octal, decimal, and other bases.", metaDescription: "Free online Octal Converter. Convert between octal, decimal, and other bases. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "unit-price-converter", title: "Unit Price Converter", description: "Compare unit prices across different package sizes.", metaDescription: "Free online Unit Price Converter. Compare unit prices across different package sizes. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "density-converter", title: "Density Converter", description: "Convert between density units like kg/m³ and lb/ft³.", metaDescription: "Free online Density Converter. Convert between density units like kg/m³ and lb/ft³. No signup required.", category: "Conversion Tools", implemented: true },
      { slug: "power-converter", title: "Power Converter", description: "Convert between watts, kilowatts, horsepower, and BTU/hr.", metaDescription: "Free power converter. Convert watts, kilowatts, horsepower online.", category: "Conversion Tools", implemented: true },
      { slug: "torque-converter", title: "Torque Converter", description: "Convert between Newton-meters, foot-pounds, and more.", metaDescription: "Free torque converter. Convert Nm, ft-lb, and other torque units online.", category: "Conversion Tools", implemented: true },
      { slug: "force-converter", title: "Force Converter", description: "Convert between Newtons, pounds-force, and dynes.", metaDescription: "Free force converter. Convert Newtons, pounds-force online.", category: "Conversion Tools", implemented: true },
      { slug: "electric-current-converter", title: "Electric Current Converter", description: "Convert between amperes, milliamperes, and microamperes.", metaDescription: "Free electric current converter. Convert amps, milliamps online.", category: "Conversion Tools", implemented: true },
      { slug: "online-shoe-size-converter", title: "Shoe Size Converter", description: "Convert shoe sizes between US, UK, EU, and CM.", metaDescription: "Free shoe size converter. Convert US, UK, EU shoe sizes online.", category: "Conversion Tools", implemented: true },
      { slug: "online-cooking-converter", title: "Cooking Converter", description: "Convert between cups, tablespoons, teaspoons, and ml.", metaDescription: "Free cooking converter. Convert cups, tbsp, tsp, ml for recipes online.", category: "Conversion Tools", implemented: true },
    ]
  },
  {
    id: "time-date",
    name: "Time & Date",
    description: "Date calculators, countdowns, and time tools",
    color: "bg-orange-500",
    bgColor: "from-orange-500 to-amber-400",
    tools: [
      { slug: "online-age-calculator", title: "Age Calculator", description: "Calculate exact age in years, months, and days from birthdate.", metaDescription: "Calculate your exact age from date of birth. Free online age calculator with days, months, years.", category: "Time & Date", implemented: true },
      { slug: "date-difference-calculator", title: "Date Difference Calculator", description: "Find the exact number of days between any two dates.", metaDescription: "Calculate the difference between two dates in days, weeks, months, and years.", category: "Time & Date", implemented: true },
      { slug: "online-countdown-timer", title: "Countdown Timer", description: "Set a countdown to any event, deadline, or date.", metaDescription: "Free online countdown timer. Count down to any event, meeting, or deadline.", category: "Time & Date", implemented: true },
      { slug: "time-duration-calculator", title: "Time Duration Calculator", description: "Calculate the duration between two times of day.", metaDescription: "Calculate time duration between two times. Free online time duration calculator.", category: "Time & Date", implemented: true },
      { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Track and sum up work hours across the week.", metaDescription: "Calculate total work hours for the day or week. Free online work hours calculator.", category: "Time & Date", implemented: true },
      { slug: "business-days-calculator", title: "Business Days Calculator", description: "Count working/business days between two dates.", metaDescription: "Count business days between two dates, excluding weekends. Free calculator.", category: "Time & Date", implemented: true },
      { slug: "leap-year-checker", title: "Leap Year Checker", description: "Check if any year is a leap year instantly.", metaDescription: "Check if any year is a leap year. Free online leap year checker tool.", category: "Time & Date", implemented: true },
      { slug: "online-time-zone-converter", title: "Time Zone Converter", description: "Convert times between different time zones worldwide.", metaDescription: "Convert time between time zones worldwide. Free online time zone converter.", category: "Time & Date", implemented: true },
      { slug: "online-stopwatch", title: "Stopwatch Tool", description: "Online stopwatch with lap times and pause/resume.", metaDescription: "Free online stopwatch with lap times. Simple and accurate digital stopwatch tool.", category: "Time & Date", implemented: true },
      { slug: "half-birthday-calculator", title: "Half Birthday Calculator", description: "Find the exact date of your half birthday.", metaDescription: "Calculate your half birthday date. Free online half birthday calculator.", category: "Time & Date", implemented: true },
      { slug: "week-number-calculator", title: "Week Number Calculator", description: "Find the week number for any date of the year.", metaDescription: "Find what week number any date falls on. Free online week number calculator.", category: "Time & Date", implemented: true },
      { slug: "overtime-calculator", title: "Overtime Calculator", description: "Calculate overtime pay based on hours and rate.", metaDescription: "Calculate overtime pay and hours worked. Free online overtime calculator.", category: "Time & Date", implemented: true },
      { slug: "days-between-dates-calculator", title: "Days Between Dates Calculator", description: "Count the exact days between any two dates.", metaDescription: "Free online Days Between Dates Calculator. Count the exact days between any two dates. No signup required.", category: "Time & Date", implemented: true },
      { slug: "working-days-calculator", title: "Working Days Calculator", description: "Calculate working days excluding weekends and holidays.", metaDescription: "Free online Working Days Calculator. Calculate working days excluding weekends and holidays. No signup required.", category: "Time & Date", implemented: true },
      { slug: "time-addition-calculator", title: "Time Addition Calculator", description: "Add hours, minutes, and seconds together easily.", metaDescription: "Free online Time Addition Calculator. Add hours, minutes, and seconds together easily. No signup required.", category: "Time & Date", implemented: true },
      { slug: "time-subtraction-calculator", title: "Time Subtraction Calculator", description: "Subtract time values from each other.", metaDescription: "Free online Time Subtraction Calculator. Subtract time values from each other. No signup required.", category: "Time & Date", implemented: true },
      { slug: "meeting-time-calculator", title: "Meeting Time Calculator", description: "Find the best meeting time across time zones.", metaDescription: "Free online Meeting Time Calculator. Find the best meeting time across time zones. No signup required.", category: "Time & Date", implemented: true },
      { slug: "shift-schedule-calculator", title: "Shift Schedule Calculator", description: "Plan and calculate rotating shift schedules.", metaDescription: "Free online Shift Schedule Calculator. Plan and calculate rotating shift schedules. No signup required.", category: "Time & Date", implemented: true },
      { slug: "deadline-calculator", title: "Deadline Calculator", description: "Calculate deadlines based on start date and duration.", metaDescription: "Free online Deadline Calculator. Calculate deadlines based on start date and duration. No signup required.", category: "Time & Date", implemented: true },
      { slug: "study-time-calculator", title: "Study Time Calculator", description: "Plan study sessions based on exam dates and topics.", metaDescription: "Free online Study Time Calculator. Plan study sessions based on exam dates and topics. No signup required.", category: "Time & Date", implemented: true },
      { slug: "reading-time-calculator", title: "Reading Time Calculator", description: "Estimate how long it takes to read any text.", metaDescription: "Free online Reading Time Calculator. Estimate how long it takes to read any text. No signup required.", category: "Time & Date", implemented: true },
      { slug: "event-countdown-timer", title: "Event Countdown Timer", description: "Create countdown timers for upcoming events.", metaDescription: "Free online Event Countdown Timer. Create countdown timers for upcoming events. No signup required.", category: "Time & Date", implemented: true },
      { slug: "hourly-time-calculator", title: "Hourly Time Calculator", description: "Calculate pay and hours on an hourly basis.", metaDescription: "Free online Hourly Time Calculator. Calculate pay and hours on an hourly basis. No signup required.", category: "Time & Date", implemented: true },
      { slug: "shift-hours-calculator", title: "Shift Hours Calculator", description: "Calculate total hours worked across shifts.", metaDescription: "Free online Shift Hours Calculator. Calculate total hours worked across shifts. No signup required.", category: "Time & Date", implemented: true },
      { slug: "time-tracking-calculator", title: "Time Tracking Calculator", description: "Track time spent on tasks and projects.", metaDescription: "Free online Time Tracking Calculator. Track time spent on tasks and projects. No signup required.", category: "Time & Date", implemented: true },
      { slug: "time-calculator", title: "Time Calculator", description: "Calculate time differences, add or subtract hours, and convert decimal hours.", metaDescription: "Free online time calculator. Find the time between two times, add or subtract time, and convert decimal hours instantly.", category: "Time & Date", implemented: true },
      { slug: "online-military-time-converter", title: "Military Time Converter", description: "Convert between 12-hour and 24-hour time formats.", metaDescription: "Free online Military Time Converter. Convert between 12-hour and 24-hour time formats. No signup required.", category: "Time & Date", implemented: true },
      { slug: "era-calculator", title: "Era Calculator", description: "Convert dates between different calendar eras and epochs.", metaDescription: "Free era calculator. Convert between calendar eras, epochs, and dating systems online.", category: "Time & Date", implemented: true },
      { slug: "zodiac-sign-calculator", title: "Zodiac Sign Calculator", description: "Find your zodiac sign based on your birth date.", metaDescription: "Free zodiac sign calculator. Find your star sign from birth date online.", category: "Time & Date", implemented: true },
      { slug: "chinese-zodiac-calculator", title: "Chinese Zodiac Calculator", description: "Find your Chinese zodiac animal from your birth year.", metaDescription: "Free Chinese zodiac calculator. Find your zodiac animal online.", category: "Time & Date", implemented: true },
      { slug: "age-in-days-calculator", title: "Age in Days Calculator", description: "Calculate your exact age in days, hours, and minutes.", metaDescription: "Free age in days calculator. Find how many days old you are online.", category: "Time & Date", implemented: true },
      { slug: "retirement-age-calculator", title: "Retirement Age Calculator", description: "Calculate how many years until your retirement date.", metaDescription: "Free retirement age calculator. Find years until retirement online.", category: "Time & Date", implemented: true },
    ]
  },
  {
    id: "health",
    name: "Health & Fitness",
    description: "Health calculators for BMI, calories, fitness and more",
    color: "bg-red-500",
    bgColor: "from-red-500 to-rose-400",
    tools: [
      { slug: "online-bmi-calculator", title: "BMI Calculator", implemented: true, description: "Calculate your Body Mass Index from height and weight.", metaDescription: "Free BMI calculator online. Calculate Body Mass Index using metric or imperial units.", category: "Health & Fitness" },
      { slug: "online-bmr-calculator", title: "BMR Calculator", description: "Find your Basal Metabolic Rate (calories at rest).", metaDescription: "Calculate your BMR (Basal Metabolic Rate). Free online BMR calculator.", category: "Health & Fitness", implemented: true },
      { slug: "online-body-surface-area-calculator", title: "Body Surface Area Calculator", description: "Estimate body surface area (BSA) using height and weight.", metaDescription: "Free online body surface area calculator. Estimate BSA with the Mosteller formula.", category: "Health & Fitness", implemented: true },
      { slug: "online-tdee-calculator", title: "TDEE Calculator", description: "Calculate Total Daily Energy Expenditure for your body.", metaDescription: "Calculate TDEE (Total Daily Energy Expenditure). Free online TDEE calculator.", category: "Health & Fitness", implemented: true },
      { slug: "calorie-intake-calculator", title: "Calorie Intake Calculator", description: "Find your daily calorie needs based on goals.", metaDescription: "Calculate how many calories you need per day. Free online calorie intake calculator.", category: "Health & Fitness", implemented: true },
      { slug: "water-intake-calculator", title: "Water Intake Calculator", description: "Find out how much water you should drink daily.", metaDescription: "Calculate your daily water intake needs. Free online water intake calculator.", category: "Health & Fitness", implemented: true },
      { slug: "ideal-weight-calculator", title: "Ideal Weight Calculator", description: "Find your ideal body weight based on height and gender.", metaDescription: "Calculate your ideal body weight. Free online ideal weight calculator.", category: "Health & Fitness", implemented: true },
      { slug: "body-fat-calculator", title: "Body Fat Calculator", description: "Estimate your body fat percentage using measurements.", metaDescription: "Calculate body fat percentage. Free online body fat calculator.", category: "Health & Fitness", implemented: true },
      { slug: "protein-intake-calculator", title: "Protein Intake Calculator", description: "Calculate daily protein requirements for your fitness goals.", metaDescription: "Find your daily protein intake needs. Free online protein intake calculator.", category: "Health & Fitness", implemented: true },
      { slug: "running-pace-calculator", title: "Running Pace Calculator", description: "Calculate your running pace, speed, and finish time.", metaDescription: "Calculate running pace per mile or km. Free online running pace calculator.", category: "Health & Fitness", implemented: true },
      { slug: "heart-rate-calculator", title: "Heart Rate Calculator", description: "Find your target heart rate zones for exercise.", metaDescription: "Calculate target heart rate zones. Free online heart rate zone calculator.", category: "Health & Fitness", implemented: true },
      { slug: "sleep-calculator", title: "Sleep Calculator", description: "Find the best bedtime or wake-up time for good sleep.", metaDescription: "Calculate when to sleep or wake up based on sleep cycles. Free sleep calculator.", category: "Health & Fitness", implemented: true },
      { slug: "pregnancy-due-date-calculator", title: "Pregnancy Due Date Calculator", description: "Calculate your expected due date from the last period.", metaDescription: "Calculate pregnancy due date. Free online pregnancy due date calculator.", category: "Health & Fitness", implemented: true },
      { slug: "ovulation-calculator", title: "Ovulation Calculator", description: "Predict your ovulation dates and fertile window.", metaDescription: "Calculate ovulation dates and fertile window. Free online ovulation calculator.", category: "Health & Fitness", implemented: true },
      { slug: "calorie-deficit-calculator", title: "Calorie Deficit Calculator", description: "Calculate the calorie deficit needed to lose weight.", metaDescription: "Calculate calorie deficit for weight loss. Free online calorie deficit calculator.", category: "Health & Fitness", implemented: true },
      { slug: "cat-age-calculator", title: "Cat Age Calculator", description: "Convert your cat's age to human years equivalently.", metaDescription: "Calculate your cat's age in human years. Free cat age calculator.", category: "Health & Fitness", implemented: true },
      { slug: "dog-age-calculator", title: "Dog Age Calculator", description: "Convert your dog's age to equivalent human years.", metaDescription: "Calculate your dog's age in human years. Free dog age calculator.", category: "Health & Fitness", implemented: true },
      { slug: "lean-body-mass-calculator", title: "Lean Body Mass Calculator", description: "Calculate your lean body mass from body fat.", metaDescription: "Free online Lean Body Mass Calculator. Calculate your lean body mass from body fat. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "daily-calories-burn-calculator", title: "Daily Calories Burn Calculator", description: "Estimate total calories burned in a day.", metaDescription: "Free online Daily Calories Burn Calculator. Estimate total calories burned in a day. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "one-rep-max-calculator", title: "One Rep Max Calculator", description: "Calculate your one rep max for any exercise.", metaDescription: "Free online One Rep Max Calculator. Calculate your one rep max for any exercise. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "body-type-calculator", title: "Body Type Calculator", description: "Determine your body type: ectomorph, mesomorph, or endomorph.", metaDescription: "Free online Body Type Calculator. Determine your body type: ectomorph, mesomorph, or endomorph. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "fitness-age-calculator", title: "Fitness Age Calculator", description: "Calculate your fitness age based on health metrics.", metaDescription: "Free online Fitness Age Calculator. Calculate your fitness age based on health metrics. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "walking-calories-calculator", title: "Walking Calories Calculator", description: "Estimate calories burned while walking.", metaDescription: "Free online Walking Calories Calculator. Estimate calories burned while walking. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "cycling-calories-calculator", title: "Cycling Calories Calculator", description: "Estimate calories burned while cycling.", metaDescription: "Free online Cycling Calories Calculator. Estimate calories burned while cycling. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "macro-nutrient-calculator", title: "Macro Nutrient Calculator", description: "Calculate your ideal macro ratios for any diet.", metaDescription: "Free online Macro Nutrient Calculator. Calculate your ideal macro ratios for any diet. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "fat-intake-calculator", title: "Fat Intake Calculator", description: "Calculate recommended daily fat intake in grams.", metaDescription: "Free online Fat Intake Calculator. Calculate recommended daily fat intake in grams. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "workout-duration-calculator", title: "Workout Duration Calculator", description: "Plan workout duration based on fitness goals.", metaDescription: "Free online Workout Duration Calculator. Plan workout duration based on fitness goals. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "step-counter-estimator", title: "Step Counter Estimator", description: "Estimate steps from distance, time, or activity.", metaDescription: "Free online Step Counter Estimator. Estimate steps from distance, time, or activity. No signup required.", category: "Health & Fitness", implemented: true },
      { slug: "calorie-calculator", title: "Calorie Calculator", description: "Calculate daily calories needed based on age, weight, and activity.", metaDescription: "Free calorie calculator. Find your daily calorie needs for weight goals online.", category: "Health & Fitness", implemented: true },
      { slug: "bac-calculator", title: "BAC Calculator", description: "Estimate blood alcohol concentration based on drinks consumed.", metaDescription: "Free BAC calculator. Estimate blood alcohol level online.", category: "Health & Fitness", implemented: true },
      { slug: "waist-to-hip-ratio-calculator", title: "Waist to Hip Ratio Calculator", description: "Calculate your waist-to-hip ratio for health assessment.", metaDescription: "Free waist to hip ratio calculator. Assess health risk from body measurements.", category: "Health & Fitness", implemented: true },
      { slug: "keto-calculator", title: "Keto Calculator", description: "Calculate ideal macros for a ketogenic diet plan.", metaDescription: "Free keto calculator. Find ideal fat, protein, carb ratios for keto diet.", category: "Health & Fitness", implemented: true },
      { slug: "intermittent-fasting-calculator", title: "Intermittent Fasting Calculator", description: "Plan your fasting and eating windows for IF diets.", metaDescription: "Free intermittent fasting calculator. Plan fasting schedules online.", category: "Health & Fitness", implemented: true },
      { slug: "vo2-max-calculator", title: "VO2 Max Calculator", description: "Estimate your VO2 max fitness level from exercise data.", metaDescription: "Free VO2 max calculator. Estimate aerobic fitness level online.", category: "Health & Fitness", implemented: true },
    ]
  },
  {
    id: "construction",
    name: "Construction & DIY",
    description: "Calculators for building, materials, and home projects",
    color: "bg-yellow-500",
    bgColor: "from-yellow-500 to-amber-500",
    tools: [
      { slug: "concrete-calculator", title: "Concrete Volume Calculator", description: "Calculate the volume of concrete needed for any project.", metaDescription: "Calculate concrete volume in cubic yards or meters. Free concrete calculator.", category: "Construction & DIY", implemented: true },
      { slug: "cement-calculator", title: "Cement Calculator", description: "Estimate cement bags needed for slabs, walls, and columns.", metaDescription: "Calculate cement quantity for construction. Free online cement calculator.", category: "Construction & DIY", implemented: true },
      { slug: "brick-calculator", title: "Brick Calculator", description: "Estimate how many bricks you need for walls or projects.", metaDescription: "Calculate number of bricks needed for any wall. Free brick calculator for construction.", category: "Construction & DIY", implemented: true },
      { slug: "steel-weight-calculator", title: "Steel Weight Calculator", description: "Calculate the weight of steel bars and rods by dimensions.", metaDescription: "Calculate steel bar weight. Free online steel weight calculator for construction.", category: "Construction & DIY", implemented: true },
      { slug: "paint-calculator", title: "Paint Calculator", description: "Estimate liters of paint needed to cover a surface.", metaDescription: "Calculate how much paint you need. Free paint coverage calculator.", category: "Construction & DIY", implemented: true },
      { slug: "tile-calculator", title: "Tile Calculator", description: "Calculate tiles needed for floors or walls by area.", metaDescription: "Calculate number of tiles needed for any room. Free tile calculator.", category: "Construction & DIY", implemented: true },
      { slug: "flooring-calculator", title: "Flooring Calculator", description: "Estimate flooring materials needed for any room size.", metaDescription: "Calculate flooring materials needed. Free flooring calculator for any room.", category: "Construction & DIY", implemented: true },
      { slug: "room-area-calculator", title: "Room Area Calculator", description: "Calculate the total area of any room or space.", metaDescription: "Calculate room area in square feet or meters. Free room area calculator.", category: "Construction & DIY", implemented: true },
      { slug: "roof-area-calculator", title: "Roof Area Calculator", description: "Estimate the total surface area of a roof by dimensions.", metaDescription: "Calculate roof area for any shape. Free online roof area calculator.", category: "Construction & DIY", implemented: true },
      { slug: "water-tank-calculator", title: "Water Tank Capacity Calculator", description: "Calculate water tank volume in liters or gallons.", metaDescription: "Calculate water tank capacity. Free water tank volume calculator.", category: "Construction & DIY", implemented: true },
      { slug: "asphalt-calculator", title: "Asphalt Calculator", description: "Estimate tons of asphalt needed for driveways or roads.", metaDescription: "Calculate asphalt needed for paving projects. Free online asphalt calculator.", category: "Construction & DIY", implemented: true },
      { slug: "gravel-calculator", title: "Gravel Calculator", description: "Estimate gravel or crushed stone needed by volume.", metaDescription: "Calculate gravel needed for any area. Free gravel volume calculator.", category: "Construction & DIY", implemented: true },
      { slug: "fence-length-calculator", title: "Fence Length Calculator", description: "Calculate total fence length and posts needed.", metaDescription: "Calculate fence length and materials needed. Free fence calculator.", category: "Construction & DIY", implemented: true },
      { slug: "lumber-calculator", title: "Lumber Calculator", description: "Estimate board feet of lumber for any building project.", metaDescription: "Calculate board feet of lumber. Free online lumber calculator.", category: "Construction & DIY", implemented: true },
      { slug: "wall-area-calculator", title: "Wall Area Calculator", description: "Calculate the total area of walls for painting or tiling.", metaDescription: "Free online Wall Area Calculator. Calculate the total area of walls for painting or tiling. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "pipe-volume-calculator", title: "Pipe Volume Calculator", description: "Calculate the volume of liquid inside a pipe.", metaDescription: "Free online Pipe Volume Calculator. Calculate the volume of liquid inside a pipe. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "sand-calculator", title: "Sand Calculator", description: "Estimate sand needed for any construction project.", metaDescription: "Free online Sand Calculator. Estimate sand needed for any construction project. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "excavation-calculator", title: "Excavation Calculator", description: "Calculate excavation volume for any site.", metaDescription: "Free online Excavation Calculator. Calculate excavation volume for any site. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "stair-calculator", title: "Stair Calculator", description: "Design stairs with proper rise, run, and dimensions.", metaDescription: "Free online Stair Calculator. Design stairs with proper rise, run, and dimensions. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "material-cost-calculator", title: "Material Cost Calculator", description: "Estimate total material costs for any project.", metaDescription: "Free online Material Cost Calculator. Estimate total material costs for any project. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "deck-area-calculator", title: "Deck Area Calculator", description: "Calculate deck area and materials needed.", metaDescription: "Free online Deck Area Calculator. Calculate deck area and materials needed. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "plaster-calculator", title: "Plaster Calculator", description: "Estimate plaster or drywall needed for walls.", metaDescription: "Free online Plaster Calculator. Estimate plaster or drywall needed for walls. No signup required.", category: "Construction & DIY", implemented: true },
      { slug: "insulation-calculator", title: "Insulation Calculator", description: "Estimate insulation coverage, waste, and the number of packs needed for walls, attics, floors, and ceilings.", metaDescription: "Free insulation calculator. Estimate insulation coverage, waste allowance, and packs needed for your project.", category: "Construction & DIY", implemented: true },
      { slug: "concrete-block-calculator", title: "Concrete Block Calculator", description: "Calculate how many concrete blocks are needed for a wall based on wall size, block dimensions, and waste.", metaDescription: "Free concrete block calculator. Estimate wall blocks, block courses, and waste-adjusted order quantity online.", category: "Construction & DIY", implemented: true },
      { slug: "paver-calculator", title: "Paver Calculator", description: "Estimate pavers for patios, walkways, and driveways using project area, paver size, and waste.", metaDescription: "Free paver calculator. Estimate patio and driveway pavers with project area and waste included.", category: "Construction & DIY", implemented: true },
      { slug: "bitumen-calculator", title: "Bitumen Calculator", description: "Estimate bitumen quantity from project area, application rate, and number of coats.", metaDescription: "Free bitumen calculator. Estimate bitumen quantity by area, application rate, coats, and tonnage.", category: "Construction & DIY", implemented: true },
      { slug: "pool-salt-calculator", title: "Pool Salt Calculator", description: "Calculate how much salt to add to a saltwater pool from pool size and current versus target ppm.", metaDescription: "Free pool salt calculator. Estimate pool salt needed from pool volume and target salt level.", category: "Construction & DIY", implemented: true },
      { slug: "rebar-calculator", title: "Rebar Calculator", description: "Calculate rebar quantity and spacing for concrete projects.", metaDescription: "Free rebar calculator. Calculate rebar needs for construction online.", category: "Construction & DIY", implemented: true },
      { slug: "drywall-calculator", title: "Drywall Calculator", description: "Estimate drywall sheets needed for walls and ceilings.", metaDescription: "Free drywall calculator. Calculate sheets of drywall needed online.", category: "Construction & DIY", implemented: true },
      { slug: "wallpaper-calculator", title: "Wallpaper Calculator", description: "Calculate wallpaper rolls needed for any room.", metaDescription: "Free wallpaper calculator. Estimate wallpaper rolls needed online.", category: "Construction & DIY", implemented: true },
      { slug: "mulch-calculator", title: "Mulch Calculator", description: "Estimate mulch volume needed for garden beds.", metaDescription: "Free mulch calculator. Calculate mulch needed for landscaping online.", category: "Construction & DIY", implemented: true },
      { slug: "soil-calculator", title: "Soil Calculator", description: "Calculate soil volume needed for raised beds or gardens.", metaDescription: "Free soil calculator. Calculate soil volume for garden projects online.", category: "Construction & DIY", implemented: true },
      { slug: "solar-panel-calculator", title: "Solar Panel Calculator", description: "Estimate solar panel count, system size, and roof area from monthly electricity usage.", metaDescription: "Free solar panel calculator. Estimate panels needed, system size, output, and roof area online.", category: "Construction & DIY", implemented: true },
      { slug: "electrical-load-calculator", title: "Electrical Load Calculator", description: "Calculate connected electrical load, current draw, and breaker size from a simple load schedule.", metaDescription: "Free electrical load calculator. Estimate connected load, demand load, current, and breaker size online.", category: "Construction & DIY", implemented: true },
    ]
  },
  {
    id: "productivity",
    name: "Productivity & Text",
    description: "Text tools, generators, and everyday productivity utilities",
    color: "bg-teal-500",
    bgColor: "from-teal-500 to-cyan-400",
    tools: [
      { slug: "online-word-counter", title: "Word Counter", description: "Count words, characters, sentences, and reading time.", metaDescription: "Count words and characters in text. Free online word counter with reading time estimate.", category: "Productivity & Text", implemented: true },
      { slug: "random-name-generator", title: "Random Name Generator", description: "Generate random first, last, or full names for any use.", metaDescription: "Generate random names online. Free random name generator for characters, projects, and more.", category: "Productivity & Text", implemented: true },
      { slug: "username-generator", title: "Username Generator", description: "Create unique, catchy usernames for any platform.", metaDescription: "Generate unique usernames online. Free username generator tool.", category: "Productivity & Text", implemented: true },
      { slug: "dice-roller", title: "Dice Roller", description: "Roll one or multiple dice with any number of sides.", metaDescription: "Roll virtual dice online. Free dice roller for any number of sides.", category: "Productivity & Text", implemented: true },
      { slug: "coin-flip", title: "Coin Flip Tool", description: "Flip a virtual coin to get heads or tails.", metaDescription: "Flip a virtual coin online. Free online heads or tails coin flip tool.", category: "Productivity & Text", implemented: true },
      { slug: "random-color-generator", title: "Random Color Generator", description: "Generate random colors with HEX and RGB values.", metaDescription: "Generate random colors. Free online random color generator with HEX codes.", category: "Productivity & Text", implemented: true },
      { slug: "case-converter", title: "Case Converter", description: "Convert text to uppercase, lowercase, title case, and more.", metaDescription: "Convert text case online. Free case converter: uppercase, lowercase, title case, camelCase.", category: "Productivity & Text", implemented: true },
      { slug: "text-reverser", title: "Text Reverser Tool", description: "Reverse any string, sentence, or block of text.", metaDescription: "Reverse text online. Free text reverser tool.", category: "Productivity & Text", implemented: true },
      { slug: "duplicate-line-remover", title: "Duplicate Line Remover", description: "Remove duplicate lines from any block of text.", metaDescription: "Remove duplicate lines from text. Free online duplicate line remover tool.", category: "Productivity & Text", implemented: true },
      { slug: "alphabetical-sort", title: "Alphabetical Sort Tool", description: "Sort a list of words or lines in alphabetical order.", metaDescription: "Sort text alphabetically online. Free alphabetical sorter tool.", category: "Productivity & Text", implemented: true },
      { slug: "palindrome-checker", title: "Palindrome Checker", description: "Check if a word or phrase is a palindrome.", metaDescription: "Check if text is a palindrome. Free online palindrome checker.", category: "Productivity & Text", implemented: true },
      { slug: "hashtag-generator", title: "Hashtag Generator Tool", description: "Generate relevant hashtags for social media posts.", metaDescription: "Generate hashtags for Instagram, Twitter, TikTok. Free hashtag generator tool.", category: "Productivity & Text", implemented: true },
      { slug: "word-frequency-counter", title: "Word Frequency Counter", description: "Analyze how often each word appears in a text.", metaDescription: "Count word frequency in text. Free word frequency analyzer tool.", category: "Productivity & Text", implemented: true },
      { slug: "random-letter-generator", title: "Random Letter Generator", description: "Generate random letters for games or codes.", metaDescription: "Free online Random Letter Generator. Generate random letters for games or codes. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "random-picker-tool", title: "Random Picker Tool", description: "Pick random items from any custom list.", metaDescription: "Free online Random Picker Tool. Pick random items from any custom list. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "spin-wheel-generator", title: "Spin Wheel Generator", description: "Create a custom spin wheel for random selection.", metaDescription: "Free online Spin Wheel Generator. Create a custom spin wheel for random selection. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "character-counter-tool", title: "Character Counter Tool", description: "Count characters with and without spaces in text.", metaDescription: "Free online Character Counter Tool. Count characters with and without spaces in text. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "line-counter-tool", title: "Line Counter Tool", description: "Count the number of lines in any text or code.", metaDescription: "Free online Line Counter Tool. Count the number of lines in any text or code. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "remove-extra-spaces-tool", title: "Remove Extra Spaces Tool", description: "Clean up extra whitespace from any text.", metaDescription: "Free online Remove Extra Spaces Tool. Clean up extra whitespace from any text. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "sort-text-lines-tool", title: "Sort Text Lines Tool", description: "Sort lines of text alphabetically or numerically.", metaDescription: "Free online Sort Text Lines Tool. Sort lines of text alphabetically or numerically. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "list-randomizer-tool", title: "List Randomizer Tool", description: "Randomize the order of items in any list.", metaDescription: "Free online List Randomizer Tool. Randomize the order of items in any list. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "text-formatter-tool", title: "Text Formatter Tool", description: "Format and beautify text with various options.", metaDescription: "Free online Text Formatter Tool. Format and beautify text with various options. No signup required.", category: "Productivity & Text", implemented: true },
      { slug: "uuid-generator", title: "UUID Generator", description: "Generate unique UUIDs (v4) for software development.", metaDescription: "Free UUID generator. Generate random UUIDs online.", category: "Productivity & Text", implemented: true },
      { slug: "json-formatter", title: "JSON Formatter", description: "Format, validate, and beautify JSON data instantly.", metaDescription: "Free JSON formatter. Validate and beautify JSON data online.", category: "Productivity & Text", implemented: true },
      { slug: "base64-encoder-decoder", title: "Base64 Encoder Decoder", description: "Encode or decode text and data using Base64.", metaDescription: "Free Base64 encoder decoder. Convert to and from Base64 online.", category: "Productivity & Text", implemented: true },
      { slug: "love-calculator", title: "Love Calculator", description: "Generate a fun compatibility score and ship name from two names.", metaDescription: "Free online love calculator. Enter two names to get a fun compatibility score, match band, and ship name instantly.", category: "Productivity & Text", implemented: true },
    ]
  },
  {
    id: "education",
    name: "Student & Education",
    description: "Grade calculators, GPA tools, and study helpers",
    color: "bg-indigo-500",
    bgColor: "from-indigo-500 to-blue-500",
    tools: [
      { slug: "online-gpa-calculator", title: "GPA Calculator", description: "Calculate your GPA based on grades and credit hours.", metaDescription: "Calculate your GPA online. Free GPA calculator for college and high school students.", category: "Student & Education", implemented: true },
      { slug: "grade-calculator", title: "Grade Calculator", description: "Calculate your current grade based on assignments.", metaDescription: "Calculate your course grade. Free online grade calculator for students.", category: "Student & Education", implemented: true },
      { slug: "weighted-grade-calculator", title: "Weighted Grade Calculator", description: "Calculate course grades from quizzes, homework, projects, and exams with custom weights.", metaDescription: "Free weighted grade calculator. Calculate your current weighted course grade and remaining course weight online.", category: "Student & Education", implemented: true },
      { slug: "final-grade-calculator", title: "Final Grade Calculator", description: "Find the final exam score needed to reach your target course grade.", metaDescription: "Free final grade calculator. See what score you need on your final exam to hit your target grade.", category: "Student & Education", implemented: true },
      { slug: "percentage-grade-calculator", title: "Percentage Grade Calculator", description: "Convert scores to percentage grades, letter grades, and GPA values instantly.", metaDescription: "Free percentage grade calculator. Convert marks to percentage, letter grade, and GPA equivalent online.", category: "Student & Education", implemented: true },
      { slug: "attendance-percentage-calculator", title: "Attendance Percentage Calculator", description: "Calculate class attendance percentage and plan how many classes you need to attend next.", metaDescription: "Free attendance percentage calculator. Check your class attendance rate and target recovery instantly.", category: "Student & Education", implemented: true },
      { slug: "reading-speed-calculator", title: "Reading Speed Calculator", description: "Measure your reading speed in words per minute and estimate reading time for longer passages.", metaDescription: "Free reading speed calculator. Measure words per minute and estimate reading time for assignments and articles.", category: "Student & Education", implemented: true },
      { slug: "marks-percentage-calculator", title: "Marks Percentage Calculator", description: "Convert obtained marks to percentage and estimate marks needed for a target percentage.", metaDescription: "Free marks percentage calculator. Convert obtained marks to percentage and calculate target marks online.", category: "Student & Education", implemented: true },
      { slug: "marks-to-gpa-converter", title: "Marks to GPA Converter", description: "Convert percentage marks to GPA on any scale.", metaDescription: "Convert marks to GPA. Free online marks to GPA converter.", category: "Student & Education", implemented: true },
      { slug: "class-average-calculator", title: "Class Average Calculator", description: "Calculate the average score, highest score, lowest score, and pass rate for a class or group.", metaDescription: "Free class average calculator. Calculate class average, highest score, lowest score, and pass rate online.", category: "Student & Education", implemented: true },
      { slug: "score-calculator", title: "Score Calculator", description: "Calculate total earned points, total possible points, and overall percentage across assessments.", metaDescription: "Free score calculator. Add quiz, assignment, and test scores to calculate your overall percentage.", category: "Student & Education", implemented: true },
      { slug: "study-planner-calculator", title: "Study Planner Calculator", description: "Plan daily study schedules from your remaining topics, time, and sessions per day.", metaDescription: "Free study planner calculator. Build a daily study plan from topics left, days left, and study hours.", category: "Student & Education", implemented: true },
      { slug: "homework-time-calculator", title: "Homework Time Calculator", description: "Estimate total homework time, break time, and finish time for your daily task list.", metaDescription: "Free homework time calculator. Estimate homework duration, breaks, and finish time online.", category: "Student & Education", implemented: true },
      { slug: "exam-countdown-timer", title: "Exam Countdown Timer", description: "Track days remaining until exam dates.", metaDescription: "Free online Exam Countdown Timer. Track days remaining until exam dates. No signup required.", category: "Student & Education", implemented: true },
      { slug: "assignment-grade-calculator", title: "Assignment Grade Calculator", description: "Calculate grades for weighted assignments.", metaDescription: "Free online Assignment Grade Calculator. Calculate grades for weighted assignments. No signup required.", category: "Student & Education", implemented: true },
      { slug: "semester-planner-tool", title: "Semester Planner Tool", description: "Plan courses and credits for the semester.", metaDescription: "Free online Semester Planner Tool. Plan courses and credits for the semester. No signup required.", category: "Student & Education", implemented: true },
      { slug: "quiz-score-calculator", title: "Quiz Score Calculator", description: "Calculate quiz scores and averages.", metaDescription: "Free online Quiz Score Calculator. Calculate quiz scores and averages. No signup required.", category: "Student & Education", implemented: true },
      { slug: "flashcard-timer-tool", title: "Flashcard Timer Tool", description: "Time your flashcard study sessions.", metaDescription: "Free online Flashcard Timer Tool. Time your flashcard study sessions. No signup required.", category: "Student & Education", implemented: true },
      { slug: "exam-score-predictor", title: "Exam Score Predictor", description: "Predict exam scores based on study patterns.", metaDescription: "Free online Exam Score Predictor. Predict exam scores based on study patterns. No signup required.", category: "Student & Education", implemented: true },
      { slug: "study-hours-tracker", title: "Study Hours Tracker", description: "Track and analyze study hours over time.", metaDescription: "Free online Study Hours Tracker. Track and analyze study hours over time. No signup required.", category: "Student & Education", implemented: true },
      { slug: "grade-improvement-calculator", title: "Grade Improvement Calculator", description: "Calculate what grades you need to improve GPA.", metaDescription: "Free online Grade Improvement Calculator. Calculate what grades you need to improve GPA. No signup required.", category: "Student & Education", implemented: true },
      { slug: "test-score-analyzer", title: "Test Score Analyzer", description: "Analyze test scores with statistics and trends.", metaDescription: "Free online Test Score Analyzer. Analyze test scores with statistics and trends. No signup required.", category: "Student & Education", implemented: true },
      { slug: "learning-time-calculator", title: "Learning Time Calculator", description: "Estimate time needed to learn a new skill.", metaDescription: "Free online Learning Time Calculator. Estimate time needed to learn a new skill. No signup required.", category: "Student & Education", implemented: true },
      { slug: "school-schedule-planner", title: "School Schedule Planner", description: "Create and manage weekly school schedules.", metaDescription: "Free online School Schedule Planner. Create and manage weekly school schedules. No signup required.", category: "Student & Education", implemented: true },
      { slug: "revision-planner-tool", title: "Revision Planner Tool", description: "Plan revision sessions before exams.", metaDescription: "Free online Revision Planner Tool. Plan revision sessions before exams. No signup required.", category: "Student & Education", implemented: true },
      { slug: "cgpa-calculator", title: "CGPA Calculator", description: "Calculate Cumulative GPA across multiple semesters.", metaDescription: "Free CGPA calculator. Calculate cumulative GPA across semesters online.", category: "Student & Education", implemented: true },
      { slug: "sat-score-calculator", title: "SAT Score Calculator", description: "Estimate your SAT score and percentile ranking.", metaDescription: "Free SAT score calculator. Estimate SAT scores and percentiles online.", category: "Student & Education", implemented: true },
      { slug: "typing-speed-test", title: "Typing Speed Test", description: "Test your typing speed in words per minute.", metaDescription: "Free typing speed test. Measure your WPM typing speed online.", category: "Student & Education", implemented: true },
      { slug: "scholarship-calculator", title: "Scholarship Calculator", description: "Calculate potential scholarship savings for college.", metaDescription: "Free scholarship calculator. Estimate college scholarship amounts online.", category: "Student & Education", implemented: true },
      { slug: "college-gpa-calculator", title: "College GPA Calculator", description: "Calculate your college GPA with weighted credits.", metaDescription: "Free college GPA calculator. Calculate weighted GPA for college courses.", category: "Student & Education", implemented: true },
      { slug: "snow-day-calculator", title: "Snow Day Calculator", description: "Estimate the chance of a snow day from weather and road conditions.", metaDescription: "Free online snow day calculator. Estimate school closure probability from snowfall, ice, temperature, wind, and road conditions.", category: "Student & Education", implemented: true },
    ]
  },
  {
    id: "gaming",
    name: "Gaming Calculators",
    description: "Game-specific tools for popular titles and platforms",
    color: "bg-pink-500",
    bgColor: "from-pink-500 to-rose-500",
    tools: [
      { slug: "blox-fruits-calculator", title: "Blox Fruits Calculator", description: "Calculate Blox Fruits values, trades, and upgrades.", metaDescription: "Blox Fruits value calculator. Calculate trade values and upgrades in Blox Fruits.", category: "Gaming Calculators", implemented: true },
      { slug: "blox-fruits-trade-calculator", title: "Blox Fruits Trade Calculator", description: "Check if a Blox Fruits trade is fair or overpaying.", metaDescription: "Blox Fruits trade value calculator. Check if trades are fair in Blox Fruits Roblox.", category: "Gaming Calculators", implemented: true },
      { slug: "roblox-tax-calculator", title: "Roblox Tax Calculator", description: "Calculate how much Robux you receive after the 30% tax.", metaDescription: "Calculate Roblox marketplace tax. Free Roblox tax calculator for sellers.", category: "Gaming Calculators", implemented: true },
      { slug: "minecraft-circle-calculator", title: "Minecraft Circle Calculator", description: "Generate pixel-perfect circles for Minecraft builds.", metaDescription: "Create Minecraft circle patterns. Free Minecraft circle generator calculator.", category: "Gaming Calculators", implemented: true },
      { slug: "valorant-sensitivity-calculator", title: "Valorant Sensitivity Calculator", description: "Convert your mouse sensitivity between FPS games.", metaDescription: "Convert Valorant sensitivity settings. Free sensitivity converter for FPS games.", category: "Gaming Calculators", implemented: true },
      { slug: "fortnite-dpi-calculator", title: "Fortnite DPI Calculator", description: "Calculate your effective DPI for Fortnite and other games.", metaDescription: "Calculate effective DPI for Fortnite. Free gaming DPI calculator.", category: "Gaming Calculators", implemented: true },
      { slug: "xp-level-calculator", title: "XP Level Calculator", description: "Calculate XP needed to reach the next level in any game.", metaDescription: "Calculate XP needed for next level. Free game XP level calculator.", category: "Gaming Calculators", implemented: true },
      { slug: "clash-of-clans-upgrade-calculator", title: "Clash of Clans Upgrade Calculator", description: "Plan your CoC upgrades with cost and time estimates.", metaDescription: "Clash of Clans upgrade cost and time calculator. Plan your CoC upgrades.", category: "Gaming Calculators", implemented: true },
      { slug: "damage-calculator", title: "Damage Calculator", description: "Calculate damage output based on stats and modifiers.", metaDescription: "Calculate game damage with modifiers and buffs. Free game damage calculator.", category: "Gaming Calculators", implemented: true },
      { slug: "game-currency-converter", title: "Game Currency Converter", description: "Convert real money to in-game currency for popular games.", metaDescription: "Convert real money to game currency. Free game currency converter.", category: "Gaming Calculators", implemented: true },
      { slug: "genshin-impact-calculator", title: "Genshin Impact Calculator", description: "Calculate damage, artifacts, and builds for Genshin Impact.", metaDescription: "Free Genshin Impact calculator. Calculate damage and artifact stats.", category: "Gaming Calculators", implemented: true },
      { slug: "cs2-sensitivity-calculator", title: "CS2 Sensitivity Calculator", description: "Convert mouse sensitivity between CS2 and other FPS games.", metaDescription: "Free CS2 sensitivity calculator. Convert sensitivity settings between FPS games.", category: "Gaming Calculators", implemented: true },
      { slug: "pokemon-iv-calculator", title: "Pokemon IV Calculator", description: "Calculate Individual Values for your Pokemon stats.", metaDescription: "Free Pokemon IV calculator. Check IVs for any Pokemon online.", category: "Gaming Calculators", implemented: true },
      { slug: "dnd-dice-roller", title: "D&D Dice Roller", description: "Roll any combination of dice for tabletop RPG games.", metaDescription: "Free D&D dice roller. Roll d4, d6, d8, d10, d12, d20 dice online.", category: "Gaming Calculators", implemented: true },
      { slug: "gaming-fps-calculator", title: "Gaming FPS Calculator", description: "Calculate expected FPS based on your hardware specs.", metaDescription: "Free gaming FPS calculator. Estimate FPS for your PC specs online.", category: "Gaming Calculators", implemented: true },
      { slug: "esports-earnings-calculator", title: "Esports Earnings Calculator", description: "Track and calculate esports tournament prize earnings.", metaDescription: "Free esports earnings calculator. Track prize pool winnings online.", category: "Gaming Calculators", implemented: true },
    ]
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Resize, compress, convert, and edit images right in your browser",
    color: "bg-cyan-500",
    bgColor: "from-cyan-500 to-blue-400",
    tools: [
      { slug: "image-resizer", title: "Image Resizer", description: "Resize images by exact pixel dimensions or percentage with live preview and browser-side export.", metaDescription: "Free image resizer. Resize images by pixels or percentage in your browser with instant preview and download.", category: "Image Tools", implemented: true },
      { slug: "image-compressor", title: "Image Compressor", description: "Compress image files with quality and width controls to reduce upload size and improve delivery speed.", metaDescription: "Free image compressor. Reduce image file size in your browser with quality, width, and format controls.", category: "Image Tools", implemented: true },
      { slug: "image-cropper", title: "Image Cropper", description: "Crop images to custom rectangles or common aspect ratios like square, 4:3, and 16:9.", metaDescription: "Free image cropper. Crop images by coordinates or aspect ratio and download the trimmed result instantly.", category: "Image Tools", implemented: true },
      { slug: "image-format-converter", title: "Image Format Converter", description: "Convert images between PNG, JPG, and WebP formats with client-side preview and export.", metaDescription: "Free image format converter. Convert PNG, JPG, and WebP images in your browser with instant preview.", category: "Image Tools", implemented: true },
      { slug: "image-to-base64", title: "Image to Base64 Converter", description: "Encode image files as Data URLs or raw Base64 strings for embedding and API workflows.", metaDescription: "Free image to Base64 converter. Encode uploaded images as Data URLs or raw Base64 text in your browser.", category: "Image Tools", implemented: true },
      { slug: "base64-to-image", title: "Base64 to Image Converter", description: "Decode Base64 image strings into previewable and downloadable image files in the browser.", metaDescription: "Free Base64 to image converter. Decode Base64 strings into previewable downloadable image files online.", category: "Image Tools", implemented: true },
      { slug: "image-rotate-flip", title: "Image Rotate & Flip", description: "Rotate images by any angle or flip horizontally and vertically.", metaDescription: "Free online image rotate and flip tool. Rotate and mirror images in your browser.", category: "Image Tools", implemented: true },
      { slug: "image-color-picker", title: "Image Color Picker", description: "Pick any color from an uploaded image and get HEX, RGB, HSL values.", metaDescription: "Free image color picker. Extract colors from any image with HEX, RGB, and HSL values.", category: "Image Tools", implemented: true },
      { slug: "image-watermark", title: "Image Watermark Tool", description: "Add text or image watermarks to your photos.", metaDescription: "Free online image watermark tool. Add text or image watermarks to photos.", category: "Image Tools", implemented: true },
      { slug: "image-filter-editor", title: "Image Filter Editor", description: "Apply image filters with live preview, presets, and browser-side export.", metaDescription: "Free online image filter editor. Apply brightness, contrast, blur, grayscale, and more filters in your browser.", category: "Image Tools", implemented: true },
      { slug: "image-to-png", title: "Image to PNG Converter", description: "Convert any image format to PNG with transparency support.", metaDescription: "Free image to PNG converter. Convert JPG, WebP, BMP to PNG online.", category: "Image Tools", implemented: true },
      { slug: "image-to-jpg", title: "Image to JPG Converter", description: "Convert any image format to JPG with quality control.", metaDescription: "Free image to JPG converter. Convert PNG, WebP, BMP to JPG online.", category: "Image Tools", implemented: true },
      { slug: "png-to-webp", title: "PNG to WebP Converter", description: "Convert PNG images to modern WebP format for smaller files.", metaDescription: "Free PNG to WebP converter. Convert PNG to WebP for faster web pages.", category: "Image Tools", implemented: true },
      { slug: "svg-to-png", title: "SVG to PNG Converter", description: "Convert SVG vector graphics to PNG raster images.", metaDescription: "Free SVG to PNG converter. Convert SVG files to PNG images online.", category: "Image Tools", implemented: true },
      { slug: "image-background-remover", title: "Background Remover", description: "Remove simple image backgrounds in your browser with live preview and transparent PNG export.", metaDescription: "Free image background remover. Remove simple backgrounds from photos in your browser with live preview and PNG export.", category: "Image Tools", implemented: true },
      { slug: "image-collage-maker", title: "Image Collage Maker", description: "Build image collages with layout presets, spacing controls, and browser-side PNG export.", metaDescription: "Free image collage maker. Create photo collages with custom layouts, spacing, and PNG export online.", category: "Image Tools", implemented: true },
      { slug: "qr-code-generator", title: "QR Code Generator", description: "Generate QR codes for URLs, text, Wi-Fi, and more.", metaDescription: "Free QR code generator. Create QR codes for links, text, and Wi-Fi online.", category: "Image Tools", implemented: true },
      { slug: "meme-generator", title: "Meme Generator", description: "Add text captions to images to create memes.", metaDescription: "Free meme generator. Add top and bottom text to any image online.", category: "Image Tools", implemented: true },
      { slug: "favicon-generator", title: "Favicon Generator", description: "Generate favicons in multiple sizes from any image.", metaDescription: "Free favicon generator. Create favicon.ico and PNG favicons from any image.", category: "Image Tools", implemented: true },
      { slug: "image-pixel-counter", title: "Image Pixel Counter", description: "Inspect exact image dimensions, total pixels, megapixels, and aspect ratio in your browser.", metaDescription: "Free image pixel counter. Get dimensions, megapixels, aspect ratio, and pixel count online.", category: "Image Tools", implemented: true },
    ]
  },
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress, and convert PDF files in your browser",
    color: "bg-rose-500",
    bgColor: "from-rose-500 to-red-400",
    tools: [
      { slug: "pdf-merge", title: "PDF Merge", description: "Combine multiple PDF files into a single document.", metaDescription: "Free online PDF merger. Combine multiple PDFs into one file in your browser.", category: "PDF Tools", implemented: true },
      { slug: "pdf-split", title: "PDF Split", description: "Split a PDF into separate files by page ranges.", metaDescription: "Free online PDF splitter. Extract pages from PDFs into separate files.", category: "PDF Tools", implemented: true },
      { slug: "pdf-compress", title: "PDF Compressor", description: "Reduce PDF file size while maintaining document quality.", metaDescription: "Free online PDF compressor. Reduce PDF file size without losing quality.", category: "PDF Tools", implemented: true },
      { slug: "image-to-pdf", title: "Image to PDF Converter", description: "Convert one or multiple images into a PDF document.", metaDescription: "Free image to PDF converter. Convert JPG, PNG images to PDF online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-to-image", title: "PDF to Image Converter", description: "Convert PDF pages to JPG or PNG images.", metaDescription: "Free PDF to image converter. Convert PDF pages to JPG or PNG online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-rotate", title: "PDF Page Rotator", description: "Rotate individual pages or all pages in a PDF.", metaDescription: "Free online PDF page rotator. Rotate PDF pages by 90, 180, or 270 degrees.", category: "PDF Tools", implemented: true },
      { slug: "pdf-page-remover", title: "PDF Page Remover", description: "Remove specific pages from a PDF document.", metaDescription: "Free PDF page remover. Delete unwanted pages from PDFs online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-page-reorder", title: "PDF Page Reorder", description: "Rearrange the order of pages in your PDF with drag and drop.", metaDescription: "Free PDF page reorder tool. Rearrange PDF pages with drag and drop.", category: "PDF Tools", implemented: true },
      { slug: "pdf-watermark", title: "PDF Watermark Tool", description: "Add text or image watermarks to PDF documents.", metaDescription: "Free PDF watermark tool. Add custom watermarks to PDFs online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-password-protect", title: "PDF Password Protector", description: "Add password encryption to protect your PDF files.", metaDescription: "Free PDF password protector. Encrypt PDFs with password protection online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-unlock", title: "PDF Unlock Tool", description: "Remove password protection from PDF files.", metaDescription: "Free PDF unlocker. Remove password from protected PDFs online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-to-text", title: "PDF to Text Extractor", description: "Extract all text content from PDF documents.", metaDescription: "Free PDF to text extractor. Extract text from PDF files online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-page-number", title: "PDF Page Number Adder", description: "Add page numbers to any position in your PDF.", metaDescription: "Free PDF page number tool. Add page numbers to PDFs online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-header-footer", title: "PDF Header & Footer", description: "Add custom headers and footers to PDF documents.", metaDescription: "Free PDF header and footer tool. Add headers and footers to PDFs.", category: "PDF Tools", implemented: true },
      { slug: "jpg-to-pdf", title: "JPG to PDF Converter", description: "Convert JPG images into a multi-page PDF document.", metaDescription: "Free JPG to PDF converter. Convert JPG images to PDF online.", category: "PDF Tools", implemented: true },
      { slug: "pdf-sign", title: "PDF Signature Tool", description: "Draw or upload your signature and place it on PDF documents.", metaDescription: "Free PDF signature tool. Sign PDF documents online in your browser.", category: "PDF Tools", implemented: true },
    ]
  },
  {
    id: "developer",
    name: "Developer Tools",
    description: "JSON formatters, code minifiers, regex testers, and encoding utilities",
    color: "bg-slate-500",
    bgColor: "from-slate-600 to-gray-400",
    tools: [
      { slug: "online-json-formatter", title: "JSON Formatter & Beautifier", description: "Format, beautify, and validate JSON data with syntax highlighting.", metaDescription: "Free online JSON formatter and beautifier. Format, validate, and pretty-print JSON data.", category: "Developer Tools", implemented: true },
      { slug: "online-json-validator", title: "JSON Validator", description: "Validate JSON syntax and find errors with line numbers.", metaDescription: "Free JSON validator. Check if your JSON is valid and find syntax errors.", category: "Developer Tools", implemented: true },
      { slug: "online-json-to-csv", title: "JSON to CSV Converter", description: "Convert JSON arrays to CSV format for spreadsheets.", metaDescription: "Free JSON to CSV converter. Convert JSON data to CSV files online.", category: "Developer Tools", implemented: true },
      { slug: "csv-to-json-converter", title: "CSV to JSON Converter", description: "Convert CSV data to JSON format instantly.", metaDescription: "Free CSV to JSON converter. Convert CSV files to JSON online.", category: "Developer Tools", implemented: true },
      { slug: "json-minifier", title: "JSON Minifier", description: "Minify JSON by removing whitespace and reducing file size.", metaDescription: "Free JSON minifier. Compress JSON data by removing whitespace online.", category: "Developer Tools", implemented: true },
      { slug: "online-html-formatter", title: "HTML Formatter & Beautifier", description: "Format and beautify messy HTML code with proper indentation.", metaDescription: "Free HTML formatter and beautifier. Pretty-print HTML code online.", category: "Developer Tools", implemented: true },
      { slug: "online-html-minifier", title: "HTML Minifier", description: "Minify HTML code to reduce page load size.", metaDescription: "Free HTML minifier. Compress HTML code by removing whitespace online.", category: "Developer Tools", implemented: true },
      { slug: "online-css-minifier", title: "CSS Minifier", description: "Minify CSS to reduce stylesheet file size.", metaDescription: "Free CSS minifier. Compress CSS code online to reduce file size.", category: "Developer Tools", implemented: true },
      { slug: "online-css-formatter", title: "CSS Formatter & Beautifier", description: "Format and beautify minified CSS with proper indentation.", metaDescription: "Free CSS formatter and beautifier. Pretty-print CSS code online.", category: "Developer Tools", implemented: true },
      { slug: "online-javascript-minifier", title: "JavaScript Minifier", description: "Minify JavaScript code to reduce file size.", metaDescription: "Free JavaScript minifier. Compress JS code online for faster loading.", category: "Developer Tools", implemented: true },
      { slug: "online-javascript-formatter", title: "JavaScript Formatter", description: "Format and beautify JavaScript code with proper styling.", metaDescription: "Free JavaScript formatter and beautifier. Pretty-print JS code online.", category: "Developer Tools", implemented: true },
      { slug: "online-regex-tester", title: "Regex Tester", description: "Test regular expressions with real-time matching and explanation.", metaDescription: "Free online regex tester. Test and debug regular expressions with live matching.", category: "Developer Tools", implemented: true },
      { slug: "online-base64-encoder-decoder", title: "Base64 Encoder & Decoder", description: "Encode text to Base64 or decode Base64 strings.", metaDescription: "Free Base64 encoder and decoder. Convert text to and from Base64 online.", category: "Developer Tools", implemented: true },
      { slug: "url-encoder-decoder", title: "URL Encoder & Decoder", description: "Encode or decode URLs and query string parameters.", metaDescription: "Free URL encoder and decoder. Encode and decode URLs online.", category: "Developer Tools", implemented: true },
      { slug: "html-entity-encoder", title: "HTML Entity Encoder & Decoder", description: "Convert special characters to HTML entities and back.", metaDescription: "Free HTML entity encoder and decoder. Convert characters to HTML entities.", category: "Developer Tools", implemented: true },
      { slug: "online-jwt-decoder", title: "JWT Decoder", description: "Decode and inspect JSON Web Tokens without verification.", metaDescription: "Free JWT decoder. Decode and inspect JWT tokens online.", category: "Developer Tools", implemented: true },
      { slug: "xml-formatter", title: "XML Formatter & Beautifier", description: "Format and beautify XML data with proper indentation.", metaDescription: "Free XML formatter and beautifier. Pretty-print XML data online.", category: "Developer Tools", implemented: true },
      { slug: "online-sql-formatter", title: "SQL Formatter", description: "Format and beautify SQL queries with syntax highlighting.", metaDescription: "Free SQL formatter. Format and beautify SQL queries online.", category: "Developer Tools", implemented: true },
      { slug: "online-markdown-previewer", title: "Markdown Previewer", description: "Write Markdown and preview the rendered output in real-time.", metaDescription: "Free Markdown previewer. Write and preview Markdown in real-time online.", category: "Developer Tools", implemented: true },
      { slug: "diff-checker", title: "Text Diff Checker", description: "Compare two texts and highlight the differences side by side.", metaDescription: "Free text diff checker. Compare two texts and find differences online.", category: "Developer Tools", implemented: true },
      { slug: "slug-generator", title: "URL Slug Generator", description: "Convert any text into a URL-friendly slug.", metaDescription: "Free URL slug generator. Convert text to SEO-friendly URL slugs.", category: "Developer Tools", implemented: true },
      { slug: "cron-expression-generator", title: "Cron Expression Generator", description: "Build and validate cron schedule expressions visually.", metaDescription: "Free cron expression generator. Build cron schedules with a visual editor.", category: "Developer Tools", implemented: true },
      { slug: "online-unix-timestamp-converter", title: "Online Unix Timestamp Converter", description: "Convert Unix timestamps to human-readable dates and back.", metaDescription: "Free online Unix timestamp converter. Convert epoch timestamps to dates and back instantly.", category: "Developer Tools", implemented: true },
      { slug: "online-uuid-generator", title: "Online UUID Generator", description: "Generate random UUIDs (v4) for databases and applications.", metaDescription: "Free online UUID generator. Generate random UUID v4 identifiers instantly.", category: "Developer Tools", implemented: true },
      { slug: "online-lorem-ipsum-generator", title: "Online Lorem Ipsum Generator", description: "Generate placeholder text for prototypes, mockups, and UI layouts.", metaDescription: "Free online Lorem Ipsum generator. Create placeholder text by paragraphs, sentences, or words.", category: "Developer Tools", implemented: true },
      { slug: "color-code-converter", title: "Color Code Converter", description: "Convert between HEX, RGB, HSL, and CMYK color formats.", metaDescription: "Free color code converter. Convert between HEX, RGB, HSL, CMYK online.", category: "Developer Tools", implemented: true },
      { slug: "online-hash-generator", title: "Hash Generator (MD5, SHA)", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.", metaDescription: "Free hash generator. Generate MD5, SHA-1, SHA-256 hashes online.", category: "Developer Tools", implemented: true },
      { slug: "html-to-markdown", title: "HTML to Markdown Converter", description: "Convert HTML code to Markdown format.", metaDescription: "Free HTML to Markdown converter. Convert HTML to Markdown online.", category: "Developer Tools", implemented: true },
      { slug: "markdown-to-html", title: "Markdown to HTML Converter", description: "Convert Markdown text to HTML code.", metaDescription: "Free Markdown to HTML converter. Convert Markdown to HTML online.", category: "Developer Tools", implemented: true },
      { slug: "json-to-xml", title: "JSON to XML Converter", description: "Convert JSON data to XML format.", metaDescription: "Free JSON to XML converter. Transform JSON to XML online.", category: "Developer Tools", implemented: true },
      { slug: "yaml-to-json", title: "YAML to JSON Converter", description: "Convert YAML data to JSON format and vice versa.", metaDescription: "Free YAML to JSON converter. Transform YAML to JSON online.", category: "Developer Tools", implemented: true },
      { slug: "string-escape-unescape", title: "String Escape & Unescape", description: "Escape or unescape special characters in strings.", metaDescription: "Free string escape tool. Escape and unescape special characters online.", category: "Developer Tools", implemented: true },
      { slug: "online-json-path-tester", title: "JSONPath Tester", description: "Test JSONPath expressions against JSON data.", metaDescription: "Free JSONPath tester. Query JSON data with JSONPath expressions online.", category: "Developer Tools", implemented: true },
      { slug: "text-to-binary-converter", title: "Text to Binary Converter", description: "Convert text to binary arrays and vice versa.", metaDescription: "Free text to binary converter. Convert ASCII or any text to binary format online.", category: "Developer Tools", implemented: true },
    ]
  },
  {
    id: "css-design",
    name: "CSS & Design Tools",
    description: "Gradient generators, box shadow builders, and visual CSS utilities",
    color: "bg-fuchsia-500",
    bgColor: "from-fuchsia-500 to-pink-400",
    tools: [
      { slug: "css-gradient-generator", title: "CSS Gradient Generator", description: "Create beautiful linear and radial CSS gradients visually.", metaDescription: "Free CSS gradient generator. Create linear and radial gradients with live preview.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-box-shadow-generator", title: "CSS Box Shadow Generator", description: "Generate CSS box-shadow values with visual controls.", metaDescription: "Free CSS box shadow generator. Create box shadows with live preview.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-text-shadow-generator", title: "CSS Text Shadow Generator", description: "Create CSS text-shadow effects with visual controls.", metaDescription: "Free CSS text shadow generator. Create text shadow effects online.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-border-radius-generator", title: "CSS Border Radius Generator", description: "Generate CSS border-radius values with visual preview.", metaDescription: "Free CSS border radius generator with live preview, per-corner controls, presets, and copyable CSS shorthand.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-flexbox-generator", title: "CSS Flexbox Generator", description: "Build flexbox layouts visually and copy the CSS code.", metaDescription: "Free CSS flexbox generator. Create flexbox layouts with visual editor.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-grid-generator", title: "CSS Grid Generator", description: "Build CSS Grid layouts visually with rows and columns.", metaDescription: "Free CSS Grid generator. Create grid layouts with a visual editor.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-animation-generator", title: "CSS Animation Generator", description: "Create CSS keyframe animations with visual timeline.", metaDescription: "Free CSS animation generator with live preview, keyframe presets, timing controls, and copyable CSS output.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-clip-path-generator", title: "CSS Clip-Path Generator", description: "Create CSS clip-path shapes like circles, polygons, and more.", metaDescription: "Free CSS clip-path generator. Create custom clip-path shapes online.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-filter-generator", title: "CSS Filter Generator", description: "Generate CSS filter effects like blur, brightness, contrast.", metaDescription: "Free CSS filter generator. Create CSS filter effects with sliders.", category: "CSS & Design Tools", implemented: true },
      { slug: "color-palette-generator", title: "Color Palette Generator", description: "Generate beautiful color palettes and harmonies from any color.", metaDescription: "Free color palette generator. Build monochrome, analogous, complementary, triadic, and split-complementary color schemes online.", category: "CSS & Design Tools", implemented: true },
      { slug: "color-contrast-checker", title: "Color Contrast Checker", description: "Check color contrast ratios for WCAG accessibility compliance.", metaDescription: "Free color contrast checker. Test WCAG accessibility compliance for colors.", category: "CSS & Design Tools", implemented: true },
      { slug: "color-picker", title: "Color Picker", description: "Pick colors and get HEX, RGB, HSL values with visual color wheel.", metaDescription: "Free online color picker. Select colors from a color wheel and get codes.", category: "CSS & Design Tools", implemented: true },
      { slug: "hex-to-rgb-converter", title: "HEX to RGB Converter", description: "Convert HEX color codes to RGB values.", metaDescription: "Free HEX to RGB converter. Convert hex color codes to RGB values online.", category: "CSS & Design Tools", implemented: true },
      { slug: "rgb-to-hex-converter", title: "RGB to HEX Converter", description: "Convert RGB color values to HEX codes.", metaDescription: "Free RGB to HEX converter. Convert RGB values to hex color codes online.", category: "CSS & Design Tools", implemented: true },
      { slug: "tailwind-color-generator", title: "Tailwind CSS Color Generator", description: "Generate custom Tailwind CSS color shade scales.", metaDescription: "Free Tailwind color generator. Create custom color scales for Tailwind CSS.", category: "CSS & Design Tools", implemented: true },
      { slug: "glassmorphism-generator", title: "Glassmorphism Generator", description: "Create frosted glass CSS effects with visual controls.", metaDescription: "Free glassmorphism CSS generator. Create glass-effect UI components.", category: "CSS & Design Tools", implemented: true },
      { slug: "neumorphism-generator", title: "Neumorphism Generator", description: "Generate soft UI (neumorphic) CSS shadow effects.", metaDescription: "Free neumorphism CSS generator. Create soft UI shadow effects online.", category: "CSS & Design Tools", implemented: true },
      { slug: "css-triangle-generator", title: "CSS Triangle Generator", description: "Create CSS triangles using borders with size and direction controls.", metaDescription: "Free CSS triangle generator. Create CSS triangles with custom sizes.", category: "CSS & Design Tools", implemented: true },
    ]
  },
  {
    id: "seo",
    name: "SEO Tools",
    description: "Meta tag generators, keyword tools, and search engine optimization utilities",
    color: "bg-lime-500",
    bgColor: "from-lime-500 to-green-400",
    tools: [
      { slug: "meta-tag-generator", title: "Meta Tag Generator", description: "Generate HTML meta tags for SEO including title, description, and keywords.", metaDescription: "Free meta tag generator. Create SEO-optimized meta tags for your website.", category: "SEO Tools", implemented: true },
      { slug: "open-graph-generator", title: "Open Graph Tag Generator", description: "Generate Open Graph meta tags for rich social media previews.", metaDescription: "Free Open Graph generator. Create OG tags for social media sharing.", category: "SEO Tools", implemented: true },
      { slug: "twitter-card-generator", title: "Twitter Card Generator", description: "Generate Twitter Card meta tags for rich tweet previews.", metaDescription: "Free Twitter Card generator. Create Twitter Card meta tags online.", category: "SEO Tools", implemented: true },
      { slug: "online-robots-txt-generator", title: "Robots.txt Generator", description: "Generate robots.txt files to control search engine crawling.", metaDescription: "Free robots.txt generator. Create robots.txt files for your website.", category: "SEO Tools", implemented: true },
      { slug: "online-sitemap-generator", title: "XML Sitemap Generator", description: "Generate XML sitemaps for better search engine indexing.", metaDescription: "Free XML sitemap generator. Create sitemaps for search engines.", category: "SEO Tools", implemented: true },
      { slug: "online-keyword-density-checker", title: "Keyword Density Checker", description: "Analyze keyword density and frequency in your content.", metaDescription: "Free keyword density checker. Analyze keyword usage in your text.", category: "SEO Tools", implemented: true },
      { slug: "serp-preview-tool", title: "Google SERP Preview", description: "Preview how your page will appear in Google search results.", metaDescription: "Free Google SERP preview. See how your page looks in search results.", category: "SEO Tools", implemented: true },
      { slug: "schema-markup-generator", title: "Schema Markup Generator", description: "Generate JSON-LD structured data for rich search results.", metaDescription: "Free schema markup generator. Create JSON-LD structured data online.", category: "SEO Tools", implemented: true },
      { slug: "canonical-tag-generator", title: "Canonical Tag Generator", description: "Generate canonical link tags to prevent duplicate content issues.", metaDescription: "Free canonical tag generator. Create canonical URLs for SEO.", category: "SEO Tools", implemented: true },
      { slug: "htaccess-redirect-generator", title: ".htaccess Redirect Generator", description: "Generate Apache .htaccess redirect rules for page moves and section migrations.", metaDescription: "Free .htaccess redirect generator. Create Apache 301 and 302 redirect rules online.", category: "SEO Tools", implemented: true },
      { slug: "online-readability-checker", title: "Readability Score Checker", description: "Check Flesch-Kincaid readability score and grade level of your content.", metaDescription: "Free readability checker. Check Flesch reading ease score of your text.", category: "SEO Tools", implemented: true },
      { slug: "online-heading-tag-checker", title: "HTML Heading Tag Checker", description: "Paste HTML and check heading tag hierarchy for SEO issues.", metaDescription: "Free heading tag checker. Validate HTML heading structure for SEO.", category: "SEO Tools", implemented: true },
      { slug: "favicon-checker", title: "Favicon Code Generator", description: "Generate favicon HTML tags and manifest code for modern browser support.", metaDescription: "Free favicon HTML code generator. Generate favicon link tags and manifest code for all browsers.", category: "SEO Tools", implemented: true },
    ]
  },
  {
    id: "security",
    name: "Security & Encryption",
    description: "Password generators, hash tools, and encryption utilities",
    color: "bg-amber-500",
    bgColor: "from-amber-500 to-yellow-400",
    tools: [
      { slug: "online-password-generator", title: "Online Password Generator", description: "Generate strong, secure passwords with custom length and complexity.", metaDescription: "Free online password generator. Create strong and secure passwords instantly.", category: "Security & Encryption", implemented: true },
      { slug: "password-strength-checker", title: "Password Strength Checker", description: "Check how strong your password is and get improvement suggestions.", metaDescription: "Free password strength checker. Test your password security online.", category: "Security & Encryption", implemented: true },
      { slug: "md5-hash-generator", title: "MD5 Hash Generator", description: "Generate MD5 hashes from any text input.", metaDescription: "Free MD5 hash generator. Generate MD5 checksums from text online.", category: "Security & Encryption", implemented: true },
      { slug: "sha256-hash-generator", title: "SHA-256 Hash Generator", description: "Generate SHA-256 hashes from any text input.", metaDescription: "Free SHA-256 hash generator. Generate SHA-256 hashes online.", category: "Security & Encryption", implemented: true },
      { slug: "sha1-hash-generator", title: "SHA-1 Hash Generator", description: "Generate SHA-1 hashes from text for checksums and verification.", metaDescription: "Free SHA-1 hash generator. Generate SHA-1 hashes from text online.", category: "Security & Encryption", implemented: true },
      { slug: "sha512-hash-generator", title: "SHA-512 Hash Generator", description: "Generate SHA-512 hashes for maximum security hashing.", metaDescription: "Free SHA-512 hash generator. Generate SHA-512 hashes online.", category: "Security & Encryption", implemented: true },
      { slug: "online-bcrypt-hash-generator", title: "Bcrypt Hash Generator", description: "Generate bcrypt password hashes with custom salt rounds.", metaDescription: "Free bcrypt hash generator. Hash passwords with bcrypt online.", category: "Security & Encryption", implemented: true },
      { slug: "online-aes-encrypt-decrypt", title: "AES Encrypt & Decrypt", description: "Encrypt and decrypt text using AES-256 encryption.", metaDescription: "Free AES encryption tool. Encrypt and decrypt text with AES-256 online.", category: "Security & Encryption", implemented: true },
      { slug: "rsa-key-generator", title: "RSA Key Pair Generator", description: "Generate RSA public and private key pairs.", metaDescription: "Free RSA key generator. Generate RSA key pairs online.", category: "Security & Encryption", implemented: true },
      { slug: "hmac-generator", title: "HMAC Generator", description: "Generate HMAC authentication codes with various hash algorithms.", metaDescription: "Free HMAC generator. Generate HMAC codes with SHA-256 and more.", category: "Security & Encryption", implemented: true },
      { slug: "random-string-generator", title: "Random String Generator", description: "Generate random strings with custom characters and length.", metaDescription: "Free random string generator. Generate random alphanumeric strings online.", category: "Security & Encryption", implemented: true },
      { slug: "encryption-decoder", title: "Caesar Cipher Tool", description: "Encrypt and decrypt text using Caesar cipher with custom shift.", metaDescription: "Free Caesar cipher tool. Encrypt and decrypt text with Caesar cipher.", category: "Security & Encryption", implemented: true },
      { slug: "binary-to-text", title: "Binary to Text Converter", description: "Convert binary code to readable text and vice versa.", metaDescription: "Free binary to text converter. Convert between binary and text online.", category: "Security & Encryption", implemented: true },
      { slug: "hex-to-text", title: "Hex to Text Converter", description: "Convert hexadecimal strings to readable text and back.", metaDescription: "Free hex to text converter. Convert between hex and text online.", category: "Security & Encryption", implemented: true },
      { slug: "online-morse-code-translator", title: "Morse Code Translator", description: "Convert text to Morse code and Morse code to text.", metaDescription: "Free Morse code translator. Convert text to and from Morse code online.", category: "Security & Encryption", implemented: true },
    ]
  },
  {
    id: "social-media",
    name: "Social Media Tools",
    description: "Character counters, image resizers, and content tools for social platforms",
    color: "bg-violet-500",
    bgColor: "from-violet-500 to-purple-400",
    tools: [
      { slug: "twitter-character-counter", title: "Twitter/X Character Counter", description: "Count characters for tweets with real-time limit tracking.", metaDescription: "Free Twitter character counter. Count characters for tweets with limits.", category: "Social Media Tools", implemented: true },
      { slug: "online-instagram-caption-counter", title: "Instagram Caption Counter", description: "Count characters and hashtags for Instagram captions.", metaDescription: "Free Instagram caption character counter. Track caption length online.", category: "Social Media Tools", implemented: true },
      { slug: "online-social-media-image-resizer", title: "Social Media Image Resizer", description: "Resize images to exact dimensions for each social media platform.", metaDescription: "Free social media image resizer. Resize images for Instagram, Facebook, Twitter.", category: "Social Media Tools", implemented: true },
      { slug: "youtube-thumbnail-checker", title: "YouTube Thumbnail Checker", description: "Check how your YouTube thumbnail reads in smaller search, mobile, and suggested-video layouts.", metaDescription: "Free YouTube thumbnail checker. Test thumbnail readability online with size and layout checks.", category: "Social Media Tools", implemented: true },
      { slug: "emoji-picker", title: "Emoji Picker & Copier", description: "Browse and copy emojis by category with one click.", metaDescription: "Free emoji picker. Browse, search, and copy emojis to clipboard.", category: "Social Media Tools", implemented: true },
      { slug: "text-to-emoji", title: "Text to Emoji Converter", description: "Convert regular text into emoji-enhanced social copy variations.", metaDescription: "Free text to emoji converter. Turn plain text into emoji-enhanced social copy online.", category: "Social Media Tools", implemented: true },
      { slug: "online-linkedin-post-formatter", title: "LinkedIn Post Formatter", description: "Format LinkedIn posts with bold, italic, and special characters.", metaDescription: "Free LinkedIn post formatter. Format text with bold and symbols.", category: "Social Media Tools", implemented: true },
      { slug: "bio-generator", title: "Social Media Bio Generator", description: "Generate short profile bios for Instagram, LinkedIn, and TikTok with platform-aware limits.", metaDescription: "Free social media bio generator. Create short bios for Instagram, LinkedIn, and TikTok online.", category: "Social Media Tools", implemented: true },
      { slug: "unicode-text-converter", title: "Unicode Text Converter", description: "Convert text to bold, italic, strikethrough, and other Unicode styles.", metaDescription: "Free Unicode text converter. Create bold, italic, and fancy text styles.", category: "Social Media Tools", implemented: true },
      { slug: "tiktok-character-counter", title: "TikTok Caption Counter", description: "Count characters for TikTok captions with limit tracking.", metaDescription: "Free TikTok caption character counter. Track caption length online.", category: "Social Media Tools", implemented: true },
      { slug: "online-social-post-scheduler-planner", title: "Social Post Planner", description: "Plan and organize your social media posting schedule.", metaDescription: "Free social media post planner. Plan your posting schedule online.", category: "Social Media Tools", implemented: true },
    ]
  },
];

const DISPLAY_TITLE_CATEGORY_PREFERENCES: Record<string, string> = {
  "password generator": "security",
  "password strength checker": "security",
  "qr code generator": "image",
  "uuid generator": "developer",
  "markdown previewer": "developer",
  "lorem ipsum generator": "developer",
  "slug generator": "developer",
  "unix timestamp converter": "developer",
  "encoder decoder": "developer",
};

export function getToolDisplayKey(tool: Tool): string {
  const normalizedTitle = tool.title
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/\b(online|url|tool)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return normalizedTitle || tool.slug.toLowerCase();
}

export function dedupeToolsForDisplay<T extends Tool>(tools: T[]): T[] {
  const seenKeys = new Set<string>();

  return tools.filter((tool) => {
    const key = getToolDisplayKey(tool);
    if (seenKeys.has(key)) {
      return false;
    }
    seenKeys.add(key);
    return true;
  });
}

export const ALL_TOOLS: Tool[] = TOOL_CATEGORIES.flatMap(cat => cat.tools);

export const DISPLAY_TOOL_CATEGORIES: ToolCategory[] = (() => {
  const seenKeys = new Set<string>();

  return TOOL_CATEGORIES
    .map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        const key = getToolDisplayKey(tool);
        const preferredCategoryId = DISPLAY_TITLE_CATEGORY_PREFERENCES[key];

        if (preferredCategoryId && preferredCategoryId !== category.id) {
          return false;
        }

        if (seenKeys.has(key)) {
          return false;
        }

        seenKeys.add(key);
        return true;
      }),
    }))
    .filter((category) => category.tools.length > 0);
})();

export const DISPLAY_ALL_TOOLS: Tool[] = DISPLAY_TOOL_CATEGORIES.flatMap((category) => category.tools);
export const SITE_TOOL_COUNT = DISPLAY_ALL_TOOLS.length;
const DISPLAY_TOOL_BY_KEY = new Map(
  DISPLAY_ALL_TOOLS.map((tool) => [getToolDisplayKey(tool), tool] as const),
);

const PREFERRED_CATEGORY_BY_SLUG: Record<string, string> = {
  "online-base64-encoder-decoder": "developer",
  "online-json-formatter": "developer",
  "lorem-ipsum-generator": "developer",
  "online-lorem-ipsum-generator": "developer",
  "online-markdown-previewer": "developer",
  "password-strength-checker": "security",
  "qr-code-generator": "image",
  "slug-generator": "developer",
  "unix-timestamp-converter": "developer",
  "online-unix-timestamp-converter": "developer",
  "url-encoder-decoder": "developer",
  "uuid-generator": "developer",
  "online-uuid-generator": "developer",
  "online-password-generator": "security",
};

const CANONICAL_SLUG_OVERRIDES: Record<string, string> = {
  "bio-generator": "social-media-bio-generator",
  "color-picker": "color-picker-tool",
  "diff-checker": "text-diff-checker",
  "emoji-picker": "emoji-picker-and-copier",
  "image-watermark": "online-image-watermark-tool",
  "lorem-ipsum-generator": "online-lorem-ipsum-generator",
  "password-generator": "online-password-generator",
  "pdf-compress": "online-pdf-compress",
  "pdf-merge": "online-pdf-merge",
  "pdf-split": "online-pdf-split",
  "pdf-watermark": "online-pdf-watermark",
  "percentage-change-calculator": "percentage-calculator",
  "percentage-decrease-calculator": "percentage-calculator",
  "percentage-difference-calculator": "percentage-calculator",
  "percentage-increase-calculator": "percentage-calculator",
  "percentage-calculator": "online-percantage-calculator",
  // Image tools
  "image-resizer": "online-image-resizer",
  "image-compressor": "online-image-compressor",
  "image-cropper": "online-image-cropper",
  "image-format-converter": "online-image-format-converter",
  "image-to-base64": "online-image-to-base64",
  "base64-to-image": "online-base64-to-image",
  "image-rotate-flip": "online-image-rotate-flip",
  "image-color-picker": "online-image-color-picker",
  "image-filter-editor": "online-image-filter-editor",
  "image-to-png": "online-image-to-png",
  "image-to-jpg": "online-image-to-jpg",
  "png-to-webp": "online-png-to-webp",
  "svg-to-png": "online-svg-to-png",
  "image-background-remover": "online-image-background-remover",
  "image-collage-maker": "online-image-collage-maker",
  "qr-code-generator": "online-qr-code-generator",
  "meme-generator": "online-meme-generator",
  "favicon-generator": "online-favicon-generator",
  "image-pixel-counter": "online-image-pixel-counter",
  // PDF tools
  "image-to-pdf": "online-image-to-pdf",
  "jpg-to-pdf": "online-jpg-to-pdf",
  "pdf-to-image": "online-pdf-to-image",
  "pdf-rotate": "online-pdf-rotate",
  "pdf-page-remover": "online-pdf-page-remover",
  "pdf-page-reorder": "online-pdf-page-reorder",
  "pdf-password-protect": "online-pdf-password-protect",
  "pdf-unlock": "online-pdf-unlock",
  "pdf-to-text": "online-pdf-to-text",
  "pdf-page-number": "online-pdf-page-number",
  "pdf-header-footer": "online-pdf-header-footer",
  "pdf-sign": "online-pdf-sign",
  "slug-generator": "url-slug-generator",
  "text-to-emoji": "text-to-emoji-converter",
  "unix-timestamp-converter": "online-unix-timestamp-converter",
  "uuid-generator": "online-uuid-generator",
};

const SLUG_ALIAS_TO_TOOL_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CANONICAL_SLUG_OVERRIDES).map(([legacySlug, canonicalSlug]) => [canonicalSlug, legacySlug]),
);

function getToolByExactSlug(slug: string): Tool | undefined {
  const preferredCategoryId = PREFERRED_CATEGORY_BY_SLUG[slug];

  if (preferredCategoryId) {
    const preferredCategory = TOOL_CATEGORIES.find((category) => category.id === preferredCategoryId);
    const preferredTool = preferredCategory?.tools.find((tool) => tool.slug === slug);

    if (preferredTool) {
      return preferredTool;
    }
  }

  return ALL_TOOLS.find((tool) => tool.slug === slug);
}

export function resolveToolSlug(slug: string): string | undefined {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return undefined;
  }

  const exactTool = getToolByExactSlug(normalizedSlug);

  if (exactTool) {
    return exactTool.slug;
  }

  const canonicalAlias = SLUG_ALIAS_TO_TOOL_SLUG[normalizedSlug];

  if (canonicalAlias) {
    return canonicalAlias;
  }

  const legacyCandidate = normalizedSlug.startsWith("online-")
    ? normalizedSlug.replace(/^online-/, "")
    : `online-${normalizedSlug}`;

  const aliasedTool = getToolByExactSlug(legacyCandidate);
  return aliasedTool?.slug;
}

export function getToolBySlug(slug: string): Tool | undefined {
  const resolvedSlug = resolveToolSlug(slug);
  return resolvedSlug ? getToolByExactSlug(resolvedSlug) : undefined;
}

export function getRelatedTools(slug: string, category: string, limit = 4): Tool[] {
  const displayCategory = DISPLAY_TOOL_CATEGORIES.find((entry) => entry.name === category);
  const sourceTools = displayCategory?.tools ?? dedupeToolsForDisplay(ALL_TOOLS.filter((tool) => tool.category === category));

  return sourceTools
    .filter(t => t.slug !== slug)
    .slice(0, limit);
}

export function getCategoryById(id: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find(c => c.id === id);
}

export function getCategoryIdBySlug(slug: string): string {
  const resolvedSlug = resolveToolSlug(slug) ?? slug;

  if (PREFERRED_CATEGORY_BY_SLUG[resolvedSlug]) {
    return PREFERRED_CATEGORY_BY_SLUG[resolvedSlug];
  }

  for (const cat of TOOL_CATEGORIES) {
    if (cat.tools.some(t => t.slug === resolvedSlug)) return cat.id;
  }
  return "tools";
}

function getCanonicalSlug(slug: string): string {
  const normalizedSlug = slug.trim().toLowerCase();
  const resolvedSlug = resolveToolSlug(normalizedSlug) ?? normalizedSlug;
  return CANONICAL_SLUG_OVERRIDES[resolvedSlug] ?? resolvedSlug;
}

export function getToolPath(slug: string): string {
  const canonicalSlug = getCanonicalSlug(slug);
  return `/${getCategoryIdBySlug(canonicalSlug)}/${canonicalSlug}`;
}

export function getCanonicalToolPath(slug: string): string {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return getToolPath(slug);
  }

  const preferredTool = DISPLAY_TOOL_BY_KEY.get(getToolDisplayKey(tool)) ?? tool;
  const canonicalSlug = getCanonicalSlug(preferredTool.slug);
  return `/${getCategoryIdBySlug(canonicalSlug)}/${canonicalSlug}`;
}


