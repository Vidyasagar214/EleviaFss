Ext.define('TS.view.fwa.FWAList', {
    extend: 'Ext.grid.Panel',
    xtype: 'fwalist',
    requires: [
        'Ext.grid.filters.Filters',
        'Ext.grid.plugin.CellEditing',
        'Ext.state.*',
        'TS.store.PriorityList'
    ],
    controller: 'fwalist',
    viewModel: 'fwalist',
    scrollble: true,
    itemId: 'fwaListGrid',
    bind: {
        store: '{fwalist}'
    },

    initComponent: function () {
        this.stateId = STATEID;
        this.renderTo = Ext.getBody();
        this.callParent();
    },

    stateful: true,
    //stateId is set in initComponent to assign who is logged in.
    // //state events to save
    stateEvents: ['columnmove', 'columnresize', 'filterchange', 'columnshow', 'columnhide', 'show', 'hide'],

    plugins: [
        {ptype: 'gridfilters', pluginId: 'fil'},
        {ptype: 'cellediting', clicksToEdit: 1}
    ],

    tbar: [
        {
            text: 'Clear Grid Filters',
            tooltip: 'Clear all grid filters',
            handler: 'onClearFilters',
            bind: {
                hidden: '{isScheduler}'
            }
        },
        '->',
        {
            xtype: 'displayfield',
            itemId: 'rowCtField',
            bind: {
                hidden: '{isScheduler}'
            }
        }
    ],

    padding: '0 5 20 0',

    columns: [
        {
            xtype: 'datecolumn',
            text: 'Date',
            stateId: 'nextDate',
            dataIndex: 'nextDate',
            filter: {
                type: 'date'
            },
            renderer: function (value, meta, rec) {

                if (new Date(value) <= new Date('01/01/2000'))
                    return '';
                if (rec.get('recurrenceConfig') && rec.get('recurrenceConfig').startDate && rec.get('recurrenceConfig').count > 0) {
                    value = rec.get('recurrenceConfig').startDate;
                }
                return Ext.util.Format.date(value, DATE_FORMAT + ' g:i A');
            }
        }, {
            xtype: 'actioncolumn',
            text: 'R</br>e</br>s</br>e</br>t',
            stateId: 'resetFwa',
            menuText: 'Reset',
            draggable: true,
            itemId: 'resetColumn',
            reference: 'resetColumn',
            resizable: true,
            menuDisabled: true,
            hideable: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-repeat  blackIcon',
                tooltip: 'Reset status to saved',
                handler: 'resetFwaToSaved',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var lastRecurrDate = record.get('recurrenceDatesInRange')[record.get('recurrenceDatesInRange').length - 1],
                        settings = TS.app.settings;
                    if (record.get('recurrencePattern') && record.get('lastSubmittedDate') > record.get('lastApprovedDate')
                        && (new Date() < new Date(lastRecurrDate) || record.get('fwaStatusId') == FwaStatus.Submitted)) {
                        return false;
                    }
                    return record.get('fwaStatusId') !== FwaStatus.Submitted && record.get('fwaStatusId') !== FwaStatus.Approved;
                }
            }],
            bind: {
                hidden: '{!isScheduler}'
            },
            width: 40
        }
        , {
            text: 'Status',
            stateId: 'fwaStatus',
            draggable: true,
            dataIndex: 'fwaStatusId',
            renderer: function (value, meta, record) {
                var me = this,
                    record = Ext.getStore('FwaStatus').findRecord('value', value),
                    vm = me.up('viewport').getViewModel();
                return (record ? record.get('description') : '');
            },
            filter: {
                type: 'list',
                idField: 'value',
                labelField: 'description',
                store: 'FwaStatus'
            }
        }
        , {
            text: 'Submitted<br/>Through',
            stateId: 'submittedDate',
            itemId: 'submittedThruColumn',
            dataIndex: 'lastSubmittedDate',
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(value, DATE_FORMAT);
                return !badDate ? formattedDate : '';
            },
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            text: 'Approved<br/>Through',
            stateId: 'approvedDate',
            itemId: 'approvedThruColumn',
            dataIndex: 'lastApprovedDate',
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(value, DATE_FORMAT);
                return !badDate ? formattedDate : '';
            },
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            xtype: 'actioncolumn',
            text: 'A</br>p</br>p</br>r',
            stateId: 'approve',
            menuText: 'Approve',
            itemId: 'approveColumn',
            reference: 'approveColumn',
            resizable: false,
            align: 'center',
            items: [{
                iconCls: 'check-mark',
                tooltip: 'Approve',
                handler: 'setApprovalStatus',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var lastRecurrDate = record.get('recurrenceDatesInRange')[record.get('recurrenceDatesInRange').length - 1],
                        settings = TS.app.settings;
                    if (record.get('recurrencePattern') && record.get('lastSubmittedDate') > record.get('lastApprovedDate')
                        && (new Date() < new Date(lastRecurrDate) || record.get('fwaStatusId') == FwaStatus.Submitted)) {
                        return false;
                    }
                    //record.set('lastApprovedDate', Ext.Date.format(new Date(), DATE_FORMAT));
                    return record.get('fwaStatusId') !== FwaStatus.Submitted;
                }
            }],
            width: 40,
            bind: {
                hidden: '{!isScheduler}'
            }
        }, {
            xtype: 'actioncolumn',
            dataIndex: 'recurrencePattern',
            stateId: 'recurrPattern',
            text: 'R</br>e</br>c</br>u</br>r',
            menuText: 'Recurring',
            menuDisabled: true,
            hideable: false,
            align: 'center',
            items: [{
                getClass: function (v, meta, rec) {
                    if (rec.get('recurrenceConfig')) {// && rec.get('nonFieldActionCompleteCt') == rec.get('nonFieldActionCt')) {
                        return 'x-fa fa-refresh blackIcon'; //'x-fa fa-plus';
                    }
                },
                tooltip: 'Recurring'
            }],
            ignoreExport: true,
            maxWidth: 40
        },
        {
            xtype: 'datecolumn',
            dataIndex: 'recurringEndDate',
            stateId: 'recurrEnd',
            tooltip: 'Recurring End Date',
            header: 'Recurr End',
            filter: {
                type: 'date'
            },
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false,
                    myDtArray = [];

                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }

                if (!value || new Date(value) == 'Invalid Date' || new Date(value) == 'NaN/NaN/0NaN' || !rec.get('recurrenceConfig')) {
                    return null;
                } else {
                    if (!rec.get('recurrenceConfig')) {
                        return null;
                    } else if (rec.get('recurrenceConfig').count > 0) {
                        return Ext.util.Format.date(rec.get('schedEndDate'), DATE_FORMAT);
                    } else { //9999-12-31T23:59:59.9999999 default if no date selected, just a count
                        if (rec.get('recurrenceConfig').until == '9999-12-31T23:59:59.9999999') {
                            return Ext.util.Format.date(rec.get('schedEndDate'), DATE_FORMAT);
                        } else {
                            return Ext.util.Format.date(rec.get('recurrenceConfig').until, DATE_FORMAT);
                        }
                    }
                }
            }
        },
        {
            xtype: 'numbercolumn',
            text: 'Attach</br>Count',
            stateId: 'attachCount',
            menuText: 'Attach Count',
            reference: 'attachCtColumn',
            disabledCls: '',
            maxWidth: 75,
            dataIndex: 'attachmentCtDoc',
            align: 'center',
            format: '0'
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0}'},
            stateId: 'fwaNumber',
            dataIndex: 'fwaNum',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            renderer: function (value, metadata, record) {
                this.getToolTip(value, metadata, record);
                return value;
            }
        }
        , {
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
            dataIndex: 'fwaName',
            stateId: 'fwaName',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            renderer: function (value, metadata, record) {
                this.getToolTip(value, metadata, record);
                return value;
            }
        }
        , {
            xtype: 'checkcolumn',
            text: 'A</br>v</br>a</br>i</br>l',
            stateId: 'available',
            menuText: 'Available',
            itemId: 'availableColumn',
            reference: 'availableColumn',
            dataIndex: 'availableForUseInField',
            //hideable: true,
            // /menuDisabled: true,
            sortable: false,
            listeners: {
                checkchange: 'makeAvailable'
            },
            renderer: function (value, meta, record, row, col) {
                if (value)
                    meta['tdAttr'] = 'data-qtip="Make un-available for the field"';
                else
                    meta['tdAttr'] = 'data-qtip="Make available for the field"';
                return new Ext.ux.CheckColumn().renderer(value);
                //return value;
            },
            width: 40,
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            xtype: 'checkcolumn',
            text: 'C</br>o</br>n</br>t</br>r',
            menuText: 'Is Contract',
            dataIndex: 'isContractWork',
            itemId: 'isContractWorkColumn',
            reference: 'isContractWorkColumn',
            tooltip: 'Is Contract Work',
            disabledCls: '',
            hidden: true,
            disabled: true,
            filter: {
                type: 'boolean',
                yesText: 'Yes',
                noText: 'No'
            },
            width: 40,
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            //xtype: 'numbercolumn',
            align: 'center',
            text: 'Ttl</br>Hrs',
            menuText: 'Ttl Hours',
            itemId: 'ttlHoursColumn',
            reference: 'ttlHoursColumn',
            disabledCls: '',
            //hidden: true,
            width: 50,
            renderer: function (value, meta, record) {
                var ttlHrs = 0;
                Ext.each(record.get('hours'), function (hours) {
                    Ext.each(hours.getData().getRange(), function (hrs) {
                        ttlHrs += hrs.get('regHrs') + hrs.get('ovtHrs') + hrs.get('ovt2Hrs') + hrs.get('travelHrs');
                    })
                });
                return ttlHrs;
            },
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            //xtype: 'numbercolumn',
            align: 'center',
            text: 'Ttl Ovt</br>Hrs',
            menuText: 'Ttl Ovt Hrs',
            itemId: 'ttlOvtHoursColumn',
            reference: 'ttlOvtHoursColumn',
            //hidden: true,
            width: 50,
            renderer: function (value, meta, record) {
                var ttlHrs = 0;
                Ext.each(record.get('hours'), function (hours) {
                    Ext.each(hours.getData().getRange(), function (hrs) {
                        ttlHrs += hrs.get('ovtHrs') + hrs.get('ovt2Hrs');
                    })
                });
                return ttlHrs;
            },
            bind: {
                hidden: '{!isScheduler}'
            }
        },
        {
            //xtype: 'numbercolumn',
            align: 'center',
            text: 'Travel<br>Hrs',
            menuText: 'Travel Hrs',
            itemId: 'ttlTravelHoursColumn',
            reference: 'ttlTravelHoursColumn',
            //hidden: true,
            width: 60,
            renderer: function (value, meta, record) {
                var ttlHrs = 0;
                Ext.each(record.get('hours'), function (hours) {
                    Ext.each(hours.getData().getRange(), function (hrs) {
                        ttlHrs += hrs.get('travelHrs');
                    })
                });
                return ttlHrs;
            },
            bind: {
                hidden: '{!isScheduler}'
            }
        }
        , {
            text: {_tr: 'fieldPriorityLabel', tpl: '{0}'},
            dataIndex: 'fieldPriorityId',
            editor: {
                xtype: 'field-prioritylist',
                listeners: {
                    change: 'priorityChange'
                },
                bind: {
                    disabled: '{isSchedulerAndNotReadOnly}'
                }
            },
            renderer: function (value, metaData, rec, row, cell, store, view) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', value);
                if (rec) {
                    metaData.style = rec.get('fieldPriorityColor'); //structure of color in fwa model
                    metaData.style += rec.get('fieldPriorityColor') != 'background:rgb(Transparent);' ? rec.get('fieldPriorityFontColor') : '';
                }
                return (priority ? priority.get('priorityDescr') : 'N/A');
            },
            filter: {
                type: 'list',
                idField: 'priorityId',
                labelField: 'priorityDescr',
                store: 'PriorityList'
            },
            listeners: {
                beforerender: function (col) {
                    // if (!this.up('grid').isScheduler) {
                    //     col.setFlex(2);
                    // }
                }
            }
        }
        , {
            text: {_tr: 'udf_t1_Label'},
            hideable: true,
            itemId: 'udft1Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t1}'
                }
            },
            dataIndex: 'udf_t1',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t1Grid}'
            }
        }
        , {
            text: {_tr: 'crewLabel'},
            bind: {
                //hidden: '{hideFwaDisplayCrew}'
            },
            dataIndex: 'scheduledCrewName',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            renderer: function (value, meta, record, idx) {
                // if (meta && record.get('scheduledCrewId') != '') {
                //     TS.Util.displayCrewSkillsAndRegistration(meta, record);                }
                return value ? value : '';
            }
        }
        , {
            text: {_tr: 'clientLabel'},
            hideable: true,
            hidden: true,
            bind: {
                hidden: '{hideFwaDisplayClient}'
            },
            dataIndex: 'clientName',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            text: {_tr: 'wbs1Label', tpl: '{0}'},
            bind: {
                hidden: '{hideFwaWbs1}'
            },
            dataIndex: 'wbs1',
            width: 90,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            text: {_tr: 'wbs1Label', tpl: '{0} Name'},
            bind: {
                hidden: '{hideFwaWbs1Name}'
            },
            dataIndex: 'wbs1Name',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            text: {_tr: 'wbs2Label', tpl: '{0}'},
            bind: {
                hidden: '{hideFwaWbs2}'
            },
            dataIndex: 'wbs2',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            text: {_tr: 'wbs2Label', tpl: '{0} Name'},
            bind: {
                hidden: '{hideFwaWbs2Name}'
            },
            dataIndex: 'wbs2Name',
            width: 150,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            dataIndex: 'wbs3',
            text: {_tr: 'wbs3Label', tpl: '{0}'},
            bind: {
                hidden: '{hideFwaWbs3}'
            },
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        }
        , {
            dataIndex: 'wbs3Name',
            hideable: true,
            text: {_tr: 'wbs3Label', tpl: '{0} Name'},
            bind: {
                hidden: '{hideFwaWbs3Name}'
            }
        }
        , {
            text: {_tr: 'udf_t2_Label'},
            hideable: true,
            itemId: 'udft2Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t2Grid}'
                }
            },
            dataIndex: 'udf_t2',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t2Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t3_Label'},
            itemId: 'udft3Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t3Grid}'
                }
            },
            dataIndex: 'udf_t3',
            hideable: true,
            hidden: true,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t3Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t4_Label'},
            itemId: 'udft4Column',
            hideable: true,
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t4Grid}'
                }
            },
            dataIndex: 'udf_t4',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t4Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t5_Label'},
            hideable: true,
            itemId: 'udft5Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t5Grid}'
                }
            },
            dataIndex: 'udf_t5',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t5Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t6_Label'},
            hideable: true,
            itemId: 'udft6Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t6Grid}'
                }
            },
            dataIndex: 'udf_t6',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t6Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t7_Label'},
            hideable: true,
            itemId: 'udft7Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t7Grid}'
                }
            },
            dataIndex: 'udf_t7',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t7Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t8_Label'},
            hideable: true,
            itemId: 'udft8Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t8Grid}'
                }
            },
            dataIndex: 'udf_t8',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t8Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t9_Label'},
            hideable: true,
            itemId: 'udft9Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t9Grid}'
                }
            },
            dataIndex: 'udf_t9',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t9Grid}'
            }
        }
        , {
            text: {_tr: 'udf_t10_Label'},
            hideable: true,
            itemId: 'udft10Column',
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: 'udfChange'
                },
                bind: {
                    readOnly: '{readOnlyUdf_t10Grid}'
                }
            },
            dataIndex: 'udf_t10',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                hidden: '{hideUdf_t10Grid}'
            }
        },
        {
            text: 'City',
            dataIndex: 'city',
            itemId: 'cityColumn',
            minWidth: 100,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            bind: {
                //hidden: '{!isScheduler}'
            }
        },
        {
            text: 'State',
            hideable: true,
            hidden: true,
            dataIndex: 'state',
            itemId: 'stateColumn',
            minWidth: 60,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            renderer: function (value, meta, record, idx) {
                return value = record.get('loc').state;
            },
            bind: {
                //hidden: '{!isScheduler}'
            }
        },
        {
            text: 'Zip',
            dataIndex: 'zip',
            itemId: 'zipColumn',
            minWidth: 60,
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            },
            renderer: function (value, meta, record, idx) {
                return value = record.get('loc').zip;
            },
            bind: {
                //hidden: '{!isScheduler}'
            }
        },
        {
            text: 'Ordered By',
            dataIndex: 'orderedByName',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a1_Label'},
            itemId: 'udfa1Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a1',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a2_Label'},
            itemId: 'udfa2Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a2',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a3_Label'},
            itemId: 'udfa3Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a3',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a4_Label'},
            itemId: 'udfa4Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a4',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a5_Label'},
            itemId: 'udfa5Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a5',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            text: {_tr: 'udf_a6_Label'},
            itemId: 'udfa6Column',
            hidden: true,
            hideable: true,
            dataIndex: 'udf_a6',
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Search for...'
                }
            }
        },
        {
            xtype: 'actioncolumn',
            itemId: 'docsColumn',
            text: 'D</br>o</br>c</br>s',
            menuDisabled: true,
            hideable: false,
            menuText: 'View Documents',
            resizable: false,
            align: 'center',
            bind: {
                hidden: '{!isScheduler}'
            },
            items: [{
                iconCls: 'x-fa fa-paperclip blackIcon',
                tooltip: 'Attach Document',
                handler: 'showAttachDocWindow'
            }],
            renderer: function (value, metaData, rec, row, cell, store, view) {
                if (rec.get('attachmentCtDoc') > 0 && rec.get('attachmentCtDoc') != rec.get('attachmentCtPhoto')) {
                    metaData.style = 'background-color:#ff6666;';
                }
                return;
            },
            width: 40
        },
        {
            xtype: 'actioncolumn',
            itemId: 'historyColumn',
            text: 'H</br>i</br>s</br>',
            menuDisabled: true,
            hideable: false,
            menuText: 'View History',
            resizable: false,
            align: 'center',
            bind: {
                hidden: '{!isScheduler}'
            },
            items: [{
                iconCls: 'x-fa fa-history blueIcon', //'icon-history', //
                tooltip: 'View History',
                handler: 'showFwaHistory'
            }],
            width: 40
        }
        , {
            xtype: 'actioncolumn',
            itemId: 'mapColumn',
            text: 'M</br>a</br>p',
            menuDisabled: true,
            hideable: false,
            menuText: 'View Map',
            resizable: false,
            dataIndex: 'Loc',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-map-pin greyIcon', //'x-fa fa-map-marker blueIcon' //'icon-map-small', //'x-fa fa-map-marker blueIcon',
                tooltip: 'View Map',
                handler: 'showFwaOnMap'
            }],
            width: 40
        }
        , {
            xtype: 'actioncolumn',
            text: 'D</br>e</br>l</br>e</br>t</br>e',
            itemId: 'deleteColumn',
            menuDisabled: true,
            hideable: false,
            menuText: 'Delete',
            resizable: false,
            align: 'center',
            bind: {
                hidden: '{!isScheduler}'
            },
            items: [{
                iconCls: 'x-fa fa-trash redIcon', //'workitem-delete', // 'x-fa fa-trash redIcon',
                tooltip: 'Delete',
                handler: 'deleteFwa'
            }],
            width: 40
        }
        , {
            xtype: 'actioncolumn',
            reference: 'prePostActionColumn',
            text: 'A</br>c</br>t</br>i</br>o</br>n',
            itemId: 'prePostActionColumn',
            menuDisabled: true,
            hideable: false,
            menuText: 'Actions',
            resizable: false,
            align: 'center',
            items: [{
                iconCls: 'actions-yellow',  // 'x-fa fa-plus yellowIcon', //actions-yellow
                tooltip: 'Pre/Post Actions',
                handler: 'prePostFwaActions',
                getClass: function (v, meta, rec) {
                    if (rec.get('nonFieldActionCt') === 0) {// && rec.get('nonFieldActionCompleteCt') == rec.get('nonFieldActionCt')) {
                        return 'x-fa fa-plus yellowIcon'; //'x-fa fa-plus';
                    } else if (rec.get('nonFieldPreActionCt') > 0 && rec.get('nonFieldPreActionCt') > rec.get('nonFieldPreActionCompleteCt')) {
                        return 'x-fa fa-circle redIcon'; //'x-fa fa-stop';
                    } else if ((rec.get('nonFieldPreActionCt') === 0 || (rec.get('nonFieldPreActionCt') > 0 && rec.get('nonFieldPreActionCt') === rec.get('nonFieldPreActionCompleteCt'))) && rec.get('nonFieldActionCt') != rec.get('nonFieldActionCompleteCt')) {
                        return 'x-fa fa-circle greenIcon'; //'x-fa fa-folder';
                    } else if (rec.get('nonFieldActionCt') === rec.get('nonFieldActionCompleteCt')) {
                        return 'x-fa fa-circle blueIcon'; //'x-fa fa-circle blueIcon';
                    } else {
                        return 'x-fa fa-plus yellowIcon';
                    }
                }
            }],
            width: 40,
            bind: {
                hidden: '{!settings.fwaDisplayActionsbutton}'
            }
        }

    ],

    getToolTip: function (value, metaData, record) {
        var info = record.get('hoverRows');

        if (record.get('schedStartDate')) {
            while (info.indexOf('^fromUTC(') > -1) {
                var start = info.indexOf('^fromUTC(') + 9,
                    end = info.indexOf(')^'),
                    oldDt = '',
                    dt = '',
                    newDt = '',
                    D = Ext.Date,
                    offset = new Date().getTimezoneOffset();
                oldDt = new Date(info.substring(start, end));
                dt = D.add(oldDt, D.MINUTE, offset * -1);
                newDt = Ext.Date.format(dt, DATE_FORMAT + ' g:i A');
                info = info.replace('^fromUTC(' + info.substring(start, end) + ')^', newDt);
            }
        } else {
            info = info.replace(/\^fromUTC\(/g, '');
            info = info.replace(/\)\^/g, '');
        }
        if (info)
            metaData.tdAttr = 'data-qtip=\'<html><head></head><body><table style="width:450px;">' + info.replace(/'/g, "&#39") + '</table></body></html>\'';
    }
    ,

    getAvailableTooltip: function (value, metaData, record) {
        var isAvailable = record.get('avaialbleForUseInTheField');
        if (isAvailable)
            metaData.tdAttr = 'data-qtip=\'<table style="width:200px;">Make Un-Available for use in the field</table>\'';
        else
            metaData.tdAttr = 'data-qtip=\'<table style="width:200px;">Make Available for use in the field</table>\'';
    }
    ,

    listeners: {
        // beforeRender: function (grid) {
        //     var vm = this.getViewModel(),
        //         settings = TS.app.settings;
        //     if (!vm.get('isScheduler')) {
        //         grid.lookup('approveColumn').setDisabled(true);
        //         grid.lookup('approveColumn').menuDisabled = true;
        //         grid.lookup('approveColumn').hideable = false;
        //         grid.lookup('approveColumn').setHidden(true);
        //
        //         grid.lookup('availableColumn').setDisabled(true);
        //         grid.lookup('availableColumn').menuDisabled = true;
        //         grid.lookup('availableColumn').hideable = false;
        //         grid.lookup('availableColumn').setHidden(true);
        //
        //         grid.lookup('isContractWorkColumn').setDisabled(true);
        //         grid.lookup('isContractWorkColumn').menuDisabled = true;
        //         grid.lookup('isContractWorkColumn').hideable = false;
        //     } else {
        //         if (settings.approveColumnShow) {
        //             grid.lookup('approveColumn').setHidden(false);
        //         }
        //         grid.lookup('approveColumn').menuDisabled = false;
        //         grid.lookup('approveColumn').hideable = true;
        //         //
        //         // // this.lookup('availableColumn').setHidden(true);
        //         // grid.lookup('availableColumn').setDisabled(true);
        //         // grid.lookup('availableColumn').menuDisabled = false;
        //         // grid.lookup('availableColumn').hideable = true;
        //         // grid.lookup('availableColumn').setHidden(false);
        //
        //         // this.lookup('isContractWorkColumn').setHidden(true);
        //         // grid.lookup('isContractWorkColumn').menuDisabled = false;
        //         // grid.lookup('isContractWorkColumn').hideable = true;
        //         //
        //         if (settings.ttlHoursColumnShow) {
        //             grid.lookup('ttlHoursColumn').setHidden(false);
        //         }
        //         grid.lookup('ttlHoursColumn').menuDisabled = false;
        //         grid.lookup('ttlHoursColumn').hideable = true;
        //
        //         if (settings.ttlOvtHoursColumnShow) {
        //             grid.lookup('ttlOvtHoursColumn').setHidden(false);
        //         }
        //         grid.lookup('ttlOvtHoursColumn').menuDisabled = false;
        //         grid.lookup('ttlOvtHoursColumn').hideable = true;
        //
        //         if (settings.ttlTravelHoursColumnShow) {
        //             grid.lookup('ttlTravelHoursColumn').setHidden(false);
        //         }
        //         grid.lookup('ttlTravelHoursColumn').menuDisabled = false;
        //         grid.lookup('ttlTravelHoursColumn').hideable = true;
        //     }
        // }
        // ,

        sortchange: 'onSortChange',

        itemdblclick: 'onFwaGridDblClick',

        afterlayout: function () {
            var settings = TS.app.settings,
                isScheduler = this.getViewModel().get('isScheduler');
            Ext.first('#historyColumn').setHidden(!isScheduler);
            Ext.first('#historyColumn').setWidth(30);
            Ext.first('#deleteColumn').setHidden(!isScheduler);
            Ext.first('#deleteColumn').setWidth(30);
            Ext.first('#mapColumn').setHidden(false);
            Ext.first('#mapColumn').setWidth(40);
            Ext.first('#prePostActionColumn').setHidden(!settings.fwaDisplayActionsbutton);
            Ext.first('#prePostActionColumn').setWidth(30);
            Ext.first('#resetColumn').setHidden(!isScheduler);
            Ext.first('#approveColumn').setHidden(!isScheduler);
            //Ext.first('#submittedThruColumn').setHidden(!isScheduler);
            //Ext.first('#approvedThruColumn').setHidden(!isScheduler);
            //Ext.first('#cityColumn').setHidden(!isScheduler);
            //Ext.first('#stateColumn').setHidden(!isScheduler);
            //Ext.first('#zipColumn').setHidden(!isScheduler);
            Ext.first('#historyColumn').setHidden(!isScheduler);
            Ext.first('#deleteColumn').setHidden(!isScheduler);

            // if (settings.fwaListNeedsRefresh) {
            //     settings.fwaListNeedsRefresh = false;
            //     this.getStore().reload();
            // }
        },

        afterrender: function (cmp) {
            var settings = TS.app.settings,
                vm = this.getViewModel(),
                isScheduler = vm.get('isScheduler');
            cmp.getView().refresh();
            // show/hide column selection from menu
            if (!isScheduler) {
                // Ext.GlobalEvents.fireEvent('ClearFwaListFilters');
                // Ext.first('#udft1Column').hideable = (false);
                // Ext.first('#udft2Column').hideable = (false);
                // Ext.first('#udft3Column').hideable = (false);
                // Ext.first('#udft4Column').hideable = (false);
                // Ext.first('#udft5Column').hideable = (false);
                // Ext.first('#udft6Column').hideable = (false);
                //
                // Ext.first('#udfa1Column').hideable = (false);
                // Ext.first('#udfa2Column').hideable = (false);
                // Ext.first('#udfa3Column').hideable = (false);
                // Ext.first('#udfa4Column').hideable = (false);
                // Ext.first('#udfa5Column').hideable = (false);
                // Ext.first('#udfa6Column').hideable = (false);
                //
                // Ext.first('#udft7Column').hideable = (false);
                // Ext.first('#udft8Column').hideable = (false);
                // Ext.first('#udft9Column').hideable = (false);
                // Ext.first('#udft10Column').hideable = (false);
                //
                Ext.first('#udft1Column').setHidden(true);
                Ext.first('#udft2Column').setHidden(true);
                Ext.first('#udft3Column').setHidden(true);
                Ext.first('#udft4Column').setHidden(true);
                Ext.first('#udft5Column').setHidden(true);
                Ext.first('#udft6Column').setHidden(true);
                Ext.first('#udft7Column').setHidden(true);
                Ext.first('#udft8Column').setHidden(true);
                Ext.first('#udft9Column').setHidden(true);
                Ext.first('#udft10Column').setHidden(true);

                // Ext.first('#udfa1Column').setHidden(true);
                // Ext.first('#udfa2Column').setHidden(true);
                // Ext.first('#udfa3Column').setHidden(true);
                // Ext.first('#udfa4Column').setHidden(true);
                // Ext.first('#udfa5Column').setHidden(true);
                // Ext.first('#udfa6Column').setHidden(true);
            } else {
                //check if selectable in column menu
                // Ext.first('#udft1Column').hideable = (!vm.get('hideUdf_t1Grid'));
                // Ext.first('#udft2Column').hideable = (!vm.get('hideUdf_t2Grid'));
                // Ext.first('#udft3Column').hideable = (!vm.get('hideUdf_t3Grid'));
                // Ext.first('#udft4Column').hideable = (!vm.get('hideUdf_t4Grid'));
                // Ext.first('#udft5Column').hideable = (!vm.get('hideUdf_t5Grid'));
                // Ext.first('#udft6Column').hideable = (!vm.get('hideUdf_t6Grid'));
                // Ext.first('#udft7Column').hideable = (!vm.get('hideUdf_t7Grid'));
                // Ext.first('#udft8Column').hideable = (!vm.get('hideUdf_t8Grid'));
                // Ext.first('#udft9Column').hideable = (!vm.get('hideUdf_t9Grid'));
                // Ext.first('#udft10Column').hideable = (!vm.get('hideUdf_t10Grid'));


                // Ext.first('#udfa1Column').hideable = (!vm.get('hideUdf_a1Grid'));
                // Ext.first('#udfa2Column').hideable = (!vm.get('hideUdf_a2Grid'));
                // Ext.first('#udfa3Column').hideable = (!vm.get('hideUdf_a3Grid'));
                // Ext.first('#udfa4Column').hideable = (!vm.get('hideUdf_a4Grid'));
                // Ext.first('#udfa5Column').hideable = (!vm.get('hideUdf_a5Grid'));
                // Ext.first('#udfa6Column').hideable = (!vm.get('hideUdf_a6Grid'));

                //
            }
            // var grid = Ext.firt('fwalist');

        },

        filterchange: function (store, filters) {
            if (filters) {
                //Ext.state.Manager.set('gridFilters', JSON.stringify(filters));
            } else
                Ext.state.Manager.set('gridFilters', null);
        }
        ,

        // columnshow: function (ct, column) {
        //     var settings = TS.app.settings;
        //     if (column.referenceKey == 'approveColumn' && this.isScheduler) {
        //         settings.approveColumnShow = true;
        //     } else if (column.referenceKey == 'ttlHoursColumn' && this.isScheduler) {
        //         settings.ttlHoursColumnShow = true;
        //     } else if (column.referenceKey == 'ttlOvtHoursColumn' && this.isScheduler) {
        //         settings.ttlOvtHoursColumnShow = true;
        //     } else if (column.referenceKey == 'ttlTravelHoursColumn' && this.isScheduler) {
        //         settings.ttlTravelHoursColumnShow = true;
        //     }
        // }
        // ,
        // columnhide: function (ct, column) {
        //     var settings = TS.app.settings;
        //     if (column.referenceKey == 'approveColumn' && this.isScheduler) {
        //         settings.approveColumnShow = false;
        //     } else if (column.referenceKey == 'ttlHoursColumn' && this.isScheduler) {
        //         settings.ttlHoursColumnShow = false;
        //     } else if (column.referenceKey == 'ttlOvtHoursColumn' && this.isScheduler) {
        //         settings.ttlOvtHoursColumnShow = false;
        //     } else if (column.referenceKey == 'ttlTravelHoursColumn' && this.isScheduler) {
        //         settings.ttlTravelHoursColumnShow = false;
        //     }
        // }
        // ,
        statesave: function (me, state) {
            //console.log('statesave', me, state)
        }
        ,
        staterestore: function (me, state) {
            //console.log('restore', me, state)
        }
    }

})
;




