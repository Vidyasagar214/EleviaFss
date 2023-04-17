Ext.define('TS.common.field.User', {

    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-user',

    valueField: 'userId',
    displayField: 'userName',
    matchFieldWidth: false,

    //TODO : fix store
    constructor: function (config) {

        /*this.store = Ext.create('CrewDesk.store.Users', {
         autoLoad : true
         });*/

        this.callParent(arguments);
    }

});
