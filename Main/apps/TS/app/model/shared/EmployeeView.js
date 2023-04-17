/**
 * Created by steve.tess on 11/5/2016.
 */
Ext.define('TS.model.shared.EmployeeView', {
    extend: 'Ext.data.Model',

    idProperty: 'id',
    identifier: 'uuid',
    fields: [
        //{name: 'id', type: 'auto'},
        {name: 'empId', type: 'string'},
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'empName', type: 'string'},
        {name: 'totalSchedHrs', type: 'float'},
        {name: 'fwaInfo', type: 'string'},
        {
            name: 'id',
            mapping: function (data) {
                return data.empGroupId + ':' + data.empId
            }
        }
    ]
});