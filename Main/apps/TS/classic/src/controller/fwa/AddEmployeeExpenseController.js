/**
 * Created by steve.tess on 7/20/2018.
 */
Ext.define('TS.controller.fwa.AddEmployeeExpenseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addemployeeexpense',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    getCategoryDetails: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            reasonField = vw.lookup('reasonField'),
            otherField = vw.lookup('otherField'),
            milesField = vw.lookup('milesField'),
            billableField = vw.lookup('billableCheckbox'),
            record = Ext.getStore('ExpCategory').getById(newValue),
            detailType = record.get('detailType');

        reasonField.setHidden(true);
        otherField.setHidden(true);
        milesField.setHidden(true);

        switch(detailType){
            case 'M':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Travel From/To');
                milesField.setHidden(false);
                break;
            case 'B':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Name of each person');
                break;
            case 'G':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                break;
        }

        billableField.setValue(record.get('billByDefault'))
    }
});