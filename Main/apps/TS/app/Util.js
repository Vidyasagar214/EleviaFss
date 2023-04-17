/*
 * App Utility Class
 */
Ext.define('TS.Util', {
    singleton: true,

    /* Generic JS methods */

    // Gets an object
    objByString: function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    },

    /* ExtJS specific methods */

    // Uses lookup to perform the same methods across multiple components
    // Refs can be a single string or array of strings
    // Method should be in dot notation if nested (for example, getStore.removeAll)
    doMultiRefs: function (view, refs, method) {
        if (view) {
            Ext.Array.forEach((typeof refs === 'string' ? [refs] : refs), function (ref) {
                if (view.lookup(ref) && view.lookup(ref)[method]) {
                    TS.Util.objByString(view.lookup(ref), method)();
                }
            }, this);
        }
    },

    /**
     * Recursively capitalizes passed in object
     * @param obj
     * @param reverse Un-capitalize
     * @param skipIds skip any property that is named 'id'
     * @returns {*}
     */
    capitalizeKeys: function (obj, reverse, skipIds) {
        var me = this;

        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        Object.keys(obj).forEach(function (key) {
            if (skipIds && key === 'id') {
                return;
            }

            var k = reverse ? Ext.String.uncapitalize(key) : Ext.String.capitalize(key),
                value;

            if (k !== key) {
                value = obj[key];
                obj[k] = value;
                delete obj[key];
            } else {
                value = obj[key];
            }

            if (value !== null && typeof value === 'object') {
                me.capitalizeKeys(value, reverse, skipIds);
            }
        });

        return obj;
    },

    onCheckForDoubleBookedEmployees: function (fwaId, crewId, start, end, callback) {
        var settings = TS.app.settings,
            UtcStart = TS.common.Util.getOutUTCDate(start),
            UtcEnd = TS.common.Util.getOutUTCDate(end);

        Fwa.CheckForDoubleBookedEmp(null, settings.username, fwaId, crewId, UtcStart, UtcEnd, function (response) {
            if (response.success && response.total > 0) {
                var message = '',
                    empList = response.data;
                Ext.Array.each(empList, function (item) {
                    message += item.errorValue + '<br>';
                });
                message += 'Do you wish to continue?';
                Ext.Msg.confirm(empList[0].errorType + 's', message, function (btn) {
                    if (btn === 'yes') {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                callback(true);
            }
        });
    },

    onCheckForDoubleBookedEmployeesByEmpId: function (empId, start, end, callback) {
        var settings = TS.app.settings,
            UtcStart = TS.common.Util.getOutUTCDate(start),
            UtcEnd = TS.common.Util.getOutUTCDate(end);

        Fwa.CheckForDoubleBookedByEmpId(null, settings.username, empId, UtcStart, UtcEnd, function (response) {
            if (response.success && response.total > 0) {
                var message = '',
                    empList = response.data;
                Ext.Array.each(empList, function (item) {
                    message += item.errorValue + '<br>';
                });
                message += 'Do you wish to continue?';
                Ext.Msg.confirm(empList[0].errorType + 's', message, function (btn) {
                    if (btn === 'yes') {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                callback(true);
            }
        });
    },

    onCheckPriorToEmployeeAssn: function (origFwa, isScheduler, selectedCrew, callback) {
        var me = this,
            settings = TS.app.settings,
            actionList,
            message,
            data = Ext.clone(origFwa);

        data.scheduledCrewId = selectedCrew;
        data.hours = [];
        data.notes = [];
        data.workSchedAndPerf = [];
        data.nonFieldActions = [];
        //check all dates
        data = me.checkFwaForValidDates(data);
        //create array of fwa units
        data.units = [];
        //adjust for time zone
        if (me.isValidDate(data.schedStartDate))
            data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        if (me.isValidDate(data.schedEndDate))
            data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        else
            data.schedEndDate = Ext.Date.add(data.schedStartDate, Ext.Date.HOUR, 1);

        var diff = data.schedEndDate - data.schedStartDate;
        data.duration = diff / 1000 / 60 / 60;
        //convert duration to minutes
        data.duration = data.duration * 60;
        data.availableTemplates = [];

        if (isNaN(data.lastSubmittedDate.getTime()) || data.lastSubmittedDate <= new Date('1/1/0001 12:30:00 AM'))
            data.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
        if (isNaN(data.lastApprovedDate.getTime()) || data.lastApprovedDate <= new Date('1/1/0001 12:30:00 AM'))
            data.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');

        Fwa.CheckPriorToEmployeeAssn(null, settings.username, data, isScheduler, function (response) {
            if (response.success) {
                if (response.message && response.message.mdBody) {
                    if (response.message.mdType.toLowerCase() == 'error') {
                        message = response.message.mdBody + '<br>';
                        Ext.Msg.alert('Error', message, function (btn) {
                            callback(false);
                        });
                    } else {
                        message = response.message.mdBody + '<br>';
                        message += 'Do you wish to continue?';
                        Ext.Msg.confirm('FYI', message, function (btn) {
                            if (btn === 'yes') {
                                callback(true);
                            } else {
                                callback(false);
                            }
                        });
                    }
                } else {
                    callback(true);
                }
            } else {
                //error
                if (response.message && response.message.mdBody) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                    callback(false);
                }
            }
        }, me, {
            autoHandle: true
        });
    },

    checkFwaForValidDates: function (data) {
        if (!data.dateOrdered || data.dateOrdered < new Date('1/1/0001 12:30:00 AM')) {
            data.dateOrdered = new Date('1/1/2001 12:00:00 AM');
        }
        if (!data.dateRequired || data.dateRequired < new Date('1/1/0001 12:30:00 AM')) {
            data.dateRequired = new Date('1/1/2001 12:00:00 AM');
        }

        if (data.lastSubmittedDate == undefined || isNaN(data.lastSubmittedDate.getTime()) || data.lastSubmittedDate <= new Date('1/1/0001 12:30:00 AM'))
            data.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
        if (data.lastApprovedDate == undefined || data.lastApprovedDate && isNaN(data.lastApprovedDate.getTime()) || data.lastApprovedDate <= new Date('1/1/0001 12:30:00 AM'))
            data.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');

        if (data.udf_d1 == undefined || !data.udf_d1 || data.udf_d1 < new Date('1/1/0001 12:30:00 AM')) {
            data.udf_d1 = new Date('1/1/2001 12:00:00 AM');
        }
        if (data.udf_d2 == undefined || !data.udf_d2 || data.udf_d2 < new Date('1/1/0001 12:30:00 AM')) {
            data.udf_d2 = new Date('1/1/2001 12:00:00 AM');
        }
        if (data.udf_d3 == undefined || !data.udf_d3 || data.udf_d3 < new Date('1/1/0001 12:30:00 AM')) {
            data.udf_d3 = new Date('1/1/2001 12:00:00 AM');
        }

        if (data.recurrenceConfig) {
            if (!data.recurrenceConfig.startDate) {
                data.recurrenceConfig.startDate = new Date('1/1/2001 12:00:00 AM');
            }
            if (!data.recurrenceConfig.until) {
                data.recurrenceConfig.until = new Date('1/1/2001 12:00:00 AM');
            }
        }
        Ext.each(data.hours, function (rec) {
            rec.startTime = new Date('1/1/2001 12:00:00 AM');
            rec.endTime = new Date('1/1/2001 12:00:00 AM');
        })

        return data;
    },

    checkFwaGridObjects: function (data, fwaUnitGrid) {
        var form = Ext.first('#fwaForm'),
            fwa = form.getRecord();
        var regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            match,
            obj,
            actionList;
        //check latitude/longitude
        if (!data.loc.latitude) data.loc.latitude = 0;
        if (!data.loc.longitude) data.loc.longitude = 0;
        Ext.first('grid-employeehours').getStore().clearFilter();
        // Update the store fields
        if (!Array.isArray(data.units))
            data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        if (!Array.isArray(data.workSchedAndPerf))
            data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        if (!Array.isArray(data.nonFieldActions))
            data.nonFieldActions = Ext.Array.pluck(data.nonFieldActions.getRange(), 'data');
        if (!Array.isArray(data.expenses))
            data.expenses = Ext.Array.pluck(data.expenses.getRange(), 'data');
        if (!Array.isArray(data.hours))
            data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
        if (!Array.isArray(data.notes))
            data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        //adjust for time zone
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });

        Ext.each(data.nonFieldActions, function (obj) {
            if (obj.actionDateCompleted) {
                obj.actionTempSaveData = 'Completed';
            } else if (obj.actionOwnerId) {
                obj.actionTempSaveData = 'Owner';
            } else {
                obj.actionTempSaveData = 'New';
            }
        });

        fwaUnitGrid.getStore().clearFilter();
        if (fwaUnitGrid && fwaUnitGrid.getStore().getRange().length >= data.units.length) {
            data.units = Ext.Array.pluck(fwaUnitGrid.getStore().getRange(), 'data');
        }
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details.length == 0) {
                unit.details = []; //if no details, create empty array
            } else {
                if (!Ext.isArray(unit.details))
                    unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
        });

        // //DATES
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);

        if (!data.dateOrdered || data.dateOrdered < new Date('1/1/0001 12:30:00 AM') || data.dateOrdered == 'Invalid Date') {
            data.dateOrdered = new Date('1/1/2001 12:00:00 AM');
        }
        if (!data.dateRequired || data.dateRequired < new Date('1/1/0001 12:30:00 AM') || data.dateRequired == 'Invalid Date') {
            data.dateRequired = new Date('1/1/2001 12:00:00 AM');
        }
        if (!data.lastSubmittedDate || data.lastSubmittedDate <= new Date('1/1/0001 12:30:00 AM') || data.lastSubmittedDate == 'Invalid Date') {
            data.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
        } else {
            data.lastSubmittedDate = TS.common.Util.getOutUTCDate(data.lastSubmittedDate);
        }
        if (!data.lastApprovedDate || data.lastApprovedDate <= new Date('1/1/0001 12:30:00 AM') || data.lastApprovedDate == 'Invalid Date') {
            data.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');
        } else {
            data.lastApprovedDate = TS.common.Util.getOutUTCDate(data.lastApprovedDate);
        }
        if (!data.udf_d1 || data.udf_d1 < new Date('1/1/0001 12:30:00 AM') || data.udf_d1 == 'Invalid Date') {
            data.udf_d1 = new Date('1/1/2001 12:00:00 AM');
        }
        if (!data.udf_d2 || data.udf_d2 < new Date('1/1/0001 12:30:00 AM') || data.udf_d2 == 'Invalid Date') {
            data.udf_d2 = new Date('1/1/2001 12:00:00 AM');
        }
        if (!data.udf_d3 || data.udf_d3 < new Date('1/1/0001 12:30:00 AM') || data.udf_d3 == 'Invalid Date') {
            data.udf_d3 = new Date('1/1/2001 12:00:00 AM');
        }

        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);

        return data;
    },


    isValidDate: function (s) {
        return (s instanceof Date) && !isNaN(s.valueOf());
    },

    hasDST: function (dt) {
        const january = new Date(dt.getFullYear(), 0, 1).getTimezoneOffset();
        const july = new Date(dt.getFullYear(), 6, 1).getTimezoneOffset();

        return Math.max(january, july) !== dt.getTimezoneOffset();
    },

    //GPS Functions
    retrieveGPSData: function (metaData) {
        //console.log(metaData);
        var me = this,
            model = Ext.create('TS.model.fwa.GPSData', {
                gpsAltitude: metaData.GPSAltitude ? metaData.GPSAltitude : 'N/A',
                gpsAltitudeRef: metaData.GPSAltitudeRef ? metaData.GPSAltitudeRef : 'N/A',
                gpsDestBearing: metaData.GPSDestBearing ? metaData.GPSDestBearing : 'N/A',
                gpsDestBearingRef: metaData.GPSDestBearingRef ? metaData.GPSDestBearingRef : 'N/A',
                gpsImgDirection: metaData.GPSImgDirection ? metaData.GPSImgDirectionRef : 'N/A',
                gpsImgDirectionRef: metaData.GPSImgDirectionRef ? metaData.GPSImgDirectionRef : 'N/A',
                gpsLatitude: metaData.GPSLatitude ? metaData.GPSLatitude : 'N/A',
                gpsLatitudeRef: metaData.GPSLatitudeRef ? metaData.GPSLatitudeRef : 'N/A',
                gpsLongitude: metaData.GPSLongitude ? metaData.GPSLongitude : 'N/A',
                gpsLongituderEF: metaData.GPSLongitudeRef ? metaData.GPSLongitudeRef : 'N/A',
                dateTime: metaData.DateTime ? metaData.DateTime : 'N/A',
                altitudeInFeet: metaData.GPSAltitude ? ((metaData.GPSAltitude.numerator / metaData.GPSAltitude.denominator) * 3.28084).toFixed(2) : 'N/A',
                bearing: metaData.GPSDestBearing ? (metaData.GPSDestBearing.numerator / metaData.GPSDestBearing.denominator).toFixed(2) : 'N/A',
                imageDirection: metaData.GPSImgDirection ? (metaData.GPSImgDirection.numerator / metaData.GPSImgDirection.denominator).toFixed(2) : 'N/A',
                direction: metaData.GPSImgDirection ? (metaData.GPSImgDirection.numerator / metaData.GPSImgDirection.denominator).toFixed(2) : 'N/A',
                latitude: metaData.GPSLatitude ? me.dmsToDegrees(metaData.GPSLatitude[0].numerator / metaData.GPSLatitude[0].denominator,
                    metaData.GPSLatitude[1].numerator / metaData.GPSLatitude[1].denominator,
                    metaData.GPSLatitude[2].numerator / metaData.GPSLatitude[2].denominator,
                    metaData.GPSLatitudeRef) : 'N/A',
                longitude: metaData.GPSLongitude ? me.dmsToDegrees(metaData.GPSLongitude[0].numerator / metaData.GPSLongitude[0].denominator,
                    metaData.GPSLongitude[1].numerator / metaData.GPSLongitude[1].denominator,
                    metaData.GPSLongitude[2].numerator / metaData.GPSLongitude[2].denominator,
                    metaData.GPSLongitudeRef) : 'N/A',
                imageDirectionRef: metaData.GPSImgDirectionRef ? metaData.GPSImgDirectionRef == 'T' ? 'True Direction' : 'Magnetic Direction' : 'N/A',
                bearingDirectionRef: metaData.GPSDestBearingRef ? metaData.GPSDestBearingRef == 'T' ? 'True Direction' : 'Magnetic Direction' : 'N/A',
                imageDirectionString: metaData.GPSImgDirection ? (metaData.GPSImgDirection.numerator / metaData.GPSImgDirection.denominator).toFixed(2) + ' / ' + me.getDegreeDirection((metaData.GPSImgDirection.numerator / metaData.GPSImgDirection.denominator).toFixed(2)) : 'N/A',
                bearingDirectionString: metaData.GPSDestBearing ? (metaData.GPSDestBearing.numerator / metaData.GPSDestBearing.denominator).toFixed(2) + ' / ' + me.getDegreeDirection((metaData.GPSDestBearing.numerator / metaData.GPSDestBearing.denominator).toFixed(2)) : 'N/A'
            });
        return model;
    },

    dmsToDegrees: function (days, minutes, seconds, direction) {
        direction.toUpperCase();
        var dd = days + minutes / 60 + seconds / (60 * 60);
        //alert(dd);
        if (direction == "S" || direction == "W") {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
    },

    getOrientation: function (orientation) {
        var style = '';
        switch (orientation) {
            case 2:
            case 3:
            case 4:
                // horizontal flip
                style = 'transform:rotate(180deg)';
                break;
            // case 5:
            //     // vertical flip + 90 rotate right
            //     ctx.rotate(0.5 * Math.PI);
            //     ctx.scale(1, -1);
            //     break;
            case 6:
                // 90° rotate right
                style = 'transform:rotate(90deg)';
                break;
            // case 7:
            //     // horizontal flip + 90 rotate right
            //     ctx.rotate(0.5 * Math.PI);
            //     ctx.translate(canvas.width, -canvas.height);
            //     ctx.scale(-1, 1);
            //     break;
            case 8:
                // 90° rotate left
                style = 'transform:rotate(270deg)';
                break;
        }

        return style;

    },

    getDegreeDirection: function (degree) {
        var direction;
        if (degree >= 348.76 && degree <= 360.00) {
            direction = 'N';
        } else if (degree >= 0 && degree <= 11.25) {
            direction = 'N';
        } else if (degree >= 11.26 && degree <= 33.75) {
            direction = 'NNE';
        } else if (degree >= 33.76 && degree <= 56.25) {
            direction = 'NE';
        } else if (degree >= 56.26 && degree <= 78.75) {
            direction = 'ENE';
        } else if (degree >= 78.76 && degree <= 101.25) {
            direction = 'E';
        } else if (degree >= 101.26 && degree <= 123.75) {
            direction = 'ESE';
        } else if (degree >= 123.76 && degree <= 146.25) {
            direction = 'SE';
        } else if (degree >= 146.26 && degree <= 168.75) {
            direction = 'SSE';
        } else if (degree >= 168.76 && degree <= 191.25) {
            direction = 'S';
        } else if (degree >= 191.26 && degree <= 213.25) {
            direction = 'SSW';
        } else if (degree >= 213.26 && degree <= 236.25) {
            direction = 'SW';
        } else if (degree >= 236.26 && degree <= 258.75) {
            direction = 'WSW';
        } else if (degree >= 258.76 && degree <= 281.25) {
            direction = 'W';
        } else if (degree >= 281.26 && degree <= 303.75) {
            direction = 'WNW';
        } else if (degree >= 303.76 && degree <= 326.25) {
            direction = 'NW';
        } else if (degree >= 326.26 && degree <= 348.75) {
            direction = 'NNW';
        }
        return direction;
    },

    getCurrentScrollToY: function () {
        var settings = TS.app.settings,
            spacing = 735;

        if (settings.fwaDisplay_udf_t1 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t2 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t3 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t4 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t5 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t6 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t7 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t8 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t9 != 'N')
            spacing += 45;
        if (settings.fwaDisplay_udf_t10 != 'N')
            spacing += 45;

        return spacing;
    },

    getAddressScrollToY: function (field) {
        var settings = TS.app.settings,
            spacing = 315;

        if (field == 'udf_a1') {
            return spacing;
        } else if (field == 'udf_a2') {
            if (settings.fwaDisplay_udf_a1 != 'N') {
                spacing += 45;
            }
            return spacing;
        } else if (field == 'udf_a3') {
            if (settings.fwaDisplay_udf_a1 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a2 != 'N') {
                spacing += 45;
            }
            return spacing;
        } else if (field == 'udf_a4') {
            if (settings.fwaDisplay_udf_a1 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a2 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a3 != 'N') {
                spacing += 45;
            }
            return spacing;
        } else if (field == 'udf_a5') {
            if (settings.fwaDisplay_udf_a1 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a2 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a3 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a4 != 'N') {
                spacing += 45;
            }
            return spacing;
        } else if (field == 'udf_a6') {
            if (settings.fwaDisplay_udf_a1 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a2 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a3 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a4 != 'N') {
                spacing += 45;
            }
            if (settings.fwaDisplay_udf_a5 != 'N') {
                spacing += 45;
            }
            return spacing;
        }
    },

    getFwaCrewAssignToolTip: function (value, metaData, record) {
        var info = record.get('hoverRows');
        if (record.get('schedStartDate')) {
            while (info.indexOf('^fromUTC(') > -1) {
                var start = info.indexOf('^fromUTC(') + 9,
                    end = info.indexOf(')^'),
                    oldDt = '',
                    dt = '',
                    newDt = '',
                    D = Ext.Date,
                    offset = new Date().getTimezoneOffset();
                oldDt = new Date(info.substring(start, end));
                dt = D.add(oldDt, D.MINUTE, offset * -1);
                newDt = Ext.Date.format(dt, DATE_FORMAT + ' g:i A');
                info = info.replace('^fromUTC(' + info.substring(start, end) + ')^', newDt);
            }
        } else {
            info = info.replace(/\^fromUTC\(/g, '');
            info = info.replace(/\)\^/g, '');
        }
        if (info)
            metaData.tdAttr = 'data-qtip=\'<html><head></head><body><table style="width:450px;">' + info.replace(/'/g, "&#39") + '</table></body></html>\'';

    },

    getToolTip: function (value, metaData, record) {
        var title = record.get('title'),
            email = record.get('emailAddress'),
            phoneNumbers = record.get('phoneNumbers'),
            city = record.get('city'),
            state = record.get('state'),
            office,
            mobile,
            fax,
            info;
        for (var i = 0, l = phoneNumbers.length; i < l; i++) {
            if (phoneNumbers[i].phoneType == 'Fax') {
                fax = phoneNumbers[i].phoneNumber;
            }
            if (phoneNumbers[i].phoneType == 'Mobile') {
                mobile = phoneNumbers[i].phoneNumber;
            }
            if (phoneNumbers[i].phoneType == 'Office') {
                office = phoneNumbers[i].phoneNumber;
            }
        }
        info = '<tr><td><b>Email Address:</b></td><td colspan="3">' + email + '</td></tr>' +
            '<tr><td><b>Office:</b></td><td>' + office + '</td><td><b>Mobile:</b></td><td>' + mobile + '</td></tr>' +
            '<tr><td><b>City:</b></td><td>' + city + '</td><td><b>State:</b></td><td>' + state + '</td></tr>';

        info += TS.Util.displayEmployeeSkillsAndRegistration(metaData, record, record.get('empId'));
        // if (info)
        //     metaData.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';

        return info;
    },

    displayEmployeeSkillsAndRegistration: function (meta, record, empId) {
        var info = '',
            skillSet = '',
            registration = '';
        info += '<tr><td><b><u>Skill Set</u></b></td><td><b><u>Registrations</u></b></td></tr>';
        var skillStore = Ext.getStore('EmployeeSkillSetList');
        var registrationStore = Ext.getStore('EmployeeRegistrationList');
        skillStore.clearFilter();
        skillStore.filterBy(function (rec) {
            return rec.get('empId') == empId;
        });
        registrationStore.clearFilter();
        registrationStore.filterBy(function (rec) {
            return rec.get('empId') == empId;
        });

        Ext.each(skillStore.getRange(), function (skill) {
            skillSet += '<tr><td style="vertical-align: text-top;">' + skill.get('description') + '</td></tr>'
        });
        Ext.each(registrationStore.getRange(), function (reg) {
            registration += '<tr><td style="vertical-align: text-top;">' + reg.get('code') + '</td></tr>'
        });
        info += '<tr><td style="vertical-align: text-top;"><table>' + skillSet + '</table></td><td style="vertical-align: text-top;"><table>' + registration + '</table></td></tr>';
        skillSet = '';
        registration = '';
        return info;
    },

    displayCrewSkillsAndRegistration: function (meta, record) {
        var crew,
            crewId,
            crewList,
            info = '',
            skillSet = '',
            registration = '',
            city = '',
            state = '',
            cityState;
        if (record.get('scheduledCrewId')) {
            crewId = record.get('scheduledCrewId');
            crew = Ext.getStore('AllCrews').findRecord('crewId', crewId);
            crewList = crew.get('crewMembers');
        } else if (record.get('crewMembers')) {
            crewList = record.get('crewMembers');
        }
        info += '<tr><td><b><u>Crew Member</u></b></td><td><b><u>Skill Set</u></b></td><td><b><u>Registrations</u></b></td></tr>';
        Ext.each(crewList.getRange(), function (crewMember) {
            var skillStore = Ext.getStore('EmployeeSkillSetList');
            var registrationStore = Ext.getStore('EmployeeRegistrationList');
            skillStore.clearFilter();
            skillStore.filterBy(function (rec) {
                return rec.get('empId') == crewMember.get('crewMemberEmpId');
            });
            registrationStore.clearFilter();
            registrationStore.filterBy(function (rec) {
                return rec.get('empId') == crewMember.get('crewMemberEmpId');
            });
            var emp = Ext.getStore('Employees').findRecord('empId', crewMember.get('crewMemberEmpId')),
                empName;
            if (emp) {
                empName = emp.get('empNameLastFirst');
                city = emp.get('city');
                state = emp.get('state');
            } else {
                // console.log(crewMember.get('crewMemberEmpId') + ' Employee not in table');
            }
            Ext.each(skillStore.getRange(), function (skill) {
                skillSet += '<tr><td style="vertical-align: text-top;">' + skill.get('description') + '</td></tr>'
            });
            Ext.each(registrationStore.getRange(), function (reg) {
                registration += '<tr><td style="vertical-align: text-top;">' + reg.get('code') + '</td></tr>'
            });
            cityState = '<tr><td style="vertical-align: text-top;">' + empName + '</td></tr><tr><td>' + city + ', ' + state + '</td></tr><tr>';//<td>'+state+'</td></tr>';
            info += '<tr><td colspan="1" style="vertical-align: text-top;">' + empName + '</td><td style="vertical-align: text-top;"><table>' + skillSet + '</table></td><td style="vertical-align: text-top;"><table>' + registration + '</table></td></tr>';
            info += '';
            skillSet = '';
            registration = '';
            cityState = '';
            city = '';
            state = '';
        });
        if (info)
            meta.tdAttr = 'data-qtip=\'<table style:"width:600px;">' + info.replace(/'/g, "&#39") + '</table>\'';
    },

    hasRequiredUdfValues: function (fwa) {
        return true;
        //turned off for now
        var settings = TS.app.settings,
            hasRequired = true,
            message = '<b>Missing required field(s): </b></br>';
        //text fields text fields/combos
        if (settings.udf_t1_isRequired && !fwa.get('udf_t1')) {
            hasRequired = false;
            message += settings.udf_t1_Label + '</br>';
        }
        if (settings.udf_t2_isRequired && !fwa.get('udf_t2')) {
            hasRequired = false;
            message += settings.udf_t2_Label + '</br>';
        }
        if (settings.udf_t3_isRequired && !fwa.get('udf_t3')) {
            hasRequired = false;
            message += settings.udf_t3_Label + '</br>';
        }
        if (settings.udf_t4_isRequired && !fwa.get('udf_t4')) {
            hasRequired = false;
            message += settings.udf_t4_Label + '</br>';
        }
        if (settings.udf_t5_isRequired && !fwa.get('udf_t5')) {
            hasRequired = false;
            message += settings.udf_t5_Label + '</br>';
        }
        if (settings.udf_t6_isRequired && !fwa.get('udf_t6')) {
            hasRequired = false;
            message += settings.udf_t6_Label + '</br>';
        }
        if (settings.udf_t7_isRequired && !fwa.get('udf_t7')) {
            hasRequired = false;
            message += settings.udf_t7_Label + '</br>';
        }
        if (settings.udf_t8_isRequired && !fwa.get('udf_t8')) {
            hasRequired = false;
            message += settings.udf_t8_Label + '</br>';
        }
        if (settings.udf_t9_isRequired && !fwa.get('udf_t9')) {
            hasRequired = false;
            message += settings.udf_t9_Label + '</br>';
        }
        if (settings.udf_t10_isRequired && !fwa.get('udf_t10')) {
            hasRequired = false;
            message += settings.udf_t10_Label + '</br>';
        }
        //address fields/combos
        if (settings.udf_a1_isRequired && !fwa.get('udf_a1')) {
            hasRequired = false;
            message += settings.udf_a1_Label + '</br>';
        }
        if (settings.udf_a2_isRequired && !fwa.get('udf_a2')) {
            hasRequired = false;
            message += settings.udf_a2_Label + '</br>';
        }
        if (settings.udf_a3_isRequired && !fwa.get('udf_a3')) {
            hasRequired = false;
            message += settings.udf_a3_Label + '</br>';
        }
        if (settings.udf_a4_isRequired && !fwa.get('udf_a4')) {
            hasRequired = false;
            message += settings.udf_a4_Label + '</br>';
        }
        if (settings.udf_a5_isRequired && !fwa.get('udf_a5')) {
            hasRequired = false;
            message += settings.udf_a5_Label + '</br>';
        }
        if (settings.udf_a6_isRequired && !fwa.get('udf_a6')) {
            hasRequired = false;
            message += settings.udf_a6_Label + '</br>';
        }
        //date fields
        if (settings.udf_d1_isRequired && Ext.Date.format(fwa.get('udf_d1'), 'Y-M-d') <= Ext.Date.format(new Date('1/1/2001 12:00:00 AM'), 'Y-M-d')) {
            hasRequired = false;
            message += settings.udf_d1_Label + '</br>';
        }
        if (settings.udf_d2_isRequired && Ext.Date.format(fwa.get('udf_d2'), 'Y-M-d') <= Ext.Date.format(new Date('1/1/2001 12:00:00 AM'), 'Y-M-d')) {
            hasRequired = false;
            message += settings.udf_d2_Label + '</br>';
        }
        if (settings.udf_d3_isRequired && Ext.Date.format(fwa.get('udf_d3'), 'Y-M-d') <= Ext.Date.format(new Date('1/1/2001 12:00:00 AM'), 'Y-M-d')) {
            hasRequired = false;
            message += settings.udf_d3_Label + '</br>';
        }

        if (!hasRequired)
            Ext.Msg.alert('Missing Required Fields', message);
        return hasRequired;
    },

    Decompress: function (base64Data) {
       var strData = atob(base64Data),
            // Convert binary string to character-number array
            charData = strData.split('').map(function (x) {
                return x.charCodeAt(0);
            }),
            // Turn number array into byte-array
            binData = new Uint8Array(charData),
            // Pako magic
            data = pako.inflate(binData),
            obj;

        strData = new TextDecoder("utf-8").decode(data);
        obj = JSON.parse(strData);

        return obj;
    }
});
