/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.controller.exp.ExpListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.explist',



    init: function () {
        // Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        var store = Ext.create('Ext.data.Store', {
            storeId: 'ExpFwaList',
            model: 'TS.model.fwa.ExpFwaModel',
            proxy: {
                type: 'default',
                directFn: 'Fwa.GetExpenseFwaList',
                paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
                extraParams: {
                    startDate: Ext.Date.add(new Date(), Ext.Date.DAY, -20).toDateString().replace('/', '-'),
                    isPreparer: 'N',
                    isScheduler: true
                }
            },
            sorters: [{
                property: 'fwaName',
                direction: 'ASC'
            }]
        });
        store.load();
    },

    copyExpenseItem: function (grid, rowIndex) {
        var settings = TS.app.settings,
            store = grid.getStore(),
            lastEntry = store.getAt(rowIndex),
            newExpense;

        if (lastEntry) {
            newExpense = lastEntry.copy(null);
            newExpense.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('expId', '');
            newExpense.set('amount', null);
            store.add(newExpense);
        }

        settings.isExpenseCopy = true;
        Ext.first('#onSaveExpenseButton').click();
    },

    deleteExpense: function (grid, rowIndex) {
        var store = grid.getStore(),
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            expReportId = record.get('expReportId'),
            expId = record.get('expId');

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this expense?", function (btn) {
            if (btn == 'yes') {
                //store.removeAt(rowIndex);
                record.set('modified', 'D');
                store.filterBy(function (obj) {
                    return obj.get('modified') != 'D';
                });
            }
        });
    },

    onExpenseGridDblClick: function (component, record, item, index, e) {
        var me = this,
            vm = me.getViewModel(),
            data = record.data,
            settings = TS.app.settings,
            enabled,
            win,
            readOnly = true;

        win = Ext.create({
            xtype: 'window-expenseeditor',
            expenseData: data,
            modal: true,
            record: record
        });

        win.lookup('fwaButton').setHidden(!data.fwaId);
        settings.nsExpenseEntry = false;
        if (data.fwaId) {
            enabled = settings.exCanModifyFwaExp || !settings.expenseReadOnly;
            win.lookup('expDate').setDisabled(!enabled);
            win.lookup('categoryField').setDisabled(!enabled);
            win.lookup('description').setDisabled(!enabled);
            win.lookup('amountField').setDisabled(!enabled);
            win.lookup('projectButton').setDisabled(!enabled);
            win.lookup('wbs1combo').setDisabled(!enabled);
            win.lookup('wbs2combo').setDisabled(!enabled);
            win.lookup('wbs3combo').setDisabled(!enabled);
            win.lookup('billableCheckbox').setDisabled(!enabled);
            win.lookup('companyPaidCheckbox').setDisabled(!enabled);
            win.lookup('account').setDisabled(!enabled);
            win.lookup('reasonField').setDisabled(!enabled);
            win.lookup('otherField').setDisabled(!enabled);
            win.lookup('milesField').setDisabled(!enabled);
            win.lookup('amountPerMileField').setDisabled(!enabled);
            win.lookup('attachButton').setDisabled(!enabled);
            //win.lookup('updateExpenseBtn').setDisabled(!enabled);
            //show FWA info
            win.lookup('fwaNumField').setHidden(false);
            win.lookup('fwaNameField').setHidden(false);
        } else {
            if (vm.get('isExa')) {
                enabled = settings.exApproverCanModify;
            } else {
                enabled = true;
            }
            win.lookup('expDate').setDisabled(!enabled);
            win.lookup('categoryField').setDisabled(!enabled);
            win.lookup('description').setDisabled(!enabled);
            win.lookup('amountField').setDisabled(!enabled);
            win.lookup('projectButton').setDisabled(!enabled);
            win.lookup('wbs1combo').setDisabled(!enabled);
            win.lookup('wbs2combo').setDisabled(!enabled);
            win.lookup('wbs3combo').setDisabled(!enabled);
            win.lookup('billableCheckbox').setDisabled(!enabled);
            win.lookup('companyPaidCheckbox').setDisabled(!enabled);
            win.lookup('account').setDisabled(!enabled);
            win.lookup('reasonField').setDisabled(!enabled);
            win.lookup('otherField').setDisabled(!enabled);
            win.lookup('milesField').setDisabled(!enabled);
            win.lookup('amountPerMileField').setDisabled(!enabled);
            win.lookup('attachButton').setDisabled(!enabled);
            //win.lookup('updateExpenseBtn').setDisabled(!enabled);
            //show FWA info
            win.lookup('fwaNumField').setHidden(true);
            win.lookup('fwaNameField').setHidden(true);
        }
    },

    onClearFilters: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            store = vw.getStore();

        // The "filters" property is added to the grid (this) by gridfilter
        vw.filters.clearFilters();
        //do again just in case
        store.remoteFilter = false;
        store.clearFilter();
        store.remoteFilter = true;
        store.filter();
    },

    attachExpenseDocument: function (grid, rowIndex) {
        var me = this,
            settings = TS.app.settings,
            windowAttachment,
            expense = grid.getStore().getAt(rowIndex);
         if (me.windowAttachment) {
            me.windowAttachment.close();
        }
        settings.nsExpenseEntry = false;
        me.windowAttachment = Ext.create('TS.view.exp.ExpAttachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            record: expense,
            associatedRecordId: expense.get('expId'),
            attachmentsList: {
                modelType: 'EXP',
                modelId: expense.get('expId'),
                record: expense,
                attachmentType: AttachmentType.Expense
            },
            autoShow: true,
            modal: true
        });
    },

    showProjectLookupWindow: function (component, e) {

    },

    /*
     * Helper Methods
     */
    convertFileToByteData: function (file, callback) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                // Convert to plain array for sending through to Ext.Direct
                //console.log(e.target.result);
                var byteArray = new Uint8Array(e.target.result),
                    returnArray = [];
                for (var i = 0; i < byteArray.length; i++) {
                    returnArray[i] = byteArray[i];
                }
                callback(returnArray);
            };
        })(file);
        reader.readAsArrayBuffer(file);
    }

});