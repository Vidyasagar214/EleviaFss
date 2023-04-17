Ext.define('TS.common.field.AllEmployee', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-allemployee',
   // requires: ['TS.model.shared.Employee'],

    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    //editable: false,
    queryMode: 'local',
    listConfig:{
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'AllEmployees',

    listeners: {
        expand: function (cb) {
            var store = cb.getStore();
            store.clearFilter();
            //store.filter('isScheduler', false);
        }
    }

});