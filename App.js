var Driver = require('./Driver.js');

//"van"
//"car"
//"motorcycle"
//"truck"
//"truck-pickup"


var DriverA = new Driver(1);
DriverA.setVehicleClass("van");
DriverA.loadtrack('track4.gpx');
var DriverB = new Driver(2);
DriverB.setVehicleClass("motorcycle");
DriverB.loadtrack('track5.gpx');
var DriverC = new Driver(3);
DriverC.setVehicleClass("truck");
DriverC.loadtrack('track6.gpx');
var DriverD = new Driver(4);
DriverD.setVehicleClass("truck-pickup");
DriverD.loadtrack('track8.gpx');
var DriverE = new Driver(5);
DriverE.setVehicleClass("car");
DriverE.loadtrack('track9.gpx');
var DriverF = new Driver(6);
DriverF.setVehicleClass("motorcycle");
DriverF.loadtrack('track10.gpx');