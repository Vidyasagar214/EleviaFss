Ext.define('TS.model.admin.UserConfig', {
    extend: 'TS.model.Base',

    idProperty: 'username',
    identifier: 'uuid',

    fields: [
        {
            name: 'usernameDisplay',
            type: 'auto'
        },
        {
            name: 'username',
            type: 'auto'
        },
        {
            name: 'empId',
            type: 'auto'
        },
        {
            name: 'empName',
            type: 'auto'
        },
        // Global configuration items:
        {
            name: 'fwaTitle',
            type: 'auto'
        },
        {
            name: 'tsTitle',
            type: 'auto'
        },
        {
            name: 'schedLabel',
            type: 'auto'
        },
        // Field labels
        {
            name: 'crewLabel',
            type: 'auto'
        },
        {
            name: 'crewLabelPlural',
            type: 'auto'
        },
        {
            name: 'crewChiefLabel',
            type: 'auto'
        },
        {
            name: 'crewChiefLabelPlural',
            type: 'auto'
        },
        {
            name: 'chiefRoleIds',
            type: 'auto'
        },
        {
            name: 'fwaLabel',
            type: 'auto'
        },
        {
            name: 'fwaAbbrevLabel',
            type: 'auto'
        },
        {
            name: 'wbs1SearchBy',
            type: 'string',
            defaultValue: 'id'
        },
        {
            name: 'crewChiefLabelWithFwaAbbrevLabel',
            convert: function (value, record) {
                return record.get('crewChiefLabel') + ' ' + record.get('fwaAbbrevLabel') + ' List';
            }
        },
        {
            name: 'crewLabelWithFwaAbbrevLabel',
            convert: function (value, record) {
                return record.get('crewLabel') + ' ' + record.get('fwaAbbrevLabel') + ' List';
            }
            // mapping: function (data) {
            //     return data.crewLabel + ' ' + data.fwaAbbrevLabel + ' List';
            // }
        },
        {
            name: 'empNameFirstLast',
            convert: function (value, record) {
                // var emp = record.get('empName').split(',');
                // return emp[1] + ' ' + emp[0];
                return '';
            }
        },
        {
            name: 'fwaLabelPlural',
            type: 'auto'
        },
        {
            name: 'fwaWorkCodeActual',
            type: 'string'
        },
        {
            name: 'unitLabel',
            type: 'string',
            defaultValue: 'Unit'
        },
        {
            name: 'unitLabelPlural',
            type: 'string',
            defaultValue: 'Units'
        },
        {
            name: 'clientLabel',
            type: 'auto'
        },
        {
            name: 'clientLabelPlural',
            type: 'auto'
        },
        {
            name: 'contactLabel',
            type: 'auto'
        },
        {
            name: 'contactLabelPlural',
            type: 'auto'
        },
        {
            name: 'wbs1Label',
            type: 'string'
        },
        {
            name: 'wbs1LabelPlural',
            type: 'string'
        },
        {
            name: 'wbsDisplayLabel',
            convert: function (value, record) {
                var wbs1 = (record.get('wbs1Label') ? record.get('wbs1Label') : ''),
                    wbs2 = (record.get('wbs2Label') ? record.get('wbs2Label') : ''),
                    wbs3 = (record.get('wbs3Label') ? record.get('wbs3Label') : '');
                return wbs1 + wbs2 + wbs3;
            }
        },
        {
            name: 'wbs2Label',
            type: 'string'
        },
        {
            name: 'wbs2LabelPlural',
            type: 'string'
        },
        {
            name: 'wbs3Label',
            type: 'string'
        },
        {
            name: 'billCatLabel',
            type: 'string'
        },
        {
            name: 'wbs3LabelPlural',
            type: 'string'
        },
        {
            name: 'laborCodeLabel',
            type: 'string'
        },
        {
            name: 'laborCodeLabelPlural',
            type: 'string'
        },
        {
            name: 'workCodeLabel',
            type: 'string',
            defaultValue: 'Function'
        },
        {
            name: 'workCodeLabelPlural',
            type: 'string',
            defaultValue: 'Functions'
        },
        {
            name: 'workDescriptionLabel',
            type: 'string',
            defaultValue: 'Function Description'
        },
        {
            name: 'workDescriptionLabelPlural',
            type: 'string',
            defaultValue: 'Function Descriptions'
        },
        // Emp Group timesheet configurations:
        {
            name: 'tsAuditLevel',
            type: 'auto'
        },
        {
            name: 'tsIncrement',
            type: 'auto'
        },
        {
            name: 'tsAllowHtmlComments',
            type: 'auto'
        },
        {
            name: 'tsAllowUnsubmit',
            type: 'auto'
        },
        {
            name: 'tsAllowTimeOnInactive',
            type: 'auto'
        },
        {
            name: 'tsReqSubmitSignature',
            type: 'auto'
        },
        {
            name: 'tsReqApprovalSignature',
            type: 'auto'
        },
        {
            name: 'tsApproverCanModify',
            type: 'bool'
        },
        {
            name: 'tsReqApproval',
            type: 'auto'
        },
        {
            name: 'tsAutoCalcOvt',
            type: 'auto'
        },
        {
            name: 'tsAllowOvtHrs',
            type: 'auto'
        },
        {
            name: 'tsAllowOvt2Hrs',
            type: 'auto'
        },
        {
            name: 'tsAllowTravelHrs',
            type: 'auto'
        },
        {
            name: 'tsCanViewCrewMemberTime',
            type: 'auto'
        },
        {
            name: 'tsCanEnterCrewMemberTime',
            type: 'auto'
        },
        {
            name: 'tsCanModifyFwaHours',
            type: 'auto'
        },
        {
            name: 'tsModifiedFwaHoursFlowBack',
            type: 'auto'
        },
        {
            name: 'tsDisplayWbs1',
            type: 'auto'
        },
        {
            name: 'tsDisplayWbs2',
            type: 'auto'
        },
        {
            name: 'tsDisplayWbs3',
            type: 'auto'
        },
        {
            name: 'tsDisplayClient',
            type: 'auto'
        },
        {
            name: 'tsDisplayLaborCode',
            type: 'auto'
        },
        {
            name: 'tsDisplayBillCat',
            type: 'auto'
        },
        // Labor code values:
        {
            name: 'tsLcLevels',
            type: 'auto'
        },
        {
            name: 'tcLcDelimiter',
            type: 'auto'
        },
        {
            name: 'tcLc1Start',
            type: 'auto'
        },
        {
            name: 'tcLc2Start',
            type: 'auto'
        },
        {
            name: 'tcLc3Start',
            type: 'auto'
        },
        {
            name: 'tcLc4Start',
            type: 'auto'
        },
        {
            name: 'tcLc5Start',
            type: 'auto'
        },
        {
            name: 'tsLc1Len',
            type: 'auto'
        },
        {
            name: 'tsLc2Len',
            type: 'auto'
        },
        {
            name: 'tsLc3Len',
            type: 'auto'
        },
        {
            name: 'tsLc4Len',
            type: 'auto'
        },
        {
            name: 'tsLc5Len',
            type: 'auto'
        },
        {
            name: 'tsDefLaborCode',
            type: 'auto'
        },
        {
            name: 'tsDefLc1',
            type: 'auto'
        },
        {
            name: 'tsDefLc2',
            type: 'auto'
        },
        {
            name: 'tsDefLc3',
            type: 'auto'
        },
        {
            name: 'tsDefLc4',
            type: 'auto'
        },
        {
            name: 'tsDefLc5',
            type: 'auto'
        },
        {
            name: 'tsLc1CanChange',
            type: 'auto'
        },
        {
            name: 'tsLc2CanChange',
            type: 'auto'
        },
        {
            name: 'tsLc3CanChange',
            type: 'auto'
        },
        {
            name: 'tsLc4CanChange',
            type: 'auto'
        },
        {
            name: 'tsLc5CanChange',
            type: 'auto'
        },

        // Emp Group FWA configurations:
        {
            name: 'fwaAuditLevel',
            type: 'auto'
        },
        {
            name: 'fwaAvailableForFwaAssignment',
            type: 'auto'
        },
        {
            name: 'fwaDisplayWbs1',
            type: 'auto'
        },
        {
            name: 'fwaDisplayWbs2',
            type: 'auto'
        },
        {
            name: 'fwaDisplayWbs3',
            type: 'auto'
        },
        {
            name: 'fwaDisplayClient',
            type: 'auto'
        },
        {
            name: 'fwaReqChiefSignature',
            type: 'auto'
        },
        {
            name: 'fwaReqClientSignature',
            type: 'auto'
        },
        {
            name: 'fwaDisplayWorkCodeInHours',
            type: 'auto'
        },
        {
            name: 'fwaAutoNumbering',
            type: 'auto'
        },
        {
            name: 'fwaCanModify',
            type: 'auto'
        },
        {
            name: 'fwaAddWorkCode',
            type: 'auto'
        },
        {
            name: 'fwaCreateNew',
            type: 'auto'
        },
        {
            name: 'fwaAllowUnsubmit',
            type: 'auto'
        },
        {
            name: 'fwaUnitsEnabled',
            type: 'bool'
        },
        {
            name: 'fwaHideWorkCodes',
            type: 'bool'
        },
        {
            name: 'fwaUnitVisibility',
            type: 'string'
        },
        {
            name: 'fwaIsApprover',
            type: 'auto'
        },
        // User-modifiable configurations:
        {
            name: 'schedVisibleHoursStart',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'schedVisibleHoursEnd',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'schedTimeAxisGranularity',
            type: 'int'
        },
        {
            name: 'schedCrewPreparedByMe',
            type: 'string'
        },
        {
            name: 'schedFwaPreparedByMe',
            type: 'string'
        },
        {
            name: 'schedWeeklyStartDay',
            type: 'int'
        },
        {
            name: 'schedDefaultTimeframe', // D=Day view, W=Week view
            type: 'string'
        },
        {
            name: 'schedDefaultStartDay', // D=next Day, W=next Workday, T=Today, M=next Monday
            type: 'string'
        },
        {
            name: 'schedDaysLookback',
            type: 'int'
        },
        {
            name: 'schedFilters',
            type: 'string'
        },
        //Default Values
        {
            name: 'tsDefLaborCode',
            type: 'string'
        },
        {
            name: 'tsDefBillCat',
            type: 'string'
        },

        // Administrative stuff:
        {
            name: 'empGroupId',
            type: 'string'
        },
        {
            name: 'holidayScheduleId',
            type: 'string'
        },
        {
            name: 'requiredFieldText',
            type: 'string',
            defaultValue: '(*required field)'
        },
        {
            name: 'tsCanEnterCrewMemberTime',
            type: 'boolean'
        },
        {
            name: 'includeCrewMembers',
            type: 'boolean'
        },
        {
            name: 'isPreparer',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'includeInactive',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'okdLicense',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'tsIsApprover',
            type: 'boolean'
        },
        {
            name: 'availableForUseInField',
            type: 'boolean'
        },
        {
            name: 'udf_t1_Label',
            type: 'string',
            default: ''
        },
        {
            name: 'fwaDisplayWorkCodePctComplete',
            type: 'bool'
        },
        {
            name: 'fwaDisplayStartButton',
            type: 'bool'
        },
        {
            name: 'fwaChiefDataFlowToCrew',
            type: 'string'
        },
        {
            name: 'fwaDisplayActionsbutton',
            type: 'bool'
        },
        {
            name: 'documentStorageLoc',
            type: 'string'
        },
        {
            name: 'imageStorageLoc',
            type: 'string'
        },
        {
            name: 'appAccess',
            type: 'string'
        },
        {
            name: 'appAccessRO',
            type: 'string'
        },
        {
            name: 'hideSections',
            type: 'string'
        },
        {
            name: 'empEkGroup',
            type: 'auto'
        },
        {
            name: 'exMileageRateReadOnly',
            type: 'bool'
        },
        {
            name: 'exMileageRate', // If true, user cannot change the mileage rate
            type: 'auto'
        },
        {
            name: 'exMileageRateLabel', // "Mile" or "Kilometer" usually
            type: 'string'
        },
        {
            name: 'mapInterval',
            type: 'auto',
            defaultValue: 1000
        },
        {
            name: 'mapApi',
            type: 'auto',
            defaultValue: 'AIzaSyCqae6gSIFW29rjr-ymlJdAG7akPVc1zC8'
        },
        {
            name: 'showUtilitiesLink',
            type: 'auto',
            defaultValue: false
        },
        {
            name: 'udf_t10_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t9_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t8_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t7_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t6_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t5_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t4_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t3_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t2_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_t1_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_a6_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_a5_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_a4_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_a3_Type',
            type: 'string',
            default: 'text'
        }, {
            name: 'udf_a2_Type',
            type: 'string',
            default: 'text'
        },
        {
            name: 'udf_a1_Type',
            type: 'string',
            default: 'text'
        },
        {
            name: 'udf_t1_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t1_Type !== 'text';
            }
        },
        {
            name: 'udf_t2_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t2_Type !== 'text';
            }
        },
        {
            name: 'udf_t3_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t3_Type !== 'text';
            }
        },
        {
            name: 'udf_t4_isCombo',
            type: 'bool',
            //defaultValue: true,
            mapping: function (data) {
                return data.udf_t4_Type !== 'text';
            }
        },
        {
            name: 'udf_t5_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t5_Type !== 'text';
            }
        },
        {
            name: 'udf_t6_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t6_Type !== 'text';
            }
        },
        {
            name: 'udf_t7_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t7_Type !== 'text';
            }
        },
        {
            name: 'udf_t8_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t8_Type !== 'text';
            }
        },
        {
            name: 'udf_t9_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t9_Type !== 'text';
            }
        },
        {
            name: 'udf_t10_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_t10_Type != 'text';
            }
        },

        {
            name: 'udf_a1_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a1_Type !== 'text';
            }
        },
        {
            name: 'udf_a2_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a2_Type !== 'text';
            }
        },
        {
            name: 'udf_a3_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a3_Type !== 'text';
            }
        },
        {
            name: 'udf_a4_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a4_Type !== 'text';
            }
        },
        {
            name: 'udf_a5_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a5_Type !== 'text';
            }
        },
        {
            name: 'udf_a6_isCombo',
            type: 'bool',
            defaultValue: false,
            mapping: function (data) {
                return data.udf_a6_Type !== 'text';
            }
        },
        {
            name: 'fwaMaxCrewSize', //  'maxCrewAssignCount',
            type: 'int',
            defaultValue: 3
        },
        {
            name: 'canAccessUtilitiesPage',
            type: 'bool'
        },
        {
            name: 'canAccessUtilitiesPageAdmin',
            type: 'bool'
        },
        {
            name: 'canAccessUtilitiesPageConfig',
            type: 'bool'
        },
        {
            name: 'colorCreating',
            type: 'string',
            defaultValue: '#FFA500'
        },
        {
            name: 'colorNotAvailableForField',
            type: 'string',
            defaultValue: '#FFC080'
        },
        {
            name: 'colorScheduled',
            type: 'string',
            defaultValue: '#e2da77'
        },
        {
            name: 'colorSaved',
            type: 'string',
            defaultValue: '#0000FF'
        },
        {
            name: 'colorInProgress',
            type: 'string',
            defaultValue: '#6a5acd'
        },
        {
            name: 'colorProgressSavedPastDue',
            type: 'string',
            defaultValue: '#FF0000'
        },
        {
            name: 'colorSubmitted',
            type: 'string',
            defaultValue: '#00cd00'
        },
        {
            name: 'colorApproved',
            type: 'string',
            defaultValue: '#808080'
        },
        {
            name: 'colorHoliday',
            type: 'string',
            defaultValue: '#00FFFF'
        },
        {
            name: 'dateFormat',
            type: 'string',
            defaultValue: DATE_FORMAT
        },
        {
            name: 'dateWithTimeFormat',
            type: 'string',
            defaultValue: DATE_FORMAT + ' g:i A'
        },

        {
            name: 'udf_a1_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_a2_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_a3_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_a4_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_a5_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_a6_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t1_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t2_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t3_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t4_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t5_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t6_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t7_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t8_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t9_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_t10_isRequired',
            type: 'bool',
            defaultValue: false
        },
        //udf date fields
        {
            name: 'udf_d1_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_d2_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'udf_d3_isRequired',
            type: 'bool',
            defaultValue: false
        },
        {
            name: 'displayStartEndTime',
            type: 'string',
            defaultValue: 'N'
        },
        {
            name: 'displayStartEndTimeByDate',
            mapping: function (data) {
                return data.displayStartEndTime === 'D';
            }
        },
        {
            name: 'displayStartEndTimeByProject',
            mapping: function (data) {
                return data.displayStartEndTime === 'P';
            }
        }

    ]
});