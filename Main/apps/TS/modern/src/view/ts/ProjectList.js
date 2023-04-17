/**
 * Created by steve.tess on 10/25/2016.
 */
Ext.define('TS.view.ts.ProjectList', {
    extend: 'Ext.Container',

    xtype: 'ts-project-list',

    layout: 'fit',

    // scrollable: {
    //     directionLock: true,
    //     x: false
    // },

    items: [
        {
            xtype: 'list',
            itemId: 'ts-projectlist',
            reference: 'projectlist',
            tpl: '{projectName}',
            headerArray: [],
            bind: {
                store: '{projects}',
                selection: '{selectedProject}'
            },
            itemCls: 'ts-timesheet-row',
            itemTpl: '{title}',
            preventSelectionOnDisclose: false,
            onItemDisclosure: true,
            listeners: [
                {
                    disclose: 'onEditProject',
                    itemsingletap: 'onEditProjectTap'
                }
            ]
        }
    ]
});