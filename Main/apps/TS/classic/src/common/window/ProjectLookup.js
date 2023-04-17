Ext.define('TS.common.window.ProjectLookup', {
    extend: 'Ext.window.Window',

    requires: [
        'TS.model.shared.WbsProjectTree'
    ],

    xtype: 'window-project-lookup',
    controller: 'window-project-lookup',
    modal: true,

    plugins: {
        ptype: 'responsive'
    },
    responsiveConfig: {
        small: {
            width: 300,
            height: 300
        },
        normal: {
            width: 500,
            height: 500
        }
    },

    title: {_tr: "wbs1Label", tpl: "{0} Lookup"},

    layout: 'fit',

    callingPage: 'TS',
    app: 'TS',

    defaultFocus: 'textfield[action=search]',

    buttons: [
        {
            reference: 'tsProjectSelectButton',
            text: 'Select',
            handler: 'onSelectProjectTreeNode',
            disabled: true // Initially disabled, enabled on treepanel select event in VC
        },
        {
            text: 'Cancel',
            handler: 'onCancelProjectTreeNode'
        }],

    items: [{
        xtype: 'treepanel',
        reference: 'tpProjectList',

        plugins: [{
            ptype: 'treefilter',
            allowParentFolders: true
        }],

        dockedItems: [{
            xtype: 'toolbar',
            plugins: 'responsive',
            responsiveConfig: {
                small: {
                    layout: {
                        pack: 'center',
                        type: 'hbox'
                    }
                },
                normal: {
                    layout: {
                        pack: 'left',
                        type: 'hbox'
                    }
                }
            },

            dock: 'top',
            items: [{
                xtype: 'textfield',
                reference: 'searchTextField',
                labelStyle: 'color: white;',
                action: 'search',
                plugins: 'responsive',
                labelAlign: 'top',
                labelWidth: 200,
                emptyText: '<search here>',
                fieldLabel: {_tr: "wbs1Label", tpl: "{0} Number or Name"},
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        handler: function (field) {
                            field.reset();
                        }
                    }
                },

                listeners: {
                    change: 'onProjectSearchChange',
                    buffer: 250
                }
            }]
        }],

        rootVisible: false,
        columns: [{
            xtype: 'treecolumn', // This is so we know which column will show the tree
            flex: 1,
            dataIndex: 'displayId',
            text: {_tr: "wbs1Label", tpl: "{0} Number"}
        }, {
            flex: 1.5,
            dataIndex: 'text',
            text: {_tr: "wbs1Label", tpl: "{0} Name"}
        }],

        store: {
            type: 'tree',
            autoLoad: false, //important
            rootNode: {
                expanded: false //important
            },
            model: 'TS.model.shared.WbsProjectTree', //Moved from above: Sencha this belongs to the store
            proxy: {
                type: 'default',
                directFn: 'Wbs1.GetWbsProjectTree',
                paramOrder: 'dbi|username|empId|node|app'
            },
            remoteSort: false
        },

        listeners: {
            selectionchange: 'onProjectSelectionChange',
            afteritemexpand: 'onProjectSelectionExpand',
            sortchange: 'onProjectSortChange'
        }
    }]
});


