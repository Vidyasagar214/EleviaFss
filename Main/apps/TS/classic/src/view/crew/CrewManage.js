/**
 * Created by steve.tess on 1/26/2018.
 */
Ext.define('TS.view.crew.CrewManage', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-crewManage',

    initComponent: function () {
        Ext.apply(this, {

            plugins: [
                {
                    ptype: 'memberexpander',
                    pluginId: 'memberExpander',
                    readOnlyMembers: true
                }
            ],

            columns: [
                {
                    width: 35,
                    dataIndex:'crewOrder',
                    text: '',
                    renderer: function (value, meta, record) {
                        if (value) {
                            return '<span class="crew-icon size_16px inline-cell" />';
                        }
                    },
                    resizable: false,
                    tooltip: 'Set original sort'
                },
                {
                    flex: 3,
                    dataIndex: 'crewName',
                    text: {_tr: 'crewLabel'},
                    renderer: function (value, meta, record) {
                        if (record.get('crewStatus') == 'I') {
                            meta.tdAttr = 'style="background-color: rgba(0,0,0,.2);"';
                        }
                        return value;
                    }
                },
                {
                    flex: 2,
                    dataIndex: 'crewChiefEmpId',
                    text: {_tr: 'crewChiefLabel'},

                    renderer: function (value, meta, record) {
                        if (record.get('crewStatus') == 'I') {
                            meta.tdAttr = 'style="background-color: rgba(0,0,0,.2);"';
                        }
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
                    text: {_tr: 'crewLabel', tpl: '{0} Ct'},
                    dataIndex: 'crewMembers',
                    hideable: false,
                    menuDisabled: true,
                    align: 'center',
                    flex: 1,
                    renderer: function (value, meta, record) {
                        if (value) {
                            return (value.data.length) + '<span class="crew-icon size_16px inline-cell" />';
                        }
                    }
                }
            ]
        });

        this.callParent(arguments);
    }
});