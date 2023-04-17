Ext.define('TS.controller.fwa.FWAListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fwalist',

    requires: [
        'Ext.util.Filter'
    ],

    listen: {
        global: {
            'UpdateFwaGrid': 'updateFwaGrid',
            'UnscheduledFwaGridSelect': 'onFwaGridSelect',
            'UpdateFwaGridFromScheduler': 'updateFwaGridFromScheduler'
        }
    },

    init: function (grid) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('fwalist'), //Note how we access the correct store
            settings = TS.app.settings,
            isScheduler = vm.get('isScheduler'),
            filtersString = Ext.state.Manager.get('gridFilters'),
            filters,
            sort;
 console.log('Scheduler list load event started at'+new Date().getHours().toString()+':'+new Date().getMinutes().toString()+':'+new Date().getSeconds());
        Ext.applyIf(me, {
            stateId: me.EmpGetStateId()
        });

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), //30 days
        }));

        if (isScheduler) {
            grid = Ext.ComponentQuery.query('grid[itemId=schedulerFwaGrid]')[0];
        } else {
            grid = Ext.ComponentQuery.query('grid[itemId=fwaGrid]')[0];
        }

        if (!isScheduler) {
            store.getProxy().setExtraParams({
                isScheduler: isScheduler,
                isPreparer: settings.schedFwaPreparedByMe
            });
            //add date if not scheduler so user does not see all
            if (!isScheduler) {
                store.getProxy().setExtraParams({
                    startDate: new Date().toDateString()
                });
            }
            //load since we default to autoLoad: false
            store.load();
            //check if grid has saved fwa filters list
            if (filtersString && isScheduler) {
                filters = JSON.parse(Ext.state.Manager.get('gridFilters'));
                Ext.each(filters, function (f) {
                    store.addFilter(new Ext.util.Filter(f));
                });
            } else {
                store.clearFilter()
            }

            if (settings.fwaListSorters) {
                sort = settings.fwaListSorters.split('^');
                store.sort(sort[0], sort[1]);
            }

            grid.getView().refresh();
            me.showFwaGrid();
        }
    },

    EmpGetStateId: function () {
        return STATEID;
    },

    clearStatusFilter: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            store = vw.getStore(),
            filter;

        if (settings.schedFilters.split('^')[12]) {
            filter = new Ext.util.Filter(JSON.parse(settings.schedFilters.split('^')[12]));
            me.clearColumnFilter(1);
            store.removeFilter(filter);
            //set active tab back to FWA
            if (vw.isScheduler) {
                vw.up('panel').up('panel').setActiveItem(2);
            }
        }
    },

    clearColumnFilter: function (col) {
        var fwaList = Ext.first('fwalist'),
            columns = fwaList.columnManager.getColumns(),
            store = fwaList.store,
            column = columns[col],
            filter,
            i,
            len,
            filterCollection;

        filter = column.filter;

        if (filter && filter.isGridFilter) {
            if (!filterCollection) {
                filterCollection = store.getFilters();
                filterCollection.beginUpdate();
            }
            filter.setActive(false);
            store.removeFilter(filter);
        }

        if (filterCollection) {
            filterCollection.endUpdate();
        }
    },

    onBackToFSS: function () {

        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    // Shows a map of all FWAs from scheduler app
    showFwaMap: function () {
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: Ext.first('#schedulerFwaGrid').getStore()
        }).show();
    },
    // itemdblclick ( this=View , record , item , index , e , eOpts )
    onFwaGridDblClick: function (vw, record, item, index, e, eOpts) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            grid = Ext.first('#fwaListGrid');
        vw.deselect(record);
        //TODO send whole record across to save DB calls
        TS.app.settings.fromProjectTree = false;
        settings.selectedFwa = record;
        Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
        Ext.first('#fwaForm').getForm().dirty = false;
        if (vm.get('isScheduler')) {
            Ext.first('#clearButton').setHidden(true);
            Ext.first('#fwaSearchButton').setHidden(true);
            Ext.first('#schedFwaGridToolbar').setHidden(true);

        }
        if (Ext.first('#rowCtField'))
            Ext.first('#rowCtField').setHidden(true);
        if (Ext.first('#schedRowCtField'))
            Ext.first('#schedRowCtField').setHidden(true);

        // if (Ext.first('#toggleWorkButton')) {
        //     Ext.first('#toggleWorkButton').setHidden(vm.get('isScheduler') || !settings.fwaDisplayStartButton);
        // }

        //do again just in case
        var grid = Ext.first('#schedulerFwaGrid') || Ext.first('#fwaGrid');
        grid.setCollapsed(true);

    },

    // Opens an FWA, bound to the row select handler
    //select  this=model , record , index , eOpts
    onFwaGridSelect: function (rowModel, record) {
        TS.app.settings.fromProjectTree = false;
        Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
        // commented out leaves row as highlighted
        // if(this.getView().isScheduler){
        //    rowModel.deselect(record);
        // }
        rowModel.deselect(record);
        //Ext.first('#fwaForm').getForm().dirty = false;
        rowModel.deselectAll();

    },

    // Opens and shows a map marker for an FWA
    showFwaOnMap: function (view, rowIndex, colIndex, item, e, record) {
        Ext.create('TS.view.fwa.FwaMap', {
            fwaRecord: record
        }).show();
    },

    checkDailyTtlHours: function (empHours) {
        var hasHours = false,
            hasComments = false;
        Ext.each(empHours.getRange(), function (hrs) {
            if (hrs.get('regHrs') + hrs.get('ovtHrs') + hrs.get('ovt2Hrs') + hrs.get('travelHrs') > 0) {
                hasHours = true;
            }
            if (hrs.get('comments') != '') {
                hasComments = true;
            }
        });

        return hasHours;
    },

    checkUnitsQuantity: function (units) {
        var hasQty = false;
        Ext.each(units.getRange(), function (u) {
            if (u.get('quantity')) {
                hasQty = true;
            }
        });
        return hasQty;
    },

    deleteFwa: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            vm = me.getViewModel(),
            status = record.get('fwaStatusId'),
            settings = TS.app.settings,
            message = '',
            hours,
            units,
            ttlHours = 0;

        //check rights
        if (settings.schedReadOnly && vm.get('isScheduler')) {
            return;
        }

        /*
         * Are you sure you want to delete [FWA Number] [FWA Name]? The information for this [FWA label] will be deleted and cannot be recovered.
         * */
        hours = record.get('hours');
        units = record.get('units');

        //useless check since the units when in grid is always empty
        // if (me.checkDailyTtlHours(hours) || me.checkUnitsQuantity(units)) {
        //     Ext.Msg.alert('ILLEGAL', 'A ' + settings.fwaAbbrevLabel + ' with Employee Hours(hours/comments) or ' + settings.unitLabelPlural + ' entered cannot be deleted. ');
        //     return false;
        // }

        switch (status) {
            case 'A' :
                Ext.Msg.alert('ILLEGAL', 'Approved ' + settings.fwaAbbrevLabel + 's cannot be deleted. ');
                return false;
            case 'S':
                Ext.Msg.alert('ILLEGAL', 'Submitted ' + settings.fwaAbbrevLabel + 's cannot be deleted. ');
                return false;
            case 'D' :
            case 'I' :
            case 'V' :
            case 'C':
            default:
                message += 'Are you sure you want to delete ' + record.get('fwaNum') + ' ' + record.get('fwaName') + '? The information for this ' + settings.fwaAbbrevLabel + '  will be deleted and cannot be recovered.';
                break;
        }

        Ext.Msg.confirm('WARNING', message, function (btn) {
            if (btn === 'yes') {
                Fwa.Delete(null, settings.username, record.get('fwaId'), function (response, operation, success) {
                    if (response && response.success) {
                        //Ext.GlobalEvents.fireEvent('UpdateFwaGrid', record, true);
                        me.updateFwaGrid(record, true);
                        //Ext.GlobalEvents.fireEvent('ReloadSchedulerFromFwa', record, true); //new one to replace below
                        Ext.GlobalEvents.fireEvent('updateSchedulerStores');
                        Ext.GlobalEvents.fireEvent('ResetCrewAssign', record, true);
                    } else if (response) {
                        Ext.GlobalEvents.fireEvent('Error', response);
                    }
                }.bind(me));
            }
        });
    },

    updateFwaGridFromScheduler: function (fwa, isDelete) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('fwalist'),
            filters = store.getFilters(),
            filterItems = [],
            sorters = store.getSorters(),
            isScheduler = vm.get('isScheduler'),
            settings = TS.app.settings,
            grid;
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), //30 days
        }));

        if (isScheduler) {
            grid = Ext.ComponentQuery.query('grid[itemId=schedulerFwaGrid]')[0];
        } else {
            grid = Ext.ComponentQuery.query('grid[itemId=fwaGrid]')[0];
        }

        store.getProxy().setExtraParams({
            startDate: new Date().toDateString(),
            isPreparer: settings.schedFwaPreparedByMe,
            isScheduler: true
        });

        if (filters.length != 0) {
            Ext.each(filters.items, function (fil) {
                filterItems.push(fil);
            });
            store.clearFilter(true);
        }

        store.load({
            scope: this,
            callback: function (records, operation, success) {
                if (filterItems) { //isScheduler && settings.schedFilters.split('^')[12]
                    Ext.each(filterItems, function (filter) {
                        store.addFilter(filter);
                    });
                }
                // if (success)
                //     Ext.GlobalEvents.fireEvent('ClearFwaListFilters');
            }
        });
        store.commitChanges();
        store.sort([
            {property: 'schedStartDate', direction: 'ASC'},
            {property: 'fwaName', direction: 'ASC'}
        ]);

        if (settings.fwaListSorters) {
            var sort = settings.fwaListSorters.split('^');
            store.sort(sort[0], sort[1]);
        }

        grid.stateId = me.EmpGetStateId();
        grid.getView().refresh();
        me.showFwaGrid();
    },

    showFwaGrid: function () {
        var form = Ext.first('form-fwa'),
            grid = Ext.first('fwalist');
        if (form)
            form.setHidden(true);
        if (grid) {
            grid.expand();
            grid.show();
        }
        // setTimeout(function () {
        //     //Ext.GlobalEvents.fireEvent('ClearFwaListFilters');
        // }, 3000)
    },

    updateFwaGrid: function (fwa, isDelete) {
        var me = this,
            settings = TS.app.settings,
            store = me.getView().getStore(),
            filters = store.getFilters(),
            vm = me.getViewModel(),
            isScheduler = me.getViewModel().get('isScheduler');

        store.getProxy().setExtraParams({
            isScheduler: isScheduler,
            isPreparer: settings.schedFwaPreparedByMe,
            timeZoneOffset: new Date().getTimezoneOffset(),
            startDate: new Date().toDateString()
        });

        store.load();
    },

    onShowUnscheduledFwaMap: function () {
        var myStore = this.getView().getStore();
        // If no FWAs on screen, return
        if (myStore.data.getCount() == 0) return;
        // Display map list
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: myStore,
            bind: {
                title: '{settings.fwaAbbrevLabel} Location(s) for unscheduled work.'
            }
        }).show();
    },

    printAll: function () {
        var store = this.getView().getStore(),
            idList = Ext.create('Ext.data.Store', {model: 'TS.model.shared.IdList'}),
            roles = Ext.getStore('Roles'),
            settings = TS.app.settings,
            view = this.getView();
        store.each(function (currentRecord) {
            idList.add({
                id: currentRecord.get('fwaId')
            });
        });

        var win = Ext.create('TS.common.window.Print', {
            modelId: idList,
            appType: 'FWA',
            title: settings.fwaAbbrevLabel + ' List',
            empId: settings.empId,
            isList: true
        });

        win.show();

    },

    // onClearFilters: function () {
    //     console.log(1);
    //     var me = this,
    //         vm = me.getViewModel(),
    //         settings = TS.app.settings,
    //         vw = me.getView(),
    //         store = vw.getStore();
    //
    //     store.remoteFilter = false;
    //     store.clearFilter(true);
    //     store.remoteFilter = true;
    //     store.filter();
    //     //set active tab back to FWA
    //     // if (vw.isScheduler) {
    //     //     vw.up('panel').up('panel').setActiveItem(2);
    //     // }
    // },

    priorityChange: function (obj, newValue, oldValue) {
        var selectedRow = obj.up('grid').getSelection()[0],
            fwaId = selectedRow.get('fwaId'),
            settings = TS.app.settings;

        Fwa.SaveFwaPriority(null, settings.username, fwaId, newValue, function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });
    },

    onViewReady: function (obj) {

    },

    makeAvailable: function (obj, rowIndex, checked, record) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            text = !checked ? 'un-available' : 'available';
        //check rights
        if (settings.schedReadOnly && vm.get('isScheduler')) {
            record.set('availableForUseInField', !checked);
            return;
        }

        Ext.Msg.confirm("Please Confirm", 'Make ' + settings.fwaAbbrevLabel + ' ' + record.get('fwaNum') + ' ' + record.get('fwaName') + ' ' + text + ' for use in field?', function (btn) {
            if (btn == 'yes') {
                Fwa.MakeAvailable(null, settings.username, settings.empId, record.get('fwaId'), checked, vm.get('isScheduler'), function (response) {
                    if (response && !response.success) {
                        Ext.GlobalEvents.fireEvent('Error', response);
                    } else {
                        //reload scheduler gantt
                        Ext.GlobalEvents.fireEvent('ReloadEventStoreOnly', response); //updateSchedulerStores
                    }
                }, this, {
                    autoHandle: true
                });
            } else {
                record.set('availableForUseInField', !checked);
                return false;
            }
        });

    },

    statusChange: function (view, rowIndex, colIndex, item, e, record) {

        var me = this,

            vm = me.getViewModel(),

            status = record.get('fwaStatusId'),
            settings = TS.app.settings,
            extraMessage,
            lastRecurrDate;

        if (settings.schedReadOnly && vm.get('isScheduler')) {
            return;
        }
        if (record.get('recurrencePattern')) {
            extraMessage = ' for all days up to the previous submitted date of  ' + Ext.Date.format(new Date(record.get('lastSubmittedDate')), 'Y-m-d') + '?';
        } else {
            extraMessage = ' on ' + Ext.Date.format(new Date(record.get('lastSubmittedDate')), 'Y-m-d') + '?';
        }
        Ext.Msg.confirm("Please Confirm", 'Are you sure you want to approve ' + settings.fwaAbbrevLabel + ' ' + record.get('fwaNum') + ' ' + record.get('fwaName') + extraMessage, function (btn) {
            if (btn == 'yes') {
                me.setStatus(record, FwaStatus.Approved, false)
            } else {
                return false;
            }
        });
    },

    resetFwaToSaved: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            vm = me.getViewModel(),
            status = record.get('fwaStatusId'),
            settings = TS.app.settings,
            extraMessage,
            lastRecurrDate;

        if (settings.schedReadOnly && vm.get('isScheduler')) {
            return;
        }
        if (record.get('recurrencePattern')) {
            extraMessage = ' for all days up to the previous submitted date of  ' + Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) + ' back to Saved?';
        } else {
            extraMessage = ' on ' + Ext.Date.format(new Date(record.get('nextDate')), DATE_FORMAT) + ' back to Saved?';
        }
        Ext.Msg.confirm("Please Confirm", 'Are you sure you want to reset ' + settings.fwaAbbrevLabel + ' ' + record.get('fwaNum') + ' ' + record.get('fwaName') + extraMessage, function (btn) {
            if (btn == 'yes') {
                if (settings.fwaUnapproveAllowResetTimesheet) {
                    Ext.Msg.confirm("Please Confirm", 'Do you want to reset time sheets for ' + settings.fwaAbbrevLabel + ' ' + record.get('fwaNum') + ' ' + record.get('fwaName') + ' also?', function (btn) {
                        if (btn == 'yes') {
                            me.setStatus(record, FwaStatus.Saved, true);
                        } else {
                            me.setStatus(record, FwaStatus.Saved, false);
                        }
                    });
                } else {
                    me.setStatus(record, FwaStatus.Saved, false);
                }
            } else {
                return false;
            }
        });
    },

    setStatus: function (record, newStatus, tsFlag) {
        var me = this,
            vm = me.getViewModel(),
            //status = record.get('fwaStatusId'),
            settings = TS.app.settings;

        Fwa.ResetFwaStatus(null, settings.username, settings.empId, record.get('fwaId'), newStatus, tsFlag, vm.get('isScheduler'), function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            } else {
                //reload grid
                me.updateFwaGrid(record);
                Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                //reload events
                Ext.GlobalEvents.fireEvent('ReloadEventStoreOnly');
            }
        }, this, {
            autoHandle: true
        });
    },

    setApprovalStatus: function (view, rowIndex, colIndex, item, e, record) {//(record, newStatus, tsFlag) {
        var me = this,
            vm = me.getViewModel(),
            status = record.get('fwaStatusId'),
            settings = TS.app.settings;

        Fwa.Approve(null, settings.username, settings.empId, record.get('fwaId'), vm.get('isScheduler'), function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            } else {
                Ext.Msg.alert('Approved', settings.fwaAbbrevLabel + ' Approved');
                //reload grid
                settings.crewAssignNeedsRefresh = true;
                // //reload events
                Ext.GlobalEvents.fireEvent('ReloadEventStoreOnly');
                Ext.first('fwalist').getStore().reload();
                record.set('lastApprovedDate', Ext.Date.format(new Date(), DATE_FORMAT));
                record.set('fwaStatusId', FwaStatus.Approved);
            }
        }, this, {
            autoHandle: true
        });
    },

    setRemoveStatus: function (record) {
        var me = this,
            vm = me.getViewModel(),
            status = record.get('fwaStatusId'),
            settings = TS.app.settings;

        Fwa.RemoveFwaStatus(null, settings.username, settings.empId, record.get('fwaId'), function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            } else {
                //reload grid
                me.updateFwaGrid(record);
                Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                //reload events
                Ext.GlobalEvents.fireEvent('ReloadEventStoreOnly');
            }
        }, this, {
            autoHandle: true
        });
    },

    setApproveStatus: function (record) {
        var me = this,
            vm = me.getViewModel(),
            status = record.get('fwaStatusId'),
            settings = TS.app.settings;

        Fwa.Approve(null, settings.username, settings.empId, record.get('fwaId'), vm.get('isScheduler'), function (response) {
            // Fwa.ApproveFwaStatus(null, settings.username, settings.empId, record.get('fwaId'), function (response) {
            if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            } else {
                //reload grid
                me.updateFwaGrid(record);
                Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                //reload events
                Ext.GlobalEvents.fireEvent('ReloadEventStoreOnly');
            }
        }, this, {
            autoHandle: true
        });
    },


    udfChange: function (obj, event, eOpts) {
        if (obj && obj.up('grid')) {
            var dataIndex = obj.dataIndex,
                selectedRow = obj.up('grid').getSelection()[0],
                vm = this.getViewModel(),
                fwaId = selectedRow.get('fwaId'),
                settings = TS.app.settings;
            //check rights
            if (settings.schedReadOnly && vm.get('isScheduler')) {
                obj.setValue(obj.originalValue);
                return;
            }

            if (obj.dirty) {
                Fwa.SaveFwaUdf(null, settings.username, fwaId, obj.dataIndex, obj.getValue(), function (response) {
                    if (response && !response.success) {
                        Ext.GlobalEvents.fireEvent('Error', response);
                    }
                }, this, {
                    autoHandle: true
                });
            }
        }
    },

    prePostFwaActions: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            recordId = record.get('fwaId'),
            settings = TS.app.settings,
            grid,
            actionWindow,
            store;

        if (me.actionWindow) {
            me.actionWindow.close();
        }
        actionWindow = Ext.create('TS.view.fwa.FwaActions', {
            isGrid: true,
            fwaRecord: record,
            fwaId: recordId
        });
        grid = Ext.first('grid-fwaactions');
        store = grid.getStore();

        actionWindow.setTitle(settings.fwaAbbrevLabel + ' Actions for ' + record.get('fwaNum'));

        Ext.each(record.get('nonFieldActions').getRange(), function (action) {
            action.set('tempDateCompleted', action.get('actionDateCompleted'));
            action.set('tempOwnerId', action.get('actionOwnerId'));
            action.set('tempNew', false);
            store.add(action);
        });
        store.sort([
            {property: 'actionType', direction: 'DESC'}
        ]);

        actionWindow.show();
    },

    showFwaHistory: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            recordId = record.get('fwaId'),
            settings = TS.app.settings,
            url = window.location,
            origin = url.origin,
            pathname = url.pathname,
            search = url.search,
            dbi = search.split('&')[1],
            w = window,
            d = document,
            e = d.documentElement,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight,
            winFeature = 'location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes, width=' + (x * .90) + ',height=' + (y * .90);

        window.open(origin + pathname + '?app=History&' + dbi + '&username=' + settings.username + '&fwaId=' + recordId, null, winFeature);
    },

    onFilterChange: function (store, filters, eOpts) {
        var settings = TS.app.settings;
        settings.fwaListFilters = filters;
        settings.fwaListStore = store;
    },

    onSortChange: function (ct, column, direction, eOpts) {
        var settings = TS.app.settings,
            me = this,
            vm = me.getViewModel(),
            store = vm.getStore('fwalist');

        if (store.getSorters().length > 0) {
            settings.fwaListSorters = store.getSorters().items[0].getProperty() + '^' + store.getSorters().items[0].getDirection();
        }
    },

    showSearchListWindow: function () {
        var me = this,
            wcStore = Ext.getStore('WorkCodes');

        if (me.searchWindow) {
            me.searchWindow.close();
        }

        me.searchWindow = Ext.create('TS.view.fwa.SearchFwaList', {
            modal: true
        });
        wcStore.clearFilter(true);
        Ext.first('#searchWorkCodeGrid').setStore(wcStore);
        me.searchWindow.show();
    },

    onClearFilters: function () {
        var me = Ext.first('fwalist'),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            store = me.getStore();

        store.remoteFilter = false;
        store.clearFilter();

        var allRecords = [];

        Ext.each(store.getData().items, function (rec) {
            allRecords.push(rec.get('fwaId'));
        });

        store.filterBy(function (rec) {
            if (rec.get('recurrenceConfig') && rec.get('recurrCt') > 1) {
                return false;
            } else {
                return true;
            }
        });
    },

    // clearFwaListFilter: function () {
    //     var me = this,
    //         vw = me.getView(),
    //         store = Ext.first('fwalist').getStore();
    //     store.clearFilter(true);
    //
    // },

    // onClearFilters: function () {
    //     console.log(2);
    //     var me = Ext.first('fwalist'),
    //         vm = me.getViewModel(),
    //         settings = TS.app.settings,
    //         vw = me.getView(),
    //         store = me.getStore();
    //
    //     store.remoteFilter = false;
    //     store.clearFilter();
    //
    //     var allRecords = [];
    //     //debugger;
    //     Ext.each(store.getData().items, function (rec) {
    //         allRecords.push(rec.get('fwaId'));
    //     });
    //
    //     store.filterBy(function (rec) {
    //         if (allRecords.includes(rec.get('fwaId'))) {
    //             if (rec.get('recurrCt') === 1 || rec.get('recurrCt') === 0) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         } else {
    //             return false;
    //         }
    //     });
    //
    //     if (vm.get('isScheduler')) {
    //         Ext.first('#btnViewLastWeek').setHidden(true);
    //         Ext.first('#btnViewNextWeek').setHidden(true);
    //         Ext.first('#labelFwaCurrentDate').setHidden(true);
    //         Ext.first('#btnWeekView').setText('Week View');
    //     }
    //
    // },
    showAttachDocWindow: function (view, rowIndex, colIndex, item, e, record) {

        var me = this,
            settings = TS.app.settings,
            windowAttachment,
            id = record.get('fwaId');

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            modal: true,
            associatedRecordId: id,
            fwaListRecord: record,
            attachmentsList: {
                isFromFwaList: true,
                modelType: 'FWA',
                modelId: id,
                attachmentType: AttachmentType.Document
            },
            //autoShow: true
        });

        if (record.get('fwaStatusId') == FwaStatus.Approved) {
            Ext.first('#cancelAttachment').click();
            var bob = Ext.Msg.show({
                title: 'FYI',
                message: 'Approved ' + settings.fwaAbbrevLabel + 's cannot have attachments added.',
                buttons: Ext.MessageBox.OK
            });
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else {
            me.windowAttachment.show();
        }
    },

});
