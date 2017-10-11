const fs = require('fs-extra');
const path = require('path');
const csvWriter = require('csv-write-stream');
const csvReader = require('csv-reader');

export function writeToCSV(filename, object) {
    let writer = csvWriter({sendHeaders: false});

    fs.ensureDirSync(`./${path.dirname(filename)}`);

    if (!fs.existsSync(filename))
        writer = csvWriter({ headers: ["weekday", "hours", "duration", "week", "year"]});

    writer.pipe(fs.createWriteStream(filename, { flags: 'a' }));
    writer.write(object);
    writer.end();
}

export function readFromCSV(filename) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filename)) {
            reject(`File ${filename} does not exist.`);
            return;
        }

        const inputStream = fs.createReadStream(filename, 'utf8');

        const rows = [];

        inputStream
            .pipe(csvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
            .on('data', (row) => {
                if (typeof row[0] === 'number')
                    rows.push(row);
            })
            .on('end', () => {
                resolve(rows);
            });
    });
}