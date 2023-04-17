/**
 * Created by steve.tess on 9/20/2018.
 */
Ext.define('TS.common.window.MyMessageBox', {
    extend: 'Ext.Sheet',
    xtype: 'my-messagebox',

    controller: 'fwa-edit',

    // stretchX: true,
    // stretchY: true,

    width: '75%',
    height: '75%',

    autoDestroy: true,

    layout: 'fit',

    items: [
        {
            xtype: 'panel',
            scrollable: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Details'},
                    items: [
                        {
                            align: 'right',
                            text: 'Close',
                            handler: 'closeSheet'
                        }
                    ]
                },
                {
                    xtype: 'displayfield',
                    reference:'myInfo'
                }
            ]
        }
    ]
});