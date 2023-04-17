/**
 * Created by steve.tess on 2/21/2017.
 */
Ext.define('TS.view.history.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'header-history',

    requires: [
        'TS.model.history.MainModel'
    ],

    cls: 'main-header',
    ui: 'header',
    viewModel: 'history-main',

    items: [
        '->',
        {
            xtype: 'label',
            reference: 'historyHeader'
        },
        '->'
    ]
});