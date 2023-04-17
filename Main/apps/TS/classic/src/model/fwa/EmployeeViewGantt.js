/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.model.fwa.EmployeeViewGantt', {
    extend: 'Sch.model.Resource',

    idProperty: 'resourceId',
    identifier: 'uuid',
    fields: [
        {name: 'empId', type: 'string'},
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'empName', type: 'string'},
        {name: 'totalSchedHrs', type: 'float'},
        {name: 'fwaInfo', type: 'string'},
        {
            name: 'resourceId',
            type: 'string'
        }
    ]
});