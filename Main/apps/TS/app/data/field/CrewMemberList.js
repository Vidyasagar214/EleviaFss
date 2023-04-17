Ext.define('TS.data.field.CrewMemberList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.crewmemberlist',

    sortType: 'none',

    convert: function (v) {

        if (v && v.length > 0) {
            Ext.Array.each(v, function (r, i) {
                if (!r.empId) {
                    v[i].empId = r.crewMemberEmpId;
                }
            });
        }

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.Employee'
        });

        if (v) {
            store.loadData(v);
        }

        return store;
    },

    serialize: function (v) {
        if (v) {
            return Ext.Array.map(v.getRange(), function (record) {
                return {
                    crewMemberEmpId: record.get('empId'), 
                    crewMemberRoleId: record.get('crewMemberRoleId'),
                    crewMemberPhone: record.get('crewMemberPhone'),
                    crewMemberEmail: record.get('crewMemberEmail')
                }
            });
        }
        return v;
    },

    getType: function () {
        return 'crewmemberlist';
    }

});
