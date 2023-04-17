/**
 * Created by steve.tess on 11/5/2016.
 */
Ext.define('TS.controller.crew.EmployeeViewPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.employeeviewpanel',
    listen: {
        global: {
            'ResetEmployeeView': 'filterReset'
        }
    },

    init: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            label = Ext.first('#evCurrentDate');
        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y');
            vm.set('evCurrentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y'));
            vm.set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'Y-m-d'));
        }
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    filterReset: function () {
        var me = this,
            grid = Ext.first('#employeeViewGrid'),
            evCurrentDate = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y'),
            store = grid.getStore(),
            label = Ext.first('#evCurrentDate');

        store.clearFilter(true);
        store.getProxy().setExtraParams({
            dt: Ext.Date.add(new Date(), Ext.Date.DAY, 1).toDateString(),
            employeeId: TS.app.settings.empId
        });
        store.load();
        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y');
            me.getViewModel().set('evCurrentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y'));
            me.getViewModel().set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'Y-m-d'));
        }
    },

    filterLessThan: function (btn , pressed , eOpts) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#employeeViewGrid'),
            store = grid.getStore();

        if(!pressed){
            store.clearFilter(true);
            btn.setText('< 8 Hrs');
            btn.setTooltip('View Hours < 8');
        }
        else {
            store.filterBy(function (obj) {
                return obj.get('totalSchedHrs') < 8;
            });
            btn.setText('All Hrs');
            btn.setTooltip('View All Hrs');
        }

    },

    filterByLastDay: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#employeeViewGrid'),
            store = grid.getStore(),
            yesterday = Ext.Date.format(Ext.Date.add(new Date(vm.get('evCurrentDate')), Ext.Date.DAY, -1), 'm-d-Y');
        //console.log(yesterday);
        vm.set('evCurrentDate', yesterday);
        vm.set('dateDisplay', Ext.Date.format(new Date(yesterday), 'Y-m-d'));
        //store.clearFilter(true);
        store.getProxy().setExtraParams({
            dt: yesterday,
            employeeId: TS.app.settings.empId
        });
        store.load();
    },

    filterByToday: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#employeeViewGrid'),
            store = grid.getStore(),
            currentDt = Ext.Date.format(new Date(), 'm-d-Y');
        //console.log(currentDt);
        vm.set('evCurrentDate', currentDt);
        vm.set('dateDisplay', Ext.Date.format(new Date(vm.get('evCurrentDate')), 'Y-m-d'));
        //store.clearFilter(true);
        store.getProxy().setExtraParams({
            dt: currentDt,
            employeeId: TS.app.settings.empId
        });

        store.load();
    },

    filterByNextDay: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#employeeViewGrid'),
            store = grid.getStore(),
            tomorrow = Ext.Date.format(Ext.Date.add(new Date(vm.get('evCurrentDate')), Ext.Date.DAY, 1), 'm-d-Y');
        //console.log(tomorrow);
        vm.set('evCurrentDate', tomorrow);
        vm.set('dateDisplay', Ext.Date.format(new Date(vm.get('tomorrow')), 'Y-m-d'));
        //store.clearFilter(true);
        store.getProxy().setExtraParams({
            dt: tomorrow,
            employeeId: TS.app.settings.empId
        });

        store.load();
    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openAboutFss: function(){
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    refreshEmployeeView: function (component, e) {
        var me = this,
            grid = Ext.first('#employeeViewGrid'),
            store = grid.getStore();

        store.reload();
    }


});