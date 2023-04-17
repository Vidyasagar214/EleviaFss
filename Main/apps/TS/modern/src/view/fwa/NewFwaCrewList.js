Ext.define('TS.view.fwa.NewFwaCrewList', {
    extend: 'Ext.Sheet',

    xtype: 'newfwacrewlist',

    controller: 'fwa-edit',
    viewModel: 'fwa-main',

    stretchX: true,
    stretchY: true,
    layout: 'fit',
    autoDestroy: true,

    items:[
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'crewLabel', tpl: '{0} List'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: function (bt) {
                        var sheet = bt.up('sheet');
                        sheet.hide();
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            cls: 'taskList',
            //title: {_tr: 'fwaAbbrevLabel', tpl: 'New {0} Crew List'},
            reference: 'newFwaCrewGrid',
            itemId: 'newFwaCrewGrid',
            flex: 1,
            scrollable: true,
            hideHeaders: true,
            style: 'border-bottom: 1px solid blue;',
            columns: [
                {
                    dataIndex: 'crewId',
                    hidden: true
                },
                {
                    dataIndex: 'crewName',
                    flex: 1,
                    text: {_tr: 'crewLabel'},
                    align: 'center'
                }
            ],
            listeners: {
                selectionchange: 'onNewFwaCrewChange'
            }
        }
    ]
});