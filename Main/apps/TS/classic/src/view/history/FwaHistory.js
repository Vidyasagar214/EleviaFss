/**
 * Created by steve.tess on 2/22/2017.
 */
Ext.define('TS.view.history.FwaHistory', {
    extend: 'Ext.grid.Panel',
    xtype: 'fwahistory',

    // requires: [
    //     'TS.model.history.MainModel'
    // ],
    //
    // //viewModel: 'history-main',

    bind: {
        store: '{fwaHistoryList}'
    },
    scrollable: true,
    columns: [
        {
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'actionDate',
            format: ' n/j/Y g:i A',
            flex: .75,
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(TS.common.Util.getInUTCDate(value), 'm/d/y g:i A');
                return !badDate ? formattedDate : '';
            }
        }, {
            text: 'Action',
            dataIndex: 'action',
            flex: 1
        }, {
            text: 'Current Value',
            dataIndex: 'newValue',
            flex: 1,
            renderer: function (value, meta, record) {
                if (record.get('action') == "Status Change") {
                    var status = Ext.getStore('FwaStatus').findRecord('value', value);
                    return status.get('description');
                } else {
                    return value;
                }
            }
        }, {
            text: 'Prior Value',
            dataIndex: 'oldValue',
            flex: 1,
            renderer: function (value, meta, record) {
                if (record.get('action') == "Status Change") {
                    var status = Ext.getStore('FwaStatus').findRecord('value', value);
                    return status.get('description');
                } else {
                    return value;
                }
            }
        }, {
            text: 'Email Recipient',
            dataIndex: 'emailRecipient',
            flex: 1,
            renderer: function (value) {
                var record = Ext.getStore('AllEmployees').getById(value);
                return (record ? record.get('lname') + ', ' + record.get('fname') : '');
            }
        }, {
            text: 'Comments',
            dataIndex: 'comments',
            flex: 2
        }
    ],

    buttons:[
        {
            text: 'Close',
            align: 'right',
            handler: 'onCloseHistory'
        }
    ],

    listeners: {
        render: 'getFwaInfo'
    }
});