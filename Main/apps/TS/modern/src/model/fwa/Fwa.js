Ext.define('TS.model.fwa.Fwa', {
    extend: 'TS.model.Base',

    requires: [
        'TS.model.fwa.DateList',
        //'TS.data.field.FwaActionList'
        'TS.model.fwa.FwaAction',
        //We have to require all associated models
        'TS.model.fwa.FwaHours',
        'TS.model.fwa.FwaNote',
        'TS.model.fwa.RecurrenceConfig',
        'TS.model.fwa.Unit',
        'TS.model.fwa.Work',
        'TS.model.shared.Address',
        'TS.model.shared.Attachment',
        'TS.model.shared.PrintTemplate'
    ],

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'fwaId',
            type: 'string'
        },
        {
            name: 'fwaNum',
            type: 'string'
        },
        {
            name: 'fwaName',
            type: 'string'
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
            name: 'fieldPriorityId',
            type: 'string',
            defaultValue: '1'
        },
        {
            name: 'fieldPriorityDesc',
            type: 'string'
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
            type: 'string',
            defaultValue: ''
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
            name: 'fwaDisplayString',
            mapping: function (data) {
                //PR1.WBS1+isnull('-'+PR2.WBS2,'')+'-'+PR1.LongName + isnull(' - '+PR2.LongName,'')
                return data.wbs1 + (data.wbs2) ? '-' + data.wbs2 : '' + '-' + data.wbs1Name + (data.wbs2Name) ? data.wbs2Name : '';
            }
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
                //console.log('regular');
                return TS.common.Util.getInUTCDate(data.schedStartDate);
            }
        },
        {
            name: 'schedEndDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function (data) {
                if(IS_OFFLINE){
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
                        if (startIsDaylight && endIsStandard && valueIsDaylight) {
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
                }  else {
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
            mapping: function(data){
                return TS.common.Util.getInUTCDate(data.lastSubmittedDate);
            }
        },
        {
            name: 'lastSubmittedByEmpId',
            type: 'string'
        },
        {
            name: 'lastApprovedDate',
            type: 'date',
            dateFormat: 'c',
            mapping: function(data){
                return TS.common.Util.getInUTCDate(data.lastApprovedDate);
            }
        },
        {
            name: 'lastApprovedByEmpId',
            type: 'string'
        },
        {
            name: 'dateOrdered',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'orderedBy',
            type: 'string'
        },
        {
            name: 'dateRequired',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'preparedByEmpId',
            type: 'string'
        },
        {
            name: 'isContractWork',
            type: 'boolean',
            defaultValue: false
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
        // {
        //     name: 'clientApprovalDate',
        //     type: 'date',
        //     dateFormat: 'c'
        // },
        {
            name: 'clientApprovalImage',
            type: 'string'
        },
        // {
        //     name: 'chiefApprovalDate',
        //     type: 'date',
        //     dateFormat: 'c'
        // },
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
            name: 'attachmentsToDelete',
            type: 'auto'
        },
        {
            name: 'attachmentsToAdd',
            type: 'auto'
        },
        {
            name: 'attachmentsToKeep',
            type: 'auto'
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
            name: 'hasNotes',
            type: 'bool'
        },
        {
            name: 'availableForUseInField',
            type: 'bool',
            default: true
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
        }
    ],

    hasOne: [
        {
            model: 'TS.model.shared.Address',
            role: 'loc'
        },
        {
            model: 'TS.model.fwa.RecurrenceConfig',
            role: 'recurrenceConfig'
        }
    ],

    hasMany: [
        {
            model: 'TS.model.fwa.FwaHours',
            role: 'hours', // field on the payload. This also becomes the accessor method
            storeConfig: {
                sorters: [
                    {
                        property: 'workDate',
                        direction: 'ASC'
                    }, {
                        sorterFn: function (a, b) {
                            // Sort by crew role to put crew chiefs at the top
                            var store = Ext.getStore('Roles'),
                                role1 = store.getById(a.get('crewRoleId')),
                                role2 = store.getById(b.get('crewRoleId'));
                            if (role1 && role2) {
                                if (role1.get('crewRoleIsChief') && !role2.get('crewRoleIsChief')) {
                                    return 1;
                                } else if (role2.get('crewRoleIsChief')) {
                                    return -1;
                                }
                            }
                            return 0;
                        },
                        direction: 'DESC'
                    }, {
                        sorterFn: function (a, b) {
                            // Sort by last name
                            var store = Ext.getStore('Employees'),
                                emp1 = store.getById(a.get('empId')),
                                emp2 = store.getById(b.get('empId'));
                            if (!emp1 || !emp2) {
                                return 0;
                            } else {
                                return (emp1.get('lname').substr(0, 1) > emp2.get('lname').substr(0, 1) ? 1 : -1);
                            }
                        },
                        direction: 'DESC'
                    }, {
                        property: 'workCodeAbbrev',
                        direction: 'ASC'
                    }
                ]
            }
        },
        {
            model: 'TS.model.exp.Expense',
            role: 'expenses'
        },
        {
            model: 'TS.model.fwa.Work',
            role: 'workSchedAndPerf'
        },
        {
            model: 'TS.model.fwa.FwaAction',
            role: 'nonFieldActions'
        },
        {
            model: 'TS.model.fwa.Unit',
            role: 'units'
        },
        {
            model: 'TS.model.fwa.FwaNote',
            role: 'notes'
        },
        {
            model: 'TS.model.shared.PrintTemplate',
            role: 'availableTemplates'
        }
    ],

    validators: {
        wbs1: 'presence'
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
