/**
 * Created by steve.tess on 6/1/2016.
 */
Ext.define('TS.view.ts.TsTreeList', {
    extend: 'Ext.Container',

    xtype: 'ts-tree-list',

    layout: 'fit',

    viewModel: {
        type: 'ts-tree-list'
    },

    scrollable: 'y',

    items: [
        {
            xtype: 'textfield',
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
            },
            listeners: {
                change: 'onProjectSearchChange',
                buffer: 250
            }
        },
        {
            xtype: 'treelist',
            reference: 'treelist',
            bind: '{navItems}',
            userCls: 'ts-list-tree-noicons'
        },
        {
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