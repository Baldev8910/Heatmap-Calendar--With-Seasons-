// ========================================
// Q3 Monsoon Momentum - Activity Tracker
// July - September 2025
// ========================================

// Header
const header = dv.el("div", "", {
    attr: {
        style: `
        text-align: center;
        margin-bottom: 40px;
        `
    }
})

header.appendChild(
    dv.el("div", "Q3 - Monsoon Momentum", {
        attr: {
            style: `
            font-size: 1.3em;
            font-weight: 300;
            color: var(--text-muted);
            letter-spacing: 0.12em;
            margin-bottom: 4px;
            `
        }
    })
)

header.appendChild(
    dv.el("div", "July - September", {
        attr: {
            style: `
            font-size: 1em;
            font-weight: 300;
            color: var(--text-muted);
            letter-spacing: 0.12em;
            margin-bottom: 0px;
            `
        }
    })
)

// Calendar Configuration
const calendarData = {
    year: 2025,
    colors: {
        multi: [
            "#F29A4D", "#E38A43", "#D47A3A", "#BE7138", 
            "#A4683A", "#7F6E45", "#5C7B54", "#3F8C66", 
            "#2C9D7A", "#1CA08F"
        ]
    },
    showCurrentDayBorder: true,
    defaultEntryIntensity: 1,
    intensityScaleStart: 0,
    intensityScaleEnd: 9,
    entries: [],
    intensifyEmptyDays: true
}

// ========================================
// Activity Collection
// ========================================

const activitiesByDate = {}
const today = moment().format("YYYY-MM-DD")

/**
 * Add an activity to a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} emoji - Activity emoji
 * @param {string} color - Activity color (unused but kept for compatibility)
 */
function addActivity(date, emoji, color) {
    if (!activitiesByDate[date]) {
        activitiesByDate[date] = { count: 0, emojis: [] }
    }
    activitiesByDate[date].count++
    activitiesByDate[date].emojis.push(emoji)
}

// ========================================
// Activity Data Collection
// ========================================

const activities = [
    { source: '"02 Workout"', field: 'Workout', emoji: '💪', color: 'blue' },
    { source: '"05 Cycling"', field: 'Cardio', emoji: '🚴‍♂️', color: 'orange' },
    { source: '"01 Daily Journal"', field: 'MasturbationAvoided', emoji: '✓', color: 'darkgreen' },
    { source: '"01 Daily Journal"', field: 'GTG', emoji: '🏋️‍♂️', color: 'lightgreen' },
    { source: '"01 Daily Journal"', field: 'waterPlants', emoji: '🪴', color: 'pink' },
    { source: '"01 Daily Journal"', field: 'Research', emoji: '📑', color: 'lightgreen' },
    { source: '"06 Readings"', field: 'Reading', emoji: '📖', color: 'yellow' },
    { source: '"01 Daily Journal"', field: 'Study', emoji: '📚', color: 'orangeToRed' },
    { source: '"03 Guitar Practice"', field: 'Guitar', emoji: '🎸', color: 'green' },
    { source: '"04 Learning Python"', field: 'Python', emoji: '🐍', color: 'red' },
    { source: '"01 Daily Journal"', field: 'Gaming', emoji: '🏎️', color: 'brown' },
    { source: '"01 Daily Journal"', field: 'DJournal', emoji: '🖥️', color: 'pink' }
]

// Collect all activities
for (let activity of activities) {
    for (let page of dv.pages(activity.source).where(p => p[activity.field])) {
        addActivity(page.file.name, activity.emoji, activity.color)
    }
}

// ========================================
// Generate Heatmap Entries
// ========================================

for (let date in activitiesByDate) {
    const data = activitiesByDate[date]
    calendarData.entries.push({
        date: date,
        intensity: data.count,
        // content: data.emojis.join(""), // Uncomment to show emojis in calendar
        color: "multi"
    })
}

// ========================================
// Render Calendar
// ========================================

renderHeatmapCalendar(this.container, calendarData)

// ========================================
// Today's Activities Section
// ========================================

const formattedDate = moment(today).format("dddd, MMMM DD, YYYY")

const todaySection = dv.el("div", "", {
    attr: {
        style: `
            margin-top: 30px;
            text-align: center;
        `
    }
})

const todayHeader = dv.el("div", `Today's Activities (${formattedDate})`, {
    attr: {
        style: `
            font-size: 0.95em;
            font-weight: 500;
            color: var(--text-muted);
            margin-bottom: 12px;
            letter-spacing: 0.03em;
        `
    }
})

todaySection.appendChild(todayHeader)

// Display today's activities or placeholder
if (activitiesByDate[today]) {
    const todayData = activitiesByDate[today]
    
    const activityDisplay = dv.el("div", todayData.emojis.join(" "), {
        attr: {
            style: `
                font-size: 1.8em;
                letter-spacing: 0.3em;
            `
        }
    })
    
    todaySection.appendChild(activityDisplay)
    
} else {
    const placeholder = dv.el("div", "No activities recorded yet today", {
        attr: {
            style: `
                color: var(--text-faint);
                font-style: italic;
                font-size: 0.9em;
            `
        }
    })
    
    todaySection.appendChild(placeholder)
}