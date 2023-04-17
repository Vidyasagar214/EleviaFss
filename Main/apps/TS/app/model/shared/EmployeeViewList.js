/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.model.shared.EmployeeViewList', {
    extend: 'Ext.data.Model',

    idProperty: 'id',
    identifier: 'uuid',

    startDateField: 'startDateTime',
    endDateField: 'endDateTime',
    nameField: 'fwaName',
    resourceIdField: 'resourceId',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'empId', type: 'string'},
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'empName', type: 'string'},
        {name: 'schedHrs', type: 'float'},
        {name: 'fwaNum', type: 'string'},
        {name: 'fwaName', type: 'string'},
        {name: 'startDateTime', type: 'date'},
        {name: 'endDateTime', type: 'date'},
        {
            name: 'resourceId',
            mapping: function (data) {
                return data.empGroupId + ':' + data.empId
            }
        }
    ]
});