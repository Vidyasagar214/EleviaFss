/**
 * Created by steve.tess on 6/15/2016.
 */
Ext.define('TS.common.grid.EmployeeAssign', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-employeeassign',
    reference: 'employeeAssignGrid',

    selModel: {
        mode: 'MULTI'
    },

    requires: [
        'Ext.grid.filters.Filters',
        'TS.view.fwa.SearchTrigger'
    ],

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: false
    },

    plugins: [
        {
            ptype: 'gridfilters'
        }
    ],

    listeners: {
        afterrender: 'onEmployeeAssignGridRender',
        scope: 'this'
    },
    stateful: true,
    stateId: 'stateGridEmployeeCrewAssign',
    //state events to save
    stateEvents: ['columnmove', 'columnresize', 'filterchange'],

    scrollable: true,
    collapsible: true,

    //store: 'Employees',
    store: {
        model: 'TS.model.shared.Employee',
        autoLoad: false,
        settingsDependency: true, //custom property
        pageSize: 100000,
        sorters: [{
            property: 'lname',
            direction: 'ASC'
        }],
        proxy: {
            type: 'default',
            directFn: 'Employee.GetList',
            paramOrder: 'dbi|username|start|limit|includeInactive|fwaEmployeesOnly',
            extraParams: {
                includeInactive: false,
                fwaEmployeesOnly: true
            }
        }
    },

    columns: [
        {
            header: 'Employee',
            flex: 2,
            dataIndex: 'empName',
            menuDisabled: true,
            renderer: function (value, meta, record) {
                this.getToolTip(value, meta, record);
                return (record.get('empName'));
            },
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewAssignEmpName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[4];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        },
        {
            dataIndex: 'defaultCrewRoleId',
            menuDisabled: true,
            hidden: true
        },
        {
            header: 'Default Role',
            dataIndex: 'crewRoleName',
            menuDisabled: true,
            flex: 1.5,
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewAssignCrewRoleName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[5];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        },
        {
            header: 'Employee Group',
            dataIndex: 'empGroupName',
            menuDisabled: true,
            flex: 1.5,
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewAssignEmpGroupName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[6];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        }
    ],

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
        info = '<tr><td><b>Email Address:</b></td><td colspan="3">' + email + '</td></tr>'+
            '<tr><td><b>Office:</b></td><td>' + office + '</td><td><b>Mobile:</b></td><td>' + mobile + '</td></tr>'+
            '<tr><td><b>City:</b></td><td>' + city + '</td><td><b>State:</b></td><td>' + state + '</td></tr>';

        info += TS.Util.displayEmployeeSkillsAndRegistration(metaData,record,record.get('empId'));
        if (info)
            metaData.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
    },

    onEmployeeAssignGridRender: function (grid) {
        new TS.common.dd.EmployeeAssignGridDragZone(grid.view.getEl(), {
            grid: grid
        });
    }

});