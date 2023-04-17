Ext.define('TS.view.crew.window.Legend', {
    extend: 'Ext.window.Window',
    xtype: 'pie-basic',

    requires: [
        'TS.controller.crew.LegendController',
        'TS.chart.theme.Basic',
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'pie-basic',
    modal: true,

    width: 700,
    height: 425,

    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Status Colors'},

    layout: 'fit',
    closable: true,

    items: [{
        xtype: 'polar',
        reference: 'chart',
        theme: 'basic',
        insetPadding: 50,
        innerPadding: 20,

        store: {
            fields: ['status', 'data1'],
            data: [
                {status: 'Creating', data1: 11.11},
                {status: 'Not Available for field use', data1: 11.11},
                {status: 'Scheduled', data1: 11.11},
                {status: 'Saved', data1: 11.11},
                {status: 'In Progress', data1: 11.11},
                {status: 'In Progress/Saved past due', data1: 11.11},
                {status: 'Submitted', data1: 11.11},
                {status: 'Approved', data1: 11.11},
                {status: 'Holiday', data1: 11.11}
            ]
        },
        bind:{
            colors: [
                '{colorCreating}',
                '{colorNotAvailableForField}',
                '{colorScheduled}',
                '{colorSaved}',
                '{colorInProgress}',
                '{colorProgressSavedPastDue}',
                '{colorSubmitted}',
                '{colorApproved}',
                '{colorHoliday}'
            ]
        },
        legend: {
            docked: 'left'
        },
        interactions: ['rotate'],
        series: [{
            type: 'pie',
            angleField: 'data1',
            label: {
                field: 'status',
                calloutLine: {
                    length: 60,
                    width: 1
                }
            },
            highlight: true,
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
    }],

    buttons: [
        {
            text: 'Close',
            align: 'right',
            handler: 'onCloseWindow'
        }
    ]
});
