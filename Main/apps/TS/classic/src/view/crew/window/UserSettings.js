Ext.define('TS.view.crew.window.UserSettings', {
    extend: 'Ext.window.Window',
    xtype: 'window-usersettings',
    modal: true,
    requires: [
        'TS.controller.crew.UserSettingsController',
        'TS.view.crew.window.UserForm'
    ],
    controller: 'window-usersettings',
    scrollable: true,

    items: [{
        xtype: 'form-usersettings'
    }],

    title: 'User Settings',
    layout: 'fit',
    closable: true,

    width: 380,
    height: 400,

    buttons: [
        {
            text: 'Save Filters',
            handler: 'saveSchedDefaults',
            align: 'left'
        }, '->',
        {
            text: 'Save Settings',
            handler: 'doSaveSettings',
            align: 'right'
        },
        {
            text: 'Cancel',
            handler: 'onCloseWindow',
            align: 'right'
        }
    ]
});
