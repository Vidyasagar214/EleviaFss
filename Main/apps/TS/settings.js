/*
* Configuration file
*
*  //10.0.0.15 Mpls
*  //192.168.1.2  Tampa
*  192.168.0.33 Medellin
* */
//insert user's correct dbi string here
var LOCAL = "http://localhost" //"http://192.168.1.5", //'http://localhost', // "http://192.168.1.115",
    PROD = "https://demo2.eleviasoftware.com",
    DEV = "http://demo1.centralconsultinggroup.com:8080",
    Helix = "https://fss.helixepi.com",
    DEMO3 = "https://demo3.eleviasoftware.com",
    SETTINGS = {},
    SERVER = LOCAL; //<- put it here PROD, DEV, BETA, TRAINING or LOCAL(default)
	var UTILITIES = SERVER + "/FieldServices.DAL.Vision/api/Utilities/";
//var DBI = "vqweJkDj4j__a2fH6QGFy0g__a2bteu6hWmh__a2fp8yL5EC4q6JfauKpc488FNcr283Glqqj__a2fpzuYTMwsK3UO5fkLRA1eTsVA__a3d__a3d";
(function () {
    SETTINGS.config =
        {
            //PENNONI
            "DBI": 'vqweJkDj4j__a2fH6QGFy0g__a2bteu6hWmh__a2fp8yL5EC4q6JfauKpc488FNcr283Glqqj__a2fpzuYTMwsK3UO5fkLRA1eTsVA__a3d__a3d',
            //LOCALHOST
            //"DBI": "__a2b8VeJPPhvprcdQPZ3Cm__a2b9P8ob66oj1xseQk9eMQJ7ZNvc__a2bi4f__a2b__a2fAGkZeb9enkDBy",
            //BKF
            //"DBI": 'ICeswNBIMnQV7Tg6L6aN__a2fLkuS__a2bMKl0JNBNcjW4JJU7gbNdMdIQOE0DIrStgwKriCb4CakngfZmfRfpCf1MhUt72ISBRoUEkVPIieqWjejEY__a3d',
            "APP": "FSS",
            "webService": SERVER + '/FieldApp.BL/DirectRouter/Index', // '/FieldApp.BL/DirectRouter/Index', // '/FieldServices.BL.4.0/DirectRouter/Index',
            "language": navigator.language // to overwrite replace with exp: "en-US"
        },
        SETTINGS.tools =
            {
            //   "cache":   UTILITIES + 'UpdateCache/' + DBI,
            // "config":  UTILITIES + 'GetConfig/' + DBI + '/config',
            // "debug":   UTILITIES + 'SetLogLevel/Debug',
            // "error":   UTILITIES + 'SetLogLevel/Error',
            // "logging": UTILITIES + 'GetLogLines/',
            // "configApp": 'microsoft-edge:' + SERVER + '/EleVia/Applications/FieldAppConfig.application?wscfg=FSS_Config_WS.XML',
            // "importApp": 'microsoft-edge:' + SERVER + '/EleVia/Applications/FieldAppAdmin.application?wscfg=FSS_Config_WS.XML'
            } //microsoft-edge:

})();
