// ========================================
// Q4 Winter Lock-In - Christmas Edition
// October - December 2025
// ========================================

const journalFormat = "YYYY-MM-DD"

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
    dv.el("div", "🥂 HAPPY NEW YEAR 🥂", {
        attr: {
            style: `
            font-size: 1.8em;
            font-weight: 600;
            color: #D4AF37;
            letter-spacing: 0.2em;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-family: 'Georgia', serif;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            `
        }
    })
)

header.appendChild(
    dv.el("div", "January - March", {
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

// =======================
// Calendar Configuration
// =======================

const calendarData = {
    year: new Date().getFullYear(), // automatic year changing
    colors: {
	multi: [
    "#FFFFFF", "#E6F2FF", "#CCE5FF", "#99CCFF",
    "#6699CC", "#4D7AA8", "#1A5490", "#003366",
    "#B8860B", "#FFD700"
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

// Collect all activities
for (let activity of activities) {
    for (let page of dv.pages(activity.source).where(p => p[activity.field])) {
        // Extract only the date part from filename (DD-MM-YY format)
        const filename = page.file.name
        const dateMatch = filename.match(/\d{2}-\d{2}-\d{2}/)
        const dateOnly = dateMatch ? dateMatch[0] : filename
        
        // Convert DD-MM-YY to YYYY-MM-DD for calendar
        const calendarDate = moment(dateOnly, journalFormat).format("YYYY-MM-DD")
        
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
        // content: data.emojis.join(""), // Uncomment to show emojis in calendar
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

// Add hover listeners after calendar renders
setTimeout(() => {
    const cells = this.container.querySelectorAll('[data-date], .day, .calendar-day')
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', (e) => {
            const date = cell.dataset.date || cell.getAttribute('data-date') || cell.title
            
            if (!date) return
            
            // Check if there are activities for this date
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
