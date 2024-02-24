import EventEmitter from 'events';
import mqtt, { MqttClient } from 'mqtt';
import convert from 'xml-js';
import fs from 'node:fs'

const options = {
    ignoreComment: true,
    ignoreDeclaration: true,
    compact: true
};
const myArray = ["Kavaratti",
    "New Delhi",
    "Tezpur",
    "Jullundur",
    "Navsari",
    "Asansol",
    "Port Blair",
    "Kota",
    "Saharanpur",
    "Bhuj",
    "Gurgaon",
    "Simla",
    "Muzaffarpur",
    "Gaya",
    "Ratlam",
    "Gwalior",
    "Baramula",
    "Guwahati",
    "Dispur",
    "Bidar",
    "Pune",
    "Ahmedabad",
    "Haldia",
    "Bhagalpur",
    "Ujjain",
    "Tonk",
    "Agartala",
    "Silchar",
    "Vellore",
    "Bharatpur",
    "Siliguri",
    "Gangtok",
    "Cuttack",
    "Alipur Duar",
    "Bhubaneshwar",
    "Dibrugarh",
    "Jorhat",
    "Hospet",
    "Tuticorin",
    "Sangli",
    "Sholapur",
    "Mumbai",
    "Diu",
    "Sirsa",
    "Mangalore",
    "Thiruvananthapuram",
    "Kochi",
    "Bangalore",
    "Proddatur",
    "Tirupati",
    "Vadodara",
    "Surat",
    "Aizawl",
    "Bhopal",
    "Hyderabad",
    "Chandigarh",
    "Gandhinagar",
    "Imphal",
    "Kohima",
    "Lucknow",
    "Bijapur",
    "Chennai",
    "Guntur",
    "Rajahmundry",
    "Haora",
    "Raurkela",
    "Dhanbad",
    "Bhatpara",
    "Kolkata",
    "Shillong",
    "Puri",
    "Krishnanagar",
    "Jamshedpur",
    "Jodhpur",
    "Sikar",
    "Barddhaman",
    "Medinipur",
    "Vishakhapatnam",
    "Silvassa",
    "Kolhapur",
    "Latur",
    "Pondicherry",
    "Brahmapur",
    "Bhiwandi",
    "Rajkot",
    "Kalyan",
    "Coimbatore",
    "Nasik",
    "Porbandar",
    "Parbhani",
    "Akola",
    "Ahmednagar",
    "Aurangabad",
    "Daman",
    "Ranchi",
    "Itanagar",
    "Raipur",
    "Kozhikode",
    "Machilipatnam",
    "Khammam",
    "Kakinada",
    "Panaji",
    "Bhavnagar",
    "Karnal",
    "Rohtak",
    "Hisar",
    "Abohar",
    "Agra",
    "Alwar",
    "Bhilwara",
    "Udaipur",
    "Meerut",
    "Delhi",
    "Rampur",
    "Ludhiana",
    "Sonipat",
    "Dehra Dun",
    "Ghaziabad",
    "Faridabad",
    "Amravati",
    "Bhiwani",
    "Gulbarga",
    "Mathura",
    "Hapur",
    "Bhilai",
    "Warangal",
    "Raichur",
    "Firozabad",
    "Burhanpur",
    "Ambala",
    "Varanasi",
    "Hathras",
    "Shahjahanpur",
    "Jabalpur",
    "Patiala",
    "Nagpur",
    "Bulandshahr",
    "Nanded",
    "Hoshiarpur",
    "Aligarh",
    "Mirzapur",
    "Bikaner",
    "Srinagar",
    "Jhansi",
    "Fatehpur",
    "Sagar",
    "Bahraich",
    "Kanpur",
    "Gorakhpur",
    "Jammu",
    "Nizamabad",
    "Faizabad",
    "Sopore",
    "Allahabad",
    "Sambalpur",
    "Pathankot",
    "Bilaspur",
    "Indore",
    "Sitapur",
    "Malegaon",
    "Dhule",
    "Panipat",
    "Muzaffarnagar",
    "Ongole",
    "Jaipur",
    "Moradabad",
    "Pali",
    "Vijayawada",
    "Budaun",
    "Bareilly",
    "Aurangabad",
    "Vizianagaram",
    "Chirala",
    "Ajmer",
    "Pilibhit",
    "Hindupur",
    "Mandya",
    "Karimnagar",
    "Tumkur",
    "Mysore",
    "Hubli",
    "Shimoga",
    "Chandrapur",
    "Bellary",
    "Davangere",
    "Amritsar",
    "Belgaum",
    "Etawah",
    "Patna",
    "Purnia",
    "Bhusawal",
    "Nandyal",
    "Kurnool",
    "Kolar",
    "Nellore",
    "Tiruvannamalai",
    "Kanchipuram",
    "Valparai",
    "Tiruppur",
    "Alappuzha",
    "Kollam",
    "Karur",
    "Kumbakonam",
    "Thanjavur",
    "Nagercoil",
    "Tirunelveli",
    "Rajapalaiyam",
    "Salem",
    "Tiruchirappalli",
    "Madurai",
    "Cuddalore",
    "Dindigul"
];

const earthRadiusKm = 6371;
const refreshRate = 1; // sekunden

export class Driver extends EventEmitter {
    locationInfo: {
        mAccuracy: number;
        mAltitude: number;
        mBearing: number;
        mBearingAccuracyDegrees: number;
        mElapsedRealtimeNanos: number;
        mGeoPoint: string;
        mLatitude: number;
        mLongitude: number;
        mProvider: string;
        mSpeed: number; //km/h
        mSpeedAccuracyMetersPerSecond: number;
        mTime: number;
        mVerticalAccuracyMeters: number;
    };
    appInfo: { appCode: string; appVersion: string; };
    city: string;
    batteryInfo: { LastChargingPluggedDateTime: string; LastChargingUnPluggedDateTime: string; batteryLevel: number; chargingStatus: boolean; significantLevel: string; significantLowLevelDateTime: string; significantOkayLevelDateTime: string; };
    driverId: number;
    vehicleInfo: { registration_certificate_number: string; vehicle_class: string; vehicle_model: string; };
    orderId: number;
    client: MqttClient | undefined;
    connected: boolean;
    track: any;
    loopId: number;
    seqId: number;
    tripDistance: number;
    driveBack: boolean;
    next: any;
    calc: boolean;
    constructor(driverId: number) {
        super();
        this.locationInfo = {
            mAccuracy: 1.0,
            mAltitude: 0.0,
            mBearing: 0.0,
            mBearingAccuracyDegrees: 0.0,
            mElapsedRealtimeNanos: 81584532000000,
            mGeoPoint: "28708956,77099433",
            mLatitude: 0,
            mLongitude: 0,
            mProvider: "fused",
            mSpeed: 100.0, //km/h
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
            batteryLevel: 100,
            chargingStatus: false,
            significantLevel: "LOW",
            significantLowLevelDateTime: "2018-11-19T17:55:52+0530",
            significantOkayLevelDateTime: ""
        };
        this.driverId = driverId;
        this.vehicleInfo = {
            registration_certificate_number: Math.random().toString(36).substring(10),
            vehicle_class: "",
            vehicle_model: ""
        };
        this.orderId = driverId;
        this.client;
        this.connected = false;
        this.track;
        this.loopId = 0;
        this.seqId = 0;
        this.tripDistance = 0.0;
        this.driveBack = false;
        this.next;
        this.calc = false;
    }

    setVehicleClass(data_class: string) {
        this.vehicleInfo.vehicle_class = data_class;
        switch (data_class) {
            case "van":
                this.vehicleInfo.vehicle_model = "GMC Vandura";
                break;
            case "car":
                this.vehicleInfo.vehicle_model = "VM Golf";
                break;
            case "motorcycle":
                this.vehicleInfo.vehicle_model = "Dirtbike Cross";
                break;
            case "truck":
                this.vehicleInfo.vehicle_model = "TAMIYA 56354";
                break;
            case "truck-pickup":
                this.vehicleInfo.vehicle_model = "Dodge Ram";
                break;
        }
        this.city = myArray[Math.floor(Math.random() * myArray.length)];

    }

