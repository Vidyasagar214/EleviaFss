/**
 * Created by steve.tess on 2/22/2017.
 */
Ext.define('TS.model.shared.History', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'username', type: 'string'},
        {name: 'action', type: 'string'},
        {name: 'actionDate', type: 'date', format: 'c'},
        {name: 'oldValue', type: 'string'},         // When action="Status Change" then = status ID
        {name: 'newValue', type: 'string'},         // When action="Status Change" then = status ID
        {name: 'emailRecipient', type: 'string'},   // Employee number
        {name: 'comments', type: 'string'}
    ]

});