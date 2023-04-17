Ext.define('TS.view.ts.ProjectLookup', {
    extend: 'Ext.Sheet',
    xtype: 'ts-projectlookuptree',
    stretchX: true,
    stretchY: true,

    autoDestroy: true, 

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'wbs1Label', tpl: '{0} Lookup'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    action: 'close'
                }
            ]
        },
        {
            xtype: 'tree-list', // 'ts-tree-list',
            reference: 'project-treelist'
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Cancel',
                    align: 'right',
                    iconCls: 'x-fa  fa-times-circle-o',
                    ui: 'action',
                    action: 'close'
                },
                {
                    text: 'Select',
                    iconCls: 'x-fa fa-check-square-o',
                    align: 'left',
                    action: 'select-project'
                }
            ]
        }
    ]

});
