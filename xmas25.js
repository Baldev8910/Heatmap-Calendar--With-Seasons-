// ========================================
// Q4 Winter Lock-In - Christmas Edition
// October - December 2025
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

// ========================================
// Snowfall Animation
// ========================================

// Clean up any existing snowfall
const existingSnow = document.querySelector('.snow-container');
if (existingSnow) {
    existingSnow.querySelectorAll('.snowflake').forEach(flake => {
        flake.style.opacity = 0;
    });
    setTimeout(() => existingSnow.remove(), 800); // Time out for snowflakes in milliseconds
}

const style = document.createElement('style'); // snowflakes shape and style
style.textContent = `
    @keyframes snowfall {
        0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
        }
        100% {
            transform: translateY(calc(100vh + 20px)) translateX(100px) rotate(360deg);
        }
    }
    
    @keyframes sway {
        0%, 100% {
            margin-left: 0;
        }
        50% {
            margin-left: 50px;
        }
    }
    
    .snowflake {
        position: fixed;
        top: -20px;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.8;
        box-shadow: 
            0 0 3px rgba(255, 255, 255, 0.8),
            0 0 6px rgba(255, 255, 255, 0.6),
            0 0 10px rgba(255, 255, 255, 0.4);
    }
    
    .snowflake::before,
    .snowflake::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        box-shadow: inherit;
    }
    
    .snowflake::before {
        top: -3px;
        left: 3px;
        width: 6px;
        height: 6px;
    }
    
    .snowflake::after {
        top: 3px;
        left: -3px;
        width: 6px;
        height: 6px;
    }
`;
document.head.appendChild(style);

const snowContainer = dv.el("div", "", {
    attr: {
        class: "snow-container", 
        style: `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: visible;
        `
    }
});

const SNOWFLAKE_COUNT = 5; // Keep 5 or single digit for better performace and less lag

// Create N snowflakes with staggered spawn
for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    setTimeout(() => {
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 8 + 7;
        const delay = Math.random() * duration * 1.5;

        const snowflake = dv.el("div", "", {
            attr: {
                class: "snowflake",
                style: `
                    left: ${Math.random() * 100}%;
                    width: ${size}px;
                    height: ${size}px;
                    opacity: ${Math.random() * 0.5 + 0.3};
                    animation: snowfall ${duration}s linear infinite,
                               sway ${Math.random() * 4 + 3}s ease-in-out infinite;
                    animation-delay: -${delay}s, ${Math.random() * 2}s;
                `
            }
        });

        snowContainer.appendChild(snowflake);
    }, i * 300); // stagger spawn for smooth density change
}

document.body.appendChild(snowContainer);

// =======================
// Calendar Configuration
// =======================

const calendarData = {
    year: 2025,
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