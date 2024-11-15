const fs = require('fs');
const { execSync } = require('child_process');
const simpleGit = require('simple-git');
const { engToNep } = require('nepali-date-converter'); 

const git = simpleGit();

const englishBirthDate = new Date(2000, 10, 23); 

function calculateTimeDifference(birthDate) {
    const now = new Date();
    const diff = now - birthDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
}

function getNepaliDate(birthDate) {
    const { fromAD } = require('nepali-date-converter');
    const nepaliDate = fromAD(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    return `${nepaliDate.year}/${nepaliDate.month}/${nepaliDate.day}`;
}

function updateReadme(timeDiff, nepaliBirthDate) {
    const readmeContent = `# ⏳ Time Since Birth (Updated Every Minute)

| **English Birth Date** | ${englishBirthDate.toDateString()} |
|------------------------|-------------------------------------|
| **Nepali Birth Date**  | ${nepaliBirthDate}                  |

## 📅 Elapsed Time:

- **Years**: ${timeDiff.years}
- **Months**: ${timeDiff.months}
- **Days**: ${timeDiff.days}
- **Hours**: ${timeDiff.hours}
- **Minutes**: ${timeDiff.minutes}
- **Seconds**: ${timeDiff.seconds}

This file updates automatically every minute to show the time since birth in both the English and Nepali calendars.

## 📘 Additional Information

### Purpose
This project is a simple Node.js script designed to demonstrate the use of date and time calculation and the integration of Git automation.

### Technologies Used
- **Node.js**: For running JavaScript server-side.
- **Git**: For automated version control.
- **Nepali Date Converter**: To convert Gregorian dates to Nepali calendar dates.

### How It Works
- The script calculates the time elapsed since a specified birth date.
- It converts the English date to the corresponding Nepali date.
- It updates a `README.md` file every minute with the current elapsed time and Nepali date.
- Changes are committed and pushed to the repository automatically.

### How to Use
1. Clone the repository.
2. Install the dependencies by running:
   ```bash
   npm install
   ```
3. Run the script using:
   ```bash
   node script.js
   ```

### Future Enhancements
- Add more localization support for other date formats.
- Improve error handling for Git operations.
- Optimize date conversion logic for better accuracy.

`;

    fs.writeFileSync('README.md', readmeContent);
}

async function commitAndPush() {
    try {
        await git.pull('origin', 'master');
        await git.add('./README.md');
        await git.commit('Updated Time since birth');
        await git.push();
    } catch (error) {
        console.error('Error during commit and push:', error);
    }
}

async function run() {
    const timeDiff = calculateTimeDifference(englishBirthDate);
    const nepaliBirthDate = getNepaliDate(englishBirthDate);
    updateReadme(timeDiff, nepaliBirthDate);
    await commitAndPush();
}

setInterval(run, 60 * 1000);

run();