/**
 * Created by steve.tess on 7/9/2018.
 */
Ext.define('TS.model.shared.ExpCategory', {
    extend: 'TS.model.Base',

    idProperty: 'category',
    identifier: 'uuid',

    fields: [
        {name: 'category', type: 'int'},
        {name: 'description', type: 'string'},
        {name: 'detailType', type: 'string'},
        {name: 'billByDefault', type: 'bool'}, // Indicates starting value of "Bill" column checkbox
        {name: 'availableOnFWAs', type: 'bool'}, // True if can be used on FWAs

        {name: 'defaultRegularBillableAccount', type: 'string'}, // Project ChargeType=R and Billable checkbox checked
        {name: 'defaultRegularNonbillableAccount', type: 'string'}, // Project ChargeType=R and Billable checkbox unchecked
        {name: 'defaultNonRegularAccount', type: 'string'} // Project ChargeType<>R
    ],
    proxy: {
        type: 'default',
        directFn: 'Exp.GetExpCategories',
        paramOrder: 'dbi|username'
    }
});