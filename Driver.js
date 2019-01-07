const EventEmitter = require('events');
const mqtt = require('mqtt');
const timeout = ms => new Promise(res => setTimeout(res, ms));


class Driver extends EventEmitter {
    constructor(driverId) {
        super();
        this.on('sendInterval', this.sendInterval);
        this.locationInfo = {
            mAccuracy: 800.0,
            mAltitude: 0.0,
            mBearing: 0.0,
            mBearingAccuracyDegrees: 0.0,
            mElapsedRealtimeNanos: 81584532000000,
            mGeoPoint: "28708956,77099433",
            mLatitude: 28.7089568,
            mLongitude: 77.0994331,
            mProvider: "fused",
            mSpeed: 0.0,
            mSpeedAccuracyMetersPerSecond: 0.0,
            mTime: 1546873293366,
            mVerticalAccuracyMeters: 0.0
        };
        this.appInfo = {
            appCode: "64",
            appVersion: "10.5.0"
        };
        this.city = "Grafing";
        this.batteryInfo = {
            LastChargingPluggedDateTime: "2018-11-16T22:33:18+0530",
            LastChargingUnPluggedDateTime: "",
            batteryLevel: 32,
            chargingStatus: false,
            significantLevel: "LOW",
            significantLowLevelDateTime: "2018-11-19T17:55:52+0530",
            significantOkayLevelDateTime: ""
        };
        this.driverId = driverId;
        this.vehicleInfo = {
            registration_certificate_number: "DL1LP5492",
            vehicle_class: "Cargo Van XL",
            vehicle_model: "MARUTI EECO"
        };
        this.orderId = driverId;
        this.client;
        this.online = false;
        this.connected = false;
        this.seqId = 163;
    }

    updateData(data) {
        this.deviceInfo = data.deviceInfo;
        this.appInfo = data.appInfo;
    }

    updateCity(data) {
        this.city = data.city;
    }

    updatevehicleInfo(data) {
        this.vehicleInfo = data.vehicleInfo;
    }

    updateLoction(data) {
        this.locationInfo = data.locationInfo;
    }

    updatebatteryInfo(data) {
        this.locationInfo = data.locationInfo;
    }

    sendMydata() {
        let message = `{
            "appInfo": ${JSON.stringify(this.appInfo)},
            "city": "${this.city}",
            "deviceInfo": {
                "batteryInfo": ${JSON.stringify(this.batteryInfo)},
                "timeStamp": "2019-01-07T20:31:33+0530"
            },
            "deviceTimeStamp": "2019-01-07T20:31:33+0530",
            "driverId": "${this.driverId}",
            "locationInfo": ${JSON.stringify(this.locationInfo)},
            "online": ${this.online},
            "orderId": "${this.orderId}",
            "seqId": ${this.seqId},
            "stopId": "261933",
            "tripDistance": 37.92267990112305,
            "tripId": "768018",
            "tripStatus": "In-Progress",
            "vehicleInfo": ${JSON.stringify(this.vehicleInfo)}
        }`;
        return message;
    }

    connect() {
        if (!this.connected) {
            this.connected = true;
            this.client = mqtt.connect('mqtt://broker.hivemq.com');

            this.client.on('connect', () => {
                this.emit('sendInterval');
            });
        }
    }

    async sendInterval() {
        this.client.publish(`innvois/driver/${this.driverId}`, this.sendMydata());
        // wait 5 seconds
        await timeout(5000);
        this.emit('sendInterval');
    }
}

module.exports = Driver;