Ext.define('TS.common.grid.Timesheet', {
	extend: 'Ext.grid.Panel',
    xtype: 'grid-timesheet',

    reference: 'tsGrid',
    
	columns: [{
		width: 100,
		xtype: 'datecolumn',
		text: 'Start Date',
		dataIndex: 'startDate',
		renderer: renderDate
	},{
		width: 100,
		xtype: 'datecolumn',
		text: 'End Date',
		dataIndex: 'endDate',
		renderer: renderDate
	},{
		width: 120,
		text: 'Status',
		dataIndex: 'statusString',
		renderer: function (value, metaData, record, row, col, store, gridView) {
		    return (value == 'Missing') ? '' : value;
		}
	}, {
		width: 150,
		text: 'Employee',
		dataIndex: 'tsEmpName'
	}],

    initComponent: function() {
		Ext.apply(this,{
            store: Ext.Object.merge((this.store||{}),{
                model: 'TS.model.ts.Tsheet',
                loader: {url: true}
        	})
        });
		this.callParent(arguments);
    },

	listeners: {
		selectionchange: 'onSelectTimesheet'
	}

});



