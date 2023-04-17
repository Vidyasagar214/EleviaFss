Ext.define('TS.common.grid.TimesheetRow', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-timesheetrow',

    requires: [
        'TS.model.ts.TsRow'
    ],
    controller: 'grid-timesheetrow',
    //cls: 'grid-timesheetrow',
    isHidden: null,
    isTsApproval: false,

    viewConfig: {
        //emptyText: '<div style="text-align: center;">Please Select a Timesheet</div>',
        deferEmptyText: false,
        markDirty: false,
        disabled: false,
        getRowClass: function (record, rowIndex, rowParams, store) {
            var settings = TS.app.settings;
            return (settings.empId != record.get('empId') && !settings.tsCanEnterCrewMemberTime ? 'readonly-row' : '');
        },
        listeners: {
            groupclick: 'startEditViaGroup'
        }
    },
    sortableColumns: false,

    store: {
        model: 'TS.model.ts.TsRow',
        remoteSort: true,
        grouper: {
            groupFn: function (record) {
                var returnArray = [],
                    settings = TS.app.settings,
                    billCatTable = Ext.getStore('BillCategory'),
                    billCategory = '',
                    billCategoryName = '',
                    value;

                billCategory =  billCatTable.getById(record.get('billCategory'));
                if (billCategory) {
                    billCategoryName = billCategory.get('description');
                }
                //WBS1
                if (settings.tsDisplayWbs1 == 'B') {
                    value = Ext.String.trim(record.get('wbs1')) ? (record.get('wbs1') + ': ' + record.get('wbs1Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs1 == 'A') {
                    value = Ext.String.trim(record.get('wbs1Name')) ? (record.get('wbs1Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs1 == 'U') {
                    value = Ext.String.trim(record.get('wbs1')) ? (record.get('wbs1')) : '';
                    returnArray.push(value);
                }
                //WBS2
                if (settings.tsDisplayWbs2 == 'B') {
                    value = Ext.String.trim(record.get('wbs2')) ? (record.get('wbs2') + ': ' + record.get('wbs2Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs2 == 'A') {
                    value = Ext.String.trim(record.get('wbs2Name')) ? (record.get('wbs2Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs2 == 'U') {
                    value = Ext.String.trim(record.get('wbs2')) ? (record.get('wbs2')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs2 == 'N') {
                    returnArray.push('');
                }
                //WBS3
                if (settings.tsDisplayWbs3 == 'B') {
                    value = Ext.String.trim(record.get('wbs3')) ? (record.get('wbs3') + ': ' + record.get('wbs3Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs3 == 'A') {
                    value = Ext.String.trim(record.get('wbs3Name')) ? (record.get('wbs3Name')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs3 == 'U') {
                    value = Ext.String.trim(record.get('wbs3')) ? (record.get('wbs3')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayWbs3 == 'N') {
                    returnArray.push('');
                }
                //CLIENT
                if (settings.tsDisplayClient == 'B') {
                    value = Ext.String.trim(record.get('clientNumber')) ? (record.get('clientNumber') + ': ' + record.get('clientName')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayClient == 'A') {
                    value = Ext.String.trim(record.get('clientName')) ? (record.get('clientName')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayClient == 'U') {
                    value = Ext.String.trim(record.get('clientNumber')) ? (record.get('clientNumber')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayClient == 'N') {
                    returnArray.push('');
                }
                //LABOR CODE
                if (settings.tsDisplayLaborCode != 'N') {
                    returnArray.push(record.get('laborCode'));
                }
                //BILLING CATEGORY
                if (settings.tsDisplayBillCat == 'A') {
                    value = Ext.String.trim(billCategoryName);
                    returnArray.push(value);
                } else if (settings.tsDisplayBillCat == 'B') {
                    value = Ext.String.trim(record.get('billCategory')) ? (record.get('billCategory') + ': ' + billCategoryName): '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayBillCat == 'U') {
                    value = Ext.String.trim(record.get('billCategory')) ? (record.get('billCategory')) : '';
                    returnArray.push(value);
                }
                else if (settings.tsDisplayBillCat == 'N') {
                    returnArray.push('');
                }

                return Ext.Array.clean(returnArray).join(', ');
            }
        },

        proxy: {
            type: 'default',
            directFn: 'TimeSheet.GetByEmployeeByDate',
            paramOrder: 'dbi|username|start|limit|empId|tsDate|includeCrewMembers',
            reader: {
                type: 'default',
                rootProperty: 'data.rows'
            },
            pageSize: 1000
        }
    },

    plugins: [{
        ptype: 'cellediting'
    }, {
        ptype: 'employeetooltip'
    }],

    features: [{
        ftype: 'summary',
        lockableScope: 'both'
    }, {
        ftype: 'grouping',
        collapsible: false,
        collapseTip: '',
        groupHeaderTpl: [
            //TODO Sencha fix icon using css, rather than img
            '<div style="font-weight:bold;">{[this.getTemplate(values)]}</div>', { //color:white;
                getTemplate: function (values) {
                    var settings = TS.app.settings;
                    if (settings.tsCanEnterCrewMemberTime) {
                        return values.name + '<img class="add-group-tsrow" src="resources/add.png" style="position:relative;cursor:pointer;margin-left:20px;" />';
                    }
                    return values.name;
                }
            }
        ]
    }],

    selModel: 'rowmodel',
    enableLocking: true,
    enableColumnMove: false,
    columns: [
        {
            // dataIndex: 'rowNum',
            // hidden: true,
            width: 1
        },
        {
            width: 160,
            dataIndex: 'empId',
            text: 'Who',
            bind: {
                hidden: '{isHidden}'
            },
            editor: {
                xtype: 'field-allemployee'
            },
            //locked: true,
            renderer: function (value, metaData, record) {
                // Indent any non crew chief roles
                metaData.tdCls = 'empId';
                var roleRecord = Ext.getStore('Roles').getById(record.get("crewRoleId"));
                if (!roleRecord || !roleRecord.get('crewRoleIsChief')) {
                    metaData.tdStyle = 'padding-left: 10px;';
                }
                // Use the employees record to set the display name
                var empRecord = Ext.getStore('TsEmployees').getById(value);
                return (empRecord ? (empRecord.get('lname') + ', ' + empRecord.get('fname')) : 'N/A');
            }
        },
        {
            width: 140,
            dataIndex: 'crewRoleId',
            text: 'Role',
            editor: {
                xtype: 'field-crewrole',
                noFilter: true
            },
            //locked: true,
            menuDisabled: true,
            renderer: function (value) {
                var record = Ext.getStore('Roles').getById(value);
                return (record ? record.get('crewRoleName') : 'N/A');
            },
            summaryRenderer: 'columnSummaryAllTotalsHeader'
        },
        {
            xtype: 'templatecolumn', //across total
            //locked: true,
            tpl: Ext.create('Ext.XTemplate',
                '{[this.renderTotals(values)]}', {
                    renderTotals: function (recordValues) {
                        var total = 0;
                        //console.log(recordValues.cells); //row totals
                        Ext.Array.each(recordValues.cells || [], function (cell) {
                            total += (cell.regHrs + cell.ovtHrs + cell.ovt2Hrs + cell.travelHrs);
                        });
                        return '<div style="text-align:right;">' + parseFloat(Math.round((total || 0) * 100) / 100).toFixed(2) + '</div>';
                    }
                }
            ),
            width: 70,
            dataIndex: 'lineID',
            text: 'Totals',
            editable: false,
            sortable: false,
            summaryRenderer: 'columnSummaryAllTotals'
        },
        {
            xtype: 'column-hours',
            sortable: false,
            //locked: true,
            bind: {
                dayCount: '{dayCount}',
                startDate: '{startDate}'
            }
        }, {
            xtype: 'actioncolumn',
            width: 35,
            resizable: false,
            menuDisabled: true,
            //locked: true,
            items: [{
                iconCls: 'x-fa fa-trash redIcon',// 'workitem-delete', //'x-fa fa-trash',
                tooltip: 'Delete',
                handler: 'deleteTimesheetRow',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var settings = TS.app.settings,
                        vm = TS.app.getViewport().getViewModel(),
                        empId = record.get('empId'),
                        tsheetStatus = (record.get('tsheetStatus') == TsStatus.Approved) || (record.get('tsheetStatus') == TsStatus.Submitted && !settings.tsAllowUnsubmit);
                    // if in TSAPPROVAL and has rights, user can delete any timesheet row
                    if (vm.get('isTimesheetApproval') && settings.tsApproverCanModify && !tsheetStatus)
                        return false;
                    else
                        return empId != settings.empId || tsheetStatus;
                }
            }]
        }, {
            xtype: 'actioncolumn',
            width: 35,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-copy greyIcon', //'page-copy', // 'x-fa fa-copy whiteIcon',
                tooltip: 'Copy',
                handler: 'copyTimesheetRow',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var settings = TS.app.settings,
                        vm = TS.app.getViewport().getViewModel(),
                        empId = record.get('empId'),
                        tsheetStatus = (record.get('tsheetStatus') == TsStatus.Approved) || (record.get('tsheetStatus') == TsStatus.Submitted && !settings.tsAllowUnsubmit);
                    // if in TSAPPROVAL and has rights, user can copy any timesheet row
                    if (vm.get('isTimesheetApproval') && settings.tsApproverCanModify && !tsheetStatus)
                        return false;
                    else
                        return empId != settings.empId || tsheetStatus;
                }
            }]
        }, {
            // Empty column to stretch the width of grouped headers
            flex: 1
        },
        {
            dataIndex: 'rowNum',
            hidden: true
        }

    ],

    listeners: {
        cellclick: 'openHoursEditor',
        beforecellclick: 'stopReadOnly',
        beforecelldblclick: 'stopReadOnly',
        //this stops the edit of a user if an existing row
        beforeedit: function (editor, context) {
            if (context.field === 'empId' && context.record.get('isNewRecord')) {
                return true;
            }
            return false;
        }
    }
});
