Ext.define('TS.model.shared.Photo', {
    extend: 'TS.model.Base',

    idProperty: 'photoId',

    fields: [
        {name: 'photoId', type: 'auto'},
        {name: 'owningModelType', type: 'auto'}, /* Fwa, Work */
        {name: 'modelId', type: 'auto'}, /* FwaId or WorkCodeId, depending on OwningModelType */
        {name: 'isSignature', type: 'auto', defaultValue: false}, /* True if this is a signature */
        {name: 'dateTaken	', type: 'auto'}, /* Auto-populated with the date the signature was actually captured */
        {name: 'photoData', type: 'auto'} /* The actual image */
    ],

    proxy: {
        type: 'default',
        directFn: 'Photo.GetList',
        paramOrder: 'dbi|username|owningModelType|modelId',
        api: {
            create: 'Photo.Save'
        }
    }

});
