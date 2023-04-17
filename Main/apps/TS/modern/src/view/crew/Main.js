/**
 * Created by steve.tess on 5/11/2017.
 */
Ext.define('TS.view.crew.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-crew',

    requires: [
        'TS.view.crew.Scheduler'
    ],

    fullscreen: true,

    controller: 'crew-main',
    viewModel: 'crew-main',

    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items:[
                {
                    xtype: 'titlebar',
                    cls: 'ts-navigation-header',
                    docked: 'top',
                    title: {_tr: 'schedTitle'},
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa  fa-home',
                            align: 'left',
                            handler: 'onBackToFSS',
                            bind: {
                                hidden: '{!fromFSS}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'scheduler',
                    flex: 1
                }
            ]
        }

    ]
});