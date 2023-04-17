const path = require('path');
const fs = require('fs');

function saveEventsToFile(events) {
    const filePath = path.join(__dirname, 'events-log.json');
    events.forEach((action) => {
        fs.appendFileSync(filePath, JSON.stringify(action));
        fs.appendFileSync(filePath, "\n");
    })
}

function readEventsFromFile() {
    const filePath = path.join(__dirname, 'events-log.json');
    const events = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return events;
}

module.exports = { saveEventsToFile, readEventsFromFile };