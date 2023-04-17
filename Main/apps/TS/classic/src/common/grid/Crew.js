Ext.define('TS.common.grid.Crew', {

    extend: 'TS.common.grid.Updatable',

    xtype: 'grid-crew',

    title: {_tr: 'crewLabelPlural', tpl: 'Assemble {0}'},

    controller: 'grid-crew',

    cls: 'crewgrid',

    viewConfig: {
        trackOver: false,
        listeners: {
            render: 'crewViewRender',
            employeedrop: 'assignMembers'
        },
        getRowClass: function (record) {
            return (record.get('crewStatus') != 'A' ? 'inactive' : '');
        }
    },

    listeners: {
        afterrender: 'onCrewGridRender'
    },

    tools: [{
        type: 'refresh',
        tooltip: {_tr: 'crewLabelPlural', tpl: ' Reset Assemble {0} sort'},
        handler: 'onResetSort'
    }],

    initComponent: function () {

        Ext.apply(this, {
            store: Ext.Object.merge((this.store || {}), {
                model: 'TS.model.fwa.Crew',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'Crew.GetList',
                    paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe',
                    extraParams: {
                        limit: 1000,
                        isPreparedByMe: TS.app.settings.schedCrewPreparedByMe
                    }
                },
                sorters: [{
                    property: 'crewStatus',
                    direction: 'DESC'
                }],
                filters: [
                    function (item) {
                        return !item.get('crewAutoCreated') && !item.get('hasFwaAttached');
                    },
                    function (item) {
                        return item.get('crewStatus') == 'A';
                    }
                ],
                listeners: {
                    load: function (t, records, successful, message) {
                        var settings = TS.app.settings;
                        if (!successful) {
                            var error = {mdBody: 'Load of ' + settings.crewLabel + 's failed (' + message.error.mdBody + ').'};
                            Ext.GlobalEvents.fireEvent('Error', error);
                        }
                    }
                }
            }),

            plugins: [
                {
                    ptype: 'memberexpander',
                    pluginId: 'memberExpander'
                },
                {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                }
            ],

            // tools: [{
            //     id: 'refresh',
            //     tooltip: {_tr: 'crewLabelPlural', tpl: ' Reset Assemble {0} sort'},
            //     handler: 'onResetSort'
            // }],

            columns: [
                {
                    flex: 2,
                    dataIndex: 'crewName',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    text: {_tr: 'crewLabel'},
                    renderer: function (value, meta, record) {
                        if (meta && record.get('scheduledCrewId') != '') {
                            TS.Util.displayCrewSkillsAndRegistration(meta, record);
                        }

                        return value;
                    }
                },
                {
                    flex: 4,
                    dataIndex: 'crewChiefEmpId',
                    text: {_tr: 'crewChiefLabel'},

                    renderer: function (value, meta, record) {
                        if (value) {
                            var employee = Ext.getStore('Employees').getById(value);
                            if (employee) {
                                return employee.get('lname') + ', ' + employee.get('fname');
                            }
                        }
                        return value;
                    }
                },
                {
                    flex: 4,
                    dataIndex: 'preparedByEmpId',
                    text: 'Managed By',
                    renderer: function (value, meta, record) {
                         if (value) {
                            var employee = Ext.getStore('AllEmployees').getById(value);
                            if (employee) {
                                return employee.get('lname') + ', ' + employee.get('fname');
                            }
                        }
                        return value;
                    }
                },
                {
                    text: 'Status',
                    xtype: 'widgetcolumn',
                    hideable: false,
                    menuDisabled: true,
                    dataIndex: 'crewStatusString',
                    flex: 1.5,
                    widget: {
                        xtype: 'button',
                        handler: 'setCrewStatus',
                        margin: 5,
                        tooltip: 'Change crew status',
                        listeners: {
                            afterrender: function (obj, b, c) {
                                if (obj) {
                                    var record = obj.$widgetRecord.data; //obj.getWidgetRecord();
                                    obj.setTooltip(record.crewStatus === 'A' ? 'Set status inactive' : 'Set status active');
                                }
                            }
                        },
                        bind: {
                            disabled: '{settings.schedReadOnly}'
                        }
                    }
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Ct'},
                    dataIndex: 'crewMembers',
                    hideable: false,
                    menuDisabled: true,
                    align: 'center',
                    flex: 1,
                    renderer: function (value, meta, record) {
                        if (meta) {
                            if (value) {
                                if (record.get('crewCt') > 1)
                                    return (value.data.length) + '  <span class="x-fa fa-users blackIcon inline-cell" />';
                                else
                                    return (value.data.length) + '  <span class="x-fa fa-user blackIcon inline-cell" />';
                            }
                        }
                    }
                },
                {
                    //TODO: .crewgrid .x-grid-row .x-grid-cell-last .x-grid-cell-inner will overwrite this rule
                    // crew icons is shown always
                    xtype: 'actioncolumn',
                    sortable: false,
                    menuDisabled: true,
                    //hideable: false,
                    width: 40,
                    align: 'center',
                    bind: {
                        hidden: '{settings.schedReadOnly}'
                    },
                    items: [
                        {
                            tooltip: 'Delete Crew',
                            iconCls: 'x-fa fa-trash redIcon',
                            handler: 'removeCrew'
                        }
                    ].concat()
                }
            ]

        });

        this.callParent(arguments);
    }

});