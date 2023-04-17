/**
 * Created by steve.tess on 7/11/2018.
 */
Ext.define('TS.common.field.ExpCategory', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-expensecategory',

    valueField: 'category',
    displayField: 'description',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{description}</div></tpl>',
    displayTpl: '<tpl for=".">{description}</tpl>',

    store: 'ExpCategory',

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
        // ,
        // change: function (obj, newValue, oldValue) {
        //
        //     if(!Ext.first('#employeeExpensesGrid')) return;
        //
        //
        //     var me = this,
        //         store = obj.getStore(),
        //         row = Ext.first('#employeeExpensesGrid').getSelection(),
        //         categoryRecord = store.findRecord('category', newValue),
        //         wbs1Field = Ext.first('#fwawbs1id'),
        //         wbs1Store = wbs1Field.getStore(),
        //         chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType'),
        //         billableField = row[0].get('billable'),
        //         accountField = row[0].get('account'),
        //         accountStore = Ext.getStore('ExpAccount');
        //
        //     accountStore.clearFilter();
        //     if (chargeType == 'R') {
        //         accountStore.filter('useOnRegularProjects', true);
        //         if (billableField) {
        //             accountField = categoryRecord.get('defaultRegularBillableAccount');
        //         } else {
        //             accountField = categoryRecord.get('defaultRegularNonbillableAccount');
        //         }
        //         billableField = !settings.expDisplayBillable;
        //     } else {
        //         accountStore.filter('useOnRegularProjects', false);
        //         accountField = categoryRecord.get('defaultNonRegularAccount');
        //         billableField = false;
        //         //billableField.hidden = true;
        //     }
        // }
    }
});