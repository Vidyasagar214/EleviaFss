/**
 * Created by steve.tess on 6/16/2016.
 */
Ext.define('TS.common.dd.CrewAssignGridDropZone', {
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
        var me = this,
            view = me.grid.getView(),
            fwaRecord = view.getRecord(target) || view.getRecord(Ext.fly(target).up(me.grid.view.getItemSelector()));

        this.proxyTpl.overwrite(dragSource.proxy.el.down('.dd-employee-hd'), {
            Name: fwaRecord.get('name')
        });

        if (me.validatorFn.call(this.validatorFnScope || me, data.records, fwaRecord, e) !== false) {
            return me.dropAllowed;
        } else {
            return me.dropNotAllowed;
        }
    },

    // This method is called as mouse moves during a drag drop operation of an employee over the crew assign area
    validatorFn: function (draggedEmployeeRecords, fwaRecord) {
        return this.isValidDrop(draggedEmployeeRecords, fwaRecord);
    },

    isValidDrop: function (draggedEmployeeRecords, fwaRecord) {
        var der = draggedEmployeeRecords,
            crew1Id = fwaRecord.get('crew1EmpId'),
            crew2Id = fwaRecord.get('crew2EmpId'),
            crew3Id = fwaRecord.get('crew3EmpId'),
            crew4Id = fwaRecord.get('crew4EmpId'),
            crew5Id = fwaRecord.get('crew5EmpId'),
            crew6Id = fwaRecord.get('crew6EmpId'),
            crew7Id = fwaRecord.get('crew7EmpId'),
            crew8Id = fwaRecord.get('crew8EmpId'),
            crew9Id = fwaRecord.get('crew9EmpId'),
            crew10Id = fwaRecord.get('crew10EmpId'),
            crew11Id = fwaRecord.get('crew11EmpId'),
            crew12Id = fwaRecord.get('crew12EmpId'),
            crew13Id = fwaRecord.get('crew13EmpId'),
            crew14Id = fwaRecord.get('crew14EmpId'),
            crew15Id = fwaRecord.get('crew15EmpId');

        for (var i = 0; i < der.length; i++) {

            if (crew1Id == der[i].get('empId') || crew2Id == der[i].get('empId') || crew3Id == der[i].get('empId') ||
                crew4Id == der[i].get('empId') || crew5Id == der[i].get('empId') || crew6Id == der[i].get('empId') ||
                crew7Id == der[i].get('empId') || crew8Id == der[i].get('empId') || crew9Id == der[i].get('empId') ||
                crew10Id == der[i].get('empId') || crew11Id == der[i].get('empId') || crew12Id == der[i].get('empId') ||
                crew13Id == der[i].get('empId') || crew14Id == der[i].get('empId') || crew15Id == der[i].get('empId') ||
                (crew1Id != '' && crew2Id != '' && crew3Id != '' &&
                    crew4Id != '' && crew5Id != '' && crew6Id != '' &&
                    crew7Id != '' && crew8Id != '' && crew9Id != '' &&
                    crew10Id != '' && crew11Id != '' && crew12Id != '' &&
                    crew13Id != '' && crew14Id != '' && crew15Id != '')) {
                return false;
            }
        }

        return true;
    },

    onNodeDrop: function (target, dragSource, e, data) {
        var me = this,
            view = me.grid.getView(),
            fwa = view.getRecord(target) || view.getRecord(Ext.fly(target).up(this.grid.view.getItemSelector())),
            employees = data.records,
            settings = TS.app.settings,
            store = view.getStore(),
            employee = data.records[0];

        if (fwa.get('fwaStatusId') == 'S') {
            Ext.Msg.alert('Warning', fwa.get('fwaName') + ' has been submitted and ' + settings.crewLabel + ' members cannot change.')
            return false;
        }

        TS.Util.onCheckForDoubleBookedEmployeesByEmpId(employee.get('empId'), fwa.get('schedStartDate'), fwa.get('schedEndDate'), function (status) {
            if (status) {
                if (!me.isValidDrop(employees, fwa)) {
                    return false;
                }
                employees[0].set('crewMemberRoleId', employees[0].get('defaultCrewRoleId'));
                if (!me.duplicateChiefCheck(employees[0], fwa)) {
                    Ext.Msg.confirm('Warning', fwa.get('fwaName') + ' has a ' + settings.crewChiefLabel + ' assigned. Do you wish to continue?', function (btn) {
                        if (btn == 'yes') {
                            //assign crew member
                            me.assignCrewMembers(view, fwa, employees);
                            //check count for duplicate date/crewchief

                            if (me.checkStartDateAndChiefCount(store, fwa, employees)) {
                                //check if assign to all similar FWA's
                                Ext.Msg.confirm(settings.crewLabel + ' Assign', "Copy to all " + settings.fwaAbbrevLabel + "'s for this " + settings.crewChiefLabel + " & date?", function (btn) {
                                    if (btn == 'yes') {
                                        //check and load for same date & chief
                                        var ret = me.checkStartDateAndChief(store, fwa, employees);
                                        if (ret) {
                                            me.nodeDropDuplicateChiefCheck(employee, fwa);
                                        }
                                    } else {
                                        //check if multiple chiefs
                                        me.nodeDropDuplicateChiefCheck(employee, fwa);
                                    }
                                });
                            } else {
                                me.nodeDropDuplicateChiefCheck(employee, fwa);
                            }
                        } else {
                            return false;
                        }
                    });
                } else {
                    me.assignCrewMembers(view, fwa, employees);
                    if (me.checkStartDateAndChiefCount(store, fwa, employees)) {
                        //check if assign to all similar FWA's
                        Ext.Msg.confirm(settings.crewLabel + ' Assign', "Copy to all " + settings.fwaAbbrevLabel + "'s for this " + settings.crewChiefLabel + " & date?", function (btn) {
                            if (btn == 'yes') {
                                //check and load for same date & chief
                                var ret = me.checkStartDateAndChief(store, fwa, employees);
                                if (ret) {
                                    me.nodeDropDuplicateChiefCheck(employee, fwa);
                                }
                            } else {
                                //check if multiple chiefs
                                me.nodeDropDuplicateChiefCheck(employee, fwa);
                            }
                        });
                    } else {
                        me.nodeDropDuplicateChiefCheck(employee, fwa);
                    }
                }
            } else {
                return false;
            }
        }.bind(me));
    },

    nodeDropDuplicateChiefCheck: function (employee, fwa) {
        var settings = TS.app.settings,
            hasChief = false,
            isChief = false;

        isChief = Ext.getStore('Roles').getById(employee.get('defaultCrewRoleId')).get('crewRoleIsChief');
        if (isChief) {
            if (fwa.get('crew1EmpId').length > 0) {
                hasChief = Ext.getStore('Roles').getById(fwa.get('crew1CrewRoleId')).get('crewRoleIsChief') &&
                    (fwa.get('crew2EmpId').length > 0 || fwa.get('crew3EmpId').length > 0);

            }
            if (!hasChief) {
                if (fwa.get('crew2EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew2CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew3EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew3CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew4EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew4CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew5EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew5CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew6EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew6CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew7EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew7CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew8EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew8CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew9EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew9CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew10EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew10CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew11EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew11CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew12EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew12CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew13EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew13CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew14EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew14CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew15EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew15CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (hasChief) {
                Ext.Msg.alert('Warning', fwa.get('fwaName') + ' has more than one(1) ' + settings.crewChiefLabel + ' assigned.');
            }
        }

        Ext.GlobalEvents.fireEvent('ResetEmployeeCrewAssignList', fwa);
    },

    assignCrewMembers: function (view, fwa, employees) {
        var id = fwa.get('scheduledCrewId'),
            settings = TS.app.settings,
            chiefLabel = settings.crewChiefLabel,
            store = view.getStore(),
            hasChief = false,
            isChief = false,
            employee,
            empId;
        employees = Ext.isArray(employees) ? employees : [employees];

        for (var i = 0; i < employees.length; i++) {
            employee = employees[i];
            empId = employee.get('empId');
            //copy the model and make it phantom
            employee = employee.copy(null);
            employee.beginEdit();
            employee.set('crewId', id);
            employee.set('empId', empId);
            //add default role is not exists
            if (employee.get('crewMemberRoleId') === undefined && employee.get('defaultCrewRoleId')) {
                employee.set('crewMemberRoleId', employee.get('defaultCrewRoleId'));
            }
            employee.endEdit();
            //check if duplicate chiefs and warn
            //this.duplicateChiefCheck(employee, fwa);
            //load
            this.loadCrewMember(fwa, employee);
        }
    },

    loadCrewMember: function (fwa, employee) {
        //double check to ensure no duplicate employees
        if (fwa.get('crew1EmpId') == employee.get('empId') || fwa.get('crew2EmpId') == employee.get('empId') || fwa.get('crew3EmpId') == employee.get('empId') ||
            fwa.get('crew4EmpId') == employee.get('empId') || fwa.get('crew5EmpId') == employee.get('empId') || fwa.get('crew6EmpId') == employee.get('empId') ||
            fwa.get('crew7EmpId') == employee.get('empId') || fwa.get('crew8EmpId') == employee.get('empId') || fwa.get('crew9EmpId') == employee.get('empId') ||
            fwa.get('crew10EmpId') == employee.get('empId') || fwa.get('crew11EmpId') == employee.get('empId') || fwa.get('crew12EmpId') == employee.get('empId') ||
            fwa.get('crew13EmpId') == employee.get('empId') || fwa.get('crew15EmpId') == employee.get('empId') || fwa.get('crew15EmpId') == employee.get('empId')) {
            return;
        }

        var isChief = Ext.getStore('Roles').getById(employee.get('crewMemberRoleId')).get('crewRoleIsChief');

        if (fwa.get('crew1EmpId').length == 0) {
            fwa.set('crew1EmpId', employee.get('empId'));
            fwa.set('crew1CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew2EmpId').length == 0) {
            fwa.set('crew2EmpId', employee.get('empId'));
            fwa.set('crew2CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew3EmpId').length == 0) {
            fwa.set('crew3EmpId', employee.get('empId'));
            fwa.set('crew3CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew4EmpId').length == 0) {
            fwa.set('crew4EmpId', employee.get('empId'));
            fwa.set('crew4CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew5EmpId').length == 0) {
            fwa.set('crew5EmpId', employee.get('empId'));
            fwa.set('crew5CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew6EmpId').length == 0) {
            fwa.set('crew6EmpId', employee.get('empId'));
            fwa.set('crew6CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew7EmpId').length == 0) {
            fwa.set('crew7EmpId', employee.get('empId'));
            fwa.set('crew7CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew8EmpId').length == 0) {
            fwa.set('crew8EmpId', employee.get('empId'));
            fwa.set('crew8CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew9EmpId').length == 0) {
            fwa.set('crew9EmpId', employee.get('empId'));
            fwa.set('crew9CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew10EmpId').length == 0) {
            fwa.set('crew10EmpId', employee.get('empId'));
            fwa.set('crew10CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew11EmpId').length == 0) {
            fwa.set('crew11EmpId', employee.get('empId'));
            fwa.set('crew11CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew12EmpId').length == 0) {
            fwa.set('crew12EmpId', employee.get('empId'));
            fwa.set('crew12CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew13EmpId').length == 0) {
            fwa.set('crew13EmpId', employee.get('empId'));
            fwa.set('crew13CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew14EmpId').length == 0) {
            fwa.set('crew14EmpId', employee.get('empId'));
            fwa.set('crew14CrewRoleId', employee.get('crewMemberRoleId'));
        } else if (fwa.get('crew15EmpId').length == 0) {
            fwa.set('crew15EmpId', employee.get('empId'));
            fwa.set('crew15CrewRoleId', employee.get('crewMemberRoleId'));
        }
        fwa.set('changesMade', true);
    },

    duplicateChiefCheck: function (employee, fwa) {
        var settings = TS.app.settings,
            hasChief = false,
            isChief = false;
        isChief = Ext.getStore('Roles').getById(employee.get('crewMemberRoleId')).get('crewRoleIsChief');
        if (isChief) {
            if (fwa.get('crew1EmpId').length > 0) {
                hasChief = Ext.getStore('Roles').getById(fwa.get('crew1CrewRoleId')).get('crewRoleIsChief');
            }
            if (!hasChief) {
                if (fwa.get('crew2EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew2CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew3EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew3CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew4EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew4CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew5EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew5CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew6EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew6CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew7EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew7CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew8EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew8CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew9EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew9CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew10EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew10CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew11EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew11CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew12EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew12CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew13EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew13CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew14EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew14CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (!hasChief) {
                if (fwa.get('crew15EmpId').length > 0) {
                    hasChief = Ext.getStore('Roles').getById(fwa.get('crew15CrewRoleId')).get('crewRoleIsChief');
                }
            }
            if (hasChief) {
                //Ext.Msg.alert('Warning', fwa.get('fwaName') + ' has more than one(1) ' + settings.crewChiefLabel + ' assigned.');
                return false;
            }
            return true;
        }
        return true;
    },

    checkStartDateAndChief: function (store, fwa, employees) {
        var me = this,
            fwaStartDate = Ext.Date.format(new Date(fwa.get('schedStartDate')), Ext.Date.patterns.ShortDate),
            isChief,
            fwaList = store.data.getRange(),
            chiefId = 0,
            empId;

        if (fwa.get('crew1CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew1CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew1EmpId');
        }
        if (!isChief && fwa.get('crew2CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew2CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew2EmpId');
        }
        if (!isChief && fwa.get('crew3CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew3CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew2EmpId');
        }
        if (!isChief && fwa.get('crew4CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew4CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew4EmpId');
        }
        if (!isChief && fwa.get('crew5CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew5CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew5EmpId');
        }
        if (!isChief && fwa.get('crew6CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew6CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew6EmpId');
        }
        if (!isChief && fwa.get('crew7CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew7CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew7EmpId');
        }
        if (!isChief && fwa.get('crew8CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew8CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew8EmpId');
        }
        if (!isChief && fwa.get('crew9CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew9CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew9EmpId');
        }
        if (!isChief && fwa.get('crew10CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew10CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew10EmpId');
        }
        if (!isChief && fwa.get('crew11CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew11CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew11EmpId');
        }
        if (!isChief && fwa.get('crew12CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew12CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew12EmpId');
        }
        if (!isChief && fwa.get('crew13CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew13CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew13EmpId');
        }
        if (!isChief && fwa.get('crew14CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew14CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew14EmpId');
        }
        if (!isChief && fwa.get('crew15CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew15CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew15EmpId');
        }

        for (var i = 0; i < employees.length; i++) {
            employee = employees[i];
            empId = employee.get('empId');
            //copy the model and make it phantom
            employee = employee.copy(null);
            employee.beginEdit();
            employee.set('crewId', id);
            employee.set('empId', empId);

            if (employee.get('crewMemberRoleId') === undefined && employee.get('defaultCrewRoleId')) {
                employee.set('crewMemberRoleId', employee.get('defaultCrewRoleId'));
            }
            employee.endEdit();
            Ext.each(fwaList, function (obj) {
                var startDate = Ext.Date.format(new Date(obj.get('schedStartDate')), Ext.Date.patterns.ShortDate),
                    empId;
                if (obj.get('crew1EmpId').length > 0) {
                    empId = obj.get('crew1EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew1CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew2EmpId').length > 0) {
                    empId = obj.get('crew2EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew2CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew3EmpId').length > 0) {
                    empId = obj.get('crew3EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew3CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                ///NEW
                if (obj.get('crew4EmpId').length > 0) {
                    empId = obj.get('crew4EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew4CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew5EmpId').length > 0) {
                    empId = obj.get('crew5EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew5CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew6EmpId').length > 0) {
                    empId = obj.get('crew6EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew6CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew7EmpId').length > 0) {
                    empId = obj.get('crew7EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew7CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew8EmpId').length > 0) {
                    empId = obj.get('crew8EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew8CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew9EmpId').length > 0) {
                    empId = obj.get('crew9EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew9CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew10EmpId').length > 0) {
                    empId = obj.get('crew10EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew10CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew11EmpId').length > 0) {
                    empId = obj.get('crew11EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew11CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew12EmpId').length > 0) {
                    empId = obj.get('crew12EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew12CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew13EmpId').length > 0) {
                    empId = obj.get('crew13EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew13CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew14EmpId').length > 0) {
                    empId = obj.get('crew14EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew14CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
                if (obj.get('crew15EmpId').length > 0) {
                    empId = obj.get('crew15EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew15CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        me.loadCrewMember(obj, employee);
                    }
                }
            });
        }
        return true;
    },

    checkStartDateAndChiefCount: function (store, fwa, employees) {
        var me = this,
            fwaStartDate = Ext.Date.format(new Date(fwa.get('schedStartDate')), Ext.Date.patterns.ShortDate),
            isChief,
            fwaList = store.data.getRange(),
            chiefId = 0,
            empId,
            ct = 0;

        if (fwa.get('crew1CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew1CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew1EmpId');
        }
        if (!isChief && fwa.get('crew2CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew2CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew2EmpId');
        }
        if (!isChief && fwa.get('crew3CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew3CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew3EmpId');
        }
        //new
        if (!isChief && fwa.get('crew4CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew4CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew4EmpId');
        }
        if (!isChief && fwa.get('crew5CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew5CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew5EmpId');
        }
        if (!isChief && fwa.get('crew6CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew6CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew6EmpId');
        }
        if (!isChief && fwa.get('crew7CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew7CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew7EmpId');
        }
        if (!isChief && fwa.get('crew8CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew8CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew8EmpId');
        }
        if (!isChief && fwa.get('crew9CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew9CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew9EmpId');
        }
        if (!isChief && fwa.get('crew10CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew10CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew10EmpId');
        }
        if (!isChief && fwa.get('crew11CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew11CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew11EmpId');
        }
        if (!isChief && fwa.get('crew12CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew12CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew12EmpId');
        }
        if (!isChief && fwa.get('crew13CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew13CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew13EmpId');
        }
        if (!isChief && fwa.get('crew14CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew14CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew14EmpId');
        }
        if (!isChief && fwa.get('crew15CrewRoleId') > 0) {
            isChief = Ext.getStore('Roles').getById(fwa.get('crew15CrewRoleId')).get('crewRoleIsChief');
            if (isChief) chiefId = fwa.get('crew15EmpId');
        }

        for (var i = 0; i < employees.length; i++) {
            employee = employees[i];
            empId = employee.get('empId');
            //copy the model and make it phantom
            employee = employee.copy(null);
            employee.beginEdit();
            employee.set('crewId', id);
            employee.set('empId', empId);

            if (employee.get('crewMemberRoleId') === undefined && employee.get('defaultCrewRoleId')) {
                employee.set('crewMemberRoleId', employee.get('defaultCrewRoleId'));
            }
            employee.endEdit();
            Ext.each(fwaList, function (obj) {
                var startDate = Ext.Date.format(new Date(obj.get('schedStartDate')), Ext.Date.patterns.ShortDate),
                    empId;
                if (obj.get('crew1EmpId').length > 0) {
                    empId = obj.get('crew1EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew1CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew2EmpId').length > 0) {
                    empId = obj.get('crew2EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew2CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew3EmpId').length > 0) {
                    empId = obj.get('crew3EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew3CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew4EmpId').length > 0) {
                    empId = obj.get('crew4EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew4CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew5EmpId').length > 0) {
                    empId = obj.get('crew5EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew5rewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew6EmpId').length > 0) {
                    empId = obj.get('crew6EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew6CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew7EmpId').length > 0) {
                    empId = obj.get('crew7EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew7CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew8EmpId').length > 0) {
                    empId = obj.get('crew8EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew8CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew9EmpId').length > 0) {
                    empId = obj.get('crew9EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew9CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew10EmpId').length > 0) {
                    empId = obj.get('crew10EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew10CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew11EmpId').length > 0) {
                    empId = obj.get('crew10EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew11CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew12EmpId').length > 0) {
                    empId = obj.get('crew12EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew12CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew13EmpId').length > 0) {
                    empId = obj.get('crew13EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew13CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew14EmpId').length > 0) {
                    empId = obj.get('crew14EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew14CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
                if (obj.get('crew15EmpId').length > 0) {
                    empId = obj.get('crew15EmpId');
                    if (empId == chiefId &&
                        Ext.getStore('Roles').getById(obj.get('crew15CrewRoleId')).get('crewRoleIsChief') &&
                        startDate == fwaStartDate) {
                        ct++;
                    }
                }
            });
        }

        return (ct > 1);
    }

});