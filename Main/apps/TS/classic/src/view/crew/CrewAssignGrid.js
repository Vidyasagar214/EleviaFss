Ext.define('TS.view.crew.CrewAssignGrid', {
    extend: 'Ext.grid.Panel',

    xtype: 'crewassigngrid',

    requires: [
        'Ext.grid.filters.Filters',
        'TS.common.field.CrewRole',
        'TS.common.field.Employee',
        'TS.model.fwa.FwaCrewAssign'
    ],

    controller: 'crewassignpanel',

    listeners: {
        afterrender: 'onCrewAssignGridRender',
        show: 'onCrewAssignGridRender'
    },

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: false
    },
    trackMouseOver: true,
    disableSelection: false,
    scrollable: true,

    initComponent: function () {

        Ext.apply(this, {
            plugins: [
                {
                    ptype: 'cellediting',
                    clicksToEdit: 1,
                    listeners: {
                        validateedit: function (editor, context, eOpts) {
                            var settings = TS.app.settings;
                            if (settings.schedReadOnly) {
                                context.cancel = true;
                            }
                        }
                    }
                },
                {
                    ptype: 'gridfilters'
                }
            ],
            selModel: 'cellmodel',
            store: {
                model: 'TS.model.fwa.FwaCrewAssign',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'Fwa.GetListWithCrew',
                    paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
                    extraParams: {
                        startDate: new Date().toDateString(),
                        isPreparer: TS.app.settings.schedFwaPreparedByMe,
                        isScheduler: true
                    },
                    reader: {
                        type: 'default',
                        transform: {
                            fn: function (data) {
                                // // do some manipulation of the raw data object
                                // var decommValue;
                                // decommValue = TS.Util.Decompress(data.data);
                                // data.data = [];
                                // Ext.each(decommValue, function (item) {
                                //     data.data.push(item);
                                // });
                                return data;
                            },
                            scope: this
                        }
                    }
                },
                filters: [
                    function (item) {
                        var ret = Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT)
                        //PER BB - Leave Submitted in
                        // &&
                        // item.get('fwaStatusId') != 'S';
                        return ret;
                    }

                ],
                listeners: {
                    load: function (t, records, successful, response) {
                        var settings = TS.app.settings,
                            submitted = [];

                        if (!successful) {
                            var error = {mdBody: 'Load of ' + settings.fwaAbbrevLabel + 's with ' + settings.crewLabel + ' failed. ' + response.getResponse().result.message.mdBody},
                                title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                            Ext.GlobalEvents.fireEvent(title, error);
                        } else {
                            Ext.each(records, function(rec){
                                rec.set('schedStartDate', TS.common.Util.getInUTCDate(rec.get('schedStartDate')));
                                rec.set('schedEndDate', TS.common.Util.getInUTCDate(rec.get('schedEndDate')));
                                rec.set('nexDate', TS.common.Util.getInUTCDate(rec.get('nextDate')));
                            })


                            //PER BB - Leave Submitted in
                            // Ext.each(records, function (rec) {
                            //     if (rec.get('fwaStatusId') == 'S') {
                            //         submitted.push(rec);
                            //     }
                            // });
                            // if (submitted.length > 0)
                            //     t.remove(submitted);
                        }
                    }
                }
            },

            columns: [
                {
                    dataIndex: 'fwaId',
                    hidden: true
                },
                {
                    xtype: 'datecolumn',
                    locked: true,
                    text: 'Date',
                    dataIndex: 'nextDate',
                    width: 100, //140,
                    minWidth: 100,
                    filter: true,
                    renderer: function (value, meta) {
                        var dt = new Date('1/1/2002'),
                            badDate = value < dt,
                            formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT),
                            holidays = Ext.getStore('HolidaySchedule'),
                            thisDt = Ext.Date.clearTime(new Date(value)),
                            found = false;
                        if (!badDate) {
                            found = holidays.find('holidayDate', thisDt);
                            if (found > -1) {
                                meta.style = "background-color: #d8ffff;";
                            } else {
                                meta.style = "background-color: white;";
                            }
                        }
                        return !badDate ? formattedDate : '';
                    },
                    listeners: {
                        dblclick: 'onFwaCrewGridSelect'
                    }
                }, {
                    text: 'Status',
                    dataIndex: 'fwaStatusId',
                    locked: true,
                    plugins: 'responsive',
                    renderer: function (value, meta, record) {
                        var me = this,
                            rec = Ext.getStore('FwaStatus').findRecord('value', value),
                            vm = me.up('viewport').getViewModel(),
                            holidays = Ext.getStore('HolidaySchedule'),
                            thisDt = Ext.Date.clearTime(new Date(record.get('nextDate'))),
                            found = false;
                        found = holidays.find('holidayDate', thisDt);
                        if (found > -1) {
                            meta.style = "background-color: #d8ffff;";
                        } else {
                            meta.style = "background-color: white;";
                        }

                        return (rec ? rec.get('description') : '');
                    },
                    listeners: {
                        dblclick: 'onFwaCrewGridSelect'
                    }
                },
                {
                    text: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    locked: true,
                    width: 100,
                    dataIndex: 'fwaNum',
                    listeners: {
                        dblclick: 'onFwaCrewGridSelect'
                    },
                    renderer: function (value, meta, record) {
                        var holidays = Ext.getStore('HolidaySchedule'),
                            thisDt = Ext.Date.clearTime(new Date(record.get('nextDate'))),
                            found = false;
                        found = holidays.find('holidayDate', thisDt);
                        if (found > -1) {
                            meta.style = "background-color: #d8ffff;";
                        } else {
                            meta.style = "background-color: white;";
                        }

                        TS.Util.getFwaCrewAssignToolTip(value, meta, record);
                        return value;
                    }
                },
                {
                    text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    dataIndex: 'fwaName',
                    locked: true,
                    width: 175,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    },
                    listeners: {
                        dblclick: 'onFwaCrewGridSelect'
                    },
                    renderer: function (value, meta, record) {
                        var holidays = Ext.getStore('HolidaySchedule'),
                            thisDt = Ext.Date.clearTime(new Date(record.get('nextDate'))),
                            found = false;
                        found = holidays.find('holidayDate', thisDt);
                        if (found > -1) {
                            meta.style = "background-color: #d8ffff;";
                        } else {
                            meta.style = "background-color: white;";
                        }
                        TS.Util.getFwaCrewAssignToolTip(value, meta, record);
                        return value;
                    }
                },
                {
                    //text: 'Field<br/>Priority',
                    text: {_tr: 'fieldPriorityLabel', tpl: '{0}'},
                    hidden: true,
                    locked: true,
                    dataIndex: 'fieldPriorityId',
                    editor: {
                        xtype: 'field-prioritylist',
                        listeners: {
                            change: 'priorityChange'
                        },
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            var settings = TS.app.settings;
                            return settings.schedReadOnly;
                        }
                    },
                    width: 75,
                    renderer: function (value, metaData, rec, row, cell, store, view) {
                        var priority = Ext.getStore('PriorityList').findRecord('priorityId', value);
                        if (rec) {
                            metaData.style = rec.get('fieldPriorityColor'); //structure of color in fwa model
                            metaData.style += rec.get('fieldPriorityColor') != 'background:rgb(Transparent);' ? rec.get('fieldPriorityFontColor') : '';
                        }
                        return (priority ? priority.get('priorityDescr') : 'N/A');
                    }
                },
                {
                    text: {_tr: 'udf_t1_Label'},
                    locked: true,
                    editor: {
                        xtype: 'textfield',
                        listeners: {
                            blur: 'udf_t1Change'
                        },
                        bind: {
                            disabled: '{settings.schedReadOnly}'
                        }
                    },
                    dataIndex: 'udf_t1',
                    width: 170,
                    bind: {
                        hidden: true //'{!hasUdfT1AndIsScheduler}'
                    }
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 1'},
                    locked: true,
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew1EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: {
                                xtype: 'field-employee',
                                listeners: {
                                    change: 'changeCrewMemberOne'
                                }
                            },
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew1CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 2'},
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew2EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                               if(record){
                                   info = TS.Util.getToolTip(value, meta, record);
                                   if (info)
                                   {
                                       meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                   }
                               }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew2CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew2',
                            menuDisabled: true,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 2',
                                handler: 'deleteCrewMember2',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew2EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 3'},
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew3EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew3CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew3',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 3',
                                handler: 'deleteCrewMember3',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew3EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 4'},
                    bind: {
                        hidden: '{showCrewAssignColumn4}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew4EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew4CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew4',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 4',
                                handler: 'deleteCrewMember4',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew4EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 5'},
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    bind: {
                        hidden: '{showCrewAssignColumn5}'
                    },
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew5EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew5CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew5',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 5',
                                handler: 'deleteCrewMember5',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew5EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 6'},
                    bind: {
                        hidden: '{showCrewAssignColumn6}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew6EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew6CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew6',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 6',
                                handler: 'deleteCrewMember6',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew6EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 7'},
                    bind: {
                        hidden: '{showCrewAssignColumn7}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew7EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew7CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew7',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 7',
                                handler: 'deleteCrewMember7',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew7EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 8'},
                    bind: {
                        hidden: '{showCrewAssignColumn8}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew8EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew8CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew8',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 8',
                                handler: 'deleteCrewMember8',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew8EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 9'},
                    bind: {
                        hidden: '{showCrewAssignColumn9}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew9EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew9CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew9',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 9',
                                handler: 'deleteCrewMember9',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew9EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 10'},
                    bind: {
                        hidden: '{showCrewAssignColumn10}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew10EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew10CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew10',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 10',
                                handler: 'deleteCrewMember10',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew10EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 11'},
                    bind: {
                        hidden: '{showCrewAssignColumn11}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew11EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew11CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew10',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 11',
                                handler: 'deleteCrewMember11',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew11EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 12'},
                    bind: {
                        hidden: '{showCrewAssignColumn12}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew12EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value) {
                                var record = Ext.getStore('Employees').getById(value);
                                return (record ? record.get('lname') + ', ' + record.get('fname') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew12CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew12',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 12',
                                handler: 'deleteCrewMember12',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew12EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 13'},
                    bind: {
                        hidden: '{showCrewAssignColumn13}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew13EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew13CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew13',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 13',
                                handler: 'deleteCrewMember13',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew13EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 14'},
                    bind: {
                        hidden: '{showCrewAssignColumn14}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew14EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew14CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value) {
                                var record = Ext.getStore('Roles').getById(value);
                                return (record ? record.get('crewRoleName') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew14',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 14',
                                handler: 'deleteCrewMember14',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew14EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Member 15'},
                    bind: {
                        hidden: '{showCrewAssignColumn15}'
                    },
                    menuDisabled: true,
                    style: 'background-color: #dbe6ef;',
                    columns: [
                        {
                            text: 'Employee',
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew15EmpId',
                            menuDisabled: true,
                            width: 130,
                            editor: 'field-employee',
                            renderer: function (value) {
                                var record = Ext.getStore('Employees').getById(value);
                                return (record ? record.get('lname') + ', ' + record.get('fname') : '');
                            }
                        },
                        {
                            text: {_tr: 'crewLabel', tpl: '{0} Role'},
                            style: 'background-color: #f5f5f5;',
                            dataIndex: 'crew15CrewRoleId',
                            maxWidth: 125,
                            editor: 'field-crewrole',
                            menuDisabled: true,
                            renderer: function (value, meta, record) {
                                var info;
                                record = Ext.getStore('Employees').getById(value);
                                if(record){
                                    info = TS.Util.getToolTip(value, meta, record);
                                    if (info)
                                    {
                                        meta.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                                    }
                                }
                                return (record ? record.get('empNameLastFirst') : '');
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            //hidden: true,
                            style: 'background-color: #f5f5f5;',
                            itemId: 'deleteCrew15',
                            menuDisabled: true,
                            hideable: false,
                            menuText: 'Delete',
                            resizable: false,
                            bind: {
                                hidden: '{settings.schedReadOnly}'
                            },
                            align: 'center',
                            items: [{
                                iconCls: 'x-fa fa-trash redIcon', // 'workitem-delete',
                                tooltip: 'Delete Crew Member 15',
                                handler: 'deleteCrewMember15',
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !record.get('crew15EmpId');
                                }
                            }],
                            width: 30
                        }
                    ]

                }
            ]
        });
        this.callParent(arguments);
    }

});