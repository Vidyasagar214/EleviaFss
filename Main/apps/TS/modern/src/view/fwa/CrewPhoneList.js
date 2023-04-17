/**
 * Created by steve.tess on 9/8/2016.
 */
Ext.define('TS.view.fwa.CrewPhoneList', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-crewphones',

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
            title: {_tr: 'crewLabel', tpl: '{0} Info'},
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
                data: '{crewPhoneList}'
            },
            itemTpl: new Ext.XTemplate('<div><b>{[this.getName(values)]}</b>&nbsp;&nbsp;&nbsp;&nbsp;Mobile:&nbsp;&nbsp;<a href="tel://{[this.getStrippedPhone(values)]}">{[this.getPhone(values)]}</a></div>',
                '<div><a href="mailto:{[this.getEmail(values)]}">{[this.getEmail(values)]}</a></div>',
                {
                    getName: function (values) {
                        return values.name;
                    },

                    getPhone: function (values) {
                        return values.phone; //123.123.1234
                    },

                    getStrippedPhone: function (values) {
                        return values.phone.replace(/[,.-]/g,'');
                    },

                    getEmail: function (values) {
                        return values.email; //name@mylocation.com
                    }
                }
            )
        }
    ]
});