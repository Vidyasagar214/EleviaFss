Ext.define('TS.common.grid.Employee', {

    extend: 'Ext.grid.Panel',

    xtype: 'grid-employee',
    cls: 'employeegrid',

    selModel: {
        mode: 'MULTI'
    },

    requires: [
        'Ext.grid.filters.Filters',
        'TS.view.fwa.SearchTrigger'
    ],

    plugins: [
        {
            ptype: 'gridfilters'
        }
    ],

    listeners: {
        afterrender: 'onEmployeeGridRender',
        scope: 'this'
    },

    scrollable: true,
    disabledCls: 'my-disabled-class',

    columns: [
        {
            header: 'Last Name',
            flex: 1,
            dataIndex: 'lname',
            renderer: function (value, meta, record) {
                //this.getToolTip(value, meta, record);
                meta.tdCls = 'empId';
                return value;
            },
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewLName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[0];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        },
        {
            header: 'First Name',
            flex: 1,
            dataIndex: 'fname',
            renderer: function (value, meta, record) {
                //this.getToolTip(value, meta, record);
                return (record.get('fname'));
            },
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewFname',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[1];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        },
        {
            header: 'Default Role',
            dataIndex: 'crewRoleName',
            flex: 1.5,
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewDefaultCrewRoleName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[2];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        },
        {
            dataIndex: 'defaultCrewRoleId',
            hideable: false,
            menuDisabled: true,
            hidden: true
        },
        {
            header: 'Employee Group',
            dataIndex: 'empGroupName',
            flex: 2,
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true,
                exactMatch: false,
                itemId: 'filterCrewEmpGroupName',
                listeners: {
                    render: function (t) {
                        var myDefault = TS.app.settings.schedFilters.split('^')[3];
                        t.setValue(myDefault);
                        return;
                    }
                }
            }]
        }
    ],

    // getToolTip: function (value, metaData, record) {
    //     var title = record.get('title'),
    //         email = record.get('emailAddress'),
    //         phoneNumbers = record.get('phoneNumbers'),
    //         city = record.get('city'),
    //         state = record.get('state'),
    //         office,
    //         mobile,
    //         fax,
    //         info;
    //     for (var i = 0, l = phoneNumbers.length; i < l; i++) {
    //         if (phoneNumbers[i].phoneType == 'Fax') {
    //             fax = phoneNumbers[i].phoneNumber;
    //         }
    //         if (phoneNumbers[i].phoneType == 'Mobile') {
    //             mobile = phoneNumbers[i].phoneNumber;
    //         }
    //         if (phoneNumbers[i].phoneType == 'Office') {
    //             office = phoneNumbers[i].phoneNumber;
    //         }
    //     }
    //     info = '<tr><td><b>Email Address:</b></td><td colspan="3">' + email + '</td></tr>' +
    //         '<tr><td><b>Office:</b></td><td>' + office + '</td><td><b>Mobile:</b></td><td>' + mobile + '</td></tr>' +
    //         '<tr><td><b>City:</b></td><td>' + city + '</td><td><b>State:</b></td><td>' + state + '</td></tr>';
    //
    //     info += TS.Util.displayEmployeeSkillsAndRegistration(metaData, record, record.get('empId'));
    //     // if (info)
    //     //     metaData.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
    //
    //     return '<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>';
    // },

    onEmployeeGridRender: function (grid) {
        new TS.common.dd.EmployeeGridDragZone(grid.view.getEl(), {
            grid: grid
        });

        var view = grid.getView();
        var tip = Ext.create('Ext.tip.ToolTip', {
            dismissDelay: DISMISS_DELAY,
            // The overall target element.
            target: view.el,
            // Each grid row causes its own separate show and hide.
            delegate: view.itemSelector,
            // Moving within the row should not hide the tip.
            trackMouse: true,
            // Render immediately so that tip.body can be referenced prior to the first show.
            renderTo: Ext.getBody(),
            listeners: {
                // Change content dynamically depending on which element triggered the show.
                beforeshow: function updateTipBody(tip) {
                    var record = view.getRecord(tip.triggerElement),
                        title = record.get('title'),
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

                    info += TS.Util.displayEmployeeSkillsAndRegistration(null, record, record.get('empId'));
                    tip.update('<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'');
                }
            }
        });

    }
});
