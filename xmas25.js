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
    dv.el("div", "🎄 Winter Lock-In - Christmas Edition 🎅", {
        attr: {
            style: `
            font-size: 1.3em;
            font-weight: 300;
            color: #c41e3a;
            letter-spacing: 0.12em;
            margin-bottom: 4px;
            `
        }
    })
)

header.appendChild(
    dv.el("div", "October - December", {
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
    year: 2025, // change the year
    colors: {
        multi: [
    "#FFFFFF", "#FFE5E5", "#FFCCCC", "#FFB3B3",
    "#FF9999", "#FF8080", "#FF6666", "#FF4D4D",
    "#FF3333", "#FF0000"
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
const today = moment().format(journalFormat)

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
    // DEBUG: Check what elements exist
    const cells = this.container.querySelectorAll('svg rect, [data-date], .day, .calendar-day')
    console.log('Found cells:', cells.length)
    
    cells.forEach(cell => {
        // DEBUG: Log cell attributes
        console.log('Cell attributes:', cell.dataset, cell.getAttribute('data-date'), cell.title)
        
        cell.addEventListener('mouseenter', (e) => {
            // Try multiple ways to get the date
            const date = cell.dataset.date || 
                        cell.getAttribute('data-date') || 
                        cell.getAttribute('date') ||
                        cell.title ||
                        cell.getAttribute('aria-label')
            
            console.log('Hovering date:', date)
            console.log('Activities for date:', activitiesByDate[date])
            
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
}, 1000) // Increased timeout

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