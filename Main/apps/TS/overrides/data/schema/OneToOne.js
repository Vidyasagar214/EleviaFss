Ext.define('TS.overrides.data.schema.OneToOne', {
    override: 'Ext.data.schema.OneToOne',
    compatibility: '6.0.2',

    doSet: function (rightRecord, leftRecord) {
        // We are the guts of the setManagerDepartment method we place on the User
        // entity. Our goal here is to establish the relationship between the new
        // Department (leftRecord) and the User (rightRecord).

        var instanceName = this.getInstanceName(), // ex "managerDepartment"
            ret = rightRecord[instanceName],
            inverseSetter = this.inverse.setterName;  // setManager for Department

        if (ret !== leftRecord) {
            rightRecord[instanceName] = leftRecord;

            if (inverseSetter) {
                // Because the FK is owned by the inverse record, we delegate the
                // majority of work to its setter. We've already locked in the only
                // thing we keep on this side so we won't recurse back-and-forth.
                leftRecord[inverseSetter](rightRecord);
            }
            rightRecord.onAssociatedRecordSet(leftRecord, this);
        }

        return ret;
    }
});