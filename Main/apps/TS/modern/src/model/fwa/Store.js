Ext.define('TS.model.fwa.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.fwalist',

    // Returns an serilized array containing record data.
    serialize: function(asString) {

        asString = ((asString === undefined) || (asString === null)) ? true : !!asString;


        // Local handy function that returns an array of a store's records's data.

        const getRecordsDataArray = (s) => s.getData().items.map(record => record.getData(true));

        // The code is tricky, because deep within the data is a record property that holds
        // a store -- fwa.units[].details. So we can't just serialize everything, because
        // we need to get the record data for that embedded store.

        // This could be done recursively -- the code does the same thing twice:
        // given a store, it converts it to an array of record data, then plucks off a property
        // that is itself another store. Then it converts that to an array of record data.

        let result = getRecordsDataArray(this).map(fwaData => {

            // Pluck off the units array.
            const data = Object.assign({}, fwaData); // Copy properties
            const units = data.units;
            delete data.units;

            // units.details -- if it exists -- contains a store
            const unitsResult = units.map(unitsData => {
                // Pluck off the details store
                const data = Object.assign({}, unitsData);
                const details = getRecordsDataArray(unitsData.details); // Use the data-ized store as the details property
                delete data.details;
                data.details = details;
                return data;
            });

            // Use the new version of units as the fwa data's units property.
            data.units = unitsResult;

            return data;
        });

        if (asString) {
            result = JSON.stringify(result);
            //result = result.replace(/(\d\d:\d\d:\d\d)(\.\d\d\dZ)/g, "$1");
            return result;
        } else {
            return result;
        }

    }

});