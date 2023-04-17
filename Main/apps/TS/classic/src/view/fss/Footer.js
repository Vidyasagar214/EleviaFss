/**
 * Created by steve.tess on 11/19/2019.
 */
Ext.define('TS.view.fss.Footer', {
    extend: 'Ext.Toolbar',
    xtype: 'footer-fss',
    height: 60,
    layout: {
        type: 'hbox',
        pack: 'center',
        align: 'middle'
    },
    //hidden: true,
    style: 'background: #21639C !important;',

    items:[
        {
            xtype:'button',
            itemId: 'schedulerCalendarViewButton',
            hidden: true,
            //iconCls: 'fss-scheduler',
            margin: '0 20 0 0',
            border:0,
            //style: 'background: #21639C !important; color: white;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Schedule ' + TS.app.settings.fwaLabelPlural + ' and ' + TS.app.settings.crewLabelPlural + ' (Calendar View) ');
                }
            },
            handler: function(){
                TS.app.settings.activeSchedTab = 1;
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
            }
        },
        {
            xtype:'button',
            itemId: 'schedulerButton',
            hidden: true,
            iconCls: 'fss-scheduler-list',
            margin: '0 20 0 0',
            border:0,
            //style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Schedule ' + TS.app.settings.fwaLabelPlural + ' and ' + TS.app.settings.crewLabelPlural + ' (List View)');
                }
            },
            handler: function(){
                TS.app.settings.activeSchedTab = 2;
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
            }
        },
        {
            xtype:'button',
            itemId: 'schedulerCrewTaskButton',
            hidden: true,
            iconCls: 'fss-scheduler-list',
            margin: '0 20 0 0',
            border:0,
            //style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Schedule ' + TS.app.settings.fwaLabelPlural + ' and ' + TS.app.settings.crewLabelPlural + ' (Task)');
                }
            },
            handler: function(){
                TS.app.settings.activeSchedTab = 6;
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
            }
        },
        {
            xtype:'button',
            itemId: 'fwaButton',
            hidden: true,
            iconCls: 'fss-calendar',
            margin: '0 20 0 0',
            border:0,
            style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('View ' + TS.app.settings.fwaLabelPlural);
                }
            },
            handler: function(){
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'FWA');
            }
        },
        {
            xtype:'button',
            itemId: 'timesheetButton',
            hidden: true,
            iconCls: 'fss-timesheet',
            margin: '0 20 0 0',
            border:0,
            style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Track and Review Timesheets');
                }
            },
            handler: function(){
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'TS');
            }
        },
        {
            xtype:'button',
            itemId: 'timesheetApprovalButton',
            hidden: true,
            iconCls: 'fss-timesheet-approval',
            margin: '0 20 0 0',
            border:0,
            style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Review and Approve Timesheets');
                }
            },
            handler: function(){
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'TSA');
            }
        },
        {
            xtype:'button',
            itemId: 'expensesButton',
            hidden: true,
            iconCls: 'fss-expenses',
            border:0,
            style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Manage Expenses');
                }
            },
            handler: function(){
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'EXP');
            }
        },
        {
            xtype:'button',
            itemId: 'expensesApprovalButton',
            hidden: true,
            iconCls: 'fss-expenses-approval',
            border:0,
            style: 'background: #21639C !important;',
            listeners:{
                mouseover: function(a,b,c){
                    a.setTooltip('Review and Approve Expenses');
                }
            },
            handler: function(){
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'EXA');
            }
        },
        '->',
        {
            xtype: 'button',
            align: 'right',
            text: 'Utilities',
            handler: function () {
                window.open(TS.app.settings.customerUtilitiesLink);
            },
            bind: {
                hidden:'{!settings.showUtilitiesLink}'
            }
        },{
            xtype: 'button',
            align: 'right',
            cls: 'fss-link-button',
            text: 'FSS Tools',
            handler: function () {
                window.open(TS.app.settings.customerUtilitiesLink);
            },
            bind: {
                hidden:'{!settings.showUtilitiesLink}'
            }
        }
    ]
});