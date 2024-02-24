import { MqttClient } from 'mqtt';
export declare class Driver {
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
        mSpeed: number;
        mSpeedAccuracyMetersPerSecond: number;
        mTime: number;
        mVerticalAccuracyMeters: number;
    };
    appInfo: {
        appCode: string;
        appVersion: string;
    };
    city: string;
    batteryInfo: {
        LastChargingPluggedDateTime: string;
        LastChargingUnPluggedDateTime: string;
        batteryLevel: number;
        chargingStatus: boolean;
        significantLevel: string;
        significantLowLevelDateTime: string;
        significantOkayLevelDateTime: string;
    };
    driverId: number;
    vehicleInfo: {
        registration_certificate_number: string;
        vehicle_class: string;
        vehicle_model: string;
    };
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
    constructor(driverId: number);
    setVehicleClass(data_class: string): void;
    sendMydata(): string;
    connect(): void;
    loadtrack(file: string): void;
    sendInterval(): Promise<void>;
    checkIfNextPointIsClose(lat1: number, lon1: number, lat2: number, lon2: number): {
        mLatitude: number;
        mLongitude: number;
    };
    toRadians(degrees: number): number;
    toDegrees(radians: number): number;
    distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number;
    getBearing(startLat: number, startLong: number, endLat: number, endLong: number): number;
    calculateNewPostionFromBearingDistance(lat: number, lng: number, bearing: number, distance: number): {
        mLatitude: number;
        mLongitude: number;
    };
}
