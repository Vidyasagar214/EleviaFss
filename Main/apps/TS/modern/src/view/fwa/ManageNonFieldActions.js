/**
 * Created by steve.tess on 9/23/2016.
 */
Ext.define('TS.view.fwa.ManageNonFieldActions', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-nonfieldactions',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Non-Field Actions', //{_tr: 'fwaAbbrevLabel', tpl: '{0} Notes' },
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'list',
            // scrollable: {
            //     directionLock: true,
            //     x: false
            // },
            bind: {
                store: '{selectedFWA.nonFieldActions}'
            },
            itemTpl: new Ext.XTemplate('<table><tr><td><b>Action:</b></td><td>{[this.getAction(values)]}&nbsp;</td><td><b>Type:&nbsp;</b>{actionTypeId}</td></tr>' +
                '<tr><td><b>Assigned To:</b></td><td>{[this.getOwner(values)]}</td></tr>' +
                '<tr><td><b>Complete Date:</b></td><td>{[this.getFormattedDate(values)]}</td></tr></table>',
                '<div><b>Notes:&nbsp;</b>{actionNotes}</div>',
                {
                    getAction: function (values) {
                        return values.actionItemDescr != null ? values.actionItemDescr : '';
                    },
                    getType:function(values){

                    },
                    getOwner: function (values) {
                        var employee;
                        if (values.actionOwnerId)
                            employee = Ext.getStore('AllEmployees').getById(values.actionOwnerId);
                        return employee != null ? employee.get('empName') : '';
                    },
                    getNotes: function (values) {
                        return values.actionNotes != null ? values.actionNotes : '';
                    },
                    getFormattedDate: function (values) {
                        return values.actionDateCompleted != null ? Ext.Date.format(new Date(values.actionDateCompleted), DATE_FORMAT) : '';
                    }
                }
            ),
            listeners: {
                painted: function (me) {
                    var settings = TS.app.settings,
                        store = this.getStore();
                    //new code for pre=loaded actions
                    if (settings.fwaactionsInfo && settings.fwaactionsInfo.length > 0) {
                        Ext.each(settings.fwaactionsInfo, function (action) {
                            store.add(action);
                        });
                        settings.fwaactionsInfo = [];
                    }
                }
            }
        }
    ]
});