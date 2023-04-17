/**
 * Created by steve.tess on 7/3/2018.
 */
Ext.define('TS.view.crew.window.AboutFSS', {
    extend: 'Ext.window.Window',
    xtype: 'window-aboutfss',
    modal: true,

    title: 'About FSS',
    //layout: 'hbox',
    layout: {
        type: 'vbox',
        align: 'center',
        //pack: 'middle'
    },
    closable: true,

    width: 375,
    height: 300,

    items:[
        {
            xtype: 'image',
            imgCls: 'eleviaIcon',
            margin: '10 0 0 0'
        },
        {
            xtype: 'displayfield',
            value: '<b>Field Services Suite</b>',
        },
        {
            xtype: 'displayfield',
            //value: '<b>version: ' + VERSION.config.appVersion +'</b>',
            renderer: function(){
                /* start get and set timezone abbreviation */
                let timezone = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1],
                    tzSplit = timezone.split(' '),
                    tzAbbrev = '';
                Ext.each(tzSplit, function (tz) {
                    tzAbbrev += tz.substring(0, 1);
                });
                /* end get and set timezone abbreviation */
               return '<b>version: ' + VERSION.config.appVersion + '  ' + tzAbbrev + '</b>';
            }
        },
        {
            xtype: 'displayfield',
            itemId: 'ttlInfo'
        }
    ]
});