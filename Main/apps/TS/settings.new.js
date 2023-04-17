/*
* Configuration file
* */

var LOCAL = "http://localhost";
var PROD = "http://demo1.centralconsultinggroup.com";
var DEV  = "http://demo1.centralconsultinggroup.com:8080";

var language = navigator.language; // to overwrite replace with exp: "en-US"

var SETTINGS = {};

var SERVER = LOCAL; //"http://ccgvm31.centralus.cloudapp.azure.com";  //LOCAL; //<- put it here PROD, DEV, BETA, TRAINING or LOCAL(default)

(function () {
    SETTINGS.config =
        {
            "DBI": "__a2b8VeJPPhvprcdQPZ3Cm__a2b9P8ob66oj1xseQk9eMQJ7ZNvc__a2bi4f__a2b__a2fAGkZeb9enkDBy",
            "APP": "FSS",
            "webService": SERVER + '/FieldServices.BL/DirectRouter/Index',
            "language": language,
        }
})();