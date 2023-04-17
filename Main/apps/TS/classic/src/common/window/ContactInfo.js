Ext.define('TS.common.window.ContactInfo', {
    extend: 'Ext.window.Window',
    xtype: 'window.contactinfo',

   // controller: 'window-contactinfo', //Empty controller

    title: 'Contact Information',
    width: 500,
    height: 350,
    bodyPadding: 10,
    defaultType: 'textfield',
    layout: 'anchor',

    items: [{
        name: 'name',
        fieldLabel: 'Name',
        labelWidth: 100,
        allowBlank: false,
        anchor: '100%'

    }, {
        name: 'title',
        fieldLabel: 'Title',
        labelWidth: 100,
        allowBlank: false,
        anchor: '100%'
    }, {
        name: 'phone',
        fieldLabel: 'Phone',
        labelWidth: 100,
        allowBlank: false,
        anchor: '100%'
    }, {
        name: 'email',
        fieldLabel: 'Email',
        labelWidth: 100,
        allowBlank: false,
        anchor: '100%',
        vtype: 'email',
        emailText: 'Sorry, please enter a valid email address'
    }],

    buttons: [{
        text: 'Save',
        handler: 'doSaveContactInfo'
    }]
});
