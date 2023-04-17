/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.view.exa.ExpApprovalDateList', {
    extend: 'Ext.grid.Panel',

    xtype: 'expapprovaldatelist',

    rowLines: false,

    bind: {
        store: '{expapprovaldatelist}'
    },

    columns:[
        {
            dataIndex: 'expReportId',
            hidden: true
        },
        {
            xtype: 'datecolumn',
            align: 'center',
            text: 'Date',
            dataIndex: 'value',
            filter: {
                type: 'date'
            },
            plugins: 'responsive',
            flex: .75,
            format: ' m/d/Y',
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
                return !badDate ? formattedDate : '';
            }
        }
    ],

    buttons: [
        {
            text: 'Open',
            handler: 'selectExpenseApprovalDate',
            itemId: 'selectExpApprovalDateButton',
            disabled: true
        },
        {
            text: 'Cancel',
            align: 'right',
            handler: 'onCloseSelectExpense'
        }
    ],

    listeners: {
        itemclick: 'onExpApprovalDateClick'
    }

});