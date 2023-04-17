Ext.define('TS.view.crew.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'viewport-crew',

    requires: [
        'TS.view.crew.CrewTaskPanel',
        'TS.view.crew.EmployeeViewGantt',
        'TS.view.crew.EmployeeViewPanel'
    ],

    controller: 'viewport-crew',

    viewModel: {
        type: 'crew'
    },

    config: {
        height: '50%',
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                reference: 'crewTabPanel',
                itemId: 'crewTabPanel',
                bind: {
                    activeTab: '{settings.activeSchedTab}'
                },
                tabPosition: 'bottom',
                tabBar: {
                    layout: {pack: 'center'}
                },

                items: [
                    {
                        xtype: 'panel',
                        hidden: true,
                        reference: 'emptyPanel',
                        tabConfig: {
                            listeners: {
                                activate: function () {
                                }
                            }
                        }
                    },
                    {
                        xtype: 'panel-crew',
                        reference: 'tabCrewPanel',
                        itemId: 'tabCrewPanel',
                        title: {_tr: 'crewLabel'},
                        tabConfig: {
                            listeners: {
                                activate: function () {
                                    if (!TS.app.settings.crewLoaded) {
                                        TS.app.settings.crewLoaded = true;
                                        Ext.GlobalEvents.fireEvent('ResetCrews');
                                    }
                                    if (TS.app.settings.crewNeedsRefresh) {
                                        TS.app.settings.crewNeedsRefresh = false;
                                        Ext.GlobalEvents.fireEvent('ResetCrews');
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'panel-scheduler',
                        reference: 'tabSchedulerPanel',
                        itemId: 'tabSchedulerPanel',
                        title: 'Scheduler',
                        tabConfig: {
                            listeners: {
                                activate: function () {
                                    if (!TS.app.settings.schedulerGanttLoaded) {
                                        TS.app.settings.schedulerGanttLoaded = true;
                                        Ext.GlobalEvents.fireEvent('updateSchedulerStores');
                                    }
                                    if (TS.app.settings.schedulerNeedsRefresh) {
                                        TS.app.settings.schedulerNeedsRefresh = false;
                                        Ext.GlobalEvents.fireEvent('updateSchedulerStores');
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'panel-fwa',
                        resizable: false,
                        reference: 'tabFwaPanel',
                        itemId: 'tabFwaPanel',
                        title: {_tr: 'fwaAbbrevLabel', tpl: '{0}s'},
                        tabConfig: {
                            listeners: {
                                activate: function (me, opts) {
                                    if (!TS.app.settings.fwaListLoaded) {
                                        TS.app.settings.fwaListLoaded = true;
                                        Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler');
                                    }
                                    if (TS.app.settings.fwaListNeedsRefresh) {
                                        TS.app.settings.fwaListNeedsRefresh = false;
                                        Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler');
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'panel-crewassign',
                        reference: 'tabCrewAssignPanel',
                        itemId: 'tabCrewAssignPanel',
                        title: {
                            _tr: 'crewLabel', tpl: '{0} Assign'
                        },
                        tabConfig: {
                            listeners: {
                                activate: function (me, opts) {
                                    if (!TS.app.settings.crewAssignLoaded) {
                                        TS.app.settings.crewAssignLoaded = false;
                                        Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                                    }
                                    if (TS.app.settings.crewAssignNeedsRefresh) {
                                        TS.app.settings.crewAssignNeedsRefresh = false
                                        Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                                    }
                                }
                            }
                        }
                    },
                    // {
                    //     xtype: 'panel-employeeview',
                    //     reference: 'tabEmployeeViewPanel',
                    //     title: 'Emp View',
                    //     hidden: true
                    //     //bind: { hidden: '{!settings.schedShowEmpViewTab}'}
                    // },
                    {
                        xtype: 'panel-employeeviewgantt',
                        reference: 'tabEmployeeViewGanttPanel',
                        itemId: 'tabEmployeeViewGanttPanel',
                        title: 'Emp Schedule',
                        tabConfig: {
                            listeners: {
                                activate: function () {
                                    if (!TS.app.settings.empScheduleGantt) {
                                        TS.app.settings.empScheduleGantt = true;
                                        Ext.GlobalEvents.fireEvent('ResetEmployeeGanttAfterFwaSave');
                                    }
                                    if (TS.app.settings.employeeGanttNeedsRefresh) {
                                        TS.app.settings.employeeGanttNeedsRefresh = false;
                                        Ext.GlobalEvents.fireEvent('ResetEmployeeGanttAfterFwaSave');
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'crewtaskpanel',
                        reference: 'tabCrewTaskPanel',
                        itemId: 'tabCrewTaskPanel',
                        title: {
                            _tr: 'crewLabel', tpl: '{0} Tasks'
                        },
                        tabConfig: {
                            listeners: {
                                activate: function () {
                                    if (!TS.app.settings.crewTaskLoaded) {
                                        TS.app.settings.crewTaskLoaded = true;
                                        Ext.GlobalEvents.fireEvent('ResetCrewTask');
                                    }
                                    if (TS.app.settings.crewTaskNeedsRefresh) {
                                        TS.app.settings.crewTaskNeedsRefresh = false;
                                        Ext.GlobalEvents.fireEvent('ResetCrewTask');
                                    }
                                }
                            }
                        }
                    }
                ],

                listeners: {
                    beforetabchange: 'beforeCrewTabpanelChange'
                    //tabchange: 'onCrewTabpanelChange'
                }

            }]
    }
})
;
