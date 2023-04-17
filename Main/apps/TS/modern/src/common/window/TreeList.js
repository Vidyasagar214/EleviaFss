Ext.define('TS.common.window.TreeList', {
    extend: 'Ext.Container',

    xtype: 'tree-list',

    requires: [
        'TS.common.window.TreeListModel'
    ],

    layout: 'vbox',

    viewModel: {
        type: 'tree-list'
    },

    scrollable: 'y',

    items: [
        {
            xtype: 'panel',
            docked: 'top',
            items: [
                {
                    xtype: 'textfield',
                    placeHolder: 'Enter search criteria here....',
                    itemId: 'searchField',
                    docked: 'top',
                    userCls: 'ts-long-label ts-border-bottom',
                    action: 'search',
                    label: {_tr: "wbs1Label", tpl: "{0} Number or Name"},
                    triggers: {
                        clear: {
                            cls: 'x-form-clear-trigger',
                            handler: function (field) {
                                field.reset();
                            }
                        }
                    }
                    ,
                    listeners: {
                        clearicontap: 'onProjectSearchChange'
                    }
                },
                {
                    xtype: 'panel',
                    cls: 'ts-fieldset-nbr',
                    items:[
                        {
                            xtype: 'button',
                            text: 'Search',
                            iconCls: 'x-fa fa-search',
                            handler: 'onSearchButtonClick',
                            ui: 'action'
                        }
                    ]
                }
            ]
        }, {
            xtype: 'panel',
            items: [
                {
                    xtype: 'treelist',
                    reference: 'treelist',
                    bind: '{navItems}',
                    userCls: 'ts-list-tree-noicons',
                    expanderOnly: false
                }
            ]
        }
        , {
            xtype: 'component',
            docked: 'bottom',
            reference: 'selectedText',
            userCls: 'ts-long-label ts-project-ct-details',
            bind: {
                html: '{selectionText}'
            }
        }
    ]
});

