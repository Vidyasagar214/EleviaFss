// This override moves delete button from items list to the docked position at the bottom
Ext.define('TS.overrides.grid.plugin.Editable', {
    override: 'Ext.grid.plugin.Editable',

    requires: [
        'TS.Messages'
    ],

    config: {
        disableSubmitBt: false
    },

    startEdit: function (record) {
        this.onTrigger(null, record);
    },

    onTrigger: function (e, rec) {
        var me = this,
            settings = TS.app.settings,
            grid = me.getGrid(),
            formConfig = me.getFormConfig(),
            toolbarConfig = me.getToolbarConfig(),
            //If onTrigger called from click/tap it will have second parameter that is DOM target
            //As it can mutate in to instance of data.Model if called from startEdit, we have to add the check
            record = (rec && rec instanceof Ext.data.Model) ? rec : me.getRecordByTriggerEvent(e),
            vm = grid.getParent().getViewModel() || grid.getParent().getParent().getViewModel(),
            fwa = vm.get('selectedFWA'),
            fwaHours = fwa._hours.getRange(),
            ttlHrs = 0,
            fields, form, sheet, toolbar, submitBt, hoursTtl = 0;

        settings.isLoading = true;
        //if no record return
        if (!record) return; //happens when user taps on screen and not on a row
        //disable add button
        if (Ext.first('fwa-managehours')) {
            if (record.get('isChief') && record.get('empId') && settings.empId !== record.get('empId') && !settings.tsCanEnterCrewMemberTime) {
                me.setDisableSubmitBt(true);
                me.setEnableDeleteButton(false);
            } else {
                me.setDisableSubmitBt(false);
                me.setEnableDeleteButton(true);
            }

            if (new Date(Ext.Date.format(new Date(record.get('startTime')), 'm/d/Y')) < new Date(Ext.Date.format(new Date('2001-01-01'), 'm/d/Y'))) {
                record.set('startTime', '');
                record.set('endTime', '');
            }

            Ext.first('fwa-managehours').lookup('addHoursButton').setDisabled(true);
            Ext.first('fwa-managehours').lookup('workCodeDateBar').setHidden(true);
        } else if (Ext.first('fwa-manageunits')) {
            Ext.first('fwa-manageunits').lookup('addUnitsButton').setDisabled(true);
            Ext.first('fwa-manageunits').lookup('unitDateBar').setHidden(true);
        } else if (Ext.first('fwa-manageexpenses')) {
            if (!record.get('amountPerMile')) {
                record.set('amountPerMile', settings.exMileageRate);
            }
            Ext.first('fwa-manageexpenses').lookup('addButton').setDisabled(true);
            //me.setEnableDeleteButton(settings.exCanModifyFwaExp);
        } else if (Ext.first('fwa-manageworkcodes')) {
            Ext.first('fwa-manageworkcodes').lookup('addWorkCodeButton').setDisabled(true);
        }

        if (fwaHours && record) {
            Ext.each(fwaHours, function (obj) {
                if (obj.get('workCodeId') == record.get('workCodeId')) {
                    hoursTtl += obj.get('regHrs') + obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('travelHrs');
                }
            });
        }

        if (record) {
            if (formConfig) {
                me.form = form = Ext.factory(formConfig, Ext.form.Panel);
            } else {
                me.form = form = Ext.factory(me.getDefaultFormConfig());

                fields = me.getEditorFields(grid.getColumns());
                form.down('fieldset').setItems(fields);
            }

            form.setRecord(record); //bombz

            toolbar = Ext.factory(toolbarConfig, Ext.form.TitleBar);
            toolbar.down('button[action=cancel]').on('tap', 'onCancelTap', me);

            submitBt = toolbar.down('button[action=submit]');
            submitBt.on('tap', 'onSubmitTap', me);
            submitBt.setDisabled(me.getDisableSubmitBt());

            me.sheet = sheet = grid.add({
                xtype: 'sheet',
                items: [toolbar, form],
                hideOnMaskTap: true,
                enter: 'right',
                exit: 'right',
                width: '100%',
                right: 0,
                layout: 'fit',
                stretchY: true,
                hidden: true
            });

            if (me.getEnableDeleteButton() && grid.getReference() != 'templateGrid') {
                form.add(
                    {
                        xtype: 'button',
                        text: 'Delete',
                        itemId: 'deleteButton',
                        ui: 'decline',
                        docked: 'bottom',
                        margin: 10,
                        handler: function () {
                            var hasHrs = hoursTtl > 0,
                                settings = TS.app.settings;
                            if (hasHrs && record.get('actualHours')) {
                                Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Hours have been entered for ' + settings.workCodeLabel + ' ' + record.get('workCodeAbbrev') + ' and cannot be deleted.');
                            } else {
                                if (grid.referenceKey == 'hoursGrid') {
                                    Ext.first('fwa-managehours').lookup('addHoursButton').setDisabled(false);
                                    Ext.first('fwa-managehours').lookup('workCodeDateBar').setHidden(false);
                                    record.set('modified', 'D');
                                    grid.getStore().addFilter({
                                        filterFn: function (record) {
                                            return record.get('modified') !== 'D';
                                        }
                                    });
                                } else if (grid.referenceKey === 'workCodeGrid') {
                                    Ext.each(fwaHours, function (empHrs) {
                                        ttlHrs += empHrs.get('regHrs') + empHrs.get('ovtHrs') + empHrs.get('ovt2Hrs') + empHrs.get('travelHrs');
                                    });
                                    if (ttlHrs > 0 && vm.get('newFwa')) {
                                        Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.crewLabel + " is changed. Do you wish to continue?</div>", function (btn) {
                                            if (btn === 'yes') {
                                                grid.getParent().getController().onWorkCodeRemoved(record);
                                                grid.getStore().remove(record);
                                                if (Ext.first('#addButton'))
                                                    Ext.first('#addButton').setDisabled(false);
                                            } else {
                                                if (Ext.first('#addButton'))
                                                    Ext.first('#addButton').setDisabled(false);
                                            }
                                        });
                                    } else if (ttlHrs > 0) {
                                        Ext.Msg.alert('Warning', 'Employee Hours have been entered for ' + settings.workCodeLabel + '(s) and cannot be deleted.')
                                    } else {
                                        grid.getParent().getController().onWorkCodeRemoved(record);
                                        grid.getStore().remove(record);
                                        if (Ext.first('#addButton'))
                                            Ext.first('#addButton').setDisabled(false);
                                    }
                                } else if (grid.referenceKey == 'expensesGrid') {
                                    record.set('modified', 'D');
                                    grid.getStore().addFilter({
                                        filterFn: function (record) {
                                            return record.get('modified') !== 'D';
                                        }
                                    });
                                    if (Ext.first('#addButton'))
                                        Ext.first('#addButton').setDisabled(false);
                                } else {
                                    grid.getStore().remove(record);
                                    if (Ext.first('#addButton'))
                                        Ext.first('#addButton').setDisabled(false);
                                }
                                fwa.dirty = true;
                                sheet.hide();
                            }
                        }
                    }
                );
                //emp hours 'Remove Employee for this Date'
                //units 'Remove'+settings.unitLabel+'for this Date'
                //work code 'Remove ' + settings.workCodeLabel
                if (grid.getReference() == 'workCodeGrid') {
                    Ext.first('#deleteButton').setText('Remove ' + settings.workCodeLabel);
                } else if (grid.getReference() == 'unitCodeGrid') {
                    Ext.first('#deleteButton').setText('Remove ' + settings.unitLabel + ' for this Date');
                } else if (grid.getReference() == 'hoursGrid') {
                    Ext.first('#deleteButton').setText('Remove Employee for this Date');
                } else if (grid.getReference() == 'expensesGrid') {
                    Ext.first('#deleteButton').setText('Remove Expense for this Date');
                }
            }

            //show/hide unit details button
            if (record.get('unitCodeId') && formConfig) {
                var me = this,
                    unitCode = Ext.getStore('UnitCode').getById(record.get('unitCodeId')),
                    display = unitCode && unitCode.get('requireDetail') != 'M' || record.get('unitCodeId') == '' ? true : false;
                me.form.down('button[action=showUnitDetails]').setHidden(display);
            }

            sheet.on('hide', 'onSheetHide', me);
            sheet.show();
            //set readOnly as needed for Units, Unit Details & Hours
            if ((record.get('regHrs') || record.get('ovtHrs') || record.get('ovt2Hrs') || record.get('travelHrs')) && record.get('readOnly') && formConfig) {
                TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                me.setHoursReadOnly();
            }

            if (record.get('unitCodeId') && record.get('readOnly') && formConfig) {
                TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                me.setUnitsReadOnly();
            }

            if (record.get('dtDate') && vm.get('selectedUnit').get('readOnly') && formConfig) {
                me.setUnitDetailsReadOnly();
            }
        }
        settings.isLoading = false;

        if (Ext.first('fwa-manageworkcodes'))
            Ext.first('#warning').setHtml('*If photos or documents are added or removed, ' + settings.fwaAbbrevLabel + ' <u>must</u> be saved to reflect changes.');

    },
    //override so delete button is hidden & submit/save button is disabled when record is read only
    getRecordByTriggerEvent: function (e) {
        var me = this,
            grid = me.getGrid(),
            vm = grid.getParent().getViewModel(),
            rowEl = e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row'),
            row;
        if (rowEl) {
            row = Ext.getCmp(rowEl.id);
            if (row) {
                //  for Hours and Units                     for Unit Details
                if (row.getRecord().get('readOnly') || (row.getRecord().get('dtDate') && vm.get('selectedUnit').get('readOnly'))) {
                    me.setEnableDeleteButton(false);
                    me.setDisableSubmitBt(true);
                } else {
                    me.setEnableDeleteButton(true);
                    me.setDisableSubmitBt(false);
                }
                return row.getRecord();
            }
        }
        return null;
    },

    setHoursReadOnly: function () {
        Ext.first('#hoursWorkDate').setReadOnly(true);
        Ext.first('#empGroupSelect').setReadOnly(true);
        Ext.first('#hoursEmpName').setReadOnly(true);
        Ext.first('#hoursCrewRole').setReadOnly(true);
        Ext.first('#workCodeGridEditColumn').setReadOnly(true);
        Ext.first('#hoursRegHrs').setReadOnly(true);
        Ext.first('#hoursOvtHrs').setReadOnly(true);
        Ext.first('#hoursOvt2Hrs').setReadOnly(true);
        Ext.first('#hoursTravelHrs').setReadOnly(true);
        Ext.first('#hoursComments').setReadOnly(true);
    },

    setUnitsReadOnly: function () {
        Ext.first('#unitDate').setReadOnly(true);
        Ext.first('#unitCodeCombo').setReadOnly(true);
        Ext.first('#unitCodeName').setDisabled(true);
        Ext.first('#quantity').setReadOnly(true);
        Ext.first('#unitEquipmentId').setReadOnly(true);
        Ext.first('#equipmentName').setReadOnly(true);
        Ext.first('#unitComments').setReadOnly(true);
    },

    setUnitDetailsReadOnly: function () {
        Ext.first('#unitDetailDate').setReadOnly(true);
        Ext.first('#unitDetailFrom').setReadOnly(true);
        Ext.first('#unitDetailTo').setReadOnly(true);
        Ext.first('#unitDetailLValue1').setReadOnly(true);
        Ext.first('#unitDetailLValue2').setReadOnly(true);
        Ext.first('#unitDetailLValue3').setReadOnly(true);
        Ext.first('#unitDetailSValue1').setReadOnly(true);
    },

    /**
     * Dynamically enable/disable Submit button
     * @param state
     */
    disableSubmit: function (state) {
        var me = this;
        if (me.form) {
            me.form.down('button[action=submit]').setDisabled(state);
        } else {
            me.setDisableSubmitBt(state);
        }
    },

    hideDeleteButton: function (state) {
        var me = this;
        me.setEnableDeleteButton(state)
    },

    setPhotoRequiredHidden: function (state) {
        var me = this;
        me.getFormConfig().items[7].hidden = !state;
        me.setPhotoRequiredTextHidden(state);
    },

    setPhotoRequiredTextHidden: function (state) {
        var me = this;
        me.getFormConfig().items[7].hidden = state;
    },

    hidePhotoButton: function (state) {
        var me = this;
        me.getFormConfig().items[8].hidden = state;
        me.getFormConfig().items[9].hidden = state;
    },

    setActualHrsReadOnly: function (state) {
        var me = this;
        me.getFormConfig().items[3].readOnly = state;
    },

    setScheduledHrsReadOnly: function (state) {
        var me = this;
        me.getFormConfig().items[2].readOnly = state;
    },

    setActualHrsHidden: function (state) {
        var me = this;
        me.getFormConfig().items[3].hidden = state;
    },

    setPercentCompleteHidden: function (state) {
        var me = this;
        me.getFormConfig().items[5].hidden = state;
    },

    disableEmployeeHours: function (state) {
        var me = this;
        //me.getFormConfig().items[4].items[0].disable = state;
        //me.form.down('button[action=submit]').setDisabled(state);
    },

    hideOvtHrs: function (state) {
        var me = this;
        me.getFormConfig().items.find(o => o.reference === 'employeeHours').items[1].hidden = state;
    },

    hideOvt2Hrs: function (state) {
        var me = this;
        me.getFormConfig().items.find(o => o.reference === 'employeeHours').items[2].hidden = state;
    },

    hideTravelHrs: function (state) {
        var me = this;
        me.getFormConfig().items.find(o => o.reference === 'employeeHours').items[3].hidden = state;
    },

    hideWorkCode: function (state) {
        var me = this;
        me.getFormConfig().items[4].hidden = state;
    },

    hideDetails: function (state) {
        var me = this;
        me.getFormConfig().items[8].hidden = state;
    },

    hideExpAccounts: function (state) {
        var me = this;
        me.getFormConfig().items[10].hidden = state; //number
        me.getFormConfig().items[11].hidden = state; //name
    },

    hideExpBillable: function (state) {
        var me = this;
        me.getFormConfig().items[12].hidden = state;
    },

    hideExpFields: function (settings) {
        var me = this;
        //hidden
        me.getFormConfig().items.find(o => o.name == 'wbs1Container').items.find(s => s.name == 'wbs1').hidden = me.hideExpWbs1(settings); //wbs1
        me.getFormConfig().items.find(o => o.name == 'wbs1Container').items.find(s => s.name == 'projectButton').hidden = me.hideExpWbs1(settings);//project button
        //me.getFormConfig().items[4].items[0].hidden = me.hideExpWbs1(settings); //wbs1
        //me.getFormConfig().items[4].items[1].hidden = me.hideExpWbs1(settings); //project button
        me.getFormConfig().items.find(o => o.name == 'wbs1name').hidden = me.hideExpWbs1Name(settings); //wbs1 name
        me.getFormConfig().items.find(o => o.name == 'wbs2').hidden = me.hideExpWbs2(settings);//wbs2
        me.getFormConfig().items.find(o => o.name == 'wbs2name').hidden = me.hideExpWbs2Name(settings); //wbs2 name
        me.getFormConfig().items.find(o => o.name == 'wbs3').hidden = me.hideExpWbs3(settings);//wbs3
        me.getFormConfig().items.find(o => o.name == 'wbs3name').hidden = me.hideExpWbs3Name(settings);//wbs3 name
        me.getFormConfig().items.find(o => o.name == 'account').hidden = me.hideAccount(settings);//account
        me.getFormConfig().items.find(o => o.name == 'accountname').hidden = me.hideAccountName(settings);//account name
        //disabled
        // me.getFormConfig().items[0].disabled = !settings.exCanModifyFwaExp; //exp date
        // me.getFormConfig().items[1].disabled = !settings.exCanModifyFwaExp; //category
        // me.getFormConfig().items[3].disabled = !settings.exCanModifyFwaExp; //amount
        // me.getFormConfig().items[4].items[0].disabled = !settings.exCanModifyFwaExp; //wbs1
        // me.getFormConfig().items[4].items[1].disabled = !settings.exCanModifyFwaExp; //project button
        // me.getFormConfig().items[5].disabled = !settings.exCanModifyFwaExp; //wbs1 name
        // me.getFormConfig().items[6].disabled = !settings.exCanModifyFwaExp;//wbs2
        // me.getFormConfig().items[7].disabled = !settings.exCanModifyFwaExp; //wbs2 name
        // me.getFormConfig().items[8].disabled = !settings.exCanModifyFwaExp;//wbs3
        // me.getFormConfig().items[9].disabled = !settings.exCanModifyFwaExp;//wbs3 name
        // me.getFormConfig().items[10].disabled = !settings.exCanModifyFwaExp;//account
        // me.getFormConfig().items[14].disabled = !settings.exCanModifyFwaExp; //reason
        // me.getFormConfig().items[15].disabled = !settings.exCanModifyFwaExp; //other
        // me.getFormConfig().items[12].disabled = !settings.exCanModifyFwaExp; //billable
        // me.getFormConfig().items[13].disabled = !settings.exCanModifyFwaExp; //company paid
        // me.getFormConfig().items[16].disabled = !settings.exCanModifyFwaExp; //miles driven
        // me.getFormConfig().items[17].disabled = !settings.exCanModifyFwaExp; //rate per mile

    },

    modifyFwaExpFields: function (settings) {
        var me = this;
        //disabled
        me.getFormConfig().items.find(o => o.name == 'expDate').disabled = !settings.exCanModifyFwaExp; //exp date
        me.getFormConfig().items.find(o => o.name == 'category').disabled = !settings.exCanModifyFwaExp; //category
        me.getFormConfig().items.find(o => o.name == 'amount').disabled = !settings.exCanModifyFwaExp; //amount
        me.getFormConfig().items.find(o => o.name == 'wbs1Container').items.find(s => s.name == 'wbs1').disabled = !settings.exCanModifyFwaExp; //wbs1
        me.getFormConfig().items.find(o => o.name == 'wbs1Container').items.find(s => s.name == 'projectButton').disabled = !settings.exCanModifyFwaExp; //project button
        me.getFormConfig().items.find(o => o.name == 'wbs1name').disabled = !settings.exCanModifyFwaExp; //wbs1 name
        me.getFormConfig().items.find(o => o.name == 'wbs2').disabled = !settings.exCanModifyFwaExp;//wbs2
        me.getFormConfig().items.find(o => o.name == 'wbs2name').disabled = !settings.exCanModifyFwaExp; //wbs2 name
        me.getFormConfig().items.find(o => o.name == 'wbs3').disabled = !settings.exCanModifyFwaExp;//wbs3
        me.getFormConfig().items.find(o => o.name == 'wbs3name').disabled = !settings.exCanModifyFwaExp;//wbs3 name
        me.getFormConfig().items.find(o => o.name == 'account').disabled = !settings.exCanModifyFwaExp;//account
        me.getFormConfig().items.find(o => o.name == 'reason').disabled = !settings.exCanModifyFwaExp; //reason
        me.getFormConfig().items.find(o => o.name == 'other').disabled = !settings.exCanModifyFwaExp; //other
        me.getFormConfig().items.find(o => o.name == 'billable').disabled = !settings.exCanModifyFwaExp; //billable
        me.getFormConfig().items.find(o => o.name == 'companyPaid').disabled = !settings.exCanModifyFwaExp; //company paid
        me.getFormConfig().items.find(o => o.name == 'miles').disabled = !settings.exCanModifyFwaExp; //miles driven
        me.getFormConfig().items.find(o => o.name == 'amountPerMile').disabled = !settings.exCanModifyFwaExp; //rate per mile

    },


    canModifyFwaExp: function (state) {
        var me = this,
            toolbarConfig = me.getToolbarConfig();
        me.getFormConfig().items.find(o => o.name == 'wbs2').hidden = state;
        me.form.down('button[action=submit]').setDisabled(!state);
    },

    onSubmitTap: function (bt) {
        var me = this,
            settings = TS.app.settings,
            rec = me.form.getValues(),
            isChief = settings.chiefRoleIds.indexOf('^' + rec.crewRoleId + '^') > -1,
            vm = me.getGrid().getParent().getViewModel() || me.getGrid().getParent().getParent().getViewModel(),
            fwa = vm.get('selectedFWA'),
            grid = me.getGrid(),
            noDataFlow = settings.fwaChiefDataFlowToCrew == 'N',
            flowHours = settings.fwaChiefDataFlowToCrew == 'H' || settings.fwaChiefDataFlowToCrew == 'B',
            flowComments = settings.fwaChiefDataFlowToCrew == 'C' || settings.fwaChiefDataFlowToCrew == 'B',
            datesInRange,
            hasNewDate = false,
            utcDate,
            workDate,
            displayDate,
            currentIndex = 0,
            workCode = rec.workCodeId,
            hoursGrid,
            store,
            empStore = Ext.getStore('Employees');

        //work code must be selected
        if (grid.getReference() == 'workCodeGrid' && !workCode) {
            Ext.Msg.alert('Warning', 'A ' + settings.workCodeLabel + ' is required to be selected. Either select a code or click Cancel to continue');
            return;
        }

        if (grid.getReference() == 'hoursGrid') {
            if (!rec.workDate ||
                !rec.empGroupId ||
                !rec.empId ||
                !rec.crewRoleId ||
                !rec.workCodeId) {
                Ext.Msg.alert('Warning', 'A Work Date, Employee Group, Employee, Crew role, Labor Code, and ' + settings.workCodeLabel + ' are required to be selected. Either select or click Cancel to continue');
                return;
            }
        }

        if (grid.getReference() == 'expensesGrid') {
            if (!rec.expDate || !rec.category) {
                Ext.Msg.alert('Warning', 'A Expense Date, and Category are required to be selected. Either select or click Cancel to continue');
                return;
            }
        }

        empStore.clearFilter();
        if (Ext.first('#empGroupSelect')) {
            Ext.first('#empGroupSelect').setValue('');
        }
        rec.dirty = true;

        //check if unit is has mileage & details
        if (rec.unitCodeId) {
            var unitCode = Ext.getStore('UnitCode').getById(rec.unitCodeId),
                required = unitCode.get('requireDetail') == 'M',
                details = Ext.Array.pluck(me.form.getRecord().get('details').getRange(), 'data');
            rec.equipmentName = !me.form.innerItems[5].getSelection() ? '' : me.form.innerItems[5].getSelection().get('equipmentName');
            if (required && details.length > 0) {
                if (rec.quantity != me.form.getRecord().get('quantity')) {
                    Ext.Msg.alert('FYI', 'Mileage quantity does not match the calculated mileage total in details.')
                }
            }
        }

        me.form.getRecord().set(me.form.getValues());
        if (rec.unitCodeId) {
            me.form.getRecord().set('equipmentName', rec.equipmentName);
        }
        if (isChief) {
            if (!noDataFlow) {
                if (flowHours) {
                    Ext.each(fwa._hours.getRange(), function (emp) {
                        if (emp.get('empId') != rec.empId) {
                            if (emp.get('workCodeId') == workCode) {
                                if (emp.get('regHrs') == 0.0) {
                                    emp.set('regHrs', rec.regHrs);
                                }
                                if (emp.get('ovtHrs') == 0.0) {
                                    emp.set('ovtHrs', rec.ovtHrs);
                                }
                                if (emp.get('ovt2Hrs') == 0.0) {
                                    emp.set('ovt2Hrs', rec.ovt2Hrs);
                                }
                            }
                        }
                    });
                }
                if (flowComments) {
                    Ext.each(fwa._hours.getRange(), function (emp) {
                        if (emp.get('empId') != rec.empId && !emp.get('comment') && emp.get('workCodeId') == workCode) {
                            emp.set('comment', rec.comment)
                        }
                    });
                }
            }
        }

        me.form.getRecord().store.sort([
            {
                property: 'lastName',
                direction: 'ASC'
            },
            {
                property: 'workCodeAbbrev',
                direction: 'DESC'
            }
        ]);

        //is an employee hours edit check and if work date exists
        if (grid.getItemId() == 'hoursGrid') {
            datesInRange = fwa.get('recurrenceDatesInRange');
            workDate = Ext.Date.format(new Date(me.form.getValues().workDate), DATE_FORMAT);
            displayDate = workDate;
            hoursGrid = Ext.first('#hoursGrid');
            store = hoursGrid.getStore();

            //check if date exists in range
            Ext.each(datesInRange, function (dt) {
                utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
                utcDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                if (utcDate == workDate) {
                    hasNewDate = true;
                    return false;
                }
            });
            Ext.first('#dateHeader').setValue(displayDate);
            //if does not exists - add to dateRange
            if (!hasNewDate) {
                workDate = Ext.Date.format(new Date(workDate), 'Y-m-d');
                if (!datesInRange) datesInRange = [];
                datesInRange.push(workDate + 'T00:00:00');
            }
            //turn on/off last & next buttons
            if (datesInRange && datesInRange.length > 0) {
                if (datesInRange.length == 1) {
                    Ext.first('#lastHoursDate').setDisabled(true);
                    Ext.first('#nextHoursDate').setDisabled(true);
                } else {
                    datesInRange = datesInRange.sort(function (a, b) {
                        return new Date(a) - new Date(b);
                    });
                    Ext.each(datesInRange, function (dt) {
                        currentIndex++;
                        utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                        var matches = (utcDate == Ext.first('#dateHeader').getValue());
                        if (matches && currentIndex == 1) {
                            Ext.first('#lastHoursDate').setDisabled(true);
                            Ext.first('#nextHoursDate').setDisabled(false);
                            return false;
                        } else if (matches && currentIndex == datesInRange.length) {
                            Ext.first('#nextHoursDate').setDisabled(true);
                            Ext.first('#lastHoursDate').setDisabled(false);
                            return false;
                        }
                    });
                }
            } else {
                Ext.first('#lastHoursDate').setDisabled(true);
                Ext.first('#nextHoursDate').setDisabled(true);
            }
        }

        if (store) {
            store.clearFilter();
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(displayDate), DATE_FORMAT);
            });
        }

        me.sheet.hide();

        if (grid.getItemId() == 'unitDetailsGrid') {
            me.sheet.parent.up('sheet').hide();
        }
        //show date bar in manage hours & units
        settings.justSaved = true;
        if (Ext.first('fwa-managehours')) {
            Ext.first('fwa-managehours').lookup('addHoursButton').setDisabled(false);
            Ext.first('fwa-managehours').lookup('workCodeDateBar').setHidden(false);
        } else if (Ext.first('fwa-manageunits')) {
            Ext.first('fwa-manageunits').lookup('addUnitsButton').setDisabled(false);
            Ext.first('fwa-manageunits').lookup('unitDateBar').setHidden(false);
        } else if (Ext.first('fwa-manageworkcodes')) {
            grid.getParent().getController().onWorkCodeAdded(rec);
            Ext.first('fwa-manageworkcodes').lookup('addWorkCodeButton').setDisabled(false);
        } else if (Ext.first('fwa-manageexpenses')) {
            Ext.first('fwa-manageexpenses').lookup('addButton').setDisabled(false);
        }

        //enable add button
        if (Ext.first('#addButton'))
            Ext.first('#addButton').setDisabled(false);
    },

    onCancelTap: function () {
        var me = this,
            settings = TS.app.settings,
            record = me.form.getRecord(),
            isFwaInfo = record.get('fwaInfo'),
            grid = me.getGrid(),
            empStore = Ext.getStore('Employees');
        //enable add button
        if (Ext.first('#addButton'))
            Ext.first('#addButton').setDisabled(false);
        empStore.clearFilter();

        if (Ext.first('#empGroupSelect')) {
            Ext.first('#empGroupSelect').setValue('');
        }

        if ((record.phantom && (!record.get('workCodeId') && !record.get('unitCodeId') && !record.get('empId'))) && (!record.dirty || (record.dirty && !record.get('empId'))) && !isFwaInfo) {
            grid.getStore().remove(record);
        }

        if (record.phantom && !record.get('category') && record.get('eKGroup')) {
            grid.getStore().remove(record);
        }
        //show date bar in manage hours & units
        settings.justSaved = true;
        if (Ext.first('fwa-managehours')) {
            Ext.first('fwa-managehours').lookup('addHoursButton').setDisabled(false);
            Ext.first('fwa-managehours').lookup('workCodeDateBar').setHidden(false);
        } else if (Ext.first('fwa-manageunits')) {
            Ext.first('fwa-manageunits').lookup('addUnitsButton').setDisabled(false);
            Ext.first('fwa-manageunits').lookup('unitDateBar').setHidden(false);
        } else if (Ext.first('fwa-manageworkcodes')) {
            Ext.first('fwa-manageworkcodes').lookup('addWorkCodeButton').setDisabled(false);
        } else if (Ext.first('fwa-manageexpenses')) {
            Ext.first('fwa-manageexpenses').lookup('addButton').setDisabled(false);
        }
        this.sheet.hide();
    },

    hideExpWbs1: function (settings) {
        if (settings.exDisplayWbs1 == 'B' || settings.exDisplayWbs1 == 'U')
            return false;
        else
            return true;
    },

    hideExpWbs1Name: function (settings) {
        if (settings.exDisplayWbs1 == 'B' || settings.exDisplayWbs1 == 'A')
            return false;
        else
            return true;
    },

    hideExpWbs2: function (settings) {
        if (settings.exDisplayWbs2 == 'B' || settings.exDisplayWbs2 == 'U')
            return false;
        else
            return true;
    },

    hideExpWbs2Name: function (settings) {
        if (settings.exDisplayWbs2 == 'B' || settings.exDisplayWbs2 == 'A')
            return false;
        else
            return true;
    },

    hideExpWbs3: function (settings) {
        if (settings.exDisplayWbs3 == 'B' || settings.exDisplayWbs3 == 'U')
            return false;
        else
            return true;
    },

    hideExpWbs3Name: function (settings) {
        if (settings.exDisplayWbs3 == 'B' || settings.exDisplayWbs3 == 'A')
            return false;
        else
            return true;
    },

    hideAccount: function (settings) {
        return !(settings.exDisplayAccount === 'B' || settings.exDisplayAccount === 'U');
    },

    hideAccountName: function (settings) {
        return !(settings.exDisplayAccount === 'B' || settings.exDisplayAccount === 'A');
    }

});
