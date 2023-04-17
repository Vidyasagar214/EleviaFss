Ext.define('TS.common.dd.CrewGridDropZone', {
    extend: 'Ext.dd.DropZone',
    ddGroup: 'employees',

    constructor: function () {
        this.callParent(arguments);

        this.proxyTpl = this.proxyTpl || new Ext.XTemplate(
                '<span class="dd-crew">' +
                '{[ this.getText(values) ]}' +
                '</span>',
                {
                    getText: function (vals) {
                        return vals.name;
                    }
                }
            );
    },

    getTargetFromEvent: function (e) {
        return e.getTarget(this.grid.view.getItemSelector());
    },

    onNodeOver: function (target, dragSource, e, data) {
        var view = this.grid.getView(),
            crewRecord = view.getRecord(target) || view.getRecord(Ext.fly(target).up(this.grid.view.getItemSelector()));

        this.proxyTpl.overwrite(dragSource.proxy.el.down('.dd-employee-hd'), {
            Name: crewRecord.get('name')
        });

        if (this.validatorFn.call(this.validatorFnScope || this, data.records, crewRecord, e) !== false) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },


    // This method is called as mouse moves during a drag drop operation of an unplanned task over the schedule area
    validatorFn: function (draggedEmployeeRecords, crewRecord) {
        return this.isValidDrop(draggedEmployeeRecords, crewRecord);
    },

    isValidDrop: function (draggedEmployeeRecords, crewRecord) {

        var der = draggedEmployeeRecords,
            members = crewRecord.get('crewMembers');

        for (var i = 0; i < der.length; i++) {

            if (members.getById(der[i].get('empId'))) {
                return false;
            }
        }

        return true;

    },

    onNodeDrop: function (target, dragSource, e, data) {

        var view = this.grid.getView(),
            crew = view.getRecord(target) || view.getRecord(Ext.fly(target).up(this.grid.view.getItemSelector())),
            employees = data.records;

        if (!this.isValidDrop(employees, crew)) {
            return false;
        }

        view.fireEvent('employeedrop', view, crew, employees);
    }
});
