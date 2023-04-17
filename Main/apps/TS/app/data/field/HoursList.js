//TODO Remove, once classic has correct model 
Ext.define('TS.data.field.HoursList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.hourslist',

    requires: [
        'Ext.data.Store',
        'TS.model.fwa.FwaHours'
    ],

    sortType: 'none',

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.FwaHours',
            // Custom sorter
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
                            if (role1.get('CrewRoleIsChief') && !role2.get('crewRoleIsChief')) {
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
                    property: 'WorkCodeAbbrev',
                    direction: 'ASC'
                }
            ]
        });

        if (v) {
            Ext.each(v, function (h) {
                if (h.startTime === h.endTime) {
                    h.startTime = '';
                    h.endTime = '';
                }
            })
            store.loadData(v);
        }

        return store;
    },

    serialize: function (v) {
        return Ext.Array.pluck(v.getRange(), 'data')
    },

    getType: function () {
        return 'hourslist';
    }
});
