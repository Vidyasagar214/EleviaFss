Ext.define('TS.common.grid.column.Hours', {
    extend: 'Ext.grid.column.Column',
    xtype: 'column-hours',

    text: null,
    menuDisabled: true,

    defaults: {
        xtype: 'numbercolumn',
        width: 65,
        minWidth: 56,
        summaryRenderer: 'columnSummaryTotal', // VC Method
        editor: 'numberfield',
        dataIndex: 'Cells', // No dataIndex, as these are rendered dynamically using the method below
        renderer: 'populateCellHours' // VC Method
    },

    config: {
        startDate: null,
        dayCount: null,
        isApproval: false
    },

    columns: [{
        hidden: true
    }],

    initComponent: function () {
        var me = this;
        me.on('render', function () {
            me.up('headercontainer').el.down('.x-column-header-inner').setStyle('display', 'none');
        });
        me.reconfigureColumns();
        me.callParent(arguments);
    },

    reconfigureColumns: function () {
        var me = this;
        if (me.getStartDate()) {
            var dt = me.getStartDate();
            // if (me.isApproval)
            //     dt = TS.common.Util.getInUTCDate(dt)
            // else
            //     dt = new Date((dt.getUTCMonth() + 1) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear());
            me.startDate = dt;
        }

        if (me.getDayCount() && me.getDayCount() > 0 && me.getStartDate()) {
            var columns = [],
                background = 'text-align:center;',
                date = me.getStartDate(),
                isHoliday;
            for (var i = 0; i < me.getDayCount(); i++) {
                //reset for each day
                background = 'text-align:center;';
                isHoliday = 0;
                isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
                    if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(date), DATE_FORMAT)) {
                        return rec;
                    }
                });
                isHoliday > -1 ? background += ' background: #00FFFF;' : background;
                columns.push({
                    text: Ext.Date.format(date, HOURS_DATE_FORMAT) + '<br/>' + Ext.Date.format(date, 'D'),
                    name: Ext.Date.toString(date),
                    menuDisabled: true,
                    draggable: false,
                    style: background,
                    tdCls: (isHoliday > -1 ? 'ts-holiday-column' : ''),
                    listeners: {
                        headerclick: 'headerClickStartEnd'
                    }
                });

                date = Ext.Date.add(date, Ext.Date.DAY, 1);
            }
            if (me.up('grid')) {
                while (me.items.length > 1) {
                    me.remove(me.items.getAt(1));
                }
                me.add(columns);
                me.getView().refresh();
            }
        }
    },

    updateStartDate: function () {
        this.reconfigureColumns();
    },

    updateDayCount: function () {
        this.reconfigureColumns();
    }
});
