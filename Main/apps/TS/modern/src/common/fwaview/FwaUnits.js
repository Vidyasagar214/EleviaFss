/**
 * Created by steve.tess on 1/26/2017.
 */
Ext.define('TS.common.fwaview.FwaUnits', {
    extend: 'Ext.Sheet',
    xtype: 'ts-fwaunits',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'unitLabelPlural'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: function () {
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
                '<span><h2>{settings.unitLabel}</h2></span><span><h2>Name</h2></span><span><h2>Qty</h2></span></div>')
        },
        {
            xtype: 'list',
            scrollable: 'y',
            itemCls: 'ts-user-details',
            itemTpl: new Ext.XTemplate('<div class="workcode-detail"><span>{[this.getUnit(values)]}</span><span>{[this.getName(values)]}</span><span>{quantity}</span></div>',
                '<div><b>Equipment:</b> {[this.getEquipmentName(values)]}</div>',
                '<div><b>Comments:</b> {[this.getComments(values)]}</div>',
                {
                    getUnit: function (values) {
                        var record = Ext.getStore('UnitCode').getById(values.unitCodeId);
                        return (record ? record.get('unitCodeAbbrev') : 'N/A');
                    },
                    getName: function (values) {
                        var record = Ext.getStore('UnitCode').getById(values.unitCodeId);
                        return (record ? record.get('unitCodeName') : 'N/A');
                    },
                    getEquipmentName: function (values) {
                        return values.equipmentName ? values.equipmentName : '';
                    },
                    getComments: function (values) {
                        return values.comments ? values.coments : '';
                    }
                }),

            itemHeight: 80, //making up some extra space
            onItemDisclosure: false,
            bind: {
                store: '{fwa.units}'
            }
        }

    ]
});