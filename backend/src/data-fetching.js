const config = require("../routes/config.json");
const googleMapsClient = require('@google/maps').createClient({
    key: config.api.key
});

export function getTravelTime(from, to) {
    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix({
            origins: [from],
            destinations: [to],
            mode: 'driving',
            departure_time: 'now'
        }, function (err, data) {
            if (err) reject(err);
            else {
                if (data.json.status !== 'OK') reject(data);
                data = data.json.rows[0].elements[0]; // Since the server only returns one route just take the first one
                resolve(data.duration_in_traffic.value);
            }
        });
    });
}

export async function getTravelObject(from, to) {
    const now = new Date();
    const weekday = now.getDay();
    const secondsSinceMidnight = now.getSeconds() + (60 * now.getMinutes()) + (60 * 60 * now.getHours());
    const onejan = new Date(now.getFullYear(), 0, 1);

    return {
        "weekday": weekday,
        "hours": secondsSinceMidnight / 60 / 60,
        "duration": await getTravelTime(from, to) / 60,
        "week": Math.ceil( (((now - onejan) / 86400000) + onejan.getDay() + 1) / 7 ),
        "year": now.getFullYear()
    };
}