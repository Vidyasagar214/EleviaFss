Ext.define('TS.model.fwa.Fwa', {
    extend: 'Sch.model.Event',

    //include custom fields
    requires: [
        'TS.data.field.WorkList',
        'TS.data.field.HoursList',
        'TS.data.field.FwaActionList',
        'TS.data.field.UnitList',
        'TS.data.field.NotesList',
        'TS.data.field.RecurrenceDatesInRange'
    ],

    idProperty: 'id',
    identifier: 'uuid',

    startDateField: 'schedStartDate',
    endDateField: 'schedEndDate',
    nameField: 'fwaName',
    resourceIdField: 'scheduledCrewId',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'fwaId',
            type: 'string'
        },{
            name: 'recurrCt',
            type: 'int'
        },
        {
            name: 'fwaNum',
            type: 'string'
            // sortType: function(str)  {
            //     var parsed = parseInt(str, 10);
            //     if ( isNaN( parsed ) ){
            //         return parseInt(str.substring(1, 10));
            //     } else {
            //         return Number.MIN_SAFE_INTEGER + parsed;
            //     }
            // }
        },
        {
            name: 'fwaName',
            type: 'string'
        },
        {
            name: 'schedBarText',
            type: 'string'
        },
        {
            name: 'fieldPriorityId',
            type: 'string',
            defaultValue: 1
        },
        {
            name: 'fwaDisplayString',
            mapping: function (data) {
                //PR1.WBS1+isnull('-'+PR2.WBS2,'')+'-'+PR1.LongName + isnull(' - '+PR2.LongName,'')
                return data.wbs1 + (data.wbs2) ? '-' + data.wbs2 : '' + '-' + data.wbs1Name + (data.wbs2Name) ? data.wbs2Name : '';
            }
        },
        {
            name: 'fieldPriorityDesc',
            mapping: function (data) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId);
                return priority ? priority.get('priorityDescr') : 'N/A';
            }
        },
        {
            name: 'fieldPriorityColor',
            mapping: function (data) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId),
                    colors;
                if (priority)
                    colors = priority.get('priorityHighlightColor');
                return colors ? 'background:rgb(' + colors + ');' : '';
            }
        },
        {
            name: 'fieldPriorityFontColor',
            mapping: function (data) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId),
                    colors,
                    luma,
                    r,
                    g,
                    b;
                if (priority) {
                    colors = priority.get('priorityHighlightColor');
                    if (colors) {
                        colors = colors.split(',');
                        r = colors[0] & 0xff;
                        g = colors[1] & 0xff;
                        b = colors[2] & 0xff;
                        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
                        if (luma < 40) {
                            return 'color:#fff !important;'
                        }
                        return 'color:#000';
                    }
                }
            }
        },
        {
            name: 'nonFieldActions',
            type: 'actionlist'
        },
        {
            name: 'nonFieldActionCt',
            type: 'int'
        },
        {
            name: 'nonFieldActionCompleteCt',
            type: 'int'
        },
        {
            name: 'nonFieldPreActionCt',
            type: 'int'
        },
        {
            name: 'nonFieldPreActionCompleteCt',
            type: 'int'
        },
        {
            name: 'udf_c1',
            type: 'boolean'
        },
        {
            name: 'udf_t1',
            type: 'string'
        },
        {
            name: 'udf_t2',
            type: 'string'
        },
        {
            name: 'udf_t3',
            type: 'string'
        },
        {
            name: 'udf_t4',
            type: 'string'
        },
        {
            name: 'udf_t5',
            type: 'string'
        },
        {
            name: 'udf_t6',
            type: 'string'
        },
        {
            name: 'udf_t7',
            type: 'string'
        },
        {
            name: 'udf_t8',
            type: 'string'
        },
        {
            name: 'udf_t9',
            type: 'string'
        },
        {
            name: 'udf_t10',
            type: 'string'
        },
        {
            name: 'udf_t11',
            type: 'string'
        },
        {
            name: 'udf_a1',
            type: 'string'
        },
        {
            name: 'udf_a2',
            type: 'string'
        },
        {
            name: 'udf_a3',
            type: 'string'
        },
        {
            name: 'udf_a4',
            type: 'string'
        },
        {
            name: 'udf_a5',
            type: 'string'
        },
        {
            name: 'udf_a6',
            type: 'string'
        },
        {
            name: 'udf_l1',
            type: 'string'
        },
        {
            name: 'udf_l2',
            type: 'string'
        },
        {
            name: 'udf_d1',
            type: 'date',
            dateFormat: 'c',
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'udf_d2',
            type: 'date',
            dateFormat: 'c',
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'udf_d3',
            type: 'date',
            dateFormat: 'c',
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'fieldPriorityDesc',
            type: 'string'
        },
        {
            name: 'fwaApprovers',
            type: 'string'
        },
        {
            name: 'fwaApproversCanModify',
            type: 'bool'
        },
        {
            name: 'hoverRows',
            type: 'string'
        },
        {
            name: 'clientId',
            type: 'string'
        },
        {
            name: 'clientNumber',
            type: 'string'
        },
        {
            name: 'clientName',
            type: 'string'
        },
        {
            name: 'contactInfo',
            type: 'string'
        },
        {
            name: 'wbs1',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
        },
        {
            name: 'wbs1Name',
            type: 'string'
        },
        {
            name: 'wbs2',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
        },
        {
            name: 'wbs2Name',
            type: 'string'
        },
        {
            name: 'wbs3',
            type: 'string',
            allowNull: true,
            convert: function (value) {
                return ((value === " " || value === "") ? null : value);
            }
        },
        {
            name: 'wbs3Name',
            type: 'string'
        },
        {
            name: 'wbsLocked',
            type: 'boolean'
        },
        {
            name: 'schedStartDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                var hasStartDST = TS.Util.hasDST(new Date(data.schedStartDate)),
                    hasEndDST = TS.Util.hasDST(new Date(data.schedEndDate));

                if (data.recurrencePattern && data.recurrenceDatesInRange.length > 0) {
                    //console.log(new Date(new Date(data.recurrenceDatesInRange[0]).setTime(new Date(data.schedStartDate).getTime())));
                    var datesInRange = data.recurrenceDatesInRange,
                        startIsDaylight = new Date(new Date(datesInRange[0]).setTime(new Date(data.schedStartDate).getTime())).toString().includes('Daylight'),
                        valueIsDaylight = new Date(data.schedStartDate).toString().includes('Daylight'),
                        endIsStandard = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Standard'),
                        startIsStandard = new Date(new Date(datesInRange[0]).setHours(new Date(data.schedStartDate).getHours())).toString().includes('Standard'),
                        valueIsStandard = new Date(data.schedStartDate).toString().includes('Standard'),
                        endIsDaylight = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Daylight');
                    //daylight to standard
                    if (startIsDaylight && endIsStandard && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.schedStartDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                    if (startIsStandard && endIsDaylight && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.schedStartDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                } else {
                    var startIsStandard = new Date(data.schedStartDate).toString().includes('Standard'),
                        endIsDaylight = new Date(data.schedEndDate).toString().includes('Daylight'),
                        valueIsDaylight = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Daylight'),
                        startIsDaylight = new Date(data.schedStartDate).toString().includes('Daylight'),
                        endIsStandard = new Date(data.schedEndDate).toString().includes('Standard'),
                        valueIsStandard = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Standard');

                    if (startIsDaylight && endIsStandard && !valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.schedStartDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                    if (startIsStandard && endIsDaylight && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.schedStartDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                }
                return TS.common.Util.getInUTCDate(data.schedStartDate);
            }
        },
        {
            name: 'schedEndDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                if (IS_OFFLINE) {
                    return data.schedEndDate;
                } else {
                    if (data.recurrencePattern && data.recurrenceDatesInRange) {

                        var datesInRange = data.recurrenceDatesInRange,
                            startIsDaylight = new Date(new Date(datesInRange[0]).setHours(new Date(data.schedStartDate).getHours())).toString().includes('Daylight'),
                            valueIsDaylight = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Daylight'),
                            endIsStandard = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Standard'),
                            startIsStandard = new Date(new Date(datesInRange[0]).setHours(new Date(data.schedStartDate).getHours())).toString().includes('Standard'),
                            valueIsStandard = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Standard'),
                            endIsDaylight = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Daylight');
                        //daylight to standard
                        if (startIsDaylight && endIsStandard && valueIsDaylight) {
                            var newDate = TS.common.Util.getInUTCDate(data.schedEndDate);
                            newDate.setHours(newDate.getHours() - 1);
                            return newDate;
                        }
                        //standard to daylight
                        if (startIsStandard && endIsDaylight && !valueIsStandard) {
                            var newDate = TS.common.Util.getInUTCDate(data.schedEndDate);
                            newDate.setHours(newDate.getHours() - 1);
                            return newDate;
                        }
                    } else {
                        var startIsStandard = new Date(data.schedStartDate).toString().includes('Standard'),
                            endIsDaylight = new Date(data.schedEndDate).toString().includes('Daylight'),
                            valueIsDaylight = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Daylight'),
                            startIsDaylight = new Date(data.schedStartDate).toString().includes('Daylight'),
                            endIsStandard = new Date(data.schedEndDate).toString().includes('Standard'),
                            valueIsStandard = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Standard');
                        //fwa's that span multiple days
                        if (startIsStandard && endIsDaylight && valueIsDaylight) {
                            var newDate = TS.common.Util.getInUTCDate(data.schedEndDate);
                            newDate.setHours(newDate.getHours() - 1);
                            return newDate;
                        }
                        if (startIsDaylight && endIsStandard && !valueIsDaylight) {
                            var newDate = TS.common.Util.getInUTCDate(data.schedEndDate);
                            newDate.setHours(newDate.getHours() - 1);
                            return newDate;
                        }
                    }
                    return TS.common.Util.getInUTCDate(data.schedEndDate);
                }
            }
        },
        {
            name: 'gridStartDate',
            type: 'string',
            mapping: function (data) {
                return Ext.Date.format(new Date(TS.common.Util.getInUTCDate(data.schedStartDate)), 'm/d/Y g:i A').toString();
            }
        },
        {
            name: 'gridEndDate',
            type: 'string',
            mapping: function (data) {
                return Ext.Date.format(new Date(TS.common.Util.getInUTCDate(data.schedEndDate)), 'm/d/Y g:i A').toString();
            }
        },
        {
            name: 'recurringEndDate',
            type: 'date',
            mapping: function (data) {
                if(!data.recurrenceConfig){
                    return null;
                }
                else if (data.recurrenceConfig.count > 0){
                    return Ext.util.Format.date(data.schedEndDate, DATE_FORMAT);
                } else {
                    if( data.recurrenceConfig.until == '9999-12-31T23:59:59.9999999'){
                        return Ext.util.Format.date(data.schedEndDate, DATE_FORMAT);
                    } else
                    {
                        return Ext.util.Format.date(data.recurrenceConfig.until, DATE_FORMAT);
                    }
                }
            }
        },
        {
            name: 'isAllDay',
            type: 'boolean'
        },
        {
            name: 'duration', //minutes
            type: 'int'
        },
        {
            name: 'recurrencePattern', // Empty string if non-recurring
            type: 'string'
        },
        {
            name: 'recurrenceDatesInRange',
            type: 'auto'
        },
        {
            name: 'nextDate', // Read-only for UI ease.  =schedStartDate for single-day
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                if (data.recurrencePattern) {
                    var datesInRange = data.recurrenceDatesInRange,
                        startIsDaylight = new Date(new Date(datesInRange[0]).setTime(new Date(data.schedStartDate).getTime())).toString().includes('Daylight'),
                        valueIsDaylight = new Date(data.nextDate).toString().includes('Daylight'),
                        endIsStandard = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Standard'),
                        startIsStandard = new Date(new Date(datesInRange[0]).setTime(new Date(data.schedStartDate).getTime())).toString().includes('Standard'),
                        valueIsStandard = new Date(data.nextDate).toString().includes('Standard'),
                        endIsDaylight = new Date(new Date(datesInRange[datesInRange.length - 1]).setHours(new Date(data.schedEndDate).getHours())).toString().includes('Daylight');
                    //daylight to standard
                    if (startIsDaylight && endIsStandard && valueIsDaylight) {
                        var newDate = TS.common.Util.getInUTCDate(data.nextDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    } else if (startIsDaylight && endIsStandard && !valueIsDaylight) {
                        TS.common.Util.getInUTCDate(data.nextDate);
                    }
                    //standard to daylight
                    else if (startIsStandard && endIsDaylight && valueIsStandard) {
                        return TS.common.Util.getInUTCDate(data.nextDate);

                    } else if (startIsStandard && endIsDaylight && !valueIsStandard) {
                        var newDate = TS.common.Util.getInUTCDate(data.nextDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                } else {
                    var startIsStandard = new Date(data.schedStartDate).toString().includes('Standard'),
                        endIsDaylight = new Date(data.schedEndDate).toString().includes('Daylight'),
                        valueIsDaylight = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Daylight'),
                        startIsDaylight = new Date(data.schedStartDate).toString().includes('Daylight'),
                        endIsStandard = new Date(data.schedEndDate).toString().includes('Standard'),
                        valueIsStandard = TS.common.Util.getInUTCDate(data.schedEndDate).toString().includes('Standard');

                    if (startIsDaylight && endIsStandard) {
                        var newDate = TS.common.Util.getInUTCDate(data.nextDate);
                        newDate.setHours(newDate.getHours() - 1);
                        return newDate;
                    }
                }
                return TS.common.Util.getInUTCDate(data.nextDate);
            }
        },
        {
            name: 'lastSubmittedDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                return TS.common.Util.getInUTCDate(data.lastSubmittedDate);
            },
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'lastSubmittedByEmpId',
            type: 'string'
        },
        {
            name: 'lastApprovedDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                return TS.common.Util.getInUTCDate(data.lastApprovedDate);
            },
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'lastApprovedByEmpId',
            type: 'string'
        },
        {
            name: 'dateOrdered',
            type: 'date',
            dateFormat: 'c',
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'orderedBy',
            type: 'string'
        },
        {
            name: 'orderedByName',
            mapping: function (data) {
                var record = Ext.getStore('AllEmployees').getById(data.orderedBy);
                return (record ? record.get('lname') + ', ' + record.get('fname') : '');
            }
        },
        {
            name: 'dateRequired',
            type: 'date',
            dateFormat: 'c',
            defaultValue: new Date('1/1/2001 12:00:00 AM')
        },
        {
            name: 'loc',
            reference: 'TS.model.shared.Address',
            defaultValue: {}
        },
        {
            name: 'city',
            mapping: function (data) {
                var city = '';
                if (data.loc) {
                    city = data.loc.city;
                }
                return city;
            }
        },
        {
            name: 'state',
            mapping: function (data) {
                var state = '';
                if (data.loc) {
                    state = data.loc.state;
                }
                return state;
            }
        },
        {
            name: 'zip',
            mapping: function (data) {
                var zip = '';
                if (data.loc) {
                    zip = data.loc.zip;
                }
                return zip;
            }
        },
        {
            name: 'workSchedAndPerf',
            type: 'worklist'
        },
        {
            name: 'units',
            type: 'unitlist'
        },
        {
            name: 'unitDatesInRange',
            mapping: function (data) {
                var datesInRange = [],
                    uniqueDates;
                if (data.units) {
                    Ext.each(data.units, function (item) {
                        datesInRange.push(item.unitDate);
                    });
                }
                uniqueDates = datesInRange.filter(function (item, pos) {
                    return datesInRange.indexOf(item) == pos;
                });
                return uniqueDates;
            }
        },
        {
            name: 'preparedByEmpId',
            type: 'string'
        },
        {
            name: 'isContractWork',
            type: 'boolean'
        },
        {
            name: 'schedCrewCt',
            type: 'int'
        },
        {
            name: 'scheduledCrewId',
            type: 'string'
        },
        {
            name: 'scheduledCrewName',
            type: 'string'
        },
        {
            name: 'scheduledCrewChiefId',
            type: 'string'
        },
        {
            name: 'hasCrew',
            type: 'bool'
        },
        {
            name: 'attachments',
            reference: 'TS.model.shared.Attachment' //this is a list
        },
        {
            name: 'attachmentsToDelete',
            type: 'auto'
        },
        {
            name: 'attachmentsToKeep',
            type: 'auto'
        },
        {
            name: 'attachmentsToAdd',
            type: 'auto'
        },
        {
            name: 'clientApprovalImage',
            type: 'string'
        },
        {
            name: 'chiefApprovalImage',
            type: 'string'
        },
        {
            name: 'attachmentCtPhoto',
            type: 'int'
        },
        {
            name: 'attachmentCtDoc',
            type: 'int'
        },
        {
            name: 'attachmentCtSig',
            type: 'int'
        },
        {
            name: 'fwaStatusId',
            type: 'string',
            defaultValue: 'C'
        },
        {
            name: 'fwaStatusIdOld',
            type: 'string',
            defaultValue: 'C'
        },
        {
            name: 'fwaStatusString',
            type: 'string',
            defaultValue: 'Creating'
        },
        {
            name: 'hours',
            type: 'hourslist'
        },
        {
            model: 'TS.model.exp.Expense',
            role: 'expenses'
        },
        {
            name: 'schedHrsTtl',
            type: 'float'
        },
        {
            name: 'perfHrsTtl',
            type: 'float'
        },
        {
            name: 'clientSigReq',
            type: 'bool',
            default: false
        },
        {
            name: 'chiefSigReq',
            type: 'bool',
            default: false
        },
        {
            name: 'notes',
            type: 'noteslist'
        },
        {
            name: 'hasNotes',
            type: 'bool'
        },
        {
            name: 'availableForUseInField',
            type: 'bool',
            default: true
        }
    ],

    validators: {
        Wbs1: 'presence'
    },

    proxy: {
        type: 'default',
        api: {
            read: 'Fwa.Get',
            update: 'Fwa.Save'
        },
        paramOrder: 'dbi|username|id|fwaDate'
    }

});
