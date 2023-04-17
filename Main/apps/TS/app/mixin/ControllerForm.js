Ext.define('TS.mixin.ControllerForm', {

    markDirty : function (type, form) {
        this.forms[type] = form;
        var button = this.lookup('saveButton'); // Ensure any form buttons have this ref
        button.setVisible(true);
    },

    /*
     Loads a form field, the value may be remote.
     record is an fwa model instance
     record[fn] is called to retrieve the value to set
     fieldName is the reference to the form field
     dataIndex for the location of the value in the returned model
     */

    loadField : function (record, fn, fieldName, dataIndex, callback, scope) {

        var field = this.lookup(fieldName);

        var options = {

            success : function (model) {

                field.suspendEvents();

                if (model) {
                    if (model.isModel) {
                        field.setValue(model.get(dataIndex));
                    }
                    else {
                        field.setValue(model);
                    }
                }
                else {
                    field.setValue('');
                }

                field.resumeEvents();

                if (callback) {
                    callback.call(scope, model);
                }

            },
            failure : function () {
                field.setValue('')
            }
        };

        record[fn].call(record, options, scope);
    },

    /*
     Reset the original values of a form. When the values are reset new dirty marks can be caught
     */

    resetOriginalValues : function (form) {

        var fields = form.getFields ? form.getFields() : form.getForm().getFields();
        fields.each(function (field) {
            field.resetOriginalValue();
        });

    }

});
