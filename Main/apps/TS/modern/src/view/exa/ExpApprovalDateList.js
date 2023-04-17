/**
 * Created by steve.tess on 8/22/2018.
 */
Ext.define('TS.view.exa.ExpApprovalDateList', {
    extend: 'Ext.grid.Grid',
    xtype: 'exp-approval-date-list',

    isScheduler: false,
    scrollable: {
        directionLock: true,
        x: false
    },

    columns: [
        {
            text: 'Date',
            dataIndex: 'value',
            align: 'center',
            renderer: renderDate,
            flex: 1
        }
    ]
});