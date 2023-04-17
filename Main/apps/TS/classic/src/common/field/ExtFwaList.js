/**
 * Created by steve.tess on 8/10/2018.
 */
Ext.define('TS.common.field.ExtFwaList', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-expfwalist',

    requires: [
        'TS.store.ExpFwaList'
    ],

    valueField: 'fwaNum',
    displayField: 'fwaName',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{fwaNum} - {fwaName}</div></tpl>',
    displayTpl: '<tpl for=".">{fwaNum}</tpl>',

    store: 'ExpFwaList',
    // store:{
    //     model: 'TS.model.fwa.ExpFwaModel',
    //     proxy: {
    //         type: 'default',
    //         directFn: 'Fwa.GetExpenseFwaList',
    //         paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler',
    //         extraParams: {
    //             startDate: '',
    //             isPreparer: 'N',
    //             isScheduler: false
    //         }
    //     },
    //     sorters: [{
    //         property: 'fwaName',
    //         direction: 'ASC'
    //     }]
    // },

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
    }
});