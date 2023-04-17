/**
 * Created by steve.tess on 4/3/2018.
 */
Ext.define('TS.model.fwa.GPSData', {
    extend: 'Ext.data.Model',

    requires: [
        'TS.Util'
    ],

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {name: 'gpsAltitude', type: 'auto'},
        {name: 'gpsAltitudeRef', type: 'auto'},
        {name: 'gpsDestBearing', type: 'auto'},
        {name: 'gpsDestBearingRef', type: 'auto'},
        {name: 'gpsImgDirection', type: 'auto'},
        {name: 'gpsImgDirectionRef', type: 'auto'},
        {name: 'gpsLatitude', type: 'auto'},
        {name: 'gpsLatitudeRef', type: 'auto'},
        {name: 'gpsLongitude', type: 'auto'},
        {name: 'gpsLongitudeRef', type: 'auto'},
        {
            name: 'dateTime',
            type: 'auto',
            dateFormat: 'c',
            mapping: function (data) {
                return TS.common.Util.getInUTCDate(data.dateTime);
            }
        },

        {
            name: 'altitudeInFeet',
            mapping: function (data) {
                return (data.gpsAltitude.numerator / data.gpsAltitude.denominator) * 3.2808;
            }
        },
        {
            name: 'bearing',
            mapping: function (data) {
                //gpsDestBearingRef
                //'T' = True direction
                // 'M' = Magnetic direction
                return data.gpsDestBearing.numerator / data.gpsDestBearing.denominator;
            }
        },
        {
            name: 'direction',
            mapping: function (data) {
                //gpsImgDirectionRef
                //'T' = True direction
                // 'M' = Magnetic direction
                return data.gpsImgDirection.numerator / data.gpsImgDirection.denominator;
            }
        },
        {
            name: 'latitude',
            mapping: function (data) {
                //gpsLatitudeRef
                // 'N' = North latitude
                // 'S' = South latitude
                return TS.Util.dmsToDegrees(data.gpsLatitude[0].numerator / data.gpsLatitude[0].denominator, data.gpsLatitude[1].numerator / data.gpsLatitude[1].denominator, data.gpsLatitude[2].numerator / data.gpsLatitude[2].denominator, data.gpsLatitudeRef);
            }
        },
        {
            name: 'longitude',
            mapping: function (data) {
                //gpsLongitudeRef
                //'E' = East longitude
                // 'W' = West longitude
                return TS.Util.dmsToDegrees(data.gpsLongitude[0].numerator / data.gpsLongitude[0].denominator, data.gpsLongitude[1].numeratordata.gpsLongitude[1].denominator, data.gpsLongitude[2].numerator / data.gpsLongitude[2].denominator, data.gpsLongitudeRef);
            }
        }

    ]

});