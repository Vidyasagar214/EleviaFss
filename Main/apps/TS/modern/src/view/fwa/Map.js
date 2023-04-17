Ext.define('TS.view.main.Map', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-map',

    includes: ['TS.controller.fwa.MapController'],
    controller: 'fwa-map',

    stretchX: true,
    stretchY: true,
    gmapType: 'map',

    layout: 'fit',

    items: [{
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Map',
            items: [{
                align: 'right',
                text: 'Close',
                //TODO move to controller
                handler: function(bt) {
                    var sheet = bt.up('sheet');

                    sheet.hide();
                }
            }]
        }
        // ,
        // {
        //     xtype: 'map',
        //     reference: 'gmap',
        //     mapOptions: {
        //         center: null,
        //         zoom: 11,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     },
        //     listeners: {
        //         maprender: 'onMapRender'
        //     }
        // }
    ]


});