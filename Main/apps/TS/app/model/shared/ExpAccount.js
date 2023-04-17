/**
 * Created by steve.tess on 8/3/2018.
 */
Ext.define('TS.model.shared.ExpAccount', {
    extend: 'TS.model.Base',

    idProperty: 'account',
    identifier: 'uuid',

    fields: [
        {name: 'account', type: 'string'},
        {name: 'accountName', type: 'string'},
        {name: 'useOnRegularProjects', type: 'bool'},
        {name: 'billable', type: 'bool'}

    ],
    proxy: {
        type: 'default',
        directFn: 'Exp.GetExpAccounts',
        paramOrder: 'dbi|username'
    }
});