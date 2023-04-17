Ext.define('TS.view.utilities.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-utilities',

    style: 'background: white !important;',
    requires: [
        'TS.controller.utilities.MainController',
        'TS.model.utilities.MainModel',
        'TS.view.utilities.Footer',
        'TS.view.utilities.Header'
    ],

    controller: 'utilities-main',
    viewModel: 'utilities-main',

    layout: 'border',
    items: [
        {
            xtype: 'header-utilities',
            region: 'north'
        },
        {
            xtype: 'header-two-utilities',
            region: 'north'
        },
        {
            xtype: 'panel',
            scrollable: 'y',
            region: 'center',
            layout: 'hbox',
            items: [
                {
                    xtype: 'utilities-list',
                    padding: '10 0 0 0',
                    bind: {
                        store: '{utilitieslist}'
                    },
                    flex: 1.25
                },
                {
                    xtype: "component",
                    style: 'background-color: #ededed;',
                    flex: 4,
                    itemId: 'iframeDisplay',
                    reference: 'iframeDisplay',
                    height: '100%',
                    // autoEl: {
                    //     tag: "iframe",
                    //     src: '' // "https://demo2.eleviasoftware.com/Brian/FSS_TEST_LINKS.HTML"
                    // }
                }
            ]
        },
        {
            xtype: 'footer-utilities',
            region: 'south'
        }

    ]

});