/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.model.exp.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.exp-main',

    requires: [
        'TS.model.exp.Expense',
        'TS.model.exp.ExpenseReport'
    ],

    init: function () {
        var me = this;

        me.get('viewfwa').on('load', function (store, records) {
            me.set('fwa', records[0]);
        });
    },

    data: {
        isExa: false
    },

    stores: {
        expreportlist: {
            model: 'TS.model.exp.ExpenseReport',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetOpenExpReports',
                paramOrder: 'dbi|username|empId'
            }
        },

        explist: {
            model: 'TS.model.exp.Expense',
            proxy: {
                type: 'default',
                directFn: 'Exp.GetExpReport',
                paramOrder: 'dbi|username|expReportId',
                reader: {
                    type: 'default',
                    rootProperty: 'data.expLines'
                }
            }
        },

        viewfwa: {
            model: 'TS.model.fwa.Fwa',
            proxy: {
                type: 'default',
                directFn: 'Fwa.Get',
                paramOrder: 'dbi|username|id|fwaDate'
            }
        },

        signaturelist: {
            model: 'TS.model.shared.Attachment',
            sorters: [
                {
                    property: 'dateAttached',
                    direction: 'ASC'
                }
            ]
        }
    },

    formulas: {
        hideUdf_d1: function(){
            return TS.app.settings.fwaDisplay_udf_d1 === 'N';
        },
        hideUdf_d2: function(){
            return TS.app.settings.fwaDisplay_udf_d2 === 'N';
        },
        hideUdf_d3: function(){
            return TS.app.settings.fwaDisplay_udf_d3 === 'N';
        },
        hideUdf_c1: function(get){
            return TS.app.settings.fwaDisplay_udf_c1 === 'N';
        },

        readOnlyUdf_c1: function(get){
            return TS.app.settings.fwaDisplay_udf_c1 === 'RO';
        },

        hideUdf_a1_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N' || TS.app.settings.udf_a1_Type == 'dropdown';
        },
        hideUdf_a1_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a1 == 'N' || TS.app.settings.udf_a1_Type != 'dropdown';
        },

        hideUdf_a2_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N' || TS.app.settings.udf_a2_Type == 'dropdown';
        },
        hideUdf_a2_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a2 == 'N' || TS.app.settings.udf_a2_Type != 'dropdown';
        },

        hideUdf_a3_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N' || TS.app.settings.udf_a3_Type == 'dropdown';
        },
        hideUdf_a3_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a3 == 'N' || TS.app.settings.udf_a3_Type != 'dropdown';
        },

        hideUdf_a4_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N' || TS.app.settings.udf_a4_Type == 'dropdown';
        },
        hideUdf_a4_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a4 == 'N' || TS.app.settings.udf_a4_Type != 'dropdown';
        },

        hideUdf_a5_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N' || TS.app.settings.udf_a5_Type == 'dropdown';
        },
        hideUdf_a5_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a5 == 'N' || TS.app.settings.udf_a5_Type != 'dropdown';
        },

        hideUdf_a6_text: function (get) {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N' || TS.app.settings.udf_a6_Type == 'dropdown';
        },
        hideUdf_a6_combo: function (get) {
            return TS.app.settings.fwaDisplay_udf_a6 == 'N' || TS.app.settings.udf_a6_Type != 'dropdown';
        },
        hideUdf_a1_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a1 == 'N'
        },
        hideUdf_a2_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a2 == 'N'
        },
        hideUdf_a3_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a3 == 'N'
        },
        hideUdf_a4_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a4 == 'N'
        },
        hideUdf_a5_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a5 == 'N'
        },
        hideUdf_a6_all: function(get){
            return TS.app.settings.fwaDisplay_udf_a6 == 'N'
        },

        readOnlyUdf_a1: function(get){
            return TS.app.settings.fwaDisplay_udf_a1 === 'RO';
        },

        readOnlyUdf_a2: function(get){
            return TS.app.settings.fwaDisplay_udf_a2 === 'RO';
        },

        readOnlyUdf_a3: function(get){
            return TS.app.settings.fwaDisplay_udf_a3 === 'RO';
        },

        readOnlyUdf_a4: function(get){
            return TS.app.settings.fwaDisplay_udf_a4 === 'RO';
        },

        readOnlyUdf_a5: function(){
            return TS.app.settings.fwaDisplay_udf_a5 === 'RO';
        },

        readOnlyUdf_a6: function(){
            return TS.app.settings.fwaDisplay_udf_a6 === 'RO';
        },

        readOnlyUdf_l1: function(){
            return TS.app.settings.fwaDisplay_udf_l1 === 'RO';
        },

        readOnlyUdf_l2: function(){
            return TS.app.settings.fwaDisplay_udf_l2 === 'RO';
        },

        hideUdf_t1_text: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'N' || TS.app.settings.udf_t1_Type == 'dropdown';
        },
        hideUdf_t1_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t1 == 'N' || TS.app.settings.udf_t1_Type != 'dropdown';
        },

        hideUdf_t2_text: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'N' || TS.app.settings.udf_t2_Type == 'dropdown';
        },
        hideUdf_t2_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t2 == 'N' || TS.app.settings.udf_t2_Type != 'dropdown';
        },

        hideUdf_t3_text: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'N' || TS.app.settings.udf_t3_Type == 'dropdown';
        },
        hideUdf_t3_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t3 == 'N' || TS.app.settings.udf_t3_Type != 'dropdown';
        },

        hideUdf_t4_text: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'N' || TS.app.settings.udf_t4_Type == 'dropdown';
        },
        hideUdf_t4_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t4 == 'N' || TS.app.settings.udf_t4_Type != 'dropdown';
        },

        hideUdf_t5_text: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'N' || TS.app.settings.udf_t5_Type == 'dropdown';
        },
        hideUdf_t5_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t5 == 'N' || TS.app.settings.udf_t5_Type != 'dropdown';
        },

        hideUdf_t6_text: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'N' || TS.app.settings.udf_t6_Type == 'dropdown';
        },
        hideUdf_t6_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t6 == 'N' || TS.app.settings.udf_t6_Type != 'dropdown';
        },

        hideUdf_t7_text: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'N' || TS.app.settings.udf_t7_Type == 'dropdown';
        },
        hideUdf_t7_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t7 == 'N' || TS.app.settings.udf_t7_Type != 'dropdown';
        },

        hideUdf_t8_text: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'N' || TS.app.settings.udf_t8_Type == 'dropdown';
        },
        hideUdf_t8_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t8 == 'N' || TS.app.settings.udf_t8_Type != 'dropdown';
        },

        hideUdf_t9_text: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'N' || TS.app.settings.udf_t9_Type == 'dropdown';
        },
        hideUdf_t9_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t9 == 'N' || TS.app.settings.udf_t9_Type != 'dropdown';
        },

        hideUdf_t10_text: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'N' || TS.app.settings.udf_t10_Type == 'dropdown';
        },
        hideUdf_t10_combo: function () {
            return TS.app.settings.fwaDisplay_udf_t10 == 'N' || TS.app.settings.udf_t10_Type != 'dropdown';
        },

        hideUdf_l1: function(){
            return TS.app.settings.fwaDisplay_udf_l1 === 'N';
        },
        hideUdf_l2: function(){
            return TS.app.settings.fwaDisplay_udf_l2 === 'N';
        },

        readOnlyUdf_t1: function(){
            return TS.app.settings.fwaDisplay_udf_t1 === 'RO';
        },

        readOnlyUdf_t2: function(){
            return TS.app.settings.fwaDisplay_udf_t2 === 'RO';
        },

        readOnlyUdf_t3: function(){
            return TS.app.settings.fwaDisplay_udf_t3 === 'RO';
        },
        readOnlyUdf_t4: function(){
            return TS.app.settings.fwaDisplay_udf_t4 === 'RO';
        },

        readOnlyUdf_t5: function(){
            return TS.app.settings.fwaDisplay_udf_t5 === 'RO';
        },

        readOnlyUdf_t6: function(){
            return TS.app.settings.fwaDisplay_udf_t6 === 'RO';
        },

        readOnlyUdf_t7: function(){
            return TS.app.settings.fwaDisplay_udf_t7 === 'RO';
        },

        readOnlyUdf_t8: function(){
            return TS.app.settings.fwaDisplay_udf_t8 === 'RO';
        },

        readOnlyUdf_t9: function(){
            return TS.app.settings.fwaDisplay_udf_t9 === 'RO';
        },

        readOnlyUdf_t10: function(){
            return TS.app.settings.fwaDisplay_udf_t10 === 'RO';
        },
        hideExpWbs1: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs1Name: function (get) {
            if (get('settings.exDisplayWbs1') == 'B' || get('settings.exDisplayWbs1') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs2: function (get) {
            if (get('settings.exDisplayWbs2') == 'B' || get('settings.exDisplayWbs2') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs2Name: function (get) {
            if (get('settings.fwaDisplayWbs3') == 'B' || get('settings.fwaDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideExpWbs3: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'U')
                return false;
            else
                return true;
        },

        hideExpWbs3Name: function (get) {
            if (get('settings.exDisplayWbs3') == 'B' || get('settings.exDisplayWbs3') == 'A')
                return false;
            else
                return true;
        },

        hideAccount: function (get) {
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'U');
        },

        hideAccountName: function (get) {
            return !(get('settings.exDisplayAccount') === 'B' || get('settings.exDisplayAccount') === 'A');
        },

        displayBillable: function (get) {
            return get('settings.exDisplayBillable');
        },

        displayCompanyPaid: function (get) {
            return get('settings.exDisplayCompanyPaid');
        },

        hasExpEditRights: function (get) {
            var me = this;
            if (me.data.isExa)
                return get('settings.exApproverCanModify');
            else
                return true;
        }

    },

    //Main model will implement this method
    getPageTitle: function () {
        return 'Expenses';
    }

});