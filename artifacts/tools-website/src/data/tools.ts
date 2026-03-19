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
      { slug: "percentage-increase-calculator", title: "Percentage Increase Calculator", description: "Calculate the percentage increase between two numbers.", metaDescription: "Calculate percentage increase between any two values. Simple free online tool.", category: "Math & Calculators", implemented: false },
      { slug: "percentage-decrease-calculator", title: "Percentage Decrease Calculator", description: "Find the percentage decrease from one value to another.", metaDescription: "Calculate percentage decrease between two numbers quickly and accurately.", category: "Math & Calculators", implemented: false },
      { slug: "percentage-difference-calculator", title: "Percentage Difference Calculator", description: "Compute the percentage difference between two values.", metaDescription: "Find the percentage difference between two numbers with this free online calculator.", category: "Math & Calculators", implemented: false },
      { slug: "fraction-to-decimal-calculator", title: "Fraction to Decimal Calculator", description: "Convert any fraction to its decimal equivalent instantly.", metaDescription: "Convert fractions to decimals easily. Free fraction to decimal converter online.", category: "Math & Calculators", implemented: false },
      { slug: "decimal-to-fraction-calculator", title: "Decimal to Fraction Calculator", description: "Convert decimals to simplified fractions in one click.", metaDescription: "Convert decimal numbers to fractions. Free online decimal to fraction calculator.", category: "Math & Calculators", implemented: false },
      { slug: "ratio-calculator", title: "Ratio Calculator", description: "Simplify ratios and solve ratio proportions easily.", metaDescription: "Calculate, simplify, and solve ratios with this free online ratio calculator.", category: "Math & Calculators", implemented: false },
      { slug: "average-calculator", title: "Average Calculator", description: "Find the mean, median, and mode of any set of numbers.", metaDescription: "Calculate the average (mean) of any set of numbers. Free online average calculator.", category: "Math & Calculators", implemented: false },
      { slug: "scientific-calculator", title: "Scientific Calculator", description: "Advanced scientific calculator with trigonometry and exponents.", metaDescription: "Free online scientific calculator with advanced math functions, trig, logs, and more.", category: "Math & Calculators", implemented: false },
      { slug: "standard-deviation-calculator", title: "Standard Deviation Calculator", description: "Calculate standard deviation and variance for datasets.", metaDescription: "Calculate standard deviation, variance, and mean for any dataset online.", category: "Math & Calculators", implemented: false },
      { slug: "square-root-calculator", title: "Square Root Calculator", description: "Find the square root of any number instantly.", metaDescription: "Calculate square roots of any number. Free online square root calculator.", category: "Math & Calculators", implemented: false },
      { slug: "cube-root-calculator", title: "Cube Root Calculator", description: "Compute the cube root of any positive or negative number.", metaDescription: "Find the cube root of any number with this free online calculator.", category: "Math & Calculators", implemented: false },
      { slug: "power-calculator", title: "Power Calculator", description: "Calculate any base raised to any exponent (power).", metaDescription: "Calculate powers and exponents. Raise any number to any power online.", category: "Math & Calculators", implemented: false },
      { slug: "logarithm-calculator", title: "Logarithm Calculator", description: "Compute log, ln, and log base n for any value.", metaDescription: "Calculate logarithms (log10, natural log, custom base) with this free online tool.", category: "Math & Calculators", implemented: false },
      { slug: "factorial-calculator", title: "Factorial Calculator", description: "Calculate the factorial of any non-negative integer.", metaDescription: "Find the factorial of any number. Free online factorial calculator.", category: "Math & Calculators", implemented: false },
      { slug: "prime-number-checker", title: "Prime Number Checker", description: "Check if a number is prime or composite instantly.", metaDescription: "Check if any number is prime. Free online prime number checker tool.", category: "Math & Calculators", implemented: false },
      { slug: "lcm-calculator", title: "LCM Calculator", description: "Find the Least Common Multiple of two or more numbers.", metaDescription: "Calculate the LCM (Least Common Multiple) of multiple numbers online.", category: "Math & Calculators", implemented: false },
      { slug: "gcd-calculator", title: "GCD Calculator", description: "Find the Greatest Common Divisor of any set of numbers.", metaDescription: "Calculate GCD (Greatest Common Divisor) or HCF of numbers. Free online tool.", category: "Math & Calculators", implemented: false },
      { slug: "random-number-generator", title: "Random Number Generator", description: "Generate random numbers within any range you specify.", metaDescription: "Generate random numbers between any min and max value. Free online random number generator.", category: "Math & Calculators", implemented: true },
      { slug: "mean-median-mode-calculator", title: "Mean Median Mode Calculator", description: "Calculate mean, median, and mode of any dataset.", metaDescription: "Find the mean, median, and mode of any set of numbers. Free statistics calculator.", category: "Math & Calculators", implemented: false },
    ]
  },
  {
    id: "finance",
    name: "Finance & Cost",
    description: "Money calculators for loans, interest, budgeting and more",
    color: "bg-green-500",
    bgColor: "from-green-500 to-emerald-400",
    tools: [
      { slug: "simple-interest-calculator", title: "Simple Interest Calculator", description: "Calculate simple interest on any principal amount.", metaDescription: "Calculate simple interest easily. Free online simple interest calculator for any principal, rate, and time.", category: "Finance & Cost", implemented: false },
      { slug: "compound-interest-calculator", title: "Compound Interest Calculator", description: "Find compound interest with any compounding frequency.", metaDescription: "Calculate compound interest with monthly, yearly or custom compounding. Free online calculator.", category: "Finance & Cost", implemented: false },
      { slug: "loan-emi-calculator", title: "Loan EMI Calculator", description: "Calculate monthly EMI for any loan amount and tenure.", metaDescription: "Calculate your monthly loan EMI online. Free loan EMI calculator for home, car, and personal loans.", category: "Finance & Cost", implemented: false },
      { slug: "discount-calculator", title: "Discount Calculator", description: "Calculate the final price after any percentage discount.", metaDescription: "Find the discounted price of any item instantly. Free online discount calculator.", category: "Finance & Cost", implemented: true },
      { slug: "profit-margin-calculator", title: "Profit Margin Calculator", description: "Calculate gross, net, and operating profit margins.", metaDescription: "Calculate profit margin percentage online. Free profit margin calculator for businesses.", category: "Finance & Cost", implemented: false },
      { slug: "markup-calculator", title: "Markup Calculator", description: "Calculate selling price from cost and markup percentage.", metaDescription: "Find selling price with markup percentage. Free online markup calculator.", category: "Finance & Cost", implemented: false },
      { slug: "break-even-calculator", title: "Break Even Calculator", description: "Find the break-even point for your business or product.", metaDescription: "Calculate your business break-even point. Free break-even analysis calculator.", category: "Finance & Cost", implemented: false },
      { slug: "roi-calculator", title: "ROI Calculator", description: "Calculate return on investment for any amount.", metaDescription: "Calculate ROI (Return on Investment) percentage. Free online investment calculator.", category: "Finance & Cost", implemented: false },
      { slug: "savings-calculator", title: "Savings Calculator", description: "Project your savings growth with interest over time.", metaDescription: "Calculate how much your savings will grow. Free online savings calculator with interest.", category: "Finance & Cost", implemented: false },
      { slug: "tip-calculator", title: "Tip Calculator", description: "Calculate the right tip amount and split bills easily.", metaDescription: "Calculate tip amount and split bills between people. Free online tip calculator.", category: "Finance & Cost", implemented: true },
      { slug: "salary-calculator", title: "Salary Calculator", description: "Convert between hourly, monthly, and annual salary.", metaDescription: "Convert your salary between hourly, monthly and yearly. Free salary calculator online.", category: "Finance & Cost", implemented: false },
      { slug: "tax-calculator", title: "Tax Calculator", description: "Estimate income tax based on earnings and deductions.", metaDescription: "Estimate your income tax. Free online tax calculator for quick tax estimates.", category: "Finance & Cost", implemented: false },
      { slug: "mortgage-payment-calculator", title: "Mortgage Payment Calculator", description: "Estimate your monthly mortgage payment and amortization.", metaDescription: "Calculate monthly mortgage payments. Free mortgage calculator for home buyers.", category: "Finance & Cost", implemented: false },
      { slug: "gst-calculator", title: "GST Calculator", description: "Add or remove GST from any price amount quickly.", metaDescription: "Calculate GST (Goods and Services Tax) on any price. Free online GST calculator.", category: "Finance & Cost", implemented: false },
      { slug: "inflation-calculator", title: "Inflation Calculator", description: "Calculate the impact of inflation on purchasing power.", metaDescription: "Calculate inflation impact on money over time. Free inflation rate calculator online.", category: "Finance & Cost", implemented: false },
      { slug: "commission-calculator", title: "Commission Calculator", description: "Calculate sales commission based on rate and earnings.", metaDescription: "Calculate sales commission amount. Free online commission calculator for any rate.", category: "Finance & Cost", implemented: false },
      { slug: "investment-growth-calculator", title: "Investment Growth Calculator", description: "Project how your investments will grow over time.", metaDescription: "Calculate investment growth over time with returns. Free online investment growth calculator.", category: "Finance & Cost", implemented: false },
      { slug: "budget-calculator", title: "Budget Calculator", description: "Plan and track your monthly budget and expenses.", metaDescription: "Create a monthly budget plan. Free budget calculator to manage income and expenses.", category: "Finance & Cost", implemented: false },
    ]
  },
  {
    id: "conversion",
    name: "Conversion Tools",
    description: "Convert between any units of measurement instantly",
    color: "bg-purple-500",
    bgColor: "from-purple-500 to-violet-500",
    tools: [
      { slug: "length-converter", title: "Length Converter", description: "Convert between meters, feet, inches, kilometers, and more.", metaDescription: "Convert length units: meters, feet, inches, cm, km, miles. Free online length converter.", category: "Conversion Tools", implemented: false },
      { slug: "weight-converter", title: "Weight Converter", description: "Convert between kilograms, pounds, ounces, and grams.", metaDescription: "Convert weight units: kg, lbs, oz, grams, tons. Free online weight converter.", category: "Conversion Tools", implemented: false },
      { slug: "temperature-converter", title: "Temperature Converter", description: "Convert between Celsius, Fahrenheit, and Kelvin.", metaDescription: "Convert temperatures between Celsius, Fahrenheit and Kelvin. Free online temperature converter.", category: "Conversion Tools", implemented: true },
      { slug: "area-converter", title: "Area Converter", description: "Convert between square meters, acres, hectares, and more.", metaDescription: "Convert area units: sq meters, acres, hectares, sq feet. Free online area converter.", category: "Conversion Tools", implemented: false },
      { slug: "volume-converter", title: "Volume Converter", description: "Convert liters, gallons, milliliters, and fluid ounces.", metaDescription: "Convert volume units: liters, gallons, ml, cups, fluid oz. Free online volume converter.", category: "Conversion Tools", implemented: false },
      { slug: "speed-converter", title: "Speed Converter", description: "Convert between mph, km/h, m/s, knots, and more.", metaDescription: "Convert speed units: mph, km/h, m/s, knots. Free online speed converter.", category: "Conversion Tools", implemented: false },
      { slug: "color-converter", title: "Color Converter", description: "Convert colors between HEX, RGB, HSL, and CMYK.", metaDescription: "Convert colors between HEX, RGB, HSL formats. Free online color converter tool.", category: "Conversion Tools", implemented: true },
      { slug: "binary-to-decimal-converter", title: "Binary to Decimal Converter", description: "Convert binary numbers to decimal format instantly.", metaDescription: "Convert binary to decimal numbers. Free online binary to decimal converter.", category: "Conversion Tools", implemented: false },
      { slug: "decimal-to-binary-converter", title: "Decimal to Binary Converter", description: "Convert decimal numbers to binary representation.", metaDescription: "Convert decimal to binary numbers. Free online decimal to binary converter.", category: "Conversion Tools", implemented: false },
      { slug: "hex-to-decimal-converter", title: "Hex to Decimal Converter", description: "Convert hexadecimal values to decimal numbers.", metaDescription: "Convert hex to decimal numbers. Free online hexadecimal to decimal converter.", category: "Conversion Tools", implemented: false },
      { slug: "roman-numeral-converter", title: "Roman Numeral Converter", description: "Convert numbers to Roman numerals and vice versa.", metaDescription: "Convert numbers to Roman numerals. Free online Roman numeral converter.", category: "Conversion Tools", implemented: false },
      { slug: "data-storage-converter", title: "Data Storage Converter", description: "Convert between bytes, KB, MB, GB, TB, and more.", metaDescription: "Convert data storage units: bytes, KB, MB, GB, TB. Free online data storage converter.", category: "Conversion Tools", implemented: false },
      { slug: "energy-converter", title: "Energy Converter", description: "Convert joules, calories, watts, kWh, and other energy units.", metaDescription: "Convert energy units: joules, calories, kWh, BTU. Free online energy converter.", category: "Conversion Tools", implemented: false },
      { slug: "pressure-converter", title: "Pressure Converter", description: "Convert between PSI, bar, pascal, atmosphere, and more.", metaDescription: "Convert pressure units: PSI, bar, pascal, atm. Free online pressure converter.", category: "Conversion Tools", implemented: false },
    ]
  },
  {
    id: "time-date",
    name: "Time & Date",
    description: "Date calculators, countdowns, and time tools",
    color: "bg-orange-500",
    bgColor: "from-orange-500 to-amber-400",
    tools: [
      { slug: "age-calculator", title: "Age Calculator", description: "Calculate exact age in years, months, and days from birthdate.", metaDescription: "Calculate your exact age from date of birth. Free online age calculator with days, months, years.", category: "Time & Date", implemented: true },
      { slug: "date-difference-calculator", title: "Date Difference Calculator", description: "Find the exact number of days between any two dates.", metaDescription: "Calculate the difference between two dates in days, weeks, months, and years.", category: "Time & Date", implemented: false },
      { slug: "countdown-timer", title: "Countdown Timer", description: "Set a countdown to any event, deadline, or date.", metaDescription: "Free online countdown timer. Count down to any event, meeting, or deadline.", category: "Time & Date", implemented: false },
      { slug: "time-duration-calculator", title: "Time Duration Calculator", description: "Calculate the duration between two times of day.", metaDescription: "Calculate time duration between two times. Free online time duration calculator.", category: "Time & Date", implemented: false },
      { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Track and sum up work hours across the week.", metaDescription: "Calculate total work hours for the day or week. Free online work hours calculator.", category: "Time & Date", implemented: false },
      { slug: "business-days-calculator", title: "Business Days Calculator", description: "Count working/business days between two dates.", metaDescription: "Count business days between two dates, excluding weekends. Free calculator.", category: "Time & Date", implemented: false },
      { slug: "leap-year-checker", title: "Leap Year Checker", description: "Check if any year is a leap year instantly.", metaDescription: "Check if any year is a leap year. Free online leap year checker tool.", category: "Time & Date", implemented: false },
      { slug: "time-zone-converter", title: "Time Zone Converter", description: "Convert times between different time zones worldwide.", metaDescription: "Convert time between time zones worldwide. Free online time zone converter.", category: "Time & Date", implemented: false },
      { slug: "stopwatch", title: "Stopwatch Tool", description: "Online stopwatch with lap times and pause/resume.", metaDescription: "Free online stopwatch with lap times. Simple and accurate digital stopwatch tool.", category: "Time & Date", implemented: false },
      { slug: "half-birthday-calculator", title: "Half Birthday Calculator", description: "Find the exact date of your half birthday.", metaDescription: "Calculate your half birthday date. Free online half birthday calculator.", category: "Time & Date", implemented: false },
      { slug: "week-number-calculator", title: "Week Number Calculator", description: "Find the week number for any date of the year.", metaDescription: "Find what week number any date falls on. Free online week number calculator.", category: "Time & Date", implemented: false },
      { slug: "overtime-calculator", title: "Overtime Calculator", description: "Calculate overtime pay based on hours and rate.", metaDescription: "Calculate overtime pay and hours worked. Free online overtime calculator.", category: "Time & Date", implemented: false },
    ]
  },
  {
    id: "health",
    name: "Health & Fitness",
    description: "Health calculators for BMI, calories, fitness and more",
    color: "bg-red-500",
    bgColor: "from-red-500 to-rose-400",
    tools: [
      { slug: "bmi-calculator", title: "BMI Calculator", implemented: true, description: "Calculate your Body Mass Index from height and weight.", metaDescription: "Free BMI calculator online. Calculate Body Mass Index using metric or imperial units.", category: "Health & Fitness" },
      { slug: "bmr-calculator", title: "BMR Calculator", description: "Find your Basal Metabolic Rate (calories at rest).", metaDescription: "Calculate your BMR (Basal Metabolic Rate). Free online BMR calculator.", category: "Health & Fitness", implemented: false },
      { slug: "tdee-calculator", title: "TDEE Calculator", description: "Calculate Total Daily Energy Expenditure for your body.", metaDescription: "Calculate TDEE (Total Daily Energy Expenditure). Free online TDEE calculator.", category: "Health & Fitness", implemented: false },
      { slug: "calorie-intake-calculator", title: "Calorie Intake Calculator", description: "Find your daily calorie needs based on goals.", metaDescription: "Calculate how many calories you need per day. Free online calorie intake calculator.", category: "Health & Fitness", implemented: false },
      { slug: "water-intake-calculator", title: "Water Intake Calculator", description: "Find out how much water you should drink daily.", metaDescription: "Calculate your daily water intake needs. Free online water intake calculator.", category: "Health & Fitness", implemented: false },
      { slug: "ideal-weight-calculator", title: "Ideal Weight Calculator", description: "Find your ideal body weight based on height and gender.", metaDescription: "Calculate your ideal body weight. Free online ideal weight calculator.", category: "Health & Fitness", implemented: false },
      { slug: "body-fat-calculator", title: "Body Fat Calculator", description: "Estimate your body fat percentage using measurements.", metaDescription: "Calculate body fat percentage. Free online body fat calculator.", category: "Health & Fitness", implemented: false },
      { slug: "protein-intake-calculator", title: "Protein Intake Calculator", description: "Calculate daily protein requirements for your fitness goals.", metaDescription: "Find your daily protein intake needs. Free online protein intake calculator.", category: "Health & Fitness", implemented: false },
      { slug: "running-pace-calculator", title: "Running Pace Calculator", description: "Calculate your running pace, speed, and finish time.", metaDescription: "Calculate running pace per mile or km. Free online running pace calculator.", category: "Health & Fitness", implemented: false },
      { slug: "heart-rate-calculator", title: "Heart Rate Calculator", description: "Find your target heart rate zones for exercise.", metaDescription: "Calculate target heart rate zones. Free online heart rate zone calculator.", category: "Health & Fitness", implemented: false },
      { slug: "sleep-calculator", title: "Sleep Calculator", description: "Find the best bedtime or wake-up time for good sleep.", metaDescription: "Calculate when to sleep or wake up based on sleep cycles. Free sleep calculator.", category: "Health & Fitness", implemented: false },
      { slug: "pregnancy-due-date-calculator", title: "Pregnancy Due Date Calculator", description: "Calculate your expected due date from the last period.", metaDescription: "Calculate pregnancy due date. Free online pregnancy due date calculator.", category: "Health & Fitness", implemented: false },
      { slug: "ovulation-calculator", title: "Ovulation Calculator", description: "Predict your ovulation dates and fertile window.", metaDescription: "Calculate ovulation dates and fertile window. Free online ovulation calculator.", category: "Health & Fitness", implemented: false },
      { slug: "calorie-deficit-calculator", title: "Calorie Deficit Calculator", description: "Calculate the calorie deficit needed to lose weight.", metaDescription: "Calculate calorie deficit for weight loss. Free online calorie deficit calculator.", category: "Health & Fitness", implemented: false },
      { slug: "cat-age-calculator", title: "Cat Age Calculator", description: "Convert your cat's age to human years equivalently.", metaDescription: "Calculate your cat's age in human years. Free cat age calculator.", category: "Health & Fitness", implemented: false },
      { slug: "dog-age-calculator", title: "Dog Age Calculator", description: "Convert your dog's age to equivalent human years.", metaDescription: "Calculate your dog's age in human years. Free dog age calculator.", category: "Health & Fitness", implemented: false },
    ]
  },
  {
    id: "construction",
    name: "Construction & DIY",
    description: "Calculators for building, materials, and home projects",
    color: "bg-yellow-500",
    bgColor: "from-yellow-500 to-amber-500",
    tools: [
      { slug: "concrete-volume-calculator", title: "Concrete Volume Calculator", description: "Calculate the volume of concrete needed for any project.", metaDescription: "Calculate concrete volume in cubic yards or meters. Free concrete calculator.", category: "Construction & DIY", implemented: false },
      { slug: "cement-calculator", title: "Cement Calculator", description: "Estimate cement bags needed for slabs, walls, and columns.", metaDescription: "Calculate cement quantity for construction. Free online cement calculator.", category: "Construction & DIY", implemented: false },
      { slug: "brick-calculator", title: "Brick Calculator", description: "Estimate how many bricks you need for walls or projects.", metaDescription: "Calculate number of bricks needed for any wall. Free brick calculator for construction.", category: "Construction & DIY", implemented: false },
      { slug: "steel-weight-calculator", title: "Steel Weight Calculator", description: "Calculate the weight of steel bars and rods by dimensions.", metaDescription: "Calculate steel bar weight. Free online steel weight calculator for construction.", category: "Construction & DIY", implemented: false },
      { slug: "paint-calculator", title: "Paint Calculator", description: "Estimate liters of paint needed to cover a surface.", metaDescription: "Calculate how much paint you need. Free paint coverage calculator.", category: "Construction & DIY", implemented: false },
      { slug: "tile-calculator", title: "Tile Calculator", description: "Calculate tiles needed for floors or walls by area.", metaDescription: "Calculate number of tiles needed for any room. Free tile calculator.", category: "Construction & DIY", implemented: false },
      { slug: "flooring-calculator", title: "Flooring Calculator", description: "Estimate flooring materials needed for any room size.", metaDescription: "Calculate flooring materials needed. Free flooring calculator for any room.", category: "Construction & DIY", implemented: false },
      { slug: "room-area-calculator", title: "Room Area Calculator", description: "Calculate the total area of any room or space.", metaDescription: "Calculate room area in square feet or meters. Free room area calculator.", category: "Construction & DIY", implemented: false },
      { slug: "roof-area-calculator", title: "Roof Area Calculator", description: "Estimate the total surface area of a roof by dimensions.", metaDescription: "Calculate roof area for any shape. Free online roof area calculator.", category: "Construction & DIY", implemented: false },
      { slug: "water-tank-calculator", title: "Water Tank Capacity Calculator", description: "Calculate water tank volume in liters or gallons.", metaDescription: "Calculate water tank capacity. Free water tank volume calculator.", category: "Construction & DIY", implemented: false },
      { slug: "asphalt-calculator", title: "Asphalt Calculator", description: "Estimate tons of asphalt needed for driveways or roads.", metaDescription: "Calculate asphalt needed for paving projects. Free online asphalt calculator.", category: "Construction & DIY", implemented: false },
      { slug: "gravel-calculator", title: "Gravel Calculator", description: "Estimate gravel or crushed stone needed by volume.", metaDescription: "Calculate gravel needed for any area. Free gravel volume calculator.", category: "Construction & DIY", implemented: false },
      { slug: "fence-length-calculator", title: "Fence Length Calculator", description: "Calculate total fence length and posts needed.", metaDescription: "Calculate fence length and materials needed. Free fence calculator.", category: "Construction & DIY", implemented: false },
      { slug: "lumber-calculator", title: "Lumber Calculator", description: "Estimate board feet of lumber for any building project.", metaDescription: "Calculate board feet of lumber. Free online lumber calculator.", category: "Construction & DIY", implemented: false },
    ]
  },
  {
    id: "productivity",
    name: "Productivity & Text",
    description: "Text tools, generators, and everyday productivity utilities",
    color: "bg-teal-500",
    bgColor: "from-teal-500 to-cyan-400",
    tools: [
      { slug: "password-generator", title: "Password Generator", description: "Generate strong, secure, random passwords instantly.", metaDescription: "Generate secure random passwords. Free online password generator with strength checker.", category: "Productivity & Text", implemented: true },
      { slug: "word-counter", title: "Word Counter", description: "Count words, characters, sentences, and reading time.", metaDescription: "Count words and characters in text. Free online word counter with reading time estimate.", category: "Productivity & Text", implemented: true },
      { slug: "random-name-generator", title: "Random Name Generator", description: "Generate random first, last, or full names for any use.", metaDescription: "Generate random names online. Free random name generator for characters, projects, and more.", category: "Productivity & Text", implemented: false },
      { slug: "username-generator", title: "Username Generator", description: "Create unique, catchy usernames for any platform.", metaDescription: "Generate unique usernames online. Free username generator tool.", category: "Productivity & Text", implemented: false },
      { slug: "password-strength-checker", title: "Password Strength Checker", description: "Check how strong and secure your password is.", metaDescription: "Check password strength online. Free password security checker tool.", category: "Productivity & Text", implemented: false },
      { slug: "dice-roller", title: "Dice Roller", description: "Roll one or multiple dice with any number of sides.", metaDescription: "Roll virtual dice online. Free dice roller for any number of sides.", category: "Productivity & Text", implemented: false },
      { slug: "coin-flip", title: "Coin Flip Tool", description: "Flip a virtual coin to get heads or tails.", metaDescription: "Flip a virtual coin online. Free online heads or tails coin flip tool.", category: "Productivity & Text", implemented: false },
      { slug: "random-color-generator", title: "Random Color Generator", description: "Generate random colors with HEX and RGB values.", metaDescription: "Generate random colors. Free online random color generator with HEX codes.", category: "Productivity & Text", implemented: false },
      { slug: "case-converter", title: "Case Converter", description: "Convert text to uppercase, lowercase, title case, and more.", metaDescription: "Convert text case online. Free case converter: uppercase, lowercase, title case, camelCase.", category: "Productivity & Text", implemented: false },
      { slug: "text-reverser", title: "Text Reverser Tool", description: "Reverse any string, sentence, or block of text.", metaDescription: "Reverse text online. Free text reverser tool.", category: "Productivity & Text", implemented: false },
      { slug: "duplicate-line-remover", title: "Duplicate Line Remover", description: "Remove duplicate lines from any block of text.", metaDescription: "Remove duplicate lines from text. Free online duplicate line remover tool.", category: "Productivity & Text", implemented: false },
      { slug: "alphabetical-sort", title: "Alphabetical Sort Tool", description: "Sort a list of words or lines in alphabetical order.", metaDescription: "Sort text alphabetically online. Free alphabetical sorter tool.", category: "Productivity & Text", implemented: false },
      { slug: "palindrome-checker", title: "Palindrome Checker", description: "Check if a word or phrase is a palindrome.", metaDescription: "Check if text is a palindrome. Free online palindrome checker.", category: "Productivity & Text", implemented: false },
      { slug: "slug-generator", title: "Slug Generator Tool", description: "Convert any text into a clean URL-friendly slug.", metaDescription: "Generate URL slugs from text. Free online slug generator for SEO-friendly URLs.", category: "Productivity & Text", implemented: false },
      { slug: "hashtag-generator", title: "Hashtag Generator Tool", description: "Generate relevant hashtags for social media posts.", metaDescription: "Generate hashtags for Instagram, Twitter, TikTok. Free hashtag generator tool.", category: "Productivity & Text", implemented: false },
      { slug: "word-frequency-counter", title: "Word Frequency Counter", description: "Analyze how often each word appears in a text.", metaDescription: "Count word frequency in text. Free word frequency analyzer tool.", category: "Productivity & Text", implemented: false },
    ]
  },
  {
    id: "education",
    name: "Student & Education",
    description: "Grade calculators, GPA tools, and study helpers",
    color: "bg-indigo-500",
    bgColor: "from-indigo-500 to-blue-500",
    tools: [
      { slug: "gpa-calculator", title: "GPA Calculator", description: "Calculate your GPA based on grades and credit hours.", metaDescription: "Calculate your GPA online. Free GPA calculator for college and high school students.", category: "Student & Education", implemented: false },
      { slug: "grade-calculator", title: "Grade Calculator", description: "Calculate your current grade based on assignments.", metaDescription: "Calculate your course grade. Free online grade calculator for students.", category: "Student & Education", implemented: false },
      { slug: "weighted-grade-calculator", title: "Weighted Grade Calculator", description: "Calculate final grade with weighted assignments and exams.", metaDescription: "Calculate weighted grades for any course. Free weighted grade calculator.", category: "Student & Education", implemented: false },
      { slug: "final-grade-calculator", title: "Final Grade Calculator", description: "Find the exam score needed to achieve your desired grade.", metaDescription: "Calculate what you need on your final exam. Free final grade calculator.", category: "Student & Education", implemented: false },
      { slug: "percentage-grade-calculator", title: "Percentage Grade Calculator", description: "Convert scores to percentage grades instantly.", metaDescription: "Calculate grade percentage from marks. Free percentage grade calculator.", category: "Student & Education", implemented: false },
      { slug: "attendance-percentage-calculator", title: "Attendance Percentage Calculator", description: "Calculate your class attendance percentage easily.", metaDescription: "Calculate attendance percentage. Free online attendance calculator for students.", category: "Student & Education", implemented: false },
      { slug: "reading-speed-calculator", title: "Reading Speed Calculator", description: "Measure your reading speed in words per minute.", metaDescription: "Test your reading speed. Free online reading speed calculator (WPM).", category: "Student & Education", implemented: false },
      { slug: "marks-percentage-calculator", title: "Marks Percentage Calculator", description: "Convert obtained marks to percentage for any total.", metaDescription: "Calculate percentage from marks. Free marks to percentage calculator.", category: "Student & Education", implemented: false },
      { slug: "marks-to-gpa-converter", title: "Marks to GPA Converter", description: "Convert percentage marks to GPA on any scale.", metaDescription: "Convert marks to GPA. Free online marks to GPA converter.", category: "Student & Education", implemented: false },
      { slug: "class-average-calculator", title: "Class Average Calculator", description: "Calculate the average score for a class or group.", metaDescription: "Calculate class average from student scores. Free class average calculator.", category: "Student & Education", implemented: false },
    ]
  },
  {
    id: "gaming",
    name: "Gaming Calculators",
    description: "Game-specific tools for popular titles and platforms",
    color: "bg-pink-500",
    bgColor: "from-pink-500 to-rose-500",
    tools: [
      { slug: "blox-fruits-calculator", title: "Blox Fruits Calculator", description: "Calculate Blox Fruits values, trades, and upgrades.", metaDescription: "Blox Fruits value calculator. Calculate trade values and upgrades in Blox Fruits.", category: "Gaming Calculators", implemented: false },
      { slug: "blox-fruits-trade-calculator", title: "Blox Fruits Trade Calculator", description: "Check if a Blox Fruits trade is fair or overpaying.", metaDescription: "Blox Fruits trade value calculator. Check if trades are fair in Blox Fruits Roblox.", category: "Gaming Calculators", implemented: false },
      { slug: "roblox-tax-calculator", title: "Roblox Tax Calculator", description: "Calculate how much Robux you receive after the 30% tax.", metaDescription: "Calculate Roblox marketplace tax. Free Roblox tax calculator for sellers.", category: "Gaming Calculators", implemented: false },
      { slug: "minecraft-circle-calculator", title: "Minecraft Circle Calculator", description: "Generate pixel-perfect circles for Minecraft builds.", metaDescription: "Create Minecraft circle patterns. Free Minecraft circle generator calculator.", category: "Gaming Calculators", implemented: false },
      { slug: "valorant-sensitivity-calculator", title: "Valorant Sensitivity Calculator", description: "Convert your mouse sensitivity between FPS games.", metaDescription: "Convert Valorant sensitivity settings. Free sensitivity converter for FPS games.", category: "Gaming Calculators", implemented: false },
      { slug: "fortnite-dpi-calculator", title: "Fortnite DPI Calculator", description: "Calculate your effective DPI for Fortnite and other games.", metaDescription: "Calculate effective DPI for Fortnite. Free gaming DPI calculator.", category: "Gaming Calculators", implemented: false },
      { slug: "xp-level-calculator", title: "XP Level Calculator", description: "Calculate XP needed to reach the next level in any game.", metaDescription: "Calculate XP needed for next level. Free game XP level calculator.", category: "Gaming Calculators", implemented: false },
      { slug: "clash-of-clans-upgrade-calculator", title: "Clash of Clans Upgrade Calculator", description: "Plan your CoC upgrades with cost and time estimates.", metaDescription: "Clash of Clans upgrade cost and time calculator. Plan your CoC upgrades.", category: "Gaming Calculators", implemented: false },
      { slug: "damage-calculator", title: "Damage Calculator", description: "Calculate damage output based on stats and modifiers.", metaDescription: "Calculate game damage with modifiers and buffs. Free game damage calculator.", category: "Gaming Calculators", implemented: false },
      { slug: "game-currency-converter", title: "Game Currency Converter", description: "Convert real money to in-game currency for popular games.", metaDescription: "Convert real money to game currency. Free game currency converter.", category: "Gaming Calculators", implemented: false },
    ]
  },
];

export const ALL_TOOLS: Tool[] = TOOL_CATEGORIES.flatMap(cat => cat.tools);

export function getToolBySlug(slug: string): Tool | undefined {
  return ALL_TOOLS.find(t => t.slug === slug);
}

export function getRelatedTools(slug: string, category: string, limit = 4): Tool[] {
  return ALL_TOOLS
    .filter(t => t.slug !== slug && t.category === category)
    .slice(0, limit);
}

export function getCategoryById(id: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find(c => c.id === id);
}
