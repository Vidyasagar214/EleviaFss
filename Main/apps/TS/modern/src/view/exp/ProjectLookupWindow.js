/**
 * Created by steve.tess on 7/24/2018.
 */
Ext.define('TS.view.exp.ProjectLookupWindow', {
    extend: 'Ext.Sheet',
    xtype: 'exp-projectlookuptree',

    controller: 'exp-editor',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

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
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'tree-list',
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
                    handler: 'closeSheet'
                },
                {
                    text: 'Select',
                    iconCls: 'x-fa fa-check-square-o',
                    align: 'left',
                    handler: 'onSelectProject'
                }
            ]
        }
    ]
});