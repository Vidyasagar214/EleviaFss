/**
 * Created by steve.tess on 9/4/2016.
 */
Ext.define('TS.model.fwa.FwaAction', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'actionItemId', type: 'string'},
        {name: 'actionItemDescr', type: 'string'},
        {name: 'actionTypeId', type: 'string'},
        {name: 'actionOwnerId', type: 'string'},
        {name: 'actionDateCompleted', type: 'date', dateFormat: 'c'},
        {name: 'actionNotes', type: 'string'},
        {name: 'actionTempSaveData', type: 'string'},
        // temp data to pass change info from UI to BL (only 1 of the following, in order)
        //   "Completed" = actionDateCompleted was added or changed
        //   "Owner" = actionOwnerId added/changed
        //   "New" = new record
        {name: 'tempDateCompleted', type: 'date', dateFormat: 'c'},
        {name: 'tempOwnerId', type: 'string'},
        {name: 'tempNew', type: 'bool'}
    ]
});