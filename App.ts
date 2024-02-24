import { Driver } from "./Driver.js";
//"van"
//"car"
//"motorcycle"
//"truck"
//"truck-pickup"

const DriverA = new Driver(1);
DriverA.setVehicleClass("van");
DriverA.loadtrack('track4.gpx');
const DriverB = new Driver(2);
DriverB.setVehicleClass("motorcycle");
DriverB.loadtrack('track5.gpx');
const DriverC = new Driver(3);
DriverC.setVehicleClass("truck");
DriverC.loadtrack('track6.gpx');
const DriverD = new Driver(4);
DriverD.setVehicleClass("truck-pickup");
DriverD.loadtrack('track8.gpx');
const DriverE = new Driver(5);
DriverE.setVehicleClass("car");
DriverE.loadtrack('track9.gpx');
const DriverF = new Driver(6);
DriverF.setVehicleClass("motorcycle");
DriverF.loadtrack('track10.gpx');