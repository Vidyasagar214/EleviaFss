Ext.define('TS.common.fwaview.FwaWorkCodes', {
    extend: 'Ext.Sheet',
    xtype: 'ts-fwaworkcodes',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'workCodeLabelPlural'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    //action: 'close'
                    handler: function(){
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'component',
            height: 25,
            docked: 'top',
            userCls: 'ts-user-details',
            bind: {
                data: {
                    settings: '{settings}'
                }
            },
            tpl: new Ext.XTemplate('<div class="workcode-header">',
                '<span><h2>{settings.workCodeLabel}</h2></span><span><h2>Scheduled</h2></span><span><h2>Actual</h2></span></div>')
        },
        {
            xtype: 'list',
            scrollable: 'y',
            itemCls: 'ts-user-details',
            itemTpl: new Ext.XTemplate('<div class="workcode-detail"><span>{workCodeAbbrev}</span><span>{scheduledHours}</span><span>{actualHours}</span></div>',
                '<div><b>Desc:</b> {[this.getDescription(values)]}</div>',
                '<div><b>Comments:</b> {comments}</div>',
                {
                    getDescription: function (values) {
                        var workCode = Ext.getStore('WorkCodes').getById(values.workCodeId);
                        return (workCode ? workCode.get('workCodeDescr') : '');
                    }
                }),

            itemHeight: 80, //making up some extra space
            onItemDisclosure: false,
            bind: {
                store: '{fwa.workSchedAndPerf}'
            }
        }
    ]

});






