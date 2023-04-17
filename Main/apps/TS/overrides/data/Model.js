Ext.define('TS.overrides.data.Model', {
    override: 'Ext.data.Model',
    compatibility: '6.0.2',

    /**
     * Called when an associated record instance has been set.
     * @param {Ext.data.Model} record The record.
     * @param {Ext.data.schema.Role} role The role.
     *
     * @private
     */
    onAssociatedRecordSet: function (record, role) {
        this.callJoined('afterAssociatedRecordSet', [record, role]);
    },

    inheritableStatics: {
        /**
         * Creates new model and it's associations 
         * @param data Optional data to initialize with
         */
        createWithAssociations: function (data) {
            var data = data || {},
                associations = this.extractAssociations(),
                obj = Ext.applyIf(data, associations);
            
            return this.getProxy().getReader().read([obj]).getRecords()[0];
        },

        extractAssociations: function () {
            var associations = this.associations,
                key,
                obj = {};

            for (key in associations) {
                //Return only direct associations with defined model
                if(associations[key].hasOwnProperty('model') && key.indexOf('.') === -1) {
                    obj[associations[key].role] = associations[key].single ? {} : [];
                }
            }

            return obj;
        }
    }

});
