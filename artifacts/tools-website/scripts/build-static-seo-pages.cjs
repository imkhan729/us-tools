const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const toolsWebsiteRoot = path.resolve(__dirname, "..");
const toolsPath = path.join(toolsWebsiteRoot, "src", "data", "tools.ts");
const distPublicDir = path.join(toolsWebsiteRoot, "dist", "public");
const templatePath = path.join(distPublicDir, "index.html");

const SITE_NAME = "US Online Tools";
const SITE_URL = "https://usonlinetools.com";
const SITE_DESCRIPTION =
    "Free online calculators, converters, generators, and browser-based utility tools.";
const SITE_LANGUAGE = "en-US";
const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
const SITE_LOGO = `${SITE_URL}/favicon.svg`;
const SITE_TWITTER_HANDLE = "@usonlinetools";
const DEFAULT_ROBOTS =
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const TOOL_STATIC_OVERRIDES = {
    "ovulation-calculator": {
        heading: "Ovulation Calculator",
        canonicalUrl: `${SITE_URL}/calculators/ovulation-calculator/`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Calculators", item: `${SITE_URL}/calculators/` },
            { name: "Ovulation Calculator", item: `${SITE_URL}/calculators/ovulation-calculator/` },
        ],
        title: `Ovulation Calculator - Estimate Your Fertile Window | ${SITE_NAME}`,
        description:
            "Use this free ovulation calculator to estimate your ovulation date, fertile window, and best days to try to conceive based on your cycle.",
        explainer:
            "Use this ovulation calculator to estimate your most fertile days based on your last period date and average cycle length. It can help you find your likely ovulation date, fertile window, next expected period, and best days to try to conceive. Results are estimates and may vary if your cycle is irregular. Most people ovulate about 14 days before their next period, but the exact day can vary. Your fertile window is the group of days when pregnancy is most likely, usually including the days before ovulation and the day of ovulation. This free ovulation calculator, fertile window calculator, ovulation date calculator, fertile days calculator, period and ovulation calculator, and fertility calculator is for general educational use only and cannot guarantee pregnancy or confirm that ovulation has happened. It should not be used as medical advice, diagnosis, treatment, or birth control guidance.",
        steps: [
            {
                title: "Enter the first day of your last menstrual period",
                text: "Use the date your most recent period started.",
            },
            {
                title: "Choose your average cycle length",
                text: "Cycle length is counted from the first day of one period to the first day of the next period.",
            },
            {
                title: "Click the calculate button",
                text: "Review your estimated ovulation date, fertile window, best days to try to conceive, next expected period, and cycle day of ovulation.",
            },
        ],
        faqs: [
            {
                question: "What is an ovulation calculator?",
                answer:
                    "An ovulation calculator is an online tool that estimates when you may ovulate. It uses your last period date and average cycle length to calculate your likely ovulation date and fertile window. It gives a helpful estimate, but it cannot confirm ovulation.",
            },
            {
                question: "How do I calculate my ovulation date?",
                answer:
                    "You can estimate your ovulation date by using the first day of your last period and your average cycle length. Ovulation often happens around 14 days before the next period, but the exact timing can vary from person to person.",
            },
            {
                question: "How many days after my period do I ovulate?",
                answer:
                    "It depends on your cycle length. In a 28-day cycle, ovulation is often estimated around day 14. In a 30-day cycle, it may be around day 16. If your cycle is shorter or longer, your ovulation day may change.",
            },
            {
                question: "What are the best days to get pregnant?",
                answer:
                    "The best days to try to conceive are usually the days before ovulation and the day of ovulation. This time is called the fertile window. This calculator estimates those days based on your cycle information.",
            },
            {
                question: "Is this ovulation calculator accurate?",
                answer:
                    "This ovulation calculator gives an estimate. It may be more accurate if your periods are regular. If your periods are irregular, your ovulation date may be harder to predict, and the calculator result should be used only as a general guide.",
            },
            {
                question: "Can I use this calculator if my periods are irregular?",
                answer:
                    "Yes, but the result may be less accurate. You can enter your average cycle length from the last few cycles. If your periods are very irregular, consider tracking ovulation signs or speaking with a healthcare professional.",
            },
            {
                question: "What cycle length should I enter?",
                answer:
                    "Enter the average number of days from the first day of one period to the first day of your next period. Common cycle lengths are around 24 to 35 days, but your personal cycle may be different.",
            },
            {
                question: "Can an ovulation calculator prevent pregnancy?",
                answer:
                    "No. An ovulation calculator should not be used as a reliable birth control method. It only estimates fertile days and cannot confirm exactly when ovulation happens.",
            },
            {
                question: "What is the difference between ovulation date and fertile window?",
                answer:
                    "The ovulation date is the estimated day an egg may be released. The fertile window is the group of days when pregnancy is most likely. The fertile window usually includes the days before ovulation and ovulation day.",
            },
            {
                question: "When should I take a pregnancy test after ovulation?",
                answer:
                    "Many people take a pregnancy test around the expected period date or about two weeks after ovulation. Test instructions vary, so always follow the directions on the pregnancy test package.",
            },
        ],
    },
    "online-password-generator": {
        heading: "Password Generator",
        canonicalUrl: `${SITE_URL}/security/online-password-generator`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Security Tools", item: `${SITE_URL}/category/security` },
            { name: "Password Generator", item: `${SITE_URL}/security/online-password-generator` },
        ],
        title: `Password Generator - Free Secure Random Password Generator | ${SITE_NAME}`,
        description:
            "Use this free password generator to create strong, secure random passwords with numbers, symbols, uppercase, and lowercase letters. No signup.",
        explainer:
            "Use this free password generator to create strong, secure random passwords for email, banking, WiFi, work apps, social media, and password managers. The tool supports long-tail password tasks such as secure password generator, random password generator, strong password generator, password generator with symbols, password generator with numbers, password generator no signup, and online password generator. A strong password is long, random, unique, and difficult to guess. For most accounts, 16 or more characters with uppercase letters, lowercase letters, numbers, and symbols is a practical starting point. For important accounts such as email, banking, cloud storage, or a password manager master password, use 20 or more characters when the service allows it. Do not reuse generated passwords across different websites. Store passwords in a trusted password manager, enable two-factor authentication for important accounts, and change a password quickly if a service reports a breach.",
        steps: [
            {
                title: "Choose the password length",
                text: "Use 16 or more characters for most accounts, and consider 20 or more characters for important accounts.",
            },
            {
                title: "Select character types",
                text: "Keep uppercase letters, lowercase letters, numbers, and symbols enabled when the website supports them.",
            },
            {
                title: "Generate and copy the password",
                text: "Refresh for a new random password, copy it, and save it in a trusted password manager.",
            },
            {
                title: "Use a unique password for every account",
                text: "Do not reuse the same generated password on multiple websites because one breach can expose other accounts.",
            },
        ],
        faqs: [
            {
                question: "What is a password generator?",
                answer:
                    "A password generator is an online tool that creates random passwords using the length and character types you choose. This password generator can include uppercase letters, lowercase letters, numbers, and symbols so you can create stronger passwords for online accounts.",
            },
            {
                question: "Is this password generator free?",
                answer:
                    "Yes. This free password generator works in your browser and does not require signup for normal use. You can generate, refresh, show, hide, and copy passwords without creating an account.",
            },
            {
                question: "Are passwords created by this tool stored?",
                answer:
                    "No. The generated password is created in your browser for the current session. Do not paste sensitive passwords into unknown websites, and store any password you decide to use in a trusted password manager.",
            },
            {
                question: "How long should a strong password be?",
                answer:
                    "For most accounts, a password of at least 14 to 16 characters is a practical starting point. For important accounts such as email, banking, cloud storage, and password manager master passwords, consider 20 or more characters if the service allows it.",
            },
            {
                question: "Should I include symbols in a password?",
                answer:
                    "Use symbols when the website or app allows them. Symbols increase the character pool and make a random password harder to guess. If a website rejects symbols, use a longer password with uppercase letters, lowercase letters, and numbers.",
            },
            {
                question: "What is the best random password generator setting?",
                answer:
                    "A strong default setting is 16 or more characters with uppercase letters, lowercase letters, numbers, and symbols enabled. Longer passwords are usually better, especially when stored in a password manager.",
            },
            {
                question: "Can I use this secure password generator for WiFi?",
                answer:
                    "Yes, if your router supports the selected length and characters. A long random WiFi password is usually safer than a short word, address, phone number, or predictable phrase.",
            },
            {
                question: "Can a password generator make a password impossible to crack?",
                answer:
                    "No tool can promise that a password is impossible to crack. A random password generator can make stronger passwords, but security also depends on the website, password storage, two-factor authentication, breach exposure, and whether you reuse passwords.",
            },
        ],
    },
    "online-qr-code-generator": {
        heading: "Online QR Code Generator",
        canonicalUrl: `${SITE_URL}/image/online-qr-code-generator`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Image Tools", item: `${SITE_URL}/category/image` },
            { name: "Online QR Code Generator", item: `${SITE_URL}/image/online-qr-code-generator` },
        ],
        title: `Online QR Code Generator - Free QR Code Generator No Sign Up | ${SITE_NAME}`,
        description:
            "Use this free QR code generator to create QR codes for links, text, WiFi, email, and contact cards. Download PNG or SVG. No signup.",
        explainer:
            "Use this free QR code generator to create scan-ready QR codes for website links, plain text, guest WiFi, email actions, and contact cards. The page targets practical QR tasks such as QR code generator, free QR code generator, online QR code generator, QR code generator no sign up, URL QR code generator, WiFi QR code generator, text QR code generator, QR code PNG download, and QR code SVG download. QR reliability depends on payload length, contrast, error correction, quiet zone, and final display size. Keep website URLs short when possible, use strong foreground and background contrast, leave clear white space around the code, and test the QR code on more than one phone before printing signs, menus, labels, flyers, or business cards.",
        steps: [
            {
                title: "Choose the QR code type",
                text: "Select URL, text, WiFi, email, or contact depending on what should open after a scan.",
            },
            {
                title: "Enter the QR content",
                text: "Paste the link, type the text, add WiFi details, write the email action, or fill the contact card fields.",
            },
            {
                title: "Check the live preview",
                text: "Review the generated QR code and adjust size, colors, quiet zone, or error correction before downloading.",
            },
            {
                title: "Download PNG or SVG",
                text: "Use PNG for quick web uploads and SVG for print layouts or designs that need sharp scaling.",
            },
        ],
        faqs: [
            {
                question: "What is a QR code generator?",
                answer:
                    "A QR code generator is an online tool that turns a URL, text, WiFi login, email action, or contact card into a scannable QR code. This page lets you preview the QR code and download it as PNG or SVG.",
            },
            {
                question: "Is this QR code generator free?",
                answer:
                    "Yes. This free QR code generator does not require signup for normal use. You can create QR codes for links, text, WiFi, email, and contact details directly in your browser.",
            },
            {
                question: "Can I create a QR code for a website link?",
                answer:
                    "Yes. Choose URL mode, paste the website link, review the live preview, and download the final QR code as PNG or SVG.",
            },
            {
                question: "Can this generate WiFi QR codes that phones can join from?",
                answer:
                    "Yes. Choose WiFi mode, enter the network details, and export the generated code. Modern phones can usually interpret that payload directly from the camera.",
            },
            {
                question: "What is the difference between PNG and SVG QR codes?",
                answer:
                    "PNG is a fixed-size image for quick sharing and web uploads. SVG is vector-based, which makes it better for print, design files, signs, labels, and layouts that may scale.",
            },
            {
                question: "How do I make a QR code easier to scan?",
                answer:
                    "Use strong contrast, keep enough white space around the QR code, avoid very long payloads, and test the code at the final printed or displayed size.",
            },
            {
                question: "Why would I raise the error correction level?",
                answer:
                    "Higher correction helps the code survive small print sizes, light damage, and noisier layouts. The tradeoff is a denser QR pattern that may need a larger export size.",
            },
        ],
    },
    "online-word-counter": {
        heading: "Word Counter",
        canonicalUrl: `${SITE_URL}/productivity/online-word-counter`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Productivity Tools", item: `${SITE_URL}/category/productivity` },
            { name: "Word Counter", item: `${SITE_URL}/productivity/online-word-counter` },
        ],
        title: `Word Counter - Free Word and Character Counter | ${SITE_NAME}`,
        description:
            "Use this free word counter to count words, characters, sentences, paragraphs, and reading time online. Paste text and get instant results.",
        explainer:
            "Use this free word counter to count words, characters, characters without spaces, sentences, paragraphs, lines, reading time, and speaking time. The page targets practical text tasks such as word counter, free word counter no sign up, character counter, online word count, sentence counter, paragraph counter, reading time calculator, essay word counter, SEO word counter, and social media character counter. Writers can use it for blog posts, product descriptions, meta descriptions, newsletters, captions, essays, assignments, landing pages, ad copy, and long-form guides. Word count is useful for meeting limits, but strong writing still depends on clarity, search intent, structure, and usefulness.",
        steps: [
            {
                title: "Paste or type your text",
                text: "Add an essay, article, caption, meta description, product description, or any other text into the counter.",
            },
            {
                title: "Review the live counts",
                text: "Check words, characters, characters without spaces, sentences, paragraphs, lines, reading time, and speaking time.",
            },
            {
                title: "Edit to match the target",
                text: "Adjust your draft until it fits the required word count, character count, assignment limit, or platform limit.",
            },
        ],
        faqs: [
            {
                question: "What is a word counter?",
                answer:
                    "A word counter is an online tool that counts the number of words in pasted or typed text. This word counter also counts characters, sentences, paragraphs, characters without spaces, and estimated reading time.",
            },
            {
                question: "Is this word counter free?",
                answer:
                    "Yes. This free word counter works online without signup. Paste your text, review the live word count and character count, then edit until your content fits the required limit.",
            },
            {
                question: "Does this count characters as well as words?",
                answer:
                    "Yes. The tool shows total characters and characters without spaces. This makes it useful as a character counter for social media posts, meta descriptions, titles, essays, and short-form content.",
            },
            {
                question: "How is reading time calculated?",
                answer:
                    "Reading time is estimated by dividing the word count by 225 words per minute and rounding up. Actual reading speed can change based on topic difficulty, formatting, and reader familiarity.",
            },
            {
                question: "Can I use this for essays and assignments?",
                answer:
                    "Yes. Students can paste an essay, report, or assignment to check whether it is under or over the required word count. Always follow the exact counting rules from your teacher, school, or publisher.",
            },
            {
                question: "Can I use this word counter for SEO content?",
                answer:
                    "Yes. Writers and marketers can use it to check article length, meta description drafts, page copy, product descriptions, and blog posts. Word count is only one SEO signal, so focus on usefulness and search intent first.",
            },
            {
                question: "Does my text get saved?",
                answer:
                    "No. The counting happens in your browser for the current page session. If you refresh or close the page, the pasted text is cleared.",
            },
        ],
    },
    "online-age-calculator": {
        heading: "Age Calculator",
        canonicalUrl: `${SITE_URL}/time-date/online-age-calculator`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Time & Date Tools", item: `${SITE_URL}/category/time-date` },
            { name: "Age Calculator", item: `${SITE_URL}/time-date/online-age-calculator` },
        ],
        title: `Age Calculator - Calculate Exact Age from Date of Birth | ${SITE_NAME}`,
        description:
            "Use this free age calculator to calculate exact age from date of birth in years, months, days, total days, and next birthday.",
        explainer:
            "Use this free age calculator to calculate exact age from date of birth in years, months, days, total days, total months, weeks, and next birthday. This page targets high-intent date tasks such as age calculator, free age calculator, date of birth calculator, DOB calculator, birthday calculator, age in years months days, age in days calculator, how old am I calculator, calculate age from birth date, and age calculator by date. It works for personal milestones, birthday countdowns, school forms, sports age checks, HR planning, benefits timelines, event planning, and quick date math. The calculator uses real calendar dates instead of a rough 365-day estimate, so leap years and month lengths are included.",
        steps: [
            {
                title: "Enter the date of birth",
                text: "Add the birth date for the person whose age you want to calculate.",
            },
            {
                title: "Choose the comparison date",
                text: "Use today's date or select a past or future date for event, school, work, or birthday planning.",
            },
            {
                title: "Review the exact age",
                text: "Check age in years, months, days, total days, total months, completed weeks, and days until the next birthday.",
            },
        ],
        faqs: [
            {
                question: "What is an age calculator?",
                answer:
                    "An age calculator is an online tool that calculates exact age from a date of birth and a selected comparison date. It can show age in years, months, days, total days, total months, weeks, and days until the next birthday.",
            },
            {
                question: "How do I calculate my exact age?",
                answer:
                    "Enter your date of birth and choose the date you want to calculate age on. The calculator subtracts the birth date from the selected date and returns the completed years, remaining months, and remaining days.",
            },
            {
                question: "Can I calculate age on a future date?",
                answer:
                    "Yes. You can change the comparison date to a future date to calculate how old someone will be on a birthday, school date, work date, eligibility date, or event date.",
            },
            {
                question: "Can I calculate age in days?",
                answer:
                    "Yes. This age calculator shows total days lived from the date of birth to the selected date. It also shows total months and completed weeks for quick date-of-birth calculations.",
            },
            {
                question: "Does this date of birth calculator handle leap years?",
                answer:
                    "Yes. The calculator uses real calendar dates, so leap years, month lengths, and different year lengths are included in the result.",
            },
            {
                question: "What is the difference between age calculator and birthday calculator?",
                answer:
                    "An age calculator focuses on exact age in years, months, days, and totals. A birthday calculator usually focuses on the next birthday date, day of week, or countdown. This page includes both exact age and next birthday timing.",
            },
            {
                question: "Can I use this for official documents?",
                answer:
                    "This tool is useful for quick personal, school, HR, and planning estimates. For legal, immigration, insurance, medical, or official eligibility decisions, verify dates with the relevant document or authority.",
            },
        ],
    },
    "online-bmi-calculator": {
        heading: "BMI Calculator",
        canonicalUrl: `${SITE_URL}/health/online-bmi-calculator`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Health & Fitness Tools", item: `${SITE_URL}/category/health` },
            { name: "BMI Calculator", item: `${SITE_URL}/health/online-bmi-calculator` },
        ],
        title: `BMI Calculator - Calculate Body Mass Index | ${SITE_NAME}`,
        description:
            "Use this free BMI calculator to calculate body mass index with metric or imperial units and see adult BMI categories.",
        explainer:
            "Use this free BMI calculator to calculate body mass index from height and weight using metric or imperial units. This page targets high-intent health calculator searches such as BMI calculator, body mass index calculator, free BMI calculator, adult BMI calculator, BMI calculator metric, BMI calculator imperial, BMI chart, healthy BMI calculator, BMI formula, and weight category calculator. BMI is calculated from weight relative to height and is commonly used as an adult screening measure. For adults age 20 and older, common BMI categories are underweight below 18.5, healthy weight from 18.5 to less than 25, overweight from 25 to less than 30, and obesity at 30 or greater. BMI is not a diagnosis and does not directly measure body fat, muscle mass, waist size, body fat distribution, pregnancy status, or personal medical history. Children and teens need BMI-for-age percentiles based on age and sex.",
        steps: [
            {
                title: "Choose metric or imperial units",
                text: "Use centimeters and kilograms or feet, inches, and pounds.",
            },
            {
                title: "Enter height and weight",
                text: "Add accurate measurements to calculate body mass index.",
            },
            {
                title: "Review the BMI result",
                text: "Check the BMI number, adult BMI category, formula, and educational context. Use the result as a screening estimate, not medical advice.",
            },
        ],
        faqs: [
            {
                question: "What is a BMI calculator?",
                answer:
                    "A BMI calculator is an online tool that calculates body mass index from height and weight. BMI is commonly used as an adult screening measure for weight categories, but it does not directly measure body fat or diagnose health.",
            },
            {
                question: "How do I calculate BMI?",
                answer:
                    "For metric units, BMI equals weight in kilograms divided by height in meters squared. For US customary units, BMI equals weight in pounds divided by height in inches squared, multiplied by 703.",
            },
            {
                question: "What are the adult BMI categories?",
                answer:
                    "For adults age 20 and older, common BMI categories are underweight below 18.5, healthy weight from 18.5 to less than 25, overweight from 25 to less than 30, and obesity at 30 or greater.",
            },
            {
                question: "Is BMI accurate for everyone?",
                answer:
                    "BMI is useful for quick screening, but it has limits. It does not distinguish muscle from fat, does not show body fat distribution, and may be less informative for athletes, older adults, pregnant people, and some medical situations.",
            },
            {
                question: "Can children use this BMI calculator?",
                answer:
                    "This page is designed for adult BMI screening. Children and teens need BMI-for-age percentiles based on age and sex, so their results should be interpreted with a pediatric growth chart or a qualified healthcare professional.",
            },
            {
                question: "Does BMI diagnose obesity or health risk?",
                answer:
                    "No. BMI is a screening measure, not a diagnosis. A healthcare professional may consider BMI along with waist circumference, medical history, blood pressure, labs, body composition, symptoms, medications, and other factors.",
            },
            {
                question: "What is a healthy BMI?",
                answer:
                    "For most adults, the standard healthy weight BMI category is 18.5 to less than 25. Your personal health picture can still depend on body composition, waist measurement, fitness, age, medical conditions, and clinical guidance.",
            },
        ],
    },
    "online-percentage-calculator": {
        heading: "Percentage Calculator",
        canonicalUrl: `${SITE_URL}/math/online-percentage-calculator`,
        breadcrumbItems: [
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Math Tools", item: `${SITE_URL}/category/math` },
            { name: "Percentage Calculator", item: `${SITE_URL}/math/online-percentage-calculator` },
        ],
        title: `Percentage Calculator - Percent Increase, Decrease and Difference | ${SITE_NAME}`,
        description:
            "Use this free percentage calculator to calculate percent of a number, percentage increase, percentage decrease, and percent difference.",
        explainer:
            "Use this free percentage calculator to calculate percent of a number, what percent one number is of another, percentage increase, percentage decrease, percentage change, and percent difference. This page targets high-intent percentage tasks such as percentage calculator, percent calculator, percentage increase calculator, percentage decrease calculator, percent difference calculator, percentage change calculator, what percent is X of Y, and what is X percent of Y. It is useful for discounts, tips, sales tax, grades, price changes, business metrics, finance, savings, commissions, markups, markdowns, and everyday math. Percentage formulas are simple: percent of a number equals percent divided by 100 multiplied by the number; percentage increase equals new value minus original value divided by original value multiplied by 100; percentage decrease equals original value minus new value divided by original value multiplied by 100.",
        steps: [
            {
                title: "Choose the percentage calculation",
                text: "Use percent of a number, what percent is X of Y, percentage change, percentage increase, percentage decrease, or percent difference.",
            },
            {
                title: "Enter the values",
                text: "Add the percentage and number, part and whole, or original and new values depending on the calculation.",
            },
            {
                title: "Review the instant result",
                text: "Use the result for discounts, grades, finance, sales, tax estimates, tips, or other everyday percentage math.",
            },
        ],
        faqs: [
            {
                question: "What is a percentage calculator?",
                answer:
                    "A percentage calculator is an online tool that helps calculate percent of a number, what percent one number is of another, percentage increase, percentage decrease, percentage change, and percent difference.",
            },
            {
                question: "How do I calculate a percentage of a number?",
                answer:
                    "To calculate a percentage of a number, divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 0.20 multiplied by 150, which equals 30.",
            },
            {
                question: "How do I calculate percentage increase?",
                answer:
                    "Subtract the original value from the new value, divide by the original value, then multiply by 100. For example, an increase from 50 to 60 is ((60 - 50) / 50) x 100 = 20%.",
            },
            {
                question: "How do I calculate percentage decrease?",
                answer:
                    "Subtract the new value from the original value, divide by the original value, then multiply by 100. For example, a decrease from 80 to 60 is ((80 - 60) / 80) x 100 = 25%.",
            },
            {
                question: "What is percent difference?",
                answer:
                    "Percent difference compares two values by dividing their absolute difference by their average, then multiplying by 100. It is useful when neither value is clearly the original value.",
            },
            {
                question: "Can I use this for discounts and sales tax?",
                answer:
                    "Yes. You can use the percent of a number calculator for discounts, tips, tax estimates, commissions, markdowns, and quick shopping calculations.",
            },
        ],
    },
};

function loadToolsModule() {
    const source = fs.readFileSync(toolsPath, "utf8");
    const transpiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
        },
    }).outputText;

    const sandbox = {
        exports: {},
        module: { exports: {} },
        require,
        console,
        process,
        __dirname: path.dirname(toolsPath),
        __filename: toolsPath,
    };

    sandbox.exports = sandbox.module.exports;
    vm.runInNewContext(transpiled, sandbox, { filename: toolsPath });
    return sandbox.module.exports;
}

function ensureBuildOutput() {
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Missing build template: ${templatePath}`);
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function normalizePath(pathname) {
    if (!pathname || pathname === "/") {
        return "/";
    }

    return pathname.replace(/\/+$/, "") || "/";
}

function toAbsoluteUrl(pathOrUrl) {
    if (/^https?:\/\//i.test(pathOrUrl)) {
        return pathOrUrl;
    }

    const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${SITE_URL}${normalizedPath}`;
}

function normalizeSchemaTypes(typeValue) {
    if (Array.isArray(typeValue)) {
        return typeValue.filter((item) => typeof item === "string");
    }

    return typeof typeValue === "string" ? [typeValue] : [];
}

function getBreadcrumbTarget(node) {
    const itemListElement = Array.isArray(node.itemListElement) ? node.itemListElement : [];
    const lastItem = itemListElement.at(-1);

    if (!lastItem || typeof lastItem !== "object") {
        return null;
    }

    return typeof lastItem.item === "string" ? lastItem.item : null;
}

function getSchemaNodeKey(node) {
    const types = normalizeSchemaTypes(node["@type"]);
    const url = typeof node.url === "string" ? node.url : null;
    const id = typeof node["@id"] === "string" ? node["@id"] : null;
    const entityKey = url ?? (id ? id.replace(/#.*$/, "") : null);

    if (types.includes("WebSite")) {
        return `website:${entityKey ?? SITE_URL}`;
    }

    if (types.includes("Organization")) {
        return `organization:${entityKey ?? SITE_URL}`;
    }

    if (types.includes("WebPage")) {
        return `webpage:${entityKey ?? "page"}`;
    }

    if (types.includes("CollectionPage")) {
        return `collection:${entityKey ?? "collection"}`;
    }

    if (types.includes("AboutPage")) {
        return `about:${entityKey ?? "about"}`;
    }

    if (types.includes("BreadcrumbList")) {
        return `breadcrumb:${getBreadcrumbTarget(node) ?? entityKey ?? "page"}`;
    }

    if (types.includes("FAQPage")) {
        return `faq:${entityKey ?? "page"}`;
    }

    if (types.includes("HowTo")) {
        return `howto:${entityKey ?? "page"}`;
    }

    if (types.includes("SoftwareApplication") || types.includes("WebApplication")) {
        return `app:${entityKey ?? (typeof node.name === "string" ? node.name : "page")}`;
    }

    if (id) {
        return `id:${id}`;
    }

    return `node:${types.sort().join("|")}:${entityKey ?? ""}:${typeof node.name === "string" ? node.name : ""}`;
}

function dedupeSchemaNodes(nodes) {
    const deduped = new Map();

    for (const node of nodes) {
        if (!node || typeof node !== "object" || Object.keys(node).length === 0) {
            continue;
        }

        deduped.set(getSchemaNodeKey(node), node);
    }

    return Array.from(deduped.values());
}

function createOrganizationSchema() {
    return {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            "@type": "ImageObject",
            url: SITE_LOGO,
        },
        image: SITE_OG_IMAGE,
    };
}

function createWebsiteSchema(description) {
    return {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description,
        inLanguage: SITE_LANGUAGE,
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}

function createWebPageSchema(canonicalUrl, name, description) {
    return {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name,
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: {
            "@id": `${SITE_URL}/#website`,
        },
        about: {
            "@id": `${SITE_URL}/#organization`,
        },
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        primaryImageOfPage: {
            "@type": "ImageObject",
            url: SITE_OG_IMAGE,
        },
    };
}

function createBreadcrumbSchema(items) {
    const lastItem = items.at(-1)?.item;

    return {
        "@type": "BreadcrumbList",
        ...(lastItem ? { "@id": `${lastItem}#breadcrumb` } : {}),
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    };
}

function createFaqSchema(canonicalUrl, faqs) {
    return {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

function createHowToSchema(canonicalUrl, name, steps) {
    return {
        "@type": "HowTo",
        "@id": `${canonicalUrl}#howto`,
        name,
        step: steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: step.text,
        })),
    };
}

function createCollectionPageSchema(canonicalUrl, name, description) {
    return {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#collection`,
        name,
        url: canonicalUrl,
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: {
            "@id": `${SITE_URL}/#website`,
        },
        about: {
            "@id": `${SITE_URL}/#organization`,
        },
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
    };
}

function createWebApplicationSchema(name, canonicalUrl, description, category, priceCurrency = "USD") {
    return {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${canonicalUrl}#webapplication`,
        name,
        url: canonicalUrl,
        description,
        applicationCategory: category,
        isAccessibleForFree: true,
        inLanguage: SITE_LANGUAGE,
        image: SITE_OG_IMAGE,
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        mainEntityOfPage: {
            "@id": `${canonicalUrl}#webpage`,
        },
        isPartOf: {
            "@id": `${SITE_URL}/#website`,
        },
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in modern browsers.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency,
        },
    };
}

function buildSchemaGraph({ canonicalUrl, title, description, customNodes = [] }) {
    return {
        "@context": "https://schema.org",
        "@graph": dedupeSchemaNodes([
            createWebsiteSchema(SITE_DESCRIPTION),
            createOrganizationSchema(),
            createWebPageSchema(canonicalUrl, title, description),
            ...customNodes,
        ]),
    };
}

function localizeSchemaGraph(schemaGraph, language) {
    return {
        ...schemaGraph,
        "@graph": schemaGraph["@graph"].map((node) =>
            Object.prototype.hasOwnProperty.call(node, "inLanguage") ? { ...node, inLanguage: language } : node,
        ),
    };
}

function extractAssetTags(templateHtml) {
    const tagMatches = templateHtml.match(/<script\b[^>]*><\/script>|<link\b[^>]*>/g) ?? [];
    return tagMatches
        .filter((tag) => tag.includes("stylesheet") || tag.includes("modulepreload") || tag.startsWith("<script"))
        .join("\n    ");
}

function extractBodyContent(templateHtml) {
    const match = templateHtml.match(/<body>([\s\S]*?)<\/body>/i);
    return match ? match[1].trim() : '<div id="root"></div>';
}

function renderHtml({
    title,
    description,
    canonicalUrl,
    schemaGraph,
    assetTags,
    bodyContent,
    robots = DEFAULT_ROBOTS,
    language = SITE_LANGUAGE,
}) {
    const serializedSchema = JSON.stringify(schemaGraph).replace(/</g, "\\u003c");

    return `<!DOCTYPE html>
<html lang="${language}">
  <head>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6438644207209483" crossorigin="anonymous"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="application-name" content="${SITE_NAME}" />
    <meta name="theme-color" content="#ff6b35" />
    <meta name="color-scheme" content="light dark" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="${language === "pt-BR" ? "pt_BR" : language === "tr" ? "tr_TR" : language === "pl" ? "pl_PL" : "en_US"}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${SITE_OG_IMAGE}" />
    <meta property="og:image:secure_url" content="${SITE_OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="${SITE_NAME} preview image" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${SITE_TWITTER_HANDLE}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_OG_IMAGE}" />
    <meta name="twitter:image:alt" content="${SITE_NAME} preview image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="${language.toLowerCase()}" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="x-default" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="${SITE_LOGO}" />
    <script type="application/ld+json" data-schema-graph="primary">${serializedSchema}</script>
    ${assetTags}
  </head>
  <body>
    ${bodyContent}
    <noscript>This site works best with JavaScript enabled.</noscript>
  </body>
</html>
`;
}

function renderStaticShell({ heading, intro, trustNote, explainer, steps = [], faqs = [], links = [], labels = {} }) {
    const {
        trust = "Privacy note",
        howTo = "How to use this tool",
        details = "About this tool",
        faq = "FAQ",
        related = "Related tools",
    } = labels;
    const stepMarkup = steps
        .map((step) => `<li><strong>${escapeHtml(step.title)}:</strong> ${escapeHtml(step.text)}</li>`)
        .join("\n          ");
    const faqMarkup = faqs
        .map(
            (faq) =>
                `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`,
        )
        .join("\n          ");
    const linkMarkup = links
        .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
        .join("\n            ");

    return `<main class="seo-prerender" aria-labelledby="seo-page-title">
      <section>
        <h1 id="seo-page-title">${escapeHtml(heading)}</h1>
        <p>${escapeHtml(intro)}</p>
        ${trustNote ? `<p><strong>${escapeHtml(trust)}:</strong> ${escapeHtml(trustNote)}</p>` : ""}
      </section>
      ${steps.length ? `<section aria-labelledby="seo-howto"><h2 id="seo-howto">${escapeHtml(howTo)}</h2><ol>${stepMarkup}</ol></section>` : ""}
      ${explainer ? `<section aria-labelledby="seo-details"><h2 id="seo-details">${escapeHtml(details)}</h2><p>${escapeHtml(explainer)}</p></section>` : ""}
      ${faqs.length ? `<section aria-labelledby="seo-faq"><h2 id="seo-faq">${escapeHtml(faq)}</h2>${faqMarkup}</section>` : ""}
      ${links.length ? `<nav aria-labelledby="seo-related"><h2 id="seo-related">${escapeHtml(related)}</h2><ul>${linkMarkup}</ul></nav>` : ""}
    </main>`;
}

function injectStaticShell(bodyContent, staticHtml) {
    if (!staticHtml) {
        return bodyContent;
    }

    const hydratedRoot = `<div id="root">${staticHtml}</div>`;
    if (bodyContent.includes('<div id="root"></div>')) {
        return bodyContent.replace('<div id="root"></div>', hydratedRoot);
    }

    return `${hydratedRoot}\n${bodyContent}`;
}

function writeRouteHtml(routePath, html) {
    const normalized = normalizePath(routePath);
    const targetPath =
        normalized === "/" ?
        templatePath :
        /\.[a-z0-9]+$/i.test(normalized) ?
        path.join(distPublicDir, normalized.replace(/^\//, "")) :
        path.join(distPublicDir, normalized.replace(/^\//, ""), "index.html");

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, html);
}

function getToolApplicationCategory(categoryId) {
    switch (categoryId) {
        case "education":
            return "EducationalApplication";
        case "health":
            return "HealthApplication";
        case "image":
            return "MultimediaApplication";
        case "pdf":
            return "UtilitiesApplication";
        default:
            return "UtilityApplication";
    }
}

function getToolHeading(title) {
    return /^online\b/i.test(title) ? title : `Online ${title}`;
}

function getToolActionLabel(title) {
    return title
        .replace(/\b(generator|calculator|converter|formatter|checker|tool|editor|timer|counter)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim() || title;
}

function buildToolSteps(tool) {
    const action = getToolActionLabel(tool.title).toLowerCase();
    return [
        {
            title: "Enter your input",
            text: `Add the details, file, text, or values you want to process with the ${tool.title}.`,
        },
        {
            title: "Review the result",
            text: `Check the live ${action} output and adjust the options if the page provides extra controls.`,
        },
        {
            title: "Copy or download",
            text: "Use the final result in your document, project, calculation, image workflow, or next online task.",
        },
    ];
}

function buildToolFaqs(tool) {
    return [
        {
            question: `Is the ${tool.title} free to use?`,
            answer: `Yes. The ${tool.title} is free to use online and does not require signup for normal browser-based use.`,
        },
        {
            question: `What is the ${tool.title} used for?`,
            answer: tool.metaDescription || tool.description,
        },
        {
            question: "Does this page work in the browser?",
            answer: "Yes. US Online Tools is built for fast browser-based workflows, so you can complete common tasks without installing desktop software.",
        },
    ];
}

function buildToolExplainer(tool, category) {
    const categoryName = category?.name ?? tool.category ?? "online utility";
    return `${tool.title} helps you complete a specific ${categoryName.toLowerCase()} task quickly from a standard web browser. ${tool.description} Use it when you need a clear result without installing extra software, creating an account, or moving through a complicated workflow. The page is designed around the practical job: enter the relevant input, review the output, and continue to the next related task. For best results, check the input values carefully, compare the result against your real-world context, and use the related tools below when you need conversion, formatting, calculation, compression, validation, or a follow-up action.`;
}

function buildRelatedToolLinks(tools, currentSlug, categoryId, limit = 6) {
    return tools.DISPLAY_ALL_TOOLS
        .filter((candidate) => candidate.implemented !== false)
        .filter((candidate) => candidate.slug !== currentSlug)
        .filter((candidate) => tools.getCategoryIdBySlug(candidate.slug) === categoryId)
        .slice(0, limit)
        .map((candidate) => ({
            label: candidate.title,
            href: tools.getCanonicalToolPath(candidate.slug),
        }));
}

function buildHomeStaticHtml(tools, heading, description) {
    const categoryLinks = tools.DISPLAY_TOOL_CATEGORIES.slice(0, 12).map((category) => ({
        label: `${category.name} Tools`,
        href: `/category/${category.id}`,
    }));

    return renderStaticShell({
        heading,
        intro: description,
        trustNote: "Many tools run directly in your browser for quick calculations, formatting, conversion, and utility tasks.",
        explainer: `${SITE_NAME} is a searchable library of ${tools.SITE_TOOL_COUNT} browser-based tools for calculators, converters, PDF tasks, image editing, developer utilities, security helpers, and productivity workflows. Start from a category hub or open a specific tool page to complete one focused task with a clear input and output.`,
        steps: [
            { title: "Choose a category", text: "Open the hub that matches your task, such as PDF tools, image tools, calculators, or developer tools." },
            { title: "Select a tool", text: "Use the crawlable category links to reach the exact calculator, converter, generator, or editor you need." },
            { title: "Complete the task", text: "Enter your input, review the result, and continue with a related tool if your workflow has another step." },
        ],
        faqs: [
            { question: "What is US Online Tools?", answer: `${SITE_NAME} is a free online utility site with calculators, converters, generators, developer tools, PDF tools, image tools, and productivity helpers.` },
            { question: "Do I need an account?", answer: "No. The tools are built for quick browser-based use without a normal signup step." },
            { question: "Are the tools organized by category?", answer: "Yes. Category hubs group related tools so users and search engines can find the right page through standard links." },
        ],
        links: categoryLinks,
    });
}

function buildCategoryStaticHtml(category, links) {
    return renderStaticShell({
        heading: `${category.name} Tools`,
        intro: `${category.description}. Browse free ${category.name.toLowerCase()} tools with direct links to each task-focused page.`,
        trustNote: "Open the exact tool you need from a standard link, then complete the task in your browser.",
        explainer: `${category.name} is a dedicated hub for related online utilities. Each page is built around one task, with a clear title, canonical URL, short explanation, usage steps, frequently asked questions, and links to other tools in the same workflow. Use this category when you want a focused tool instead of a broad software suite.`,
        steps: [
            { title: "Scan the hub", text: `Review the available ${category.name.toLowerCase()} tools and choose the closest match for your task.` },
            { title: "Open the tool page", text: "Follow the standard link so the page can be discovered, crawled, and shared directly." },
            { title: "Continue the workflow", text: "Use related links on each tool page when you need a follow-up action." },
        ],
        faqs: [
            { question: `What can I find in ${category.name}?`, answer: category.description },
            { question: "Are these pages indexable?", answer: "Yes. The category and tool pages include canonical URLs, crawlable links, and page-specific metadata." },
            { question: "Can I open a specific tool directly?", answer: "Yes. Every listed tool has its own URL so it can be bookmarked, shared, crawled, and indexed." },
        ],
        links,
    });
}

function buildInfoPageStaticHtml({ heading, intro, explainer, steps, links }) {
    return renderStaticShell({
        heading,
        intro,
        trustNote: "US Online Tools is built for direct, browser-based utility tasks with clear pages, standard links, and crawlable static content.",
        explainer,
        steps,
        links,
    });
}

function buildToolStaticHtml(tool, category, relatedLinks, heading, override) {
    const steps = override?.steps ?? buildToolSteps(tool);
    const faqs = override?.faqs ?? buildToolFaqs(tool);
    const explainer = override?.explainer ?? buildToolExplainer(tool, category);

    return renderStaticShell({
        heading,
        intro: `${tool.metaDescription} ${tool.description}`,
        trustNote: "For normal use, the interactive workflow is designed to run in your browser and keep the task fast without account friction.",
        explainer,
        steps,
        faqs,
        links: [
            ...(category ? [{ label: `${category.name} Tools`, href: `/category/${category.id}` }] : []),
            ...relatedLinks,
        ],
    });
}

function buildRoutes(tools) {
    const routes = [];
    const homepageTools = tools.DISPLAY_ALL_TOOLS.filter((tool) => tool.implemented !== false);
    const homeDescription = `${tools.SITE_TOOL_COUNT} free online tools including calculators, converters, generators, and utilities. No signup required. 100% free at usonlinetools.com.`;

    routes.push({
        path: "/",
        title: `Free Online Tools - ${SITE_NAME}`,
        description: homeDescription,
        canonicalUrl: SITE_URL,
        staticHtml: buildHomeStaticHtml(tools, `Free Online Tools`, homeDescription),
        schemaGraph: buildSchemaGraph({
            canonicalUrl: SITE_URL,
            title: `Free Online Tools - ${SITE_NAME}`,
            description: homeDescription,
            customNodes: [
                createCollectionPageSchema(
                    SITE_URL,
                    `${SITE_NAME} Home`,
                    `${tools.SITE_TOOL_COUNT} free online tools including calculators, converters, generators, and utilities.`,
                ),
            ],
        }),
    });

    for (const category of tools.DISPLAY_TOOL_CATEGORIES) {
        const canonicalUrl = `${SITE_URL}/category/${category.id}`;
        const description = `${category.description}. ${category.tools.length} free online ${category.name.toLowerCase()} tools. No signup required.`;

        routes.push({
            path: `/category/${category.id}`,
            title: `${category.name} - Free Online Tools | ${SITE_NAME}`,
            description,
            canonicalUrl,
            staticHtml: buildCategoryStaticHtml(
                category,
                category.tools
                    .filter((tool) => tool.implemented !== false)
                    .slice(0, 12)
                    .map((tool) => ({
                        label: tool.title,
                        href: tools.getCanonicalToolPath(tool.slug),
                    })),
            ),
            schemaGraph: buildSchemaGraph({
                canonicalUrl,
                title: `${category.name} - Free Online Tools | ${SITE_NAME}`,
                description,
                customNodes: [
                    createCollectionPageSchema(canonicalUrl, `${category.name} Tools`, description),
                    createBreadcrumbSchema([
                        { name: "Home", item: SITE_URL },
                        { name: category.name, item: canonicalUrl },
                    ]),
                ],
            }),
        });
    }

    const staticPages = [{
            path: "/about",
            title: `About ${SITE_NAME} | ${SITE_NAME}`,
            description: "Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use.",
            staticHtml: buildInfoPageStaticHtml({
                heading: `About ${SITE_NAME}`,
                intro: "US Online Tools is a free online tools website with calculators, converters, generators, image tools, PDF tools, developer utilities, and productivity helpers.",
                explainer: "The site is organized around task-focused pages with descriptive URLs, self-referencing canonical tags, static crawlable HTML, JSON-LD structured data, sitemap coverage, and internal links from category hubs. Most tools are designed for quick browser-based workflows with no signup requirement.",
                steps: [
                    { title: "Choose a category", text: "Start from a calculator, converter, image, PDF, developer, security, SEO, or productivity category." },
                    { title: "Open the exact tool", text: "Use standard links to reach a focused page for one task." },
                    { title: "Complete the task", text: "Enter the required information and use the result directly in your browser." },
                ],
                links: [
                    { label: "All Tool Categories", href: "/" },
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "Terms of Service", href: "/terms-of-service" },
                ],
            }),
            customNodes: [{
                    "@type": "AboutPage",
                    name: `About ${SITE_NAME}`,
                    url: `${SITE_URL}/about`,
                    description: "Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use.",
                },
                createBreadcrumbSchema([
                    { name: "Home", item: SITE_URL },
                    { name: "About", item: `${SITE_URL}/about` },
                ]),
            ],
        },
        {
            path: "/privacy-policy",
            title: `Privacy Policy | ${SITE_NAME}`,
            description: "Read the privacy policy for US Online Tools, including how browser-based tools process data and what limited information may be collected by hosting infrastructure.",
            staticHtml: buildInfoPageStaticHtml({
                heading: "Privacy Policy",
                intro: "This privacy policy explains how US Online Tools handles browser-based tool usage, hosting logs, advertising scripts, and standard website operations.",
                explainer: "Many calculator and utility tasks are designed to run in the browser for fast use. Hosting providers, analytics, advertising networks, and security systems may process limited technical information such as IP address, browser type, referrer, pages requested, device information, and timestamps. Do not enter sensitive personal, medical, legal, or financial information into tools unless you understand the context and risk.",
                steps: [
                    { title: "Use tools intentionally", text: "Only enter information needed for the calculation, conversion, or generation task." },
                    { title: "Review third-party scripts", text: "Advertising and analytics providers may process data according to their own policies." },
                    { title: "Contact the site owner", text: "Use the available site contact route if privacy questions require follow-up." },
                ],
                links: [
                    { label: "About US Online Tools", href: "/about" },
                    { label: "Terms of Service", href: "/terms-of-service" },
                    { label: "All Tools", href: "/" },
                ],
            }),
            customNodes: [
                createBreadcrumbSchema([
                    { name: "Home", item: SITE_URL },
                    { name: "Privacy Policy", item: `${SITE_URL}/privacy-policy` },
                ]),
            ],
        },
        {
            path: "/terms-of-service",
            title: `Terms of Service | ${SITE_NAME}`,
            description: "Review the terms of service for using US Online Tools, including acceptable use, informational disclaimers, and site availability limitations.",
            staticHtml: buildInfoPageStaticHtml({
                heading: "Terms of Service",
                intro: "These terms describe acceptable use of US Online Tools, including informational limits, availability limits, and user responsibility for results.",
                explainer: "US Online Tools provides free online calculators, converters, generators, and utility pages for general informational use. Tool outputs depend on the values entered and the assumptions used by each tool. Health, finance, legal, education, construction, and similar results should be treated as estimates unless verified by a qualified professional or official source.",
                steps: [
                    { title: "Use the site lawfully", text: "Do not misuse tools, overload the service, or attempt to interfere with normal operation." },
                    { title: "Verify important results", text: "Check critical outputs before using them for professional, medical, legal, financial, or official decisions." },
                    { title: "Understand availability", text: "Tools may change, move, or become unavailable as the site is maintained." },
                ],
                links: [
                    { label: "About US Online Tools", href: "/about" },
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "All Tools", href: "/" },
                ],
            }),
            customNodes: [
                createBreadcrumbSchema([
                    { name: "Home", item: SITE_URL },
                    { name: "Terms of Service", item: `${SITE_URL}/terms-of-service` },
                ]),
            ],
        },
        {
            path: "/404.html",
            title: `404 - Page Not Found | ${SITE_NAME}`,
            description: "The requested page could not be found on US Online Tools.",
            robots: "noindex, follow",
            customNodes: [],
        },
    ];

    for (const page of staticPages) {
        const canonicalUrl = `${SITE_URL}${page.path}`;
        routes.push({
            path: page.path,
            title: page.title,
            description: page.description,
            robots: page.robots,
            canonicalUrl,
            staticHtml: page.staticHtml,
            schemaGraph: buildSchemaGraph({
                canonicalUrl,
                title: page.title,
                description: page.description,
                customNodes: page.customNodes,
            }),
        });
    }

    const localizedFinancePages = [
        {
            path: "/yuzde-hesaplama",
            heading: "Yüzde Hesaplama",
            title: `Yüzde Hesaplama | ${SITE_NAME}`,
            description:
                "Türkçe yüzde hesaplama aracıyla yüzde bulma, yüzde artış, yüzde azalış, oran ve değişim hesaplarını hızlıca yapın.",
            explainer:
                "Bu sayfa Türkçe yüzde hesaplama işlemleri için tasarlanmıştır. Yüzde oranını, bir sayının yüzdesini, yüzde artış ve yüzde azalış sonuçlarını tarayıcıda hızlıca hesaplayabilirsiniz.",
            faqs: [
                { question: "Yüzde nasıl hesaplanır?", answer: "Bir sayının yüzdesi, sayı × yüzde / 100 formülüyle hesaplanır." },
                { question: "Yüzde artış nasıl bulunur?", answer: "Yeni değer ile eski değer arasındaki fark eski değere bölünür ve 100 ile çarpılır." },
                { question: "Hesaplama ücretsiz mi?", answer: "Evet, araç ücretsizdir ve kayıt gerektirmez." },
            ],
            links: [
                { label: "Matematik Araçları", href: "/category/math" },
            ],
            language: "tr",
            categoryLabel: "Matematik",
            categoryHref: "/category/math",
            appCategory: "UtilitiesApplication",
        },
        {
            path: "/ar/hesab-alomr",
            heading: "حاسبة العمر",
            title: `حاسبة العمر | ${SITE_NAME}`,
            description:
                "احسب العمر بالسنوات والأشهر والأيام من تاريخ الميلاد، مع نتيجة عربية واضحة تعمل مباشرة في المتصفح.",
            explainer:
                "تساعدك حاسبة العمر العربية على معرفة العمر من تاريخ الميلاد حتى اليوم أو حتى تاريخ تختاره، مع عرض السنوات والأشهر والأيام بصيغة سهلة القراءة.",
            faqs: [
                { question: "كيف يتم حساب العمر؟", answer: "يتم حساب الفرق بين تاريخ الميلاد والتاريخ المختار بالسنوات ثم الأشهر ثم الأيام." },
                { question: "هل تدعم الحاسبة تاريخاً مخصصاً؟", answer: "نعم، يمكن استخدام تاريخ اليوم أو اختيار تاريخ آخر للحساب." },
                { question: "هل تحفظ الحاسبة تاريخ الميلاد؟", answer: "لا، الحساب يتم داخل المتصفح ولا يتطلب حساباً." },
            ],
            links: [
                { label: "أدوات الوقت والتاريخ", href: "/category/time-date" },
            ],
            language: "ar",
            categoryLabel: "الوقت والتاريخ",
            categoryHref: "/category/time-date",
            appCategory: "UtilitiesApplication",
        },
        {
            path: "/ar/tahweel-altareekh",
            heading: "تحويل التاريخ الهجري والميلادي",
            title: `تحويل التاريخ الهجري والميلادي | ${SITE_NAME}`,
            description:
                "حوّل التاريخ بين الهجري والميلادي بواجهة عربية واتجاه RTL، مع نتيجة فورية داخل المتصفح.",
            explainer:
                "هذه الأداة تساعد على تحويل التاريخ من الميلادي إلى الهجري أو من الهجري إلى الميلادي لأغراض التخطيط والمراجعة اليومية. قد تختلف الرؤية الشرعية أو التقويم المحلي في بعض الدول.",
            faqs: [
                { question: "هل التحويل الهجري دقيق دائماً؟", answer: "التحويل يعطي نتيجة حسابية تقريبية، وقد تختلف بعض التواريخ حسب الرؤية المحلية." },
                { question: "هل يمكن التحويل في الاتجاهين؟", answer: "نعم، يمكن التحويل من الميلادي إلى الهجري ومن الهجري إلى الميلادي." },
                { question: "هل الأداة مجانية؟", answer: "نعم، الأداة مجانية وتعمل في المتصفح." },
            ],
            links: [
                { label: "أدوات الوقت والتاريخ", href: "/category/time-date" },
            ],
            language: "ar",
            categoryLabel: "الوقت والتاريخ",
            categoryHref: "/category/time-date",
            appCategory: "UtilitiesApplication",
        },
        {
            path: "/calculadora-juros-compostos",
            heading: "Calculadora de Juros Compostos",
            title: `Calculadora de Juros Compostos | ${SITE_NAME}`,
            description:
                "Calcule juros compostos com aporte inicial, aportes mensais, taxa, prazo e memória de cálculo em português do Brasil.",
            explainer:
                "Esta calculadora mostra a evolução de um investimento com juros compostos, separando valor investido, juros acumulados e saldo final. Use como simulação matemática, não como recomendação financeira.",
            faqs: [
                { question: "Como calcular juros compostos?", answer: "Use a fórmula montante = capital × (1 + taxa)^tempo, somando aportes quando existirem." },
                { question: "A calculadora aceita aportes mensais?", answer: "Sim, ela considera aporte inicial, aportes recorrentes, taxa e prazo." },
                { question: "O resultado é recomendação de investimento?", answer: "Não. É uma simulação matemática para planejamento." },
            ],
            links: [
                { label: "Ferramentas de Finanças", href: "/category/finance" },
            ],
            language: "pt-BR",
            categoryLabel: "Finanças",
            categoryHref: "/category/finance",
            appCategory: "FinanceApplication",
        },
        {
            path: "/kalkulator-umur",
            heading: "Kalkulator Umur",
            title: `Kalkulator Umur | ${SITE_NAME}`,
            description:
                "Hitung umur dalam tahun, bulan, dan hari dari tanggal lahir dengan kalkulator umur bahasa Indonesia.",
            explainer:
                "Kalkulator umur ini menghitung selisih antara tanggal lahir dan tanggal acuan, lalu menampilkan umur dalam tahun, bulan, hari, total hari, dan ringkasan yang mudah dibaca.",
            faqs: [
                { question: "Bagaimana cara menghitung umur?", answer: "Umur dihitung dari selisih tanggal lahir sampai tanggal acuan dalam tahun, bulan, dan hari." },
                { question: "Apakah bisa memakai tanggal acuan selain hari ini?", answer: "Ya, gunakan tanggal acuan khusus jika ingin menghitung umur pada tanggal tertentu." },
                { question: "Apakah tanggal lahir disimpan?", answer: "Tidak, perhitungan dilakukan di browser." },
            ],
            links: [
                { label: "Alat waktu dan tanggal", href: "/category/time-date" },
            ],
            language: "id",
            categoryLabel: "Waktu dan Tanggal",
            categoryHref: "/category/time-date",
            appCategory: "UtilitiesApplication",
        },
        {
            path: "/kdv-hesaplama",
            heading: "KDV Hesaplama",
            title: `KDV Hesaplama | ${SITE_NAME}`,
            description:
                "KDV dahil, KDV hariç ve KDV tutarından matrah hesaplamalarını Türkçe olarak %20, %10, %1 veya özel oranla yapın.",
            explainer:
                "Bu Türkçe KDV hesaplama aracı, KDV hariç tutardan KDV dahil toplamı, KDV dahil tutardan matrahı ve yalnız KDV tutarından vergi matrahını hesaplar.",
            faqs: [
                { question: "KDV nasıl hesaplanır?", answer: "KDV hariç tutar oranla çarpılır ve 100'e bölünür." },
                { question: "KDV dahil tutardan KDV nasıl çıkarılır?", answer: "Dahil tutarı 1 + oran/100 değerine bölerek matrahı bulun, sonra toplamdan çıkarın." },
                { question: "Özel oran kullanabilir miyim?", answer: "Evet, eski dönem veya özel hesaplamalar için manuel oran girebilirsiniz." },
            ],
            links: [
                { label: "Finans Araçları", href: "/category/finance" },
                { label: "Yüzde Hesaplama", href: "/yuzde-hesaplama" },
            ],
            language: "tr",
            categoryLabel: "Finans",
            categoryHref: "/category/finance",
            appCategory: "FinanceApplication",
        },
        {
            path: "/calculo-rescisao",
            heading: "Calculadora de Rescisão Trabalhista CLT",
            title: `Calculadora de Rescisão CLT 2026 | ${SITE_NAME}`,
            description:
                "Calcule rescisão trabalhista CLT com salário, datas, aviso prévio, 13º, férias, INSS, IRRF e multa do FGTS separada.",
            explainer:
                "Esta página estima verbas de rescisão CLT no Brasil e separa o pagamento líquido feito pela empresa da multa do FGTS. A calculadora cobre dispensa sem justa causa, pedido de demissão, acordo trabalhista do art. 484-A e justa causa, com memória de cálculo para saldo de salário, aviso prévio, 13º proporcional, férias, INSS, IRRF, descontos e FGTS.",
            faqs: [
                { question: "A calculadora mostra o valor líquido da rescisão?", answer: "Ela estima o pagamento líquido feito pela empresa depois de INSS, IRRF e descontos informados. A multa do FGTS fica separada porque normalmente não é paga junto no TRCT." },
                { question: "Como o aviso prévio é calculado?", answer: "A ferramenta usa 30 dias e acrescenta 3 dias por ano completo trabalhado, limitado a 90 dias. No acordo trabalhista, o aviso indenizado entra pela metade." },
                { question: "Pedido de demissão tem multa de 40% do FGTS?", answer: "Não. Em regra, pedido de demissão não gera multa de 40% nem saque integral do FGTS." },
            ],
            links: [
                { label: "Calculadora de Férias", href: "/calculo-ferias" },
                { label: "Ferramentas de Finanças", href: "/category/finance" },
            ],
        },
        {
            path: "/calculo-ferias",
            heading: "Calculadora de Férias CLT",
            title: `Calculadora de Férias CLT 2026 | ${SITE_NAME}`,
            description:
                "Calcule férias CLT com 1/3, abono pecuniário, INSS, IRRF, dependentes, redução 2026, férias proporcionais e memória de cálculo.",
            explainer:
                "Esta página estima férias gozadas durante contrato ativo no Brasil. O cálculo mostra férias, adicional constitucional de 1/3, abono pecuniário, 1/3 sobre abono, INSS, IRRF, redução mensal de 2026, adiantamento opcional do 13º e memória de cálculo. Férias indenizadas na rescisão devem ser tratadas separadamente.",
            faqs: [
                { question: "Como calcular férias?", answer: "Para férias integrais de 30 dias, some o salário ao adicional de 1/3 e depois aplique INSS e IRRF quando devidos." },
                { question: "Posso vender 10 dias de férias?", answer: "Se você tiver direito a 30 dias, pode converter até um terço, ou seja, 10 dias, em abono pecuniário." },
                { question: "Esta calculadora serve para férias na rescisão?", answer: "Esta página é para férias gozadas durante o contrato. Para férias indenizadas no desligamento, use a calculadora de rescisão." },
            ],
            links: [
                { label: "Calculadora de Rescisão", href: "/calculo-rescisao" },
                { label: "Ferramentas de Finanças", href: "/category/finance" },
            ],
        },
        {
            path: "/kidem-tazminati-hesaplama",
            heading: "Kıdem Tazminatı Hesaplama",
            title: `Kıdem Tazminatı Hesaplama 2026 – Güncel Tavan | ${SITE_NAME}`,
            description:
                "İşe giriş-çıkış tarihi, brüt maaş, yol, yemek ve ikramiye ile kıdem tazminatını 2026 tarih bazlı tavan ve damga vergisiyle hesaplayın.",
            explainer:
                "Bu sayfa Türkiye için standart 1475 sayılı İş Kanunu m.14 çerçevesinde kıdem tazminatı tahmini yapar. Hesaplama işe giriş ve fesih tarihinden toplam kıdem gününü bulur, çıplak brüt ücret ile düzenli yan haklardan giydirilmiş brüt ücreti oluşturur, fesih tarihindeki kıdem tavanını seçer, brüt kıdemi ve binde 7,59 damga vergisi sonrası net kıdemi gösterir.",
            faqs: [
                { question: "Kıdem tazminatı nasıl hesaplanır?", answer: "Brüt kıdem = min(giydirilmiş brüt ücret, fesih tarihindeki kıdem tavanı) × toplam kıdem günü ÷ 365. Brüt tutardan standart olarak binde 7,59 damga vergisi düşülür." },
                { question: "2026 kıdem tazminatı tavanı ne kadar?", answer: "2026'nın ilk yarısında ₺64.948,77, 1 Temmuz–31 Aralık döneminde ₺73.729,87'dir. Fesih tarihindeki tavan uygulanır." },
                { question: "Kıdem tazminatından hangi kesinti yapılır?", answer: "Standart kanuni kıdem tazminatından yalnız damga vergisi kesintisi gösterilir." },
            ],
            links: [
                { label: "Yüzde Hesaplama", href: "/yuzde-hesaplama" },
                { label: "Finans Araçları", href: "/category/finance" },
            ],
            language: "tr",
        },
        {
            path: "/kalkulator-vat",
            heading: "Kalkulator VAT",
            title: `Kalkulator VAT – Netto, Brutto i Podatek | ${SITE_NAME}`,
            description:
                "Oblicz VAT, kwotę netto i brutto dla stawek 23%, 8%, 5% lub 0%. Przelicz netto na brutto, brutto na netto albo wylicz kwoty z samego VAT.",
            explainer:
                "Ta strona oblicza VAT dla Polski w trzech kierunkach: netto na brutto, brutto na netto oraz kwota VAT na netto i brutto. Obsługuje główne stawki 23%, 8%, 5%, 0%, osobne oznaczenie ZW oraz własną stawkę do obliczeń historycznych lub specjalnych. Kalkulator nie ustala, jaka stawka prawnie pasuje do konkretnego towaru albo usługi.",
            faqs: [
                { question: "Jak obliczyć VAT od kwoty netto?", answer: "Pomnóż netto przez stawkę VAT. Dla 1 000 zł i 23% podatek wynosi 230 zł." },
                { question: "Jak obliczyć netto z brutto?", answer: "Podziel brutto przez 1 + stawka/100. Dla 23% dziel przez 1,23." },
                { question: "Czym różni się 0% od ZW?", answer: "0% jest stawką VAT, natomiast ZW oznacza zwolnienie z podatku. Skutki podatkowe nie są takie same." },
            ],
            links: [
                { label: "Narzędzia finansowe", href: "/category/finance" },
            ],
            language: "pl",
            priceCurrency: "PLN",
        },
    ];

    for (const page of localizedFinancePages) {
        const canonicalUrl = `${SITE_URL}${page.path}`;
        const pageLanguage = page.language ?? "pt-BR";
        const steps = page.steps ?? (pageLanguage === "tr" ? [
            { title: "Ücret ve tarih bilgilerini girin", text: "Brüt ücretinizi, düzenli yan hakları, işe giriş ve fesih tarihlerini ekleyin." },
            { title: "Tavan ve kesintiyi kontrol edin", text: "Fesih tarihine göre seçilen kıdem tavanını, hizmet gününü, brüt kıdemi ve damga vergisini inceleyin." },
            { title: "Resmî işlemden önce doğrulayın", text: "Sonucu tahmin olarak kullanın; bordro kayıtları, fesih nedeni ve güncel mevzuatla ayrıca kontrol edin." },
        ] : pageLanguage === "pl" ? [
            { title: "Wpisz kwotę", text: "Podaj kwotę netto, brutto albo samą kwotę VAT." },
            { title: "Wybierz stawkę VAT", text: "Użyj 23%, 8%, 5%, 0%, ZW albo własnej stawki do obliczeń matematycznych." },
            { title: "Sprawdź wynik i wzór", text: "Porównaj netto, VAT, brutto oraz zastosowany wzór z fakturą lub własnymi danymi." },
        ] : [
            { title: "Informe o salário e os dados do contrato", text: "Use valores brutos e selecione as opções aplicáveis ao cálculo trabalhista." },
            { title: "Revise o resultado", text: "Confira os componentes, impostos, descontos e memória de cálculo exibidos na página." },
            { title: "Valide casos formais", text: "Use o resultado como estimativa e confirme a folha oficial com RH, contador, sindicato ou profissional habilitado." },
        ]);
        routes.push({
            path: page.path,
            title: page.title,
            description: page.description,
            canonicalUrl,
            language: pageLanguage,
            staticHtml: renderStaticShell({
                heading: page.heading,
                intro: page.description,
                trustNote: pageLanguage === "tr" ?
                    "Türkçe hesaplama aracı; ücret ve tarih bilgileri tarayıcıda işlenir, kimlik numarası veya üyelik gerekmez." :
                    pageLanguage === "pl" ?
                        "Polski kalkulator VAT działa w przeglądarce; nie wymaga NIP, numeru faktury, e-maila ani konta." :
                        pageLanguage === "ar" ?
                            "الأداة تعمل داخل المتصفح ولا تتطلب حساباً أو بريداً إلكترونياً." :
                            pageLanguage === "id" ?
                                "Kalkulator berjalan di browser dan tidak memerlukan akun atau email." :
                        "Calculadora em português do Brasil, com dados inseridos no navegador e sem necessidade de CPF, e-mail ou cadastro.",
                explainer: page.explainer,
                steps,
                faqs: page.faqs,
                links: page.links,
                labels: pageLanguage === "tr" ? {
                    trust: "Gizlilik notu",
                    howTo: "Bu araç nasıl kullanılır",
                    details: "Bu araç hakkında",
                    faq: "Sık sorulan sorular",
                    related: "İlgili araçlar",
                } : pageLanguage === "pl" ? {
                    trust: "Informacja o prywatności",
                    howTo: "Jak używać tego narzędzia",
                    details: "O tym narzędziu",
                    faq: "Najczęstsze pytania",
                    related: "Powiązane narzędzia",
                } : undefined,
            }),
            schemaGraph: localizeSchemaGraph(buildSchemaGraph({
                canonicalUrl,
                title: page.title,
                description: page.description,
                customNodes: [
                    createWebApplicationSchema(page.heading, canonicalUrl, page.description, page.appCategory ?? "FinanceApplication", page.priceCurrency ?? "USD"),
                    createBreadcrumbSchema([
                        { name: pageLanguage === "tr" ? "Ana Sayfa" : pageLanguage === "pl" ? "Strona główna" : "Home", item: SITE_URL },
                        { name: page.categoryLabel ?? (pageLanguage === "tr" ? "Finans" : pageLanguage === "pl" ? "Finanse" : "Finanças"), item: `${SITE_URL}${page.categoryHref ?? "/category/finance"}` },
                        { name: page.heading, item: canonicalUrl },
                    ]),
                    createHowToSchema(canonicalUrl, `${pageLanguage === "tr" ? "Nasıl kullanılır" : pageLanguage === "pl" ? "Jak używać" : "Como usar"} ${page.heading}`, steps),
                    createFaqSchema(canonicalUrl, page.faqs),
                ],
            }), pageLanguage),
        });
    }

    const canonicalToolPaths = Array.from(
        new Set(homepageTools.map((tool) => tools.getCanonicalToolPath(tool.slug))),
    );

    for (const canonicalPath of canonicalToolPaths) {
        const canonicalSlug = canonicalPath.split("/").filter(Boolean).at(-1);
        if (!canonicalSlug) {
            continue;
        }

        const tool =
            tools.ALL_TOOLS.find((entry) => entry.slug === canonicalSlug) ??
            tools.DISPLAY_ALL_TOOLS.find((entry) => entry.slug === canonicalSlug) ??
            tools.getToolBySlug(canonicalSlug);
        if (!tool) {
            continue;
        }

        const categoryId = tools.getCategoryIdBySlug(canonicalSlug);
        const category = tools.DISPLAY_TOOL_CATEGORIES.find((entry) => entry.id === categoryId);
        const override = TOOL_STATIC_OVERRIDES[canonicalSlug];
        const pageHeading = override?.heading ?? getToolHeading(tool.title);
        const pageTitle = override?.title ?? `${pageHeading} | ${SITE_NAME}`;
        const pageDescription = override?.description ?? tool.metaDescription;
        const canonicalUrl = override?.canonicalUrl ?? `${SITE_URL}${canonicalPath}`;
        const steps = override?.steps ?? buildToolSteps(tool);
        const faqs = override?.faqs ?? buildToolFaqs(tool);
        const relatedLinks = buildRelatedToolLinks(tools, canonicalSlug, categoryId);
        const breadcrumbItems = override?.breadcrumbItems ?? [
            { name: "Home", item: SITE_URL },
            ...(category ?
                [{ name: category.name, item: `${SITE_URL}/category/${category.id}` }] :
                []),
            { name: pageHeading, item: canonicalUrl },
        ];

        routes.push({
            path: canonicalPath,
            title: pageTitle,
            description: pageDescription,
            canonicalUrl,
            staticHtml: buildToolStaticHtml(tool, category, relatedLinks, pageHeading, override),
            schemaGraph: buildSchemaGraph({
                canonicalUrl,
                title: pageTitle,
                description: pageDescription,
                customNodes: [
                    createWebApplicationSchema(
                        pageHeading,
                        canonicalUrl,
                        pageDescription,
                        getToolApplicationCategory(categoryId),
                    ),
                    createBreadcrumbSchema(breadcrumbItems),
                    createHowToSchema(canonicalUrl, `How to use ${pageHeading}`, steps),
                    createFaqSchema(canonicalUrl, faqs),
                ],
            }),
        });
    }

    return routes;
}

function main() {
    ensureBuildOutput();

    const tools = loadToolsModule();
    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const assetTags = extractAssetTags(templateHtml);
    const bodyContent = extractBodyContent(templateHtml);
    const routes = buildRoutes(tools);

    for (const route of routes) {
        const routeBodyContent = injectStaticShell(bodyContent, route.staticHtml);
        const html = renderHtml({
            title: route.title,
            description: route.description,
            canonicalUrl: route.canonicalUrl,
            schemaGraph: route.schemaGraph,
            assetTags,
            bodyContent: routeBodyContent,
            robots: route.robots,
            language: route.language,
        });

        writeRouteHtml(route.path, html);
    }

    console.log(`[build-static-seo-pages] Wrote ${routes.length} prerendered HTML files.`);
}

main();
