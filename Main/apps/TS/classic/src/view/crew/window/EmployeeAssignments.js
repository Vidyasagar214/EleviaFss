/**
 * Created by steve.tess on 11/5/2016.
 */
Ext.define('TS.view.crew.window.EmployeeAssignments', {
    extend: 'Ext.window.Window',

    xtype: 'employeeassignments',

    title: 'Employee Assignments',
    width: 900,
    height: 350,
    scrollable: true,

    items: [
        // {
        //     xtype: 'grid-crewassign'
        // },
        {

        }
    ],

    buttons: [
        // {
        //     text: 'Select',
        //     handler: 'onSaveCrewAssign'
        // },
        {
            text: 'Close',
            handler: 'onCancelCrewAssign'
        }
    ]
});