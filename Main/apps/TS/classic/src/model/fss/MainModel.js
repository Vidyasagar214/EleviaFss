/**
 * Created by steve.tess on 5/17/2016.
 */
Ext.define('TS.model.fss.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.fss-main',

    stores: {
        fsslist: {
            model: 'TS.model.fss.FssList'
        },
        fsslisteast: {
            model: 'TS.model.fss.FssList'
        }
    },

    constructor: function (config) {
       var store,
            storeEast,
            isLeft = true,
            isRight = !isLeft,
            settings = TS.app.settings,
            appAccessRaw = settings.appAccess.split('^'),
            appAccess = appAccessRaw.filter(function (el) {
                return el != '';
            }),
            appAccessRORaw = settings.appAccessRO.split('^'),
            appAccessRO = appAccessRORaw.filter(function (el) {
                return el != '';
            }),
            appCt = appAccess.length,
            appROCt = appAccessRO.length,
            gridEast = Ext.first('fss-list-east'),
            gridWest = Ext.first('fss-list'),
            //dummyColumn = Ext.first('fss-list').getColumns()[0],
            schedulerBtn = Ext.first('#schedulerButton'),
            schedulerMainBtn = Ext.first('#schedulerCalendarViewButton'),
            schedulerCrewTaskBtn = Ext.first('#schedulerCrewTaskButton'),
            expensesBtn = Ext.first('#expensesButton'),
            expensesApprovalBtn = Ext.first('#expensesApprovalButton'),
            fwaBtn = Ext.first('#fwaButton'),
            timesheetBtn = Ext.first('#timesheetButton'),
            timesheetApprovalBtn = Ext.first('#timesheetApprovalButton'),
            emp;

        this.callParent([config]);
        //PRESET VARIABLES
        settings.noSchedAccess = true;
        settings.noFwaAccess = true;
        settings.noTimesheetAccess = true;
        settings.noExpenseAccess = true;

        settings.schedReadOnly = false;
        settings.fwaReadOnly = false;
        settings.timesheetReadOnly = false;
        settings.expenseReadOnly = false;

        store = this.getStore('fsslist');
        storeEast = this.getStore('fsslisteast');

        if ((appCt >= 2 || appROCt >= 2) || (appCt + appROCt >= 2) || appAccess.indexOf('FS') >= 0) {
            gridEast.setHidden(false);
            var sched = settings.schedTitle;
            if (appAccess.indexOf('FS') >= 0 || appAccessRO.indexOf('FS') >= 0) {
                // schedulerMainBtn.setHidden(false);
                // schedulerBtn.setHidden(false);
                schedulerMainBtn.setText(settings.schedTitle + ' - Calendar View');
                schedulerBtn.setText(settings.schedTitle + ' - List View');
                if (isLeft) {
                    store.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - Calendar View',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-calendar',
                        activeTab: 'tabSchedulerPanel'
                    });
                    isLeft = false;
                } else {
                    storeEast.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - Calendar View',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-calendar',
                        activeTab: 'tabSchedulerPanel'
                    });
                    isLeft = true;
                }

                if (isLeft) {
                    isLeft = false;
                    store.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - List View',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-fwa-list',
                        activeTab: 'tabFwaPanel'
                    });
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - List View',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-fwa-list',
                        activeTab: 'tabFwaPanel'
                    });
                }

                // if (isLeft) {
                //     isLeft = false;
                //     store.add({
                //         app: 'Scheduler',
                //         name: sched.toUpperCase() + ' - Crew Assign',
                //         path: 'app-Scheduler',
                //         icon: 'fss-sch-fwa-list',
                //         activeTab: 3
                //     });
                // } else {
                //     isLeft = true;
                //     storeEast.add({
                //         app: 'Scheduler',
                //         name: sched.toUpperCase() + ' - Crew Assign',
                //         path: 'app-Scheduler',
                //         icon: 'fss-sch-fwa-list',
                //         activeTab: 3
                //     });
                // }

                if (isLeft) {
                    isLeft = false;
                    store.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - Employee Schedule',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-employee-schedule',
                        activeTab: 'tabEmployeeViewGanttPanel'
                    });
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - Employee Schedule',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-employee-schedule',
                        activeTab: 'tabEmployeeViewGanttPanel'
                    });
                }

                if (isLeft) {
                    isLeft = false;
                    store.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - ' + settings.crewLabel + ' Tasks',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-crew-task-list',
                        activeTab: 'tabCrewTaskPanel'
                    });
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'Scheduler',
                        name: sched.toUpperCase() + ' - ' + settings.crewLabel + ' Tasks',
                        path: 'app-Scheduler',
                        icon: 'fss-sch-crew-task-list',
                        activeTab: 'tabCrewTaskPanel'
                    });
                }
                if (appAccess.indexOf('FS') >= 0) {
                    settings.noSchedAccess = false;
                }
                if (appAccessRO.indexOf('FS') >= 0) {
                    settings.schedReadOnly = true;
                }
            }
            if (appAccess.indexOf('FF') >= 0 || appAccessRO.indexOf('FF') >= 0) {
                //fwaBtn.setHidden(false);
                if (isLeft) {
                    isLeft = false;
                    store.add({app: 'FWA', name: settings.fwaLabelPlural, path: 'app-fwa', icon: 'fss-fwa-list'});
                } else {
                    isLeft = true;
                    storeEast.add({app: 'FWA', name: settings.fwaLabelPlural, path: 'app-fwa', icon: 'fss-fwa-list'});
                }
                if (appAccess.indexOf('FF') >= 0) {
                    settings.noFwaAccess = false;
                }
                if (appAccessRO.indexOf('FF') >= 0) {
                    settings.fwaReadOnly = true;
                }
            }
            if (appAccess.indexOf('FT') >= 0 || appAccessRO.indexOf('FT') >= 0) {
                //timesheetBtn.setHidden(false);
                if (isLeft) {
                    isLeft = false;
                    store.add({app: 'TS', name: settings.tsTitle + 's', path: 'app-ts', icon: 'fss-timesheet'});
                } else {
                    isLeft = true;
                    storeEast.add({app: 'TS', name: settings.tsTitle + 's', path: 'app-ts', icon: 'fss-timesheet'});
                }
                if (appAccess.indexOf('FT') >= 0) {
                    settings.noTimesheetAccess = false;
                }
                if (appAccessRO.indexOf('FT') >= 0) {
                    settings.timesheetReadOnly = true;
                }
            }

            if (appAccess.indexOf('FE') >= 0 || appAccessRO.indexOf('FE') >= 0) {
                //expensesBtn.setHidden(false);
                if (isLeft) {
                    isLeft = false;
                    store.add({app: 'EXP', name: 'Expenses', path: 'app-exp', icon: 'fss-expenses'});
                } else {
                    isLeft = true;
                    storeEast.add({app: 'EXP', name: 'Expenses', path: 'app-exp', icon: 'fss-expenses'});
                }
                if (appAccess.indexOf('FE') >= 0) {
                    settings.noExpenseAccess = false;
                }
                if (appAccessRO.indexOf('FE') >= 0) {
                    settings.expenseReadOnly = true;
                }
            }

            if (settings.tsIsApprover) {
                //timesheetApprovalBtn.setHidden(false);
                if (isLeft) {
                    isLeft = false;
                    store.add({
                        app: 'TSA',
                        name: settings.tsTitle + ' Approval',
                        path: 'app-tsa',
                        icon: 'fss-timesheet-approval'
                    });
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'TSA',
                        name: settings.tsTitle + ' Approval',
                        path: 'app-tsa',
                        icon: 'fss-timesheet-approval'
                    });
                }
            }

            if (settings.exIsApprover) {
                //expensesApprovalBtn.setHidden(false);
                if (isLeft) {
                    isLeft = false;
                    store.add({app: 'EXA', name: ' Expense Approval', path: 'app-exa', icon: 'fss-expense-approval'});
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'EXA',
                        name: ' Expense Approval',
                        path: 'app-exa',
                        icon: 'fss-expense-approval'
                    });
                }
            }

            if (settings.canAccessUtilitiesPage) {
                if (isLeft) {
                    isLeft = false;
                    store.add({app: 'UTILITIES', name: 'Utilities', path: 'app-util', icon: 'fss-utilities'});
                } else {
                    isLeft = true;
                    storeEast.add({
                        app: 'UTILITIES',
                        name: 'Utilities',
                        path: 'app-util',
                        icon: 'fss-utilities'
                    });
                }
            }
        } else {
            gridEast.setHidden(false);
            gridEast.setFlex(.5);
            if (appAccess.indexOf('FS') >= 0 || appAccessRO.indexOf('FS') >= 0) {
                // schedulerMainBtn.setHidden(false);
                // schedulerBtn.setHidden(false);
                schedulerMainBtn.setText(settings.schedTitle + ' - Calendar View');
                schedulerBtn.setText(settings.schedTitle + ' - List View');
                store.add({
                    app: 'Scheduler',
                    name: settings.schedTitle + ' - Calendar View',
                    path: 'app-Scheduler',
                    icon: 'fss-sch-calendar',
                    activeTab: 1
                });

                store.add({
                    app: 'Scheduler',
                    name: settings.schedTitle + ' - List View',
                    path: 'app-Scheduler',
                    icon: 'fss-sch-fwa-list',
                    activeTab: 2
                });

                store.add({
                    app: 'Scheduler',
                    name: settings.schedTitle + ' - ' + ' Employee Schedule',
                    path: 'app-Scheduler',
                    icon: 'fss-sch-employee-schedule',
                    activeTab: 5
                });

                store.add({
                    app: 'Scheduler',
                    name: settings.schedTitle + ' - ' + settings.crewLabel + ' Tasks',
                    path: 'app-Scheduler',
                    icon: 'fss-sch-crew-task-list',
                    activeTab: 6
                });

                if (appAccess.indexOf('FS') >= 0) {
                    settings.noSchedAccess = false;
                }
                if (appAccessRO.indexOf('FS') >= 0) {
                    settings.schedReadOnly = true;
                }
            }
            if (appAccess.indexOf('FF') >= 0 || appAccessRO.indexOf('FF') >= 0) {
                //fwaBtn.setHidden(false);
                store.add({app: 'FWA', name: settings.fwaLabelPlural, path: 'app-fwa', icon: 'fss-fwa-list'});
                if (appAccess.indexOf('FF') >= 0) {
                    settings.noFwaAccess = false;
                }
                if (appAccessRO.indexOf('FF') >= 0) {
                    settings.fwaReadOnly = true;
                }
            }
            if (appAccess.indexOf('FT') >= 0 || appAccessRO.indexOf('FT') >= 0) {
                //timesheetBtn.setHidden(false);
                store.add({app: 'TS', name: settings.tsTitle + 's', path: 'app-ts', icon: 'fss-timesheet'});
                if (appAccess.indexOf('FT') >= 0) {
                    settings.noTimesheetAccess = false;
                }
                if (appAccessRO.indexOf('FT') >= 0) {
                    settings.timesheetReadOnly = true;
                }
            }

            if (settings.tsIsApprover) {
                //timesheetApprovalBtn.setHidden(false);
                store.add({
                    app: 'TSA',
                    name: settings.tsTitle + ' Approval',
                    path: 'app-tsa',
                    icon: 'fss-timesheet-approval'
                });
            }

            if (appAccess.indexOf('FE') >= 0 || appAccessRO.indexOf('FE') >= 0) {
                //expensesBtn.setHidden(false);
                store.add({app: 'EXP', name: ' Expenses', path: 'app-exp', icon: 'fss-expenses'});
                if (appAccess.indexOf('FE') >= 0) {
                    settings.noExpenseAccess = false;
                }
                if (appAccessRO.indexOf('FE') >= 0) {
                    settings.expenseReadOnly = true;
                }
            }

            if (settings.exIsApprover) {
                //expensesApprovalBtn.setHidden(false);
                store.add({app: 'EXA', name: ' Expense Approval', path: 'app-exa', icon: 'fss-expense-approval'});
            }

            if (settings.canAccessUtilitiesPage) {
                store.add({app: 'UTILITIES', name: 'Utilities', path: 'app-util', icon: 'fss-utilities'});
            }

        }

        if ((appCt + appROCt) >= 2 && (appCt + appROCt % 2) != 0) {
            storeEast.add({});
        }

    },

    //Main model will implement this method
    getPageTitle: function () {
        return 'FSS';
    }

})
;