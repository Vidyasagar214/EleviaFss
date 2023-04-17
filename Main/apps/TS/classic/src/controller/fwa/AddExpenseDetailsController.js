/**
 * Created by steve.tess on 7/20/2018.
 */
Ext.define('TS.controller.fwa.AddExpenseDetailsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addexpensedetails',

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            vw = me.getView();

        if (vw.expenseData)
            me.setExpenseDetails(vw.expenseData);
    },

    setExpenseDetails: function (data) {
        this.lookup("expenseDetailsForm").getForm().setValues({
            id: data.id,
            reason: data.reason,
            other: data.other,
            empId: data.empId,
            miles: data.miles,
            amountPerMile: data.amountPerMile,
            amount: data.amount
        });
    },

    /**
     * @param {Ext.Component} component
     */
    afterRenderDetails: function (component) {
        var me = this,
            vw = me.getView(),
            reasonField = vw.lookup('reasonField'),
            otherField = vw.lookup('otherField'),
            milesField = vw.lookup('milesField'),
            mileageRate = vw.lookup('amountPerMileField'),
            amountField = vw.lookup('amountField'),
            record = Ext.getStore('ExpCategory').getById(vw.expenseData.category),
            detailType = record.get('detailType');

        reasonField.setHidden(true);
        otherField.setHidden(true);
        milesField.setHidden(true);
        mileageRate.setHidden(true);
        amountField.setHidden(true);

        switch (detailType) {
            case 'M':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Travel From/To');
                milesField.setHidden(false);
                mileageRate.setHidden(false);
                amountField.setHidden(false);
                vw.setHeight(450);
                break;
            case 'B':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Name of each person');
                vw.setHeight(300);
                break;
            case 'G':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                vw.setHeight(225);
                break;
        }


    },

    setMileageAmount: function () {
        var me = this,
            vw = me.getView(),
            milesField = vw.lookup('milesField'),
            mileageRate = vw.lookup('amountPerMileField'),
            amountField = vw.lookup('amountField');

        amountField.setValue(milesField.getValue() * (mileageRate.getValue()*.01));
    },

    cancelDetails: function (component, e) {
        this.getView().close();
    },

    saveDetails: function (component, e) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            expense = vw.lookup("expenseDetailsForm").getForm().getValues(),
            grid = Ext.first('grid-employeeexpenses'),
            store = grid.getStore(),
            expenseLine,
            record;

        if (!expense.id) {
            expenseLine = Ext.create('TS.model.exp.Expense', {
                id: Ext.data.identifier.Uuid.Global.generate(),
                amount: expense.amount,
                reason: expense.reason,
                other: expense.other,
                miles: expense.miles
            });
            store.add(expenseLine);
        } else {
            record = store.findRecord('id', expense.id);
            record.set('amount', expense.amount);
            record.set('reason', expense.reason);
            record.set('other', expense.other);
            record.set('miles', expense.miles);
        }

        vw.close();
    }

});