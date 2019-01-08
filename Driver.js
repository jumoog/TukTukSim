const EventEmitter = require('events');
const mqtt = require('mqtt');
const timeout = ms => new Promise(res => setTimeout(res, ms));
const convert = require('xml-js');
const options = {
    ignoreComment: true,
    ignoreDeclaration: true,
    compact: true
};

class Driver extends EventEmitter {
    constructor(driverId) {
        super();
        this.on('sendInterval', this.sendInterval);
        this.on('connect', this.connect);
        this.locationInfo = {
            mAccuracy: 800.0,
            mAltitude: 0.0,
            mBearing: 0.0,
            mBearingAccuracyDegrees: 0.0,
            mElapsedRealtimeNanos: 81584532000000,
            mGeoPoint: "28708956,77099433",
            mLatitude: 0,
            mLongitude: 0,
            mProvider: "fused",
            mSpeed: 0.0,
            mSpeedAccuracyMetersPerSecond: 0.0,
            mTime: 0,
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
        this.connected = false;
        this.track;
        this.loopId = 0;
        this.seqId = 0;
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
        // increment seqId
        this.seqId++;
        // set next Latitude
        this.locationInfo.mLatitude = parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lat);
        // set next Longitude
        this.locationInfo.mLongitude = parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lon);
        // set current unix time in milliseconds
        this.locationInfo.mTime = Date.now();
        console.log(`Latitude: <${this.locationInfo.mLatitude}> mLongitude: <${this.locationInfo.mLongitude}> Driver: <${this.driverId}>`);
        // construct a message
        let message = {
            appInfo: this.appInfo,
            city: this.city,
            deviceInfo: {
                batteryInfo: this.batteryInfo,
                timeStamp: "2019-01-07T20:31:33+0530"
            },
            deviceTimeStamp: "2019-01-07T20:31:33+0530",
            driverId: this.driverId,
            locationInfo: this.locationInfo,
            online: this.connected,
            orderId: this.orderId,
            seqId: this.seqId,
            stopId: "261933",
            tripDistance: 37.92267990112305,
            tripId: "768018",
            tripStatus: "In-Progress",
            vehicleInfo: this.vehicleInfo
        };
        if (this.loopId !== this.track.gpx.trk.trkseg.trkpt.length - 1)
            this.loopId++;
        else {
            this.loopId = 0;
        }
        return JSON.stringify(message);
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

    loadtrack(file) {
        let xml = require('fs').readFileSync(`${__dirname}/${file}`, 'utf8');
        this.track = convert.xml2js(xml, options);
        console.log(`loaded track: ${this.track.gpx.trk.name._text}`);
        this.emit('connect');
    }

    async sendInterval() {
        this.client.publish(`innovis/driver/${this.driverId}`, this.sendMydata());
        // wait 1 seconds
        await timeout(1000);
        this.emit('sendInterval');
    }
}

module.exports = Driver;