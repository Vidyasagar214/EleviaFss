Ext.define('TS.controller.ProjectLookupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-project-lookup',

    init: function () {
        var app = this.getView().app,
            tree = this.lookup('tpProjectList'),
            store = tree.getStore();

        store.getProxy().setExtraParam('app', app);
        tree.getRootNode().expand(); //this will load store with parameters
    },

    onProjectSearchChange: function (field, newVal, oldVal) {
        var store = this.lookup('tpProjectList').getStore();
        if (newVal === '') {
            store.clearFilter();
        } else {
            store.clearFilter();
            store.filterBy(function (rec) {
                if (rec.get('model') == 'Wbs2' || rec.get('model') == 'Wbs3') return true;
                if (rec.get('text').toLowerCase().match(newVal.toLowerCase()) || rec.get('id').toLowerCase().match(newVal.toLowerCase())) {
                    return true;
                }
            })
        }
    },

    onProjectSelectionChange: function (rowModel, selection) {
        this.lookup('tsProjectSelectButton').setDisabled(!(selection && selection.length > 0));
    },

    onProjectSelectionExpand: function (node, index, item, eOpts) {
        var treePanel = this.lookup('tpProjectList'),
            nodeCt = node.childNodes.length;
        //scroll to index and plus # of childnodes
        treePanel.getView().scrollRowIntoView(index + nodeCt);
        //set focus to node
        treePanel.getSelectionModel().select([node]);
    },

    onSelectProjectTreeNode: function () {
        var tree = this.lookup('tpProjectList'),
            settings = TS.app.settings,
            selectedNode = tree.getSelection(), //tree.getSelectionModel().getSelection(0),
            model = selectedNode[0].get('model'),
            clientId = selectedNode[0].get('clientId'),
            id = selectedNode[0].get('displayId'),
            name = selectedNode[0].get('text'),
            selectedNodeId = selectedNode[0].id,
            selectedNodeIdArray = selectedNodeId.split('^'),
            callingPage = this.getView().callingPage,//getCallingPage();
            //get selected values
            wbs1 = Ext.create('TS.model.shared.Wbs1', {id: selectedNodeIdArray[0]}),
            wbs2 = selectedNodeIdArray[1] ? Ext.create('TS.model.shared.Wbs2', {id: selectedNodeIdArray[1]}) : null,
            wbs3 = selectedNodeIdArray[2] ? Ext.create('TS.model.shared.Wbs3', {id: selectedNodeIdArray[2]}) : null,
            //get store
            unitCodeStore = Ext.getStore('UnitCode'),
            empHoursRows = Ext.first('grid-employeehours'),
            ttlHrs = 0;
        //load store
        if (callingPage !== 'EL'){
            unitCodeStore.getProxy().setExtraParams({
                wbs1: wbs1 ? wbs1.get('id') : '^',
                wbs2: wbs2 ? wbs2.get('id') : '^',
                wbs3: wbs3 ? wbs3.get('id') : '^',
                includeInactive: false
            });
            unitCodeStore.reload();
            unitCodeStore.filterBy(function (row) {
                return row.get('status') == 'A';
            });
        }
        // Pass to TS

        if (callingPage == 'TS') {
            // Down to parent
            Ext.first('grid-timesheetrow').getController().setProjectValues(wbs1, wbs2, wbs3);
        } else if (callingPage == 'EL') {
            Ext.first('window-expenseeditor').getController().setProjectValues(wbs1, wbs2, wbs3);
        } else if (callingPage == 'EE') {
            Ext.first('fwa-expenseeditor').getController().setProjectValues(wbs1, wbs2, wbs3);
        } else if (callingPage == 'PL') {
            Ext.first('window-projecteditor').getController().setProjectValues(wbs1, wbs2, wbs3);
            // Pass to FWA
        } else {
            empHoursRows = empHoursRows.getStore().getRange(),
            Ext.each(empHoursRows, function (hrs) {
                ttlHrs += hrs.get('regHrs') + hrs.get('ovtHrs') + hrs.get('ovt2Hrs') + hrs.get('travelHrs');
            });
            if (TS.app.getViewport().getViewModel().get('newFwa') && ttlHrs > 0) {
                Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.crewLabel + " is changed. Do you wish to continue?</div>", function (btn) {
                    if (btn === 'yes') {

                        TS.app.getViewport().lookup('fwaForm').getController().setProjectValues(wbs1, wbs2, wbs3);
                    } else {

                    }
                });
            } else {
                TS.app.getViewport().lookup('fwaForm').getController().setProjectValues(wbs1, wbs2, wbs3);
            }
        }
        // Close window
        this.getView().close();
    },

    onProjectSortChange: function (ct, column, direction, eOpts) {
        var vm = this.getViewModel(),
            isScheduler = vm.get('isScheduler'),
            isFwa = vm.get('isFwa');
    },

    onCancelProjectTreeNode: function () {
        this.getView().close();
    }

});

