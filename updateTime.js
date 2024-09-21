const fs = require('fs');
const { execSync } = require('child_process');
const simpleGit = require('simple-git');
const NepaliDate = require('nepali-date');

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
    const nepaliDate = new NepaliDate(birthDate);
    return nepaliDate.format("YYYY/MM/DD");
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

This file updates automatically every minute to show the time since birth in both the English and Nepali calendars.`;

    fs.writeFileSync('README.md', readmeContent);
}

async function commitAndPush() {
    await git.add('./README.md');
    await git.commit('Updated time since birth');
    await git.push();
}

async function run() {
    const timeDiff = calculateTimeDifference(englishBirthDate);
    const nepaliBirthDate = getNepaliDate(englishBirthDate);
    updateReadme(timeDiff, nepaliBirthDate);
    await commitAndPush();
}

setInterval(run, 60 * 1000);

run();
