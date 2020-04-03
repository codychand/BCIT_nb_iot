const mongodb = require("mongodb");
// const ObjectId = require("mongodb").ObjectID;

const conString =
    "mongodb://nb-iot:wmYS9eyYk3usfR6uUGGhiHuI3C4tsHo9ITTSb1g1HRe0PsRmJbEauOBIaOEvIPYCtEKYOheZZ0P5ju7UqIFhpQ%3D%3D@nb-iot.mongo.cosmos.azure.com:10255/?ssl=true&appName=@nb-iot@";
const dbName = "nbIOT";
const collectionName = "nbIOTstore";

var db = null;

var getDB = () => {
    return db;
};

let earliest = 1578688706;
let deviceID = [
    "testing",
    "LTE-M 1",
    "LTE-M 2",
    "LTE-M 3",
    "NB-IOT Level 1",
    "NB-IOT LEVEL 2",
    "NB-IOT Level 3",
    "NB-IOT Level 4",
    "NB-IOT Level 5",
    "NB_IOT1",
    "NB_IOT2"
];

/*
 * unixToDate converts a unix timestamp in Seconds into a Date object
 */
function unixToDate(unixtime) {
    return new Date(unixtime * 1000);
}

/*
 * dateToUnix converts a date string to a unix timestamp in Seconds by making a date object
 */
function dateToUnix(date) {
    return parseInt((new Date(date).getTime() / 1000).toFixed(0));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    mongodb.MongoClient.connect(
        conString,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: dbName
        },
        (err, client) => {
            if (err) {
                return console.log("Unable to connect to DB");
            }
            db = client.db(dbName);
            // console.log(db);
            console.log("Successfully connected to MongoDB server");
        }
    );
}

function getDevices() {
    return new Promise((resolve, reject) => {
        let datastore = getDB();
        datastore
            .collection(collectionName)
            .aggregate([{ $group: { _id: "$deviceID" } }])
            .toArray((err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        // .distinct("deviceID", (err, result) => {
        //     if (err) {
        //         reject(err);
        //     }
        //     resolve(result);
        // });
    });
}

async function getData(start_timestamp, end_timestamp, deviceID) {
    let datastore = getDB();
    // await datastore.collection(collectionName).createIndexes([
    //     { key: { deviceID: 1, tsAzure: 1 }, name: "deviceDate" },
    //     { key: { deviceID: 1 }, name: "deviceID" },
    //     { key: { tsAzure: 1 }, name: "tsAzure" }
    // ]);
    let skip = 0;
    let limit = 100;
    let items = [];

    console.log(await datastore.collection(collectionName).indexes());
    while (true) {
        try {
            console.log(skip);
            let c = datastore
                .collection(collectionName)
                .find(
                    {
                        deviceID: deviceID,
                        tsAzure: {
                            $gte: start_timestamp,
                            $lt: end_timestamp
                        }
                    },
                    {
                        batchSize: 100,
                        hint: { deviceID: 1, tsAzure: 1 },
                        skip,
                        limit
                    }
                )
                .project({
                    _id: 0,
                    temp: 1,
                    humidity: 1,
                    pressure: 1,
                    tsAzure: 1
                });

            if (!(await c.hasNext())) {
                break;
            }
            items = [...items, ...(await c.toArray())];

            await sleep(1500);
            skip += limit;
        } catch {
            await sleep(1500);
            continue;
        }
    }

    // let items = await c.next();
    // console.log(await c.hasNext());
    return items;

    // return new Promise(async (resolve, reject) => {
    //     let datastore = getDB();
    //     let items = datastore.collection(collectionName).find(
    //         {
    //             deviceID: deviceID,
    //             tsAzure: {
    //                 $gte: start_timestamp,
    //                 $lt: end_timestamp
    //             }
    //         },
    //         { batchSize: 10 }
    //     );

    //     while (await items.hasNext()) {
    //         try {
    //             items.push(await items.next());
    //             setTimeout(handler);
    //         } catch {
    //             continue;
    //         }
    //     }
    //     resolve(items);
    //     // .toArray((err, result) => {
    //     //     if (err) {
    //     //         reject(err);
    //     //     }
    //     //     resolve(result);
    //     // });
    // });
}

module.exports = {
    getData,
    getDevices,
    init
};
