Ext.define('TS.common.grid.CrewAssign', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-crewassign',

    cls: 'crewgrid',

    viewConfig: {
        trackOver: false
    },
    initComponent: function () {

        Ext.apply(this, {

            store: 'CrewsForNewFWA',

            plugins: [{
                ptype: 'memberexpander',
                pluginId: 'memberExpander',
                readOnlyMembers: true
            }],

            columns: [
                {
                    flex: 4,
                    dataIndex: 'crewName',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    text: {_tr: 'crewLabel'},
                    renderer: function (value, meta, record){
                        TS.Util.displayCrewSkillsAndRegistration(meta, record);
                        return value;
                    }
                },
                {
                    flex: 5,
                    dataIndex: 'crewChiefEmpId',
                    text: {_tr: 'crewChiefLabel'},

                    renderer: function (value, meta, record) {
                        if (value) {
                            var employee = Ext.getStore('Employees').getById(value);
                            if (employee) {
                                return employee.get('fname') + ' ' + employee.get('lname');
                            }
                        }
                        return value;
                    }
                },
                {
                    text: {_tr: 'crewLabel', tpl: '{0} Ct'},
                    dataIndex: 'crewMembers',
                    plugins: 'responsive',
                    responsiveConfig: {
                        small: {
                            width: 80
                        },
                        normal: {
                            width: 150
                        }
                    },

                    renderer: function (value) {
                        if (value) {
                            return (value.data.length) + '<span class="crew-icon size_16px inline-cell" />';
                        }
                    }
                }
            ],
            listeners:{
                selectionChange: 'onSelectionCrewChange'
            }

        });

        this.callParent(arguments);
    }
});
