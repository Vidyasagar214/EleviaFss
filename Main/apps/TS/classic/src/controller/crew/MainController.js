Ext.define('TS.controller.crew.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.viewport-crew',

    routes: {
        '': 'showScheduler',
        'fwalist': 'showFwaList',
        'crew': 'showCrews',
        'scheduler': 'showScheduler',
        'newfwa': 'startNewFwa',
        'fwa/:id': 'showFwa',
        'copyfwa/:id': 'copyFwa',
        'grid': 'showFwaGrid'

    },

    listen: {
        global: {
            'ResetFormAfterDelete': 'onResetFormAfterDelete',
            'StartNewFwa': 'startNewFwa',
            'ShowSelectedFwa': 'showFwa',
            'ShowFwaGrid': 'showFwaGrid',
            'CopyFwa': 'copyFwa',
            'ResetFwaList': 'refreshFwaPanel',
            'ClearFwaListFilters': 'onClearFilters'
        }
    },

    init: function () {
        var me = this,
            settings = TS.app.settings,
            crewAssignGrid = Ext.first('crewassigngrid'),
            crewAssignStore = crewAssignGrid.getStore(),
            hasFwa = Ext.first('#fwaForm'),
            crewAssignRecords = crewAssignStore.getRange(),
            tabPanel;
        //first time in
        me.getView().setLoading(true);
        //default to Scheduler tab on load
        //Ext.GlobalEvents.fireEvent('Route:Silent', 'scheduler');
        //override tab height & width for uniformity
        me.lookup('crewTabPanel').setActiveItem(0);//settings.activeSchedTab);
        tabPanel = me.lookup('crewTabPanel').items;
        Ext.each(tabPanel.items, function (panel) {
            panel.tab.setWidth(160);
            panel.tab.setHeight(50);
        });

        me.getView().setLoading(false);
        //this.callParent(arguments);
        if (hasFwa)//set as dirty false
        {
            Ext.first('#fwaForm').getForm().getRecord().dirty = false;
            var fwa = hasFwa.getForm(),
                items = fwa.getFields().items;

            Ext.each(items, function (i) {
                i.dirty = false;
            });

            Ext.first('form-fwa').setHidden(true);
            Ext.first('fwalist').setHidden(false);
        }
        Ext.each(crewAssignRecords, function (rec) {
            rec.set('changesMade', false);
        });

        me.setSchedulerDateFormat();
        PREPARED_BY_ME = settings.isPreparedByMe;
    },

    setSchedulerDateFormat: function () {
        //hourAndDay
        Sch.preset.Manager.items[2].headerConfig.top.dateFormat = HOUR_DAY_TOP;
        Sch.preset.Manager.items[2].headerConfig.middle.dateFormat = HOUR_DAY_MIDDLE;
        //weekAndDay
        Sch.preset.Manager.items[4].headerConfig.bottom.dateFormat = WEEK_DAY_BOTTOM;
        Sch.preset.Manager.items[4].headerConfig.middle.dateFormat = WEEK_DAY_MIDDLE;
    },

    onBackToFSS: function () {
        //check for dirty
        var me = this,
            hasFwa = Ext.first('#fwaForm'),
            activeTab = me.lookup('crewTabPanel').getActiveTab(),
            fwaList = Ext.first('fwalist').getView().grid,
            fwa,
            form,
            items;

        if (hasFwa && activeTab.referenceKey == 'tabFwaPanel' && activeTab.layoutCounter != 2) {
            fwa = hasFwa.getForm();
            form = me.lookup('fwaForm');
            items = fwa.getFields().items;

            Ext.each(items, function (i) {
                if (i.value && i.value != '' && i.dirty && i.originalValue && i.originalValue != i.value) {
                    fwa.dirty = true;
                }
            });

            if (fwa.dirty || form.getRecord().dirty) {
                Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                    if (btn == 'yes') {
                        fwa.dirty = false;
                        form.getRecord().dirty = false;
                        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
                        //fwaList.filters.clearFilters();
                    } else {
                        form.expand();
                    }
                });
            } else {
                fwaList.filters.clearFilters();
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
            }
        } else {
            fwaList.filters.clearFilters();
            Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
        }

    },

    //For deep linking
    handleSubRoute: function () {
        var param = arguments[1];

        //Let the interested parties know that we are done with Routing
        this.fireEvent('routingComplete', param);
    },

    /*
     * TabPanel Routing
     */
    showScheduler: function () { //this.lookup('tabSchedulerPanel')
        this.lookup('crewTabPanel').setActiveTab('tabSchedulerPanel');
    },

    showFwaList: function () { //this.lookup('tabFwaPanel')
        this.lookup('crewTabPanel').setActiveTab('tabFwaPanel');
        Ext.first('#refreshFwaListBtn').show();
    },

    startNewFwa: function () {
        var me = this,
            fwa = Ext.first('#fwaForm').getForm(),
            form = me.lookup('fwaForm');
        me.getViewModel().set('parentPage', me.lookup('crewTabPanel').activeTab.referenceKey);
        me.lookup('crewTabPanel').setActiveTab('tabFwaPanel');
        form.show().expand();
        setTimeout(function () {
            form.getController().readyInitialRecord(false);
            Ext.first('#showFwaMapButton').hide();
            Ext.first('#printAllButton').hide();
            Ext.first('#newFwaButton').setHidden(true);
            Ext.first('#refreshFwaListBtn').hide();
            Ext.first('#fwaGridButton').show();
            Ext.first('#fwaGridButtonNew').hide();

            Ext.first('#fwaSearchButton').setHidden(true);
            Ext.first('#clearButton').setHidden(true);
            Ext.first('#schedFwaGridToolbar').setHidden(true);

            fwa.dirty = true;
            if (Ext.first('#schedRowCtField'))
                Ext.first('#schedRowCtField').setHidden(true);
            me.resetUDF_Fields();
        }, 500);

    },

    resetUDF_Fields: function () {
        //text fields
        for (i = 1; i <= 10; i++) {
            Ext.first('#udf_t' + i + '_text').setValue('');
            Ext.first('#udf_t' + i + '_combo').setValue('');
        }
        //address fields
        for (i = 1; i <= 6; i++) {
            Ext.first('#udf_a' + i + '_text').setValue('');
            Ext.first('#udf_a' + i + '_combo').setValue('');
        }
        //date fields
        for (i = 1; i <= 3; i++) {
            Ext.first('#udf_d' + i + '_field').setValue('');
        }
    },

    showFwaGrid: function () {
        var me = this,
            fwa = Ext.first('#fwaForm').getForm(),
            form = me.lookup('fwaForm'),
            grid = Ext.first('fwalist');
        me.lookup('crewTabPanel').getLayout().setActiveItem(2);
        form.collapse();

        if (grid) {
            grid.setCollapsed(false);
            grid.show();
        }
        Ext.first('#fwaGridButton').hide();
        Ext.first('#fwaGridButtonNew').hide();
        Ext.first('#showFwaMapButton').show();
        Ext.first('#printAllButton').show();
        Ext.first('#newFwaButton').show();
    },
    // Shows & loads an FWA
    showFwa: function (id, fwaDate) {
        var me = this,
            form = me.lookup('fwaForm'),
            grid = me.lookup('schedulerFwaGrid'),
            settings = TS.app.settings,
            vm = me.getViewModel();

        vm.set('parentPage', me.lookup('crewTabPanel').activeTab.referenceKey);
        me.lookup('crewTabPanel').setActiveTab('tabFwaPanel');
        //form.show().expand();
        //add timeout to slow down, so has time to find controller & method
        setTimeout(function () {
            if (form && form.getController()) {
                form.getController().loadRemoteFwa(id, fwaDate);
            } else {
                Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
            }

            Ext.first('#showFwaMapButton').hide();
            Ext.first('#printAllButton').hide();
            if (vm.get('isScheduler') && settings.schedReadOnly)
                Ext.first('#newFwaButton').hide();
            else
                Ext.first('#newFwaButton').show();

            Ext.first('#fwaGridButton').setHidden(false);
            Ext.first('fwalist').setHidden(false);
            Ext.first('#fwaSearchButton').setHidden(true);
            Ext.first('#clearButton').setHidden(true);
            Ext.first('#schedFwaGridToolbar').setHidden(true);
        }, 250);
    },

    onResetFormAfterDelete: function () {
        var me = this,
            form = me.lookup('fwaForm');
        form.collapse();
        form.getController().readyInitialRecord(false);
        Ext.first('#showFwaMapButton').hide();
        Ext.first('#printAllButton').hide();
        Ext.first('#newFwaButton').hide();
        Ext.first('#fwaGridButton').hide();
        Ext.first('#fwaGridButtonNew').hide();
    },

    backToGrid: function () {
        Ext.first('#fwaGridButton').focus();
        //check for dirty
        var me = this,
            settings = TS.app.settings,
            fwa = Ext.first('#fwaForm').getForm(),
            form = me.lookup('fwaForm'),
            grid = me.lookup('schedulerFwaGrid'),
            items = fwa.getFields().items;

        Ext.each(items, function (i) {
            if (i.dirty && (i.originalValue && i.originalValue != i.value)) { // && i.originalValue
                fwa.dirty = true;
            }
        });

        if (fwa.dirty || form.getRecord().dirty || settings.fwaIsDirty) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    fwa.dirty = false;
                    form.getRecord().dirty = false;
                    Ext.GlobalEvents.fireEvent('ResetFormAfterDelete');
                    Ext.each(items, function (i) {
                        i.dirty = false;
                        i.originalValue == i.value;
                    });
                    // Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
                    Ext.first('form-fwa').collapse();
                    Ext.first('fwalist').expand();
                    Ext.first('#showFwaMapButton').show();
                    Ext.first('#printAllButton').show();
                    Ext.first('#newFwaButton').show();
                    Ext.first('#fwaGridButtonNew').hide();
                    Ext.first('#fwaGridButton').hide();
                    Ext.first('#clearButton').setHidden(false);
                    Ext.first('#fwaSearchButton').setHidden(false);
                    Ext.first('#schedFwaGridToolbar').setHidden(false);
                    me.showFwaCt();
                    grid.show();
                    //me.onClearFilters();
                    settings.fwaIsDirty = false;
                } else {
                    form.expand();
                }
            });
        } else {
            // Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
            // TS.app.redirectTo('grid');
            Ext.GlobalEvents.fireEvent('ResetFormAfterDelete');
            Ext.first('form-fwa').collapse();
            Ext.first('fwalist').expand();
            Ext.first('#showFwaMapButton').show();
            Ext.first('#printAllButton').show();
            Ext.first('#clearButton').setHidden(false);
            Ext.first('#fwaSearchButton').setHidden(false);
            Ext.first('#schedFwaGridToolbar').setHidden(false);

            Ext.first('#newFwaButton').show();
            me.showFwaCt();
            grid.show();
            //me.onClearFilters();
        }
        Ext.first('#refreshFwaListBtn').show();
    },

    showFwaCt: function () {
        Ext.first('#schedRowCtField').setHidden(false);
    },

    showCrews: function () {
        this.lookup('crewTabPanel').setActiveTab(this.lookup('tabCrewPanel'));
    },

    beforeCrewTabpanelChange: function (tabPanel, newCard, oldCard) {
        var me = this,
            settings = TS.app.settings,
            crewAssignTab = me.lookup('tabCrewAssignPanel'),
            crewAssignGrid = Ext.first('crewassigngrid'),
            crewAssignStore = crewAssignGrid.getStore(),
            crewAssignRecords = crewAssignStore.getRange(),
            fwaTab = me.lookup('tabFwaPanel'),
            fwa = Ext.first('form-fwa') ? Ext.first('form-fwa').getForm() : null,
            crewAssignChanges = false,
            form = me.lookup('fwaForm'),
            grid,
            store,
            eventStore,
            resourceStore;
        //reset on way in

        if (Ext.first('#newFwaButton')) {
            if (me.getViewModel().get('newFwa'))
                Ext.first('#newFwaButton').setHidden(true);
        }
        Ext.first('#clearButton').setHidden(false);
        Ext.first('#fwaSearchButton').setHidden(false);
        Ext.first('#schedFwaGridToolbar').setHidden(false);

        if (oldCard == fwaTab && fwa && form && (settings.fwaIsDirty || fwa.dirty || settings.crewChange || form.getRecord().dirty)) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    fwa.dirty = false;
                    settings.fwaIsDirty = false;
                    settings.crewChange = false;
                    me.onCrewTabpanelChange(tabPanel, newCard);
                    Ext.first('#fwaGridButton').hide();
                    Ext.first('#fwaGridButtonNew').hide();
                } else {
                    tabPanel.getLayout().setActiveItem('tabFwaPanel');
                    form.show().expand();
                    Ext.first('#showFwaMapButton').hide();
                    Ext.first('#printAllButton').hide();
                    Ext.first('#schedFwaGridToolbar').setHidden(true);

                    Ext.first('#fwaGridButton').show();
                    if (settings.schedReadOnly || me.getViewModel().get('newFwa'))
                        Ext.first('#newFwaButton').hide();
                    else
                        Ext.first('#newFwaButton').show();
                    Ext.first('#fwaGridButtonNew').hide();
                }
            });
        } else if (oldCard == crewAssignTab) {
            Ext.each(crewAssignRecords, function (rec) {
                if (rec.get('changesMade')) {
                    crewAssignChanges = true;
                }
            });
            if (crewAssignChanges) {
                Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                    if (btn == 'yes') {
                        me.onCrewTabpanelChange(tabPanel, newCard, oldCard);
                        Ext.first('crewassigngrid').getStore().reload();
                        Ext.first('grid-employeeassign').getStore().reload();
                    } else {
                        tabPanel.getLayout().setActiveItem('tabCrewAssignPanel');
                    }
                });

            } else {
                me.onCrewTabpanelChange(tabPanel, newCard, oldCard);
            }
        } else {
            me.onCrewTabpanelChange(tabPanel, newCard, oldCard);
            Ext.first('#fwaGridButton').hide();
            Ext.first('#fwaGridButtonNew').hide();
            if (Ext.first('form-fwa')) {
                Ext.first('form-fwa').collapse();
            }
            if (Ext.first('fwalist')) {
                Ext.first('fwalist').expand();
                Ext.first('fwalist').show();
            }

        }
    },

    // Fires silent routes to maintain back history
    onCrewTabpanelChange: function (tabPanel, newCard, oldCard) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            fwaTab = Ext.first('#tabFwaPanel'),
            form = me.lookup('fwaForm'),
            grid = Ext.first('#schedulerFwaGrid');

        if (Ext.first('#showFwaMapButton')) Ext.first('#showFwaMapButton').show();
        if (Ext.first('#printAllButton')) Ext.first('#printAllButton').show();
        if (vm.get('isScheduler') && settings.schedReadOnly) {
            if (Ext.first('#newFwaButton')) {
                Ext.first('#newFwaButton').hide();
            }
        } else if (Ext.first('#newFwaButton') && !vm.get('newFwa')) {
            Ext.first('#newFwaButton').show();
        }

        if (oldCard == me.lookup('tabFwaPanel')) {
            //Ext.GlobalEvents.fireEvent('ResetFormAfterDelete');
        }
        // if (Ext.first('#newFwaButton')) Ext.first('#newFwaButton').show();
        if (newCard == me.lookup('tabCrewPanel')) {
            Ext.first('#ShowInactiveButton').click();
            Ext.first('#ShowInactiveButton').click();
        } else if (newCard == me.lookup('tabSchedulerPanel')) {
            if (!settings.schedulerLoaded) {
                settings.schedulerLoaded = true;
                setTimeout(function () {
                    Ext.GlobalEvents.fireEvent('ScrollToDateOnLoad');
                }, 1500);
            }
        } else if (newCard == me.lookup('tabCrewAssignPanel')) {
            // if (!settings.crewAssignLoaded) {
            //     settings.crewAssignLoaded = true;
            //     Ext.GlobalEvents.fireEvent('ResetCrewAssign');
            // }
        } else if (newCard == me.lookup('tabFwaPanel')) {
            //Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler');
            Ext.first('#newFwaButton').show();
            Ext.first('#schedRowCtField').setHidden(false);
            // if(form) {
            //     form.collapse();
            //     grid.show();
            // }
        } else if (newCard == me.lookup('tabCrewTaskPanel')) {
            // if (!settings.crewTaskLoaded) {
            //     settings.crewTaskLoaded = true;
            //     //Ext.GlobalEvents.fireEvent('ResetCrewTask');
            // }
            //Ext.GlobalEvents.fireEvent('ResetCrewTask');
        } else if (newCard == me.lookup('tabEmployeeViewGanttPanel')) {
            // if (!settings.empScheduleGantt) {
            //     settings.empScheduleGantt = true;
            //     Ext.GlobalEvents.fireEvent('ResetEmployeeGanttAfterFwaSave');
            // }
        }
    },
    /*
     When a fwa is edited and saved in the fwa detail form (fwa store) then update the record in the
     planned or unplanned fwa store
     */
    updateFWA: function (store, record, operation, modifiedFieldNames, details, eOpts) {

        switch (operation) {

            case 'commit' :

                var target = Ext.getStore('plannedfwas').getById(record.getId()) || Ext.getStore('unplannedfwas').getById(record.getId());
                this.syncFWA(record, target);
                break;
        }
    },

    /*
     When a fwa is unscheduled, removed from the scheduler, update the (all) fwa store
     */

    removePlannedFWA: function (store, records, index, isMove, eOpts) {
        var target = Ext.getStore('fwas').getById(records[0].getId());
        this.syncFWA(records[0], target);
    },

    /*
     When a fwa is rescheduled in the scheduler, update the fwa record in the fwa store after commit
     */
    updatePlannedFWA: function (store, record, operation, modifiedFieldNames, details, eOpts) {

        switch (operation) {

            case 'commit' :
                var target = Ext.getStore('fwas').getById(record.getId());
                this.syncFWA(record, target);
                break;
        }
    },

    copyFwa: function (id) {
        var me = this,
            settings = TS.app.settings;
        Fwa.Copy(null, settings.username, id, function (response, operation) {
            var record = Ext.create('TS.model.fwa.Fwa', response.data);
            record.set('fwaId', record.id);
            record.set('fwaNum', '');
            me.lookup('fwaForm').show().expand();
            me.lookup('fwaForm').getController().loadFwaRecord(record, true);
            me.getViewModel().set('newFwa', true);
            settings.fwaIsDirty = true;
            //enable form fields
            Ext.GlobalEvents.fireEvent('enableForm');
        }, me, {
            autoHandle: true
        });
    },

    /*
     Copy data from the source record to the target record.
     Loc and WorkScheduled is not copied.
     */
    syncFWA: function (source, target) {

        if (source && target) {

            target.beginEdit();
            var data = source.getData();
            delete data.Loc;
            delete data.WorkScheduled;
            target.set(data);
            target.endEdit();
            target.commit(true);

        }
    },

    // Shows a map of all scheduled FWAs
    showFwaMap: function () {
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: this.lookup('schedulerFwaGrid').getStore()
        }).show();
    },

    printAll: function () {
        var store = this.lookup('schedulerFwaGrid').getStore(),
            idList = Ext.create('Ext.data.Store', {model: 'TS.model.shared.IdList'}),
            idArray = [],
            fwaNumArray = [],
            dateArray = [],
            settings = TS.app.settings,
            view = this.getView();
        store.each(function (currentRecord) {
            idArray.push(currentRecord.get('fwaId'));
            fwaNumArray.push(currentRecord.get('fwaNum'));
            if (currentRecord.get('schedStartDate') > new Date('Mon Jan 01 0001 00:00:00'))
                dateArray.push(currentRecord.get('schedStartDate'));
        });

        var win = Ext.create('TS.common.window.Print', {
            modelId: idList,
            appType: 'FWA',
            title: settings.fwaAbbrevLabel + ' List',
            empId: settings.empId,
            isList: true,
            idArray: idArray,
            fwaNumArray: fwaNumArray,
            dateArray: dateArray
        });
        win.show();
    },

    searchFwa: function () {
        var me = this,
            vw = me.getView(),
            fwaId = me.getViewModel().get('selectFwaId'),
            clientId = me.getViewModel().get('selectClientId'),
            searchForm = Ext.first('#searchWorkCodeGrid'),
            resultList = Ext.first('#fwaResultList'),
            searchParameters = '',
            wcString = '',
            wcSelections = searchForm.getSelection(),
            store = resultList.getStore();

        vw.setLoading(true);
        Ext.each(wcSelections, function (wc) {
            wcString += wc.get('workCodeAbbrev') + ',';
        });
        //get clientId
        searchParameters += Ext.first('#clientSearch').getValue() ? '^' + 'ClientID=' + clientId : '';
        //get WBS values
        searchParameters += Ext.first('#wbs1Search').getValue() ? '^' + 'WBS1=' + Ext.first('#wbs1Search').getValue() : '';
        searchParameters += Ext.first('#wbs2Search').getValue() ? '^' + 'WBS2=' + Ext.first('#wbs2Search').getValue() : '';
        searchParameters += Ext.first('#wbs3Search').getValue() ? '^' + 'WBS3=' + Ext.first('#wbs3Search').getValue() : '';
        //get start/end dates
        searchParameters += Ext.first('#startDateSearch').getValue() ? '^' + 'StartDate=' + Ext.Date.format(Ext.first('#startDateSearch').getValue(), 'Y-m-d') : '';
        searchParameters += Ext.first('#endDateSearch').getValue() ? '^' + 'EndDate=' + Ext.Date.format(Ext.first('#endDateSearch').getValue(), 'Y-m-d') : '';
        //get work codes
        searchParameters += wcString ? '^' + 'WC=' + wcString : '';
        //remove first ^
        searchParameters = searchParameters.substr(1);

        store.getProxy().setExtraParams(
            {
                fwaId: fwaId ? fwaId : '',
                searchParameters: searchParameters
            }
        );

        store.load();

        searchForm.setHidden(true);
        resultList.setHidden(false);
        Ext.first('#searchButtonX').setHidden(true);
        Ext.first('#resetSearchButton').setHidden(false);
        Ext.first('#viewButton').setHidden(false);
        vw.setLoading(false);
    },

    closeSearch: function (bt) {
        Ext.first('#searchFwa').close();
    },

    closeSearchList: function (bt) {
        Ext.first('window-searchfwalist').close();
    },

    resetSearchFwa: function () {
        var searchForm = Ext.first('#searchWorkCodeGrid'),
            resultList = Ext.first('#fwaResultList');

        searchForm.getSelectionModel().deselectAll();
        searchForm.setHidden(false);
        resultList.setHidden(true);
        Ext.first('#searchButtonX').setHidden(false);
        Ext.first('#resetSearchButton').setHidden(true);
        Ext.first('#viewButton').setHidden(true);
        Ext.first('#viewButton').setDisabled(true);
    },

    viewSelectedResult: function () {
        var me = this,
            selection = Ext.first('#fwaResultList').getSelection()[0],
            settings = TS.app.settings;

        Ext.create('TS.view.ts.FwaWindow', {
            title: settings.fwaAbbrevLabel + ': ' + selection.get('fwaNum') + '  ' + selection.get('fwaName'),
            id: selection.get('fwaId'),
            modal: true,
            isPopup: true
        }).show();
        //
        // var me = this,
        //     selection = Ext.first('#fwaResultList').getSelection()[0];
        // TS.app.redirectTo('fwa/' + selection.get('fwaId'));
        // Ext.first('#searchFwa').close();
    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    refreshFwaPanel: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            fwaList = me.lookup('schedulerFwaGrid'),
            store = fwaList.getStore(),
            filters = store.getFilters(),
            vm = me.getViewModel(),
            activeTab = me.lookup('crewTabPanel').getActiveTab(),
            isScheduler = me.getViewModel().get('isScheduler'),
            fwa,
            form,
            items,
            fwaId;

        if (activeTab.referenceKey == 'tabFwaPanel') {
            //determine if in fwa list or fwa form
            if (Ext.first('form-fwa') && !Ext.first('form-fwa').collapsed) {
                fwa = Ext.first('#fwaForm').getForm();
                form = me.lookup('fwaForm');
                items = fwa.getFields().items;
                fwaId = form.getRecord().get('fwaId');

                Ext.each(items, function (i) {
                    if (i.dirty && (i.originalValue && i.originalValue != i.value)) { // && i.originalValue
                        fwa.dirty = true;
                    }
                });

                if (fwa.dirty || form.getRecord().dirty) {
                    Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                        if (btn == 'yes') {
                            fwa.dirty = false;
                            form.getRecord().dirty = false;
                            me.showFwa(fwaId);
                        }
                    });
                } else {
                    me.showFwa(fwaId);
                }
            } else {
                store.getProxy().setExtraParams({
                    isScheduler: isScheduler,
                    isPreparer: settings.schedFwaPreparedByMe,
                    startDate: new Date().toDateString()
                });
                store.load();
            }
        }
    },

    closeSMS: function (btn) {
        btn.up('window').close()
    },

    sendSMS: function () {
        var me = this,
            form = me.lookup('smsForm').getForm(),
            smsData = form.getValues(),
            settings = TS.app.settings,
            provider = smsData.provider ? smsData.provider : smsData.providerText;

        if (!provider || !form.isValid()) {
            Ext.Msg.alert('Warning', 'Employee, Provider and Message are all required fields');
            return;
        } else {
            User.SendSms(null, settings.username, smsData.mobileNumber, provider, smsData.message, function (response, operation, success) {
                Ext.first('window-SMS').close();
                Ext.GlobalEvents.fireEvent('Message:Code', 'sendSmsSuccess');
            }, this, {
                autoHandle: true
            });
        }
    },

    onShowHideProperties: function (btn) {
        var me = this,
            vw = me.getView(),
            propWindow = vw.lookup('exIfDataWindow'),
            hide = propWindow.hidden;

        propWindow.setHidden(!hide);
        btn.setText(!hide ? 'Show GPS Info' : 'Hide Info');
    },

    searchFwaList: function () {
        var me = this,
            vw = me.getView(),
            store = Ext.first('fwalist').getStore(),
            searchForm = Ext.first('#searchWorkCodeGrid'),
            wcSelections = searchForm.getSelection(),
            fwaName = Ext.first('#fwaNameSearch').getValue(),
            client = Ext.first('#clientSearch').getValue(),
            //get WBS values
            wbs1 = Ext.first('#wbs1Search').getValue(),
            wbs2 = Ext.first('#wbs2Search').getValue(),
            wbs3 = Ext.first('#wbs3Search').getValue(),
            //get start/end dates
            startDate = Ext.first('#startDateSearch').getValue(),
            endDate = Ext.first('#endDateSearch').getValue();

        vw.setLoading(true);
        store.clearFilter();

        store.filterBy(function (rec) {
            if (rec.get('recurrenceConfig') && rec.get('recurrCt') > 1) {
                return false;
            } else {
                return true;
            }
        });

        if (fwaName) {
            store.filter(function (rec) {
                return (rec.get('fwaName').toLowerCase().indexOf(fwaName.toLowerCase()) !== -1) || (rec.get('fwaNum').toLowerCase().indexOf(fwaName.toLowerCase()) !== -1);
            });
        }
        if (client) {
            store.filter(function (rec) {
                return (rec.get('clientName').toLowerCase().indexOf(client.toLowerCase()) !== -1) || (rec.get('clientNumber').toLowerCase().indexOf(client.toLowerCase()) !== -1);
            });
        }
        if (wbs1) {
            store.filter(function (rec) {
                return (rec.get('wbs1Name').toLowerCase().indexOf(wbs1.toLowerCase()) !== -1) || (rec.get('wbs1').toLowerCase().indexOf(wbs1.toLowerCase()) !== -1);
            });
        }
        if (wbs2) {
            store.filter(function (rec) {
                return (rec.get('wbs2Name').toLowerCase().indexOf(wbs2.toLowerCase()) !== -1) || (rec.get('wbs2').toLowerCase().indexOf(wbs2.toLowerCase()) !== -1);
            });
        }
        if (wbs3) {
            store.filter(function (rec) {
                return (rec.get('wbs3Name').toLowerCase().indexOf(wbs3.toLowerCase()) !== -1 || (rec.get('wbs3').toLowerCase().indexOf(wbs3.toLowerCase()) !== -1));
            });
        }
        if (startDate || endDate) {
            store.filter(function (rec) {
                if (startDate && !endDate) {
                    return new Date(Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT)) >= new Date(Ext.Date.format(new Date(startDate), DATE_FORMAT));
                } else if (!startDate && endDate) {
                    return new Date(Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT)) <= new Date(Ext.Date.format(new Date(endDate), DATE_FORMAT));
                } else {
                    return new Date(Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT)) >= new Date(Ext.Date.format(new Date(startDate), DATE_FORMAT)) &&
                        new Date(Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT)) <= new Date(Ext.Date.format(new Date(endDate), DATE_FORMAT));
                }
            });
        }

        if (wcSelections.length > 0) {
            store.filter(function (rec) {
                var ok = false;
                console.log(rec.get('workSchedAndPerf').getRange());
                Ext.each(rec.get('workSchedAndPerf').getRange(), function (recwc) {
                    Ext.each(wcSelections, function (wc) {
                        console.log(wc.get('workCodeId') + '==' + recwc.get('workCodeId'));
                        if (wc.get('workCodeId') === recwc.get('workCodeId')) {
                            ok = true;
                        }
                    });
                });
                console.log(ok);
                return ok;
            });
        }
        vw.setLoading(false);
        Ext.first('window-searchfwalist').close();
    },

    continueSubmitWithDate: function (btn, a, b) {
        var dateForm = Ext.first('#fwaSubmitDate'),
            data = Ext.first('#fwaSubmitDate').fwa,
            entries = dateForm.items.items[0].getForm().getValues(),
            selectedDate = entries.selectedDate,
            submitAll = entries.submitAll;

        btn.up('window').close();
        if (submitAll == 'on') {
            data.nextDate = new Date(2040, 11, 31, 1, 0, 0);
        } else {
            data.nextDate = new Date(selectedDate);
        }

        Ext.first('form-fwa').getController().continueSubmitWithDate(data);
    }
    ,

    cancelSubmitWithDate: function (btn) {
        Ext.first('form-fwa').setLoading(false);
        btn.up('window').close();
        if (Ext.first('#fwaSubmitDate')) Ext.first('#fwaSubmitDate').close();
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
        wcStore.clearFilter();
        Ext.first('#searchWorkCodeGrid').setStore(wcStore);
        me.searchWindow.show();
    },

    clearFwaListFilter: function () {
        var me = this,
            vw = me.getView(),
            store = Ext.first('fwalist').getStore();
        store.clearFilter();
    },

    showHideApprove: function (me) {
        var grid = Ext.first('fwalist'),
            column = grid.getColumns()[5];

        if (column.isVisible()) {
            column.hide();
            me.setText('Show Approval Column');
        } else {
            column.show();
            me.setText('Hide Approval Column');
        }

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

        Ext.first('#btnViewLastWeek').setHidden(true);
        Ext.first('#btnViewNextWeek').setHidden(true);
        Ext.first('#labelFwaCurrentDate').setHidden(true);
        Ext.first('#btnWeekView').setText('Week View');
    },

    reloadAllFWAs: function () {
        var me = Ext.first('fwalist'),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            store = me.getStore(),
            filters = store.getFilters(),
            allRecords = [],
            hasColumnFilter = false;
        //check if has any column header filters
        for (let i = 0; i < filters.items.length; i++) {
            if (filters.items[i]._filterValue) {
                hasColumnFilter = true;
            }
        }
        if (filters.items.length < 3 && !hasColumnFilter)
            store.clearFilter();
        else
            for (let i = 0; i < filters.items.length; i++) {
                if (!filters.items[i]._filterValue) {
                    store.removeFilter(filters.items[i]);
                }
            }

        store.filterBy(function (rec) {
            if (rec.get('recurrenceConfig') && rec.get('recurrCt') > 1) {
                return false;
            } else {
                return true;
            }
        });

        Ext.first('#btnViewLastWeek').setHidden(true);
        Ext.first('#btnViewNextWeek').setHidden(true);
        Ext.first('#labelFwaCurrentDate').setHidden(true);
        Ext.first('#btnWeekView').setText('Week View');
    },

    filterByWeekLast: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('fwalist'),
            store = grid.getStore(),
            settings = TS.app.settings,
            dateNow = Ext.Date.add(new Date(vm.get('currentWeekStart')), Ext.Date.DAY, -7),
            weekStartDay = settings.schedWeeklyStartDay,
            startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
            endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6),
            filters = store.getFilters(),
            hasColumnFilter = false;

        //check if grid has any column header filters
        for (let i = 0; i < filters.items.length; i++) {
            if (filters.items[i]._filterValue) {
                hasColumnFilter = true;
            }
        }

        if (filters.items.length < 3 && !hasColumnFilter)
            store.clearFilter();
        else
            for (let i = 0; i < filters.items.length; i++) {
                if (!filters.items[i]._filterValue) {
                    store.removeFilter(filters.items[i]);
                }
            }

        store.filterBy(function (item) {
            if (item.get('recurrCt') > 0) {
                return Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                    Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
            } else {
                return Ext.Date.format(item.get('schedStartDate'), 'Y-m-d') >= Ext.Date.format(startDate, 'Y-m-d') &&
                    Ext.Date.format(item.get('schedStartDate'), 'Y-m-d') <= Ext.Date.format(endDate, 'Y-m-d');
            }
        });

        vm.set('fwaListCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
        vm.set('isWeekView', true);
        vm.set('currentWeekStart', startDate);
    },

    filterByWeek: function () {
        if (Ext.first('#btnWeekView').getText() == 'All FWAs') {
            this.reloadAllFWAs();
        } else {
            var me = this,
                vw = me.getView(),
                vm = me.getViewModel(),
                grid = Ext.first('fwalist'),
                store = grid.getStore(),
                settings = TS.app.settings,
                dateNow = new Date(),
                weekStartDay = settings.schedWeeklyStartDay,
                startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
                endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6),
                filters = store.getFilters(),
                hasColumnFilter = false;

            for (let i = 0; i < filters.items.length; i++) {
                if (filters.items[i]._filterValue) {
                    hasColumnFilter = true;
                }
            }

            if (filters.items.length < 3 && !hasColumnFilter)
                store.clearFilter();
            else
                for (let i = 0; i < filters.items.length; i++) {
                    if (!filters.items[i]._filterValue) {
                        store.removeFilter(filters.items[i]);
                    }
                }
            //store.clearFilter();
            store.filterBy(function (item) {
                // return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) >= Ext.Date.format(new Date(startDate), DATE_FORMAT) &&
                //     Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) <= Ext.Date.format(new Date(endDate), DATE_FORMAT);

                if (item.get('recurrCt') > 0) {
                  return Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                        Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
                } else {
                    return Ext.Date.format(item.get('schedStartDate'), 'Y-m-d') >= Ext.Date.format(startDate, 'Y-m-d') &&
                        Ext.Date.format(item.get('schedStartDate'), 'Y-m-d') <= Ext.Date.format(endDate, 'Y-m-d');
                }
            });
            vm.set('fwaListCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
            vm.set('isWeekView', true);
            vm.set('currentWeekStart', startDate);
            vw.lookup('btnViewLastWeek').setHidden(false);
            vw.lookup('btnViewNextWeek').setHidden(false);
            vw.lookup('labelFwaCurrentDate').setHidden(false);
            vw.lookup('btnWeekView').setText('All FWAs');
        }
    },

    filterByWeekNext: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('fwalist'),
            store = grid.getStore(),
            settings = TS.app.settings,
            dateNow = Ext.Date.add(new Date(vm.get('currentWeekStart')), Ext.Date.DAY, 7),
            weekStartDay = settings.schedWeeklyStartDay,
            startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
            endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6),
            filters = store.getFilters(),
            recurrenceDatesCount = 0,
            hasColumnFilter = false;

        //check if grid has any column header filters
        for (let i = 0; i < filters.items.length; i++) {
            if (filters.items[i]._filterValue) {
                hasColumnFilter = true;
            }
        }

        if (filters.items.length < 3 && !hasColumnFilter)
            store.clearFilter();
        else
            for (let i = 0; i < filters.items.length; i++) {
                if (!filters.items[i]._filterValue) {
                    store.removeFilter(filters.items[i]);
                }
            }

        store.filterBy(function (item) {
            //debugger;
            if (item.get('recurrCt')  > 0) {
                return Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                    Ext.Date.format(new Date(item.get('nextDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
            } else {
                // return item.get('schedStartDate') >= startDate &&
                //     item.get('schedStartDate') <= endDate;
                console.log(new Date(item.get('schedStartDate')) >= new Date(startDate));
                return Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                    Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
            }
        });

        vm.set('fwaListCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
        vm.set('isWeekView', true);
        vm.set('currentWeekStart', startDate);
    }

});
