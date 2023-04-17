Ext.define('TS.mixin.CrewMember', {

    crewViewRender: function (view) {

        //Handle crewmember events with delegates

        view.getEl().on({
            mouseover: {
                delegate: '.crewmembergrid .memberitem',
                fn: 'memberMouseOver'
            },
            mouseout: {
                delegate: '.crewmembergrid .memberitem',
                fn: 'memberMouseOut'
            },
            click: {
                delegate: '.crewmembergrid .memberitem .memberdelete',
                fn: 'memberDelete'
            }
        });

        view.getEl().on({
            click: {
                delegate: '.crewmembergrid',
                fn: 'memberGridClick'
            }
        });
    },

    /*
     When a crewmember is clicked in the Crew grid the corresponding crewmember is selected.
     */

    memberGridClick: function (event, target) {

        var el = Ext.fly(target);

        if (el) {
            var crewId = el.getAttribute('data-crewid');
            var store = this.getView().getStore();
            this.getView().getSelectionModel().select(store.getById(crewId));
        }
    },

    /*
     Show delete option when hovering over a crewmember.
     */

    memberMouseOver: function (event, html, eOpts) {
        var el = Ext.fly(html),
            settings = TS.app.settings;

        if (el) {
            var lastCell = el.down('.memberlastcell .x-grid-cell-inner');
            if (lastCell && !settings.schedReadOnly) {
                lastCell.addCls('memberdelete');
                //lastCell.addCls('x-fa fa-trash redIcon');
            }
        }
    },

    /*
     Removes the delete option on mouseout on a crewmember
     */

    memberMouseOut: function (event, html, eOpts) {
        var el = Ext.fly(html);

        if (el) {
            var lastCell = el.down('.memberlastcell .memberdelete');
            if (lastCell) {
                lastCell.removeCls('memberdelete');
                //lastCell.removeCls('x-fa fa-trash redIcon');
            }
        }
    },

    /*
     Handles the removal of a crewmember. The crew model will handle the removal in its inner employee store.
     On callback the crew record is refreshed in the view and afterunassignmember event is fired.

     The afterunassignmember event is handles by the container controller. This controller will select the crew record and
     refilter the employment grid.
     */

    memberDelete: function (event, target) {

        var el = Ext.fly(target);

        if (el) {
            var empId = el.up('.memberitem').getAttribute('data-empid'),
                crewId = el.up('.crewmembergrid').getAttribute('data-crewid'),
                settings = TS.app.settings,
                store = this.getView().getStore(),
                crewRecord = store.getById(crewId),
                crewMemberRecord,
                crewCt;

            if (crewRecord.get('crewMembers').data.length == 1) {
                Ext.Msg.alert('Warning', crewRecord.get('crewName') + ' must have at least one(1) ' + settings.crewLabel + ' member.');
                return false;
            }

            if (crewRecord) {
                crewMemberRecord = crewRecord.get('crewMembers').getById(empId);
                crewCt = crewRecord.get('crewCt');
                crewRecord.get('crewMembers').remove(crewMemberRecord);
                //if deleted crew member is crew chief. then put next in line as chief
                if (crewMemberRecord.get('crewMemberEmpId') == crewRecord.get('crewChiefEmpId')) {
                    crewRecord.set('crewChiefEmpId', crewRecord.get('crewMembers').data.items[0].get('crewMemberEmpId'));
                    crewRecord.set('crewChiefRoleId', crewRecord.get('crewMembers').data.items[0].get('crewMemberRoleId'));
                }

                this.saveCrew(crewRecord);

                //this.getView().getView().refreshNode(crewRecord);
                Ext.GlobalEvents.fireEvent('ResetCrewGrid', crewRecord);
            }
        }
    },

    /*
     Assign Members to a crew. The crew model handles the new assignments and calls the callback.
     On callback the record in the view is refreshed and afterAssignMembers event is fired.

     On afterAssignMembers the container controller will select the crew record and filter the employee grid.
     */

    assignMembers: function (view, crew, employees) {
        var crewChiefId = crew.get('crewChiefEmpId'),
            employees = Ext.isArray(employees) ? employees : [employees],
            id = crew.getId(),
            members = crew.get('crewMembers'),
            employee,
            empId;

        for (var i = 0; i < employees.length; i++) {
            employee = employees[i];
            empId = employee.get('empId');
            //copy the model and make it phantom else we update the unplanned fwa record
            employee = employee.copy(null);
            employee.beginEdit();
            employee.set('crewId', id);
            employee.set('empId', empId);

            if (employee.get('crewMemberRoleId') === undefined && employee.get('defaultCrewRoleId')) {
                employee.set('crewMemberRoleId', employee.get('defaultCrewRoleId'));
            }
            employee.endEdit();
            members.add(employee);
        }
        //this.getView().getView().refreshNode(crew);
        this.saveCrew(crew);
        Ext.GlobalEvents.fireEvent('ResetCrewGrid', crew);
    },

    saveCrew: function (record, successCallback) {
        var settings = TS.app.settings,
            store = this.getView().getStore(),
            hasChief = false,
            crewData = record.getData({
                serialize: true
            });
        if (record.get('crewName') == '') {
            Ext.Msg.alert('Warning', settings.crewLabel + ' Name is a required field');
            return;
        }
        //since this is triggered on a drag/drop first member is assigned as chief no matter what role is
        //could be a one man crew && settings.chiefRoleIds.indexOf('^'+ob.CrewMemberRoleId+'^') = -1
        if (crewData.crewMembers.length == 1) {
            var roleId = crewData.crewMembers[0].crewMemberRoleId,
                empId = crewData.crewMembers[0].crewMemberEmpId;
            record.data.crewChiefRoleId = roleId;
            record.data.crewChiefEmpId = empId;
            crewData.crewChiefRoleId = roleId;
            crewData.crewChiefEmpId = empId;
        }

        //loop thru and check for chief
        Ext.each(crewData.crewMembers, function (ob) {
            Ext.Object.each(ob, function (property, value) {
                if (settings.chiefRoleIds.indexOf('^' + ob.crewMemberRoleId + '^') > -1 && !hasChief) {
                    crewData.crewChiefEmpId = ob.crewMemberEmpId;
                    crewData.crewChiefRoleId = ob.crewMemberRoleId;
                    record.set('crewChiefEmpId', ob.crewMemberEmpId);
                    record.set('crewChiefRoleId', ob.crewMemberRoleId);
                    hasChief = true;
                    return false;
                } else if (settings.chiefRoleIds.indexOf('^' + ob.crewMemberRoleId + '^') > -1 && hasChief) {
                    Ext.Msg.alert('Warning', crewData.crewName + ' has more than one(1) ' + settings.crewChiefLabel + ' assigned.');
                }
            });
        });

        Crew.Update(null, settings.username, crewData, function (response, operation, success) {
            Ext.GlobalEvents.fireEvent('updateSchedulerStores');
            Ext.getStore('AllCrews').reload();
            var grid = this.getView(),
                plugin = grid.getPlugin('memberExpander'),
                idx;
            // we can toggle the row once the store has reloaded
            store.on('load', function () {
                Ext.GlobalEvents.fireEvent('ToggleCrewRow', record);
            }, store, {
                single: true
            });
            store.reload();
            settings.fwaListNeedsRefresh = true;
        }, this, {
            autoHandle: true
        });
    }

});