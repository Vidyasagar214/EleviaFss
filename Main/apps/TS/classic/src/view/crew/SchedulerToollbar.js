Ext.define('TS.view.crew.SchedulerToolbar', {

    extend: 'Ext.toolbar.Toolbar',

    xtype: 'toolbar-scheduler',

    //ui: 'darkblue',
    //cls: 'toolbar-background',

    defaults: {
        xtype: 'button',
        width: 75
    },

    items: [
        // {
        //     xtype: 'tbspacer'
        // },
        // '->',
        {
            width: 70,
            iconCls: 'x-fa fa-home',
            align: 'left',
            handler: 'onBackToFSS',
            bind: {
                hidden: '{!fromFSS}'
            },
            tooltip: 'FSS application list'
        },
        {
            cls: 'home-button',
            width: 35,
            iconCls: 'iMessage',
            align: 'left',
            tooltip: 'Send text message',
            handler: 'onSendSMS',
            bind: {
                hidden: true //'{!isScheduler}'
            }
        },
        '->',
        {
            text: 'Max',
            iconCls: 'zoomMax',
            handler: 'zoomInFull',
            hidden: true
        },
        {
            text: 'Min',
            iconCls: 'zoomMin',
            handler: 'zoomOutFull',
            hidden: true
        },
        {
            text: 'Go to Date',
            handler: 'onGoToDate',
            width: 100
        },
        {
            iconCls: 'x-fa fa-calendar',
            reference: 'zoomWeeklyButton',
            handler: 'zoomToWeekly',
            tooltip: 'Week View'
        },
        {
            iconCls: 'x-fa fa-undo',
            handler: 'zoomToPreset',
            tooltip: 'Reset'
        },
        {
            iconCls: 'x-fa fa-minus-circle',
            handler: 'zoomIn',
            tooltip: 'View Past Dates',
            reference: 'zoomInBtn',
            itemId: 'zoomInBtn'
        },
        {
            iconCls: 'x-fa fa-plus-circle',
            handler: 'zoomOut',
            tooltip: 'View Ahead Dates',
            reference: 'zoomOutBtn',
            itemId: 'zoomOutBtn'
        },
        {
            iconCls: 'x-fa fa-arrow-left',
            handler: 'shiftPrevious',
            tooltip: 'Shift Previous'
        },
        {
            iconCls: 'x-fa fa-arrow-right',
            handler: 'shiftNext',
            tooltip: 'Shift Next'
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: 'New {0}'},
            reference: 'schedulerNewFwaBtn',
            itemId:'schedulerNewFwaBtn',
            handler: 'startNewFwa',
            width: '120',
            bind: {
                //tooltip: 'Create New {settings.fwaAbbrevLabel}',
                hidden: '{settings.schedReadOnly}'
            }
        },
        {
            text: 'Maps',
            handler: 'showFwaMap',
            tooltip: 'View Scheduled Location(s)'
        },
        // {
        //     iconCls: 'x-fa fa-calendar',
        //     handler: 'zoomToEntireMonth',
        //     tooltip: 'View By Month',
        //     // hidden: true
        // },
        '->',
        {
            iconCls: 'colorwheel', // 'x-fa fa-question',
            handler: 'openStatusLegend',
            tooltip: 'Color Legend'
        },
        {
            iconCls: 'printer',
            handler: 'printScheduleWindow',
            tooltip: 'Print Schedule',
            hidden: true
        },
        {
            iconCls: 'x-fa fa-refresh',
            align: 'right',
            tooltip: 'Refresh screen',
            itemId: 'refreshSchedulerButton',
            width: 25,
            handler: 'refreshSchedulerScreen'
        },
        {
            iconCls: 'x-fa fa-cogs',
            handler: 'openSettingsWindow',
            tooltip: 'User Settings'
        },
        {
            iconCls: 'x-fa fa-info-circle',
            width: 25,
            handler: 'openAboutFss',
            tooltip: 'About FSS'
        }
    ]
});
