/**
 * Created by steve.tess on 6/23/2016.
 */
Ext.define('TS.view.fwa.SearchTrigger', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchtrigger',
    triggers: {
        clear: {
            cls: 'x-form-clear-trigger',
            handler: function (field) {
                field.reset();
            }
        }
    },

    onTriggerClick: function () {
        this.setValue('');
        if(this.up().dataIndex == 'crewName'){
            this.searchCrew(this.up().dataIndex, '');
        } else {
            this.setFilter(this.up().dataIndex, '');
        }
        this.setFilter(this.up().dataIndex, '');
    },

    setFilter: function (filterId, value) {
        var store = this.up('grid').getStore();

        if (value) {
            store.removeFilter(filterId, false);
            var filter = {id: filterId, property: filterId, value: value};
            if (this.anyMatch) filter.anyMatch = this.anyMatch;
            if (this.caseSensitive) filter.caseSensitive = this.caseSensitive;
            if (this.exactMatch) filter.exactMatch = this.exactMatch;
            store.addFilter(filter);
        } else {
            store.filters.removeAtKey(filterId);
        }
    },

    searchCrew: function (filterId, value) {
        var store = this.up('grid').getStore(),
            empStore = Ext.getStore('Employees');

        if (value) {
            var filter = {id: filterId, property: 'hasEmpOrGroupMatch', value: true};
            store.each(function (rec) {
                rec.set('hasEmpOrGroupMatch', false);
                Ext.each(rec.data.crewMembers.getRange(), function (emp) {
                    var member = empStore.getById(emp.get('crewMemberEmpId')),
                        empGroupName = member.get('empGroupName'),
                        empName = member.get('empNameLastFirst');
                    if (empGroupName.indexOf(value) != -1 || empName.indexOf(value) != -1 || rec.get('crewName').indexOf(value) != -1) {
                        rec.set('hasEmpOrGroupMatch', true);
                    }
                });
            });
            store.addFilter(filter);
        } else {
            store.filters.removeAtKey(filterId);
        }
    },

    listeners: {
        render: function () {
            var me = this;
            me.ownerCt.on('resize', function () {
                me.setWidth(this.getEl().getWidth())
            })
        },
        change: function () {
            var me = this;
            if (me.up().dataIndex == 'crewName') {
                me.searchCrew(me.up().dataIndex, me.getValue());
            }
            else if (me.autoSearch) me.setFilter(me.up().dataIndex, me.getValue())
        }
    }

});

//put below into each grid columns you want to search
// items:[{
//     xtype: 'searchtrigger',
//     autoSearch: true,
//     anyMatch: true
// }]