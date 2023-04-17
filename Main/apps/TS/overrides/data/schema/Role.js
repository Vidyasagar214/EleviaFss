Ext.define('TS.overrides.data.schema.Role', {
    override: 'Ext.data.schema.Role',
    compatibility: '6.0.2',

    doSetFK: function (leftRecord, rightRecord, options, scope) {
        // Consider the Department entity with a managerId to a User entity. This method
        // is the guts of the setManager method that we place on the Department entity to
        // store the User entity. We are the "manager" role and that role describes a
        // User. This method is called, however, given a Department (record) and the User
        // (value).

        var me = this,
            foreignKey = me.association.getFieldName(),  // "managerId"
            instanceName = me.getInstanceName(),  // "manager"
            current = leftRecord[instanceName],
            inverse = me.inverse,
            inverseSetter = inverse.setterName,  // setManagerDepartment for User
            session = leftRecord.session,
            modified, oldInstanceName;

        if (rightRecord && rightRecord.isEntity) {
            if (current !== rightRecord) {
                oldInstanceName = me.getOldInstanceName();
                leftRecord[oldInstanceName] = current;
                leftRecord[instanceName] = rightRecord;
                if (current && current.isEntity) {
                    current[inverse.getInstanceName()] = undefined;
                }
                if (foreignKey) {
                    leftRecord.set(foreignKey, rightRecord.getId());
                }
                delete leftRecord[oldInstanceName];
                leftRecord.onAssociatedRecordSet(rightRecord, me);

                if (inverseSetter) {
                    // Because the rightRecord has a reference back to the leftRecord
                    // we pass on to its setter (if there is one). We've already set
                    // the value on this side so we won't recurse back-and-forth.
                    rightRecord[inverseSetter](leftRecord);
                }
            }
        } else {
            // The value we received could just be the id of the rightRecord so we just
            // need to set the FK accordingly and cleanup any cached references.

            //<debug>
            if (!foreignKey) {
                Ext.raise('No foreignKey specified for "' + me.association.left.role +
                    '" by ' + leftRecord.$className);
            }
            //</debug>

            modified = (leftRecord.changingKey && !inverse.isMany) || leftRecord.set(foreignKey, rightRecord);
            // set returns the modifiedFieldNames[] or null if nothing was change

            if (modified && current && current.isEntity && !current.isEqual(current.getId(), rightRecord)) {
                // If we just modified the FK value and it no longer matches the id of the
                // record we had cached (ret), remove references from *both* sides:
                leftRecord[instanceName] = undefined;
                if (!inverse.isMany) {
                    current[inverse.getInstanceName()] = undefined;
                }
            }
        }

        if (options) {
            if (Ext.isFunction(options)) {
                options = {
                    callback: options,
                    scope: scope || leftRecord
                };
            }
            return leftRecord.save(options);
        }
    }
});