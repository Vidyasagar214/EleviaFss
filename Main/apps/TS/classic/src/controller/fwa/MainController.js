Ext.define('TS.controller.fwa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.fwa',

    plugins: [{
        ptype: 'printer'
    }],

    routes: {
        'newfwa': 'startNewFwa',
        'fwa/:id': 'showFwa',
        'copyfwa/:id': 'copyFwa'
    },

    before: {
        'startNewFwa': 'checkUnsaved',
        'showFwa': 'checkUnsaved',
        'showDefaultTab': 'checkUnsaved',
        'copyFwa': 'checkUnsaved'
    },

    refs: {
        fwaForm: {
            xtype: 'form-fwa',
            selector: 'form-fwa',
            autoCreate: true
        }
    },

    listen: {
        global: {
            'ShowSelectedFwa': 'showFwa',
            'ShowFwaGrid': 'showFwaGrid',
            'StartNewFwa': 'startNewFwa',
            'CopyFwa': 'copyFwa'
        }
    },

    init: function () {
        var me = this,
            settings = TS.app.settings,
            vm = this.getViewModel(),
            vw = this.getView(),
            fwaHeader = Ext.first('header-fwa');

        //console.log(Ext.first('fwalist').getStore().getAutoLoad());
        if (!vm.get('isScheduler')) {
            Ext.first('fwalist').getStore().setAutoLoad(true);
        } else {
            Ext.first('fwalist').getStore().setAutoLoad(false);
        }
        //console.log(Ext.first('fwalist').getStore().getAutoLoad());

        if (fwaHeader) {
            vw.lookup('newFwaButton').setHidden(!settings.fwaCreateNew);
        }
        //default to grid, even on refresh
        me.showDefaultTab();
    },

    onBackToFSS: function () {
        //check for dirty
        var me = this,
            hasFwa = Ext.first('#fwaForm'),
            gridHidden = me.lookup('fwaGrid').hidden,
            fwaList = Ext.first('fwalist').getView().grid,
            fwa,
            form,
            items;

        if (hasFwa && gridHidden) {
            fwa = hasFwa.getForm();
            form = me.lookup('fwaForm');
            items = fwa.getFields().items;
            Ext.each(items, function (i) {
                if (i.value && i.value != '' && i.dirty && i.originalValue && i.originalValue != i.value) {
                    fwa.dirty = true;
                }
            });
            //console.log(fwa.dirty);
            if (fwa.dirty) {
                Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                    if (btn == 'yes') {
                        fwaList.filters.clearFilters();
                        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
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

    /*
     * Routing Methods
     */

    backToGrid: function () {
        var me = this,
            settings = TS.app.settings,
            fwa = Ext.first('#fwaForm').getForm(),
            form = me.lookup('fwaForm'),
            grid = me.lookup('fwaGrid'),
            items = fwa.getFields().items,
            units = Ext.first('grid-unit').getStore();

        Ext.each(items, function (i) {
            if (i.dirty) { //} && (i.originalValue != i.value)) { // && i.originalValue
                fwa.dirty = true;
            }
        });

        if (fwa.dirty || settings.fwaIsDirty) {
            Ext.Msg.confirm('Please Confirm', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    Ext.GlobalEvents.fireEvent('ResetFormStartEndDates');
                    Ext.GlobalEvents.fireEvent('ChangeViewport', 'FWA');
                    Ext.first('form-fwa').collapse();
                    Ext.first('fwalist').expand();
                    fwa.dirty = false;
                    settings.fwaIsDirty = false;
                    me.showFwaCt();
                    grid.show();
                } else {
                    form.expand();
                }
            });
        } else {
            units.clearData();
            units.removeAll();
            Ext.GlobalEvents.fireEvent('ResetFormStartEndDates');
            //Ext.GlobalEvents.fireEvent('resetDirtyState');
            Ext.GlobalEvents.fireEvent('ChangeViewport', 'FWA');
            Ext.first('form-fwa').collapse();
            Ext.first('fwalist').expand();
            grid.show();
            me.showFwaCt();
        }
    },

    showFwaCt: function () {
        Ext.first('#rowCtField').setHidden(false);
    },

    showDefaultTab: function () {
        var me = this;
        me.lookup('showFwaMapButton').show();
        me.lookup('fwaGridButton').hide();
        Ext.first('#fwaGridButtonNew').hide();
        me.lookup('fwaPrintButton').show();
        Ext.first('fwalist').expand();
        Ext.first('form-fwa').setHidden(true);
        Ext.first('fwalist').setHidden(false);
        if (me.lookup('refreshFwaListBtn')) {
            me.lookup('refreshFwaListBtn').show();
        }
    },

    //Starts a new FWA grid row
    startNewFwa: function () {
        var me = this,
            fwa = Ext.first('#fwaForm').getForm(),
            docBtn = me.getView().lookup('showAttachDocButton'),
            picBtn = me.getView().lookup('showAttachPhotoButton');
        me.getViewModel().set('newFwa', true);
        me.lookup('fwaForm').show().expand();
        me.lookup('fwaGrid').hide().collapse();
        me.lookup('fwaForm').getController().readyInitialRecord(false);
        me.lookup('showFwaMapButton').hide();
        if (me.lookup('refreshFwaListBtn'))
            me.lookup('refreshFwaListBtn').hide();
        me.lookup('fwaGridButton').show();
        Ext.first('#fwaGridButtonNew').hide();
        me.lookup('fwaPrintButton').hide();
        //reset counts in attach buttons -- hidden when new fwa, no need to reset text
        // docBtn.setText('Attach Doc');
        // picBtn.setText('Attach Photo');
        //enable form fields
        Ext.GlobalEvents.fireEvent('enableForm');
        fwa.dirty = true;
        if (Ext.first('#rowCtField'))
            Ext.first('#rowCtField').setHidden(true);
        Ext.first('#newFwaButton').setHidden(true);
        me.resetUDF_Fields();
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

    // Shows & loads an FWA
    showFwa: function (id, fwaDate) {
        var me = this;
        me.lookup('fwaGrid').hide().collapse();
        me.lookup('fwaForm').show().expand();
        me.lookup('fwaForm').getController().loadRemoteFwa(id, fwaDate);
        me.lookup('showFwaMapButton').hide();
        if (me.lookup('refreshFwaListBtn')) {
            //me.lookup('refreshFwaListBtn').hide();
        }
        me.lookup('fwaGridButton').show();
        Ext.first('#fwaGridButtonNew').hide();
        me.lookup('fwaPrintButton').hide();
        me.getViewModel().set('newFwa', false);
        me.checkFwaCreateNewRights();
    },

    showFwaGrid: function () {
        var me = this;

        me.lookup('fwaGrid').expand();
        me.lookup('fwaGrid').show();

        Ext.first('#fwaGridButton').hide();
        Ext.first('#fwaGridButtonNew').hide();
        Ext.first('#showFwaMapButton').show();
        Ext.first('#printAllButton').show();
        Ext.first('#newFwaButton').show();
    },

    //check security settings for user rights to create new fwa
    checkFwaCreateNewRights: function () {
        var me = this,
            settings = TS.app.settings,
            isScheduler = me.getViewModel().get('isScheduler');
        if (!isScheduler && !settings.fwaCreateNew) {
            me.lookup('newFwaButton').hide();
        }
    },

    /*
     * Before Routing Methods
     */
    checkUnsaved: function () {
        var action = arguments[arguments.length - 1],
            isDirty = this.lookup('fwaForm').getForm().isDirty(),
            form = this.lookup('fwaForm').getForm();
        if (this.lookup('fwaForm')) {
            if (isDirty || form.dirty) {
                Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                    if (btn == 'yes') {
                        form.dirty = false;
                        action.resume();
                        Ext.GlobalEvents.fireEvent('resetDirtyState');
                    } else {
                        action.stop();
                        //Ext.GlobalEvents.fireEvent('Route:Silent');
                    }
                });
            } else {
                action.resume();
            }
        } else {
            action.resume();
        }
    },

    // Shows a map of all FWAs
    showFwaMap: function () {
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: this.lookup('fwaGrid').getStore()
        }).show();
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    copyFwa: function (id) {
        var settings = TS.app.settings,
            me = this,
            record = null;

        Fwa.Copy(null, settings.username, id, function (response) {
            record = Ext.create('TS.model.fwa.Fwa', response.data);
            record.set('fwaId', record.id);
            record.set('fwaNum', '');
            me.lookup('fwaForm').show().expand();
            me.lookup('fwaForm').getController().loadFwaRecord(record, true);
            me.lookup('showFwaMapButton').hide();
            if (me.lookup('refreshFwaListBtn')) {
                me.lookup('refreshFwaListBtn').hide();
            }
            me.lookup('fwaGridButton').show();
            Ext.first('#fwaGridButtonNew').hide();
            me.lookup('fwaPrintButton').hide();
            me.getViewModel().set('newFwa', true);
            settings.fwaIsDirty = true;
            //enable form fields
            //Ext.GlobalEvents.fireEvent('enableForm');
        }, me, {
            autoHandle: true
        });
    },

    printAll: function () {
        var store = this.lookup('fwaGrid').getStore(),
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
            modelId: '_none_',
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

    searchFwaList: function () {
        var me = this,
            vw = me.getView(),
            store = Ext.first('fwalist').getStore(),
            searchForm = Ext.first('#searchWorkCodeGrid'),
            wcSelections = searchForm.getSelection(),
            client = Ext.first('#clientSearch').getValue(),
            //get WBS values
            wbs1 = Ext.first('#wbs1Search').getValue(),
            wbs2 = Ext.first('#wbs2Search').getValue(),
            wbs3 = Ext.first('#wbs3Search').getValue(),
            //get start/end dates
            startDate = Ext.first('#startDateSearch').getValue(),
            endDate = Ext.first('#endDateSearch').getValue();

        vw.setLoading(true);
        store.clearFilter(true);
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
                Ext.each(rec.get('workSchedAndPerf').getRange(), function (recwc) {
                    Ext.each(wcSelections, function (wc) {
                        if (wc.get('workCodeId') === recwc.get('workCodeId')) {
                            ok = true;
                        }
                    });
                });
                return ok;
            });
        }
        vw.setLoading(false);
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
            vw = me.getView(),
            selection = Ext.first('#fwaResultList').getSelection()[0],
            settings = TS.app.settings,
            fwaWindow;

        if (me.fwaWindow)
            me.fwaWindow.close();

        fwaWindow = Ext.create('TS.view.ts.FwaWindow', {
            title: settings.fwaAbbrevLabel + ': ' + selection.get('fwaNum') + '  ' + selection.get('fwaName'),
            fwaId: selection.get('fwaId'),
            schedStartDate: selection.get('schedStartDate'),
            modal: true,
            isPopup: true
        });
        fwaWindow.show();

        /* OLD WAY
         var settings = TS.app.settings;
         if (this.lookup('fwaForm') != null) {
         this.lookup('fwaForm').close();
         }
         TS.app.redirectTo('fwa/' + selection.get('fwaId'));
         Ext.first('#searchFwa').close();
         */
    },

    clearSearchDates: function () {
        Ext.first('#startDateSearch').setValue();
        Ext.first('#endDateSearch').setValue();
    },

    closeSearch: function (bt) {
        Ext.first('#searchFwa').close();
    },

    closeSearchList: function (bt) {
        Ext.first('window-searchfwalist').close();
    },

    onShowHideProperties: function (btn) {
        var me = this,
            vw = me.getView(),
            propWindow = vw.lookup('exIfDataWindow'),
            hide = propWindow.hidden,
            parentWindow = vw.lookup('parentWindow');

        propWindow.setHidden(!hide);
        if (hide)
            Ext.getCmp('latitude').focus(false, 200);
        //parentWindow.scrollTo('Top', 0, true);
        //parentWindow.getTargetEl().scroll('Top', 100000, true);
        btn.setText(!hide ? 'Show GPS Info' : 'Hide Info');
    },

    continueSubmitWithDate: function (btn, a, b) {
        var dateForm = Ext.first('#fwaSubmitDate'),
            data = Ext.first('#fwaSubmitDate').fwa,
            entries = dateForm.items.items[0].getForm().getValues(),
            selectedDate = entries.selectedDate,
            submitAll = entries.submitAll;
        btn.up('window').close();
        if (submitAll == 'on') {
            data.nextDate = TS.common.Util.getInUTCDate(new Date(2040, 11, 31, 0, 0));
        } else {
            data.nextDate = new Date(selectedDate);
        }

        Ext.first('form-fwa').getController().continueSubmitWithDate(data);
    },

    cancelSubmitWithDate: function (btn) {
        Ext.first('form-fwa').setLoading(false);
        btn.up('window').close();
        if (Ext.first('#fwaSubmitDate')) Ext.first('#fwaSubmitDate').close();
    }

});