    sendMydata() {
        // increment seqId
        this.seqId++;

        if (this.seqId > 1) {
            this.next = this.checkIfNextPointIsClose(this.locationInfo.mLatitude, this.locationInfo.mLongitude, parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lat), parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lon));
            let calc = this.distanceInKmBetweenEarthCoordinates(this.locationInfo.mLatitude, this.locationInfo.mLongitude, this.next.mLatitude, this.next.mLongitude);
            this.tripDistance = this.tripDistance + calc;
            console.log(`Distance: <${calc}> KM / TripDistance: <${this.tripDistance}>`);
            // set next Latitude
            this.locationInfo.mLatitude = this.next.mLatitude;
            // set next Longitude
            this.locationInfo.mLongitude = this.next.mLongitude;
        } else {
            // set next Latitude
            this.locationInfo.mLatitude = parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lat);
            // set next Longitude
            this.locationInfo.mLongitude = parseFloat(this.track.gpx.trk.trkseg.trkpt[this.loopId]._attributes.lon);
        }

        // set current unix time in milliseconds
        this.locationInfo.mTime = Date.now();
        let timeNow = new Date().toISOString();

        console.log(`Latitude: <${this.locationInfo.mLatitude}> Longitude: <${this.locationInfo.mLongitude}> Driver: <${this.driverId}>`);
        // construct a message
        let message = {
            appInfo: this.appInfo,
            city: this.city,
            deviceInfo: {
                batteryInfo: this.batteryInfo,
                timeStamp: timeNow
            },
            deviceTimeStamp: timeNow,
            driverId: this.driverId,
            locationInfo: this.locationInfo,
            online: this.connected,
            orderId: this.orderId,
            seqId: this.seqId,
            stopId: "261933",
            tripDistance: this.tripDistance,
            tripId: "768018",
            tripStatus: "In-Progress",
            vehicleInfo: this.vehicleInfo
        };
        if (this.driveBack) {
            if (this.loopId !== 0) {
                if (!this.calc) {
                    this.loopId--;
                }
            } else {
                this.driveBack = false;
            }
        } else if (this.loopId !== this.track.gpx.trk.trkseg.trkpt.length - 1 && !this.driveBack) {
            if (!this.calc) {
                this.loopId++;
            }
        } else {
            this.driveBack = true;
        }
        return JSON.stringify(message);
    }

    connect() {
        if (!this.connected) {
            this.connected = true;
            this.client = mqtt.connect('mqtt://broker.hivemq.com');
            this.client.on('connect', () => {
                this.sendInterval()
            });
        }
    }

    loadtrack(file: string) {
        let xml = fs.readFileSync(file, 'utf8');
        this.track = convert.xml2js(xml, options);
        console.log(`loaded track: ${this.track.gpx.trk.name._text}`);
        this.connect();
    }

    async sendInterval() {
        this.client?.publish(`innovis/driver/${this.driverId}`, this.sendMydata());
        setTimeout(() => this.sendInterval(), refreshRate * 1000);
    }

    checkIfNextPointIsClose(lat1: number, lon1: number, lat2: number, lon2: number) {
        this.locationInfo.mBearing = this.getBearing(lat1, lon1, lat2, lon2);
        console.log(`Bearing: <${this.locationInfo.mBearing}> Driver: <${this.driverId}>`);
        let distance = this.locationInfo.mSpeed / 3600 * refreshRate;

        if (this.distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) > distance) {
            console.log(`Slow down Driver: <${this.driverId}>`);
            this.calc = true;
            return this.calculateNewPostionFromBearingDistance(lat1, lon1, this.locationInfo.mBearing, distance);
        } else {
            this.calc = false;
            return {
                mLatitude: lat2,
                mLongitude: lon2
            };
        }
    }

    toRadians(degrees: number) {
        return degrees * Math.PI / 180;
    }

    toDegrees(radians: number) {
        return radians * 180 / Math.PI;
    }

    distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
        let dLat = this.toRadians(lat2 - lat1);
        let dLon = this.toRadians(lon2 - lon1);
        lat1 = this.toRadians(lat1);
        lat2 = this.toRadians(lat2);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    getBearing(startLat: number, startLong: number, endLat: number, endLong: number) {
        startLat = this.toRadians(startLat);
        startLong = this.toRadians(startLong);
        endLat = this.toRadians(endLat);
        endLong = this.toRadians(endLong);
        var dLong = endLong - startLong;
        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0)
                dLong = -(2.0 * Math.PI - dLong);
            else
                dLong = (2.0 * Math.PI + dLong);
        }
        return (this.toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }

    calculateNewPostionFromBearingDistance(lat: number, lng: number, bearing: number, distance: number) {
        let lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / earthRadiusKm) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / earthRadiusKm) * Math.cos(Math.PI / 180 * bearing));
        let lon2 = Math.PI / 180 * lng + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / earthRadiusKm) * Math.cos(Math.PI / 180 * lat), Math.cos(distance / earthRadiusKm) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2));
        return {
            mLatitude: 180 / Math.PI * lat2,
            mLongitude: 180 / Math.PI * lon2
        };
    }
}
