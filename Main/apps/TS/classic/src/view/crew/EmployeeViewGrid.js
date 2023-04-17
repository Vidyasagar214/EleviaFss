/**
 * Created by steve.tess on 11/5/2016.
 */
Ext.define('TS.view.crew.EmployeeViewGrid', {
    extend: 'Ext.grid.Panel',

    xtype: 'employeeviewgrid',

    requires: [
        'TS.model.shared.EmployeeView',
        'TS.view.fwa.SearchTrigger'
    ],

    controller: 'employeeviewpanel',

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: false
    },
    trackMouseOver: true,
    disableSelection: false,
    //scrollable: true,

    initComponent: function () {

        Ext.apply(this, {
            plugins: [
                {
                    ptype: 'gridfilters'
                }
            ],

            selModel: 'cellmodel',

            store: {
                model: 'TS.model.shared.EmployeeView',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'Employee.GetEmployeeView',
                    paramOrder: 'dbi|username|employeeId|dt',
                    extraParams: {
                        dt: Ext.Date.add(new Date(), Ext.Date.DAY, 1).toDateString(),
                        employeeId: TS.app.settings.empId
                    }
                },
                listeners: {
                    load: function (t, records, successful, response) {
                        var settings = TS.app.settings;
                        if (!successful) {
                            var error = {mdBody: 'Load of Employee View failed ' + response.getResponse().result.message.mdBody},
                                title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                            Ext.GlobalEvents.fireEvent(title, error);
                        }
                    }
                }
            },
            columns: [
                {
                    header: 'Employee Group',
                    dataIndex: 'empGroupName',
                    flex: 1,
                    items: [{
                        xtype: 'searchtrigger',
                        autoSearch: true,
                        anyMatch: true,
                        exactMatch: false,
                        itemId: 'filterEmpViewEmpGroupName',
                        listeners: {
                            render: function (t) {
                                var myDefault = TS.app.settings.schedFilters.split('^')[7];
                                t.setValue(myDefault);
                                return;
                            }
                        }

                    }]
                },
                {
                    header: 'Employee',
                    dataIndex: 'empName',
                    flex: 1,
                    items: [{
                        xtype: 'searchtrigger',
                        autoSearch: true,
                        anyMatch: true,
                        exactMatch: false,
                        itemId: 'filterEmpViewEmpName',
                        listeners: {
                            render: function (t) {
                                var myDefault = TS.app.settings.schedFilters.split('^')[8];
                                t.setValue(myDefault);
                                return;
                            }
                        }
                    }]
                },
                {
                    header: 'Scheduled</br>Hours',
                    dataIndex: 'totalSchedHrs',
                    align: 'right',
                    flex: .75
                },
                {
                    header: {_tr: 'fwaAbbrevLabel', tpl: 'Chiefs and {0}s Assigned To'},
                    dataIndex: 'fwaInfo',
                    flex: 7
                }
            ]
        });

        this.callParent(arguments);
    }

});