// ========================================
// Auto-Switching Quarterly Themes
// ========================================

const journalFormat = "YYYY-MM-DD"

const currentMonth = new Date().getMonth() + 1 // 1-12
let quarter
if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = 1
} else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = 2
} else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = 3
} else {
    quarter = 4
}

const themes = {
    1: {
        title: "Q1 - Winter/Spring Reset",
        subtitle: "January - March",
        colors: [
            "#CBF1FF", "#C5F7F1", "#BFFBE1", "#B9FFD2",
            "#AFFFBE", "#A4F8AA", "#97F093", "#89E77B",
            "#78DB63", "#66CC4E"
        ]
    },
    2: {
        title: "Q2 - Summer Surge",
        subtitle: "April - June",
        colors: [
            "#66CC4E", "#7ED63F", "#96DF32", "#AFE726",
            "#C8EF1B", "#E1F611", "#F3EC0D", "#F9D23A",
            "#F7B65A", "#F29A4D"
        ]
    },
    3: {
        title: "Q3 - Monsoon Momentum",
        subtitle: "July - September",
        colors: [
            "#F29A4D", "#E38A43", "#D47A3A", "#BE7138",
            "#A4683A", "#7F6E45", "#5C7B54", "#3F8C66",
            "#2C9D7A", "#1CA08F"
        ]
    },
    4: {
        title: "Q4 - Winter Lock-In",
        subtitle: "October - December",
        colors: [
            "#1CA08F", "#2FA7A2", "#44AEB4", "#5AB5C6",
            "#71BDD7", "#89C7E5", "#A2D4F0", "#B8E3F8",
            "#C4EEFF", "#CBF1FF"
        ]
    }
}

const currentTheme = themes[quarter]

// ========================================
// Header Section
// ========================================

const header = dv.el("div", "", {
    attr: {
        style: `
            text-align: center;
            margin-bottom: 40px;
        `
    }
})

header.appendChild(
    dv.el("div", currentTheme.title, {
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
    dv.el("div", currentTheme.subtitle, {
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

this.container.appendChild(header)

// =======================
// Calendar Configuration
// =======================

const calendarData = {
    year: new Date().getFullYear(),
    colors: {
        multi: currentTheme.colors
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
    { source: '"01 Daily Journal"', field: 'AcaResearch', emoji: '📄', color: 'lightgreen' },
    { source: '"06 Readings"', field: 'Reading', emoji: '📖', color: 'yellow' },
    { source: '"01 Daily Journal"', field: 'Study', emoji: '📚', color: 'orangeToRed' },
    { source: '"03 Guitar Practice"', field: 'Guitar', emoji: '🎸', color: 'green' },
    { source: '"04 Learning Python"', field: 'Python', emoji: '🐍', color: 'red' },
    { source: '"01 Daily Journal"', field: 'Gaming', emoji: '🏎️', color: 'brown' },
    { source: '"01 Daily Journal"', field: 'DJournal', emoji: '🖥️', color: 'pink' },
]

for (let activity of activities) {
    for (let page of dv.pages(activity.source).where(p => p[activity.field])) {
        const filename = page.file.name
        const calendarDate = moment(filename, journalFormat, true).format("YYYY-MM-DD")
        addActivity(calendarDate, activity.emoji, activity.color)
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
        color: "multi"
    })
}

// ========================================
// Render Calendar
// ========================================

renderHeatmapCalendar(this.container, calendarData)

// ========================================
// Hover Tooltip for Activities
// ========================================

const tooltip = dv.el("div", "", {
    attr: {
        style: `
            position: fixed;
            display: none;
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            padding: 12px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            pointer-events: none;
            text-align: center;
        `
    }
})

document.body.appendChild(tooltip)

setTimeout(() => {
    const cells = this.container.querySelectorAll('[data-date], .day, .calendar-day')
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', (e) => {
            const date = cell.dataset.date || cell.getAttribute('data-date') || cell.title
            
            if (!date) return
            
            if (activitiesByDate[date]) {
                const data = activitiesByDate[date]
                
                tooltip.innerHTML = `
                    <div style="font-size: 0.85em; color: var(--text-muted); margin-bottom: 8px;">
                        ${date}
                    </div>
                    <div style="font-size: 2em; letter-spacing: 0.2em;">
                        ${data.emojis.join(" ")}
                    </div>
                    <div style="font-size: 0.8em; color: var(--text-muted); margin-top: 8px;">
                        ${data.count} activit${data.count === 1 ? 'y' : 'ies'}
                    </div>
                `
                tooltip.style.display = 'block'
                tooltip.style.left = (e.pageX + 10) + 'px'
                tooltip.style.top = (e.pageY + 10) + 'px'
            }
        })
        
        cell.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none'
        })
        
        cell.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                tooltip.style.left = (e.pageX + 10) + 'px'
                tooltip.style.top = (e.pageY + 10) + 'px'
            }
        })
    })
}, 500)

// ========================================
// Today's Activities Section
// ========================================

const formattedDate = moment().format("dddd, MMMM DD, YYYY")

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

this.container.appendChild(todaySection)
