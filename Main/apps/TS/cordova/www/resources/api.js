Ext.ns("Ext.app");
Ext.app.REMOTING_API = {
    "type": "remoting",
    "url": SETTINGS.config.webService,
    "actions": {
        "ActionItem": [{
            "name": "GetList", //string dbi, string username
            "len": 2
        }],
        "ActionType": [{
            "name": "GetList", //string dbi, string username
            "len": 2
        }],
        "Address": [{
            "name": "GetAddress", //string dbi, string username, string clientId, string addressId
            "len": 4
        }],
        "AttachmentData": [{
            "name": "GetAttachmentDataById", //string dbi, string username, int id
            "len": 3
        }, {
            "name": "GetAttachmentById", //string dbi, string username, int attachmentid, bool includeItem
            "len": 4
        }, {
            "name": "GetAttachmentList", //string dbi, string username, string modelType, string modelId, string attachmentType, bool includeItem
            "len": 6
        }, {
            "name": "SaveAttachment", //string dbi, string username, Attachment attachment, AttachmentData data
            "len": 4
        }, {
            "name": "DeleteAttachment", //string dbi, string username, int attachmentId
            "len": 3
        }],
        "BillCategory": [{
            "name": "GetList", ////string dbi, string username, int start, int limit
            "len": 4
        }],
        "Exp": [{
            "name": "GetExpCategories", ////string dbi, string username, int start, int limit
            "len": 2
        }, {
            "name": "GetExpAccounts", ////string dbi, string username, int start, int limit
            "len": 2
        }, {
            "name": "GetOpenExpReports", ////string dbi, string username, string employee
            "len": 3
        }, {
            "name": "GetExpReport", ////string dbi, string username, string expReportId
            "len": 3
        }, {
            "name": "SaveExpReport", //string dbi, string username, ExpenseReport expReport
            "len": 3
        }, {
            "name": "DeleteExpenseLine", //string dbi, string username, string expReportId, string expId
            "len": 4
        }, {
            "name": "DeleteExpenseReport", //string dbi, string username, string expReportId
            "len": 3
        }, {
            "name": "GetExpensePeriodDates", //string dbi, string username, string empId
            "len": 3
        }, {
            "name": "GetExpenseApprovalDates", //string dbi, string username, string empId
            "len": 3
        }, {
            "name": "GetExpenseApprovalListByDate", //string dbi, string username, string expDate
            "len": 3
        }, {
            "name": "ApproveRejectExpense", //string dbi, string username, string expReportId, bool flag, string comments, Attachment signature
            "len": 6
        }],
        "ChargeType": [{
            "name": "GetList", //string dbi, string username, int start, int limit
            "len": 4
        }],
        "Client": [{
            "name": "GetList", //string dbi, string username, int start, int limit, bool includeInactive
            "len": 5
        }, {
            "name": "Get", //string dbi, string username,string id
            "len": 3
        }],
        "Crew": [{
            "name": "GetCrewChiefList", //string dbi, string username, string empId
            "len": 3
        }, {
            "name": "GetList", //string dbi, string username, int start, int limit, string empId, bool isPreparedByMe
            "len": 6
        }, {
            "name": "GetCrewById", //string dbi, string username, string id
            "len": 3
        }, {
            "name": "Update", //string dbi, string username, Crew crew
            "len": 3
        }, {
            "name": "Delete", //string dbi, string username, string id
            "len": 3
        }, {
            "name": "GetCrewListForNewFwa", //string dbi, string username, string empId
            "len": 3
        }],
        "Document": [{
            "name": "GetTemplateList", //string dbi, string username, string modelType, string modelId
            "len": 4
        }, {
            "name": "GetDocument",
            "len": 9
        }, {
            "name": "GetUnsavedFwaDocument", //string dbi, string username, string empId, string templateId, string templateApp, string modelId, Fwa fwa, string templateType, string returnBytes, int utcOffset, bool saveFirst
            "len": 11
        }],
        "Email": [{
            "name": "GetEmailAddress", //string dbi, string username
            "len": 3
        }, {
            "name": "SendEmail", // string dbi, string username, string email, int utcOffset
            "len": 4
        }, {
            "name": "SendEmailWithUnsaved", // string dbi, string username, string empId, Email email, Fwa fwa, int utcOffset, bool saveFirst
            "len": 7
        }],
        "EmpGroup": [{
            "name": "Get", //string dbi, string username, string id
            "len": 3
        }, {
            "name": "GetList", //string dbi, string username
            "len": 2
        }],
        "Employee": [{
            "name": "Get", //string dbi, string username, string id
            "len": 3
        }, {
            "name": "GetList", //string dbi,  string username, int start, int limit, bool includeInactive, bool fwaEmployeesOnly
            "len": 6
        }, {
            "name": "GetAll", //string dbi,  string username
            "len": 2
        }, {
            "name": "GetEmployeeView",
            "len": 4
        }, {
            "name": "GetEmployeeViewList",
            "len": 4
        }],
        "Equipment": [{ //string dbi, string username, int start, int limit, string unitCodeId
            "name": "GetList",
            "len": 5
        }],
        "UserConfig": [{
            "name": "Get", //string dbi, string email, string app
            "len": 3
        }, {
            "name": "SaveUserConfig", //string dbi, string username, UserConfig userConfig
            "len": 3,
            "formHandler": false
        }, {
            "name": "GetByUsername", //string dbi, string username, string app
            "len": 3
        }, {
            "name": "SaveSchedulerDefaults", //string dbi, string username, string schedDefaults
            "len": 3
        }],
        "PriorityList": [{
            "name": "GetList", //string dbi, string email
            "len": 2
        }],
        "Fwa": [{
            "name": "CreateNew",
            "len": 0
        }, {
            "name": "GetListWithCrew", //string dbi, string username, int start, int limit,string empId, string startDate, bool isPreparer, bool isScheduler
            "len": 8
        }, {
            "name": "GetList", //string dbi, string username, int start, int limit,string empId, string startDate, bool isPreparer, bool isScheduler
            "len": 8
        },  {
            "name": "GetExpenseFwaList", //string dbi, string username, int start, int limit,string empId, string startDate, bool isPreparer, bool isScheduler
            "len": 8
        }, {
            "name": "GetSchedulerFwaList", //string dbi,  string username, int start, int limit,string empId, bool isPreparedByMe, bool scheduledFwas
            "len": 7
        }, {
            "name": "Get", //string dbi, string username, string id, string fwaDate /* YYYY-MM-DD */
            "len": 4
        }, {
            "name": "Save", //string dbi, string username, string employeeId, Fwa fwa, bool isScheduler, bool isAuto
            "len": 6,
            "formHandler": false
        }, {
            "name": "Submit", //string dbi, string username, string employeeId, Fwa fwa, bool isScheduler
            "len": 5,
            "formHandler": false
        }, {
            "name": "Delete", //string dbi, string username, string fwaId
            "len": 3
        }, {
            "name": "StartWork", //string dbi, string username, string fwaId, double latitude, double longitude
            "len": 3
        }, {
            "name": "EndWork", //string dbi, string username, string fwaId, double latitude, double longitude
            "len": 3
        }, {
            "name": "SaveFwaLocation", //string dbi, string username, string fwaId, Address location
            "len": 4
        }, {
            "name": "Copy", //string dbi, string username, string id
            "len": 3
        }, {
            "name": "Approve", //string dbi, string username, string employeeId, Fwa fwa, bool isScheduler
            "len": 5,
            "formHandler": false
        }, {
            "name": "SetStatus", //string dbi, string username, string employeeId, string fwaId, string newStatus, bool resetTimesheet, bool isScheduler
            "len": 7,
            "formHandler": false
        }, {
            "name": "RemoveStatus", //string dbi, string username, string employeeId, string fwaId
            "len": 4,
            "formHandler": false
        }, {
            "name": "ResetFwaStatus", //string dbi, string username, string employeeId, string fwaId
            "len": 7,
            "formHandler": false
        }, {
            "name": "ApproveFwaStatus", //string dbi, string username, string employeeId, string fwaId
            "len": 4,
            "formHandler": false
        }, {
            "name": "MakeAvailable", //string dbi, string username, string employeeId, string fwaId, bool makeAvailable, bool isScheduler
            "len": 6,
            "formHandler": false
        }, {
            "name": "CheckForDoubleBookedEmp", //string dbi, string username, string crewId, datetime startDateTime, datetime endDateTime
            "len": 6
        }, {
            "name": "CheckForDoubleBookedByEmpId", //string dbi, string username, string empId, datetime startDateTime, datetime endDateTime
            "len": 5
        }, {
            "name": "GetFwaInfoForWbs", //string dbi, string empGroupId, string wbs1, string wbs2, string wbs3
            "len": 5
        }, {
            "name": "SaveCrewAssign", //string dbi, string username, string fwaId, string empId1, string crewRoleId1, string empId2, string crewRoleId2, string empId3, string crewRoleId3
            "len": 9
        }, {
            "name": "SearchPreviousFwaByProject",  //string dbi, string username, string fwaId, string workCodeList, bool restrictByWbs2
            "len": 5
        }, {
            "name": "SaveFwaStatus",  //string dbi, string username, string empId, string fwaId, string statusId
            "len": 5
        }, {
            "name": "SaveFwaPriority",  //string dbi, string username, string fwaId, string priorityId
            "len": 4
        }, {
            "name": "SaveFwaUdf",  //string dbi, string username, string fwaId, string udfField, string udfValue
            "len": 5
        }, {
            "name": "SaveFwaActions",  //string dbi, string username, string fwaId, List<FwaAction> fwaActions
            "len": 4
        }, {
            "name": "GetRecurrenceEndDate", //RecurrenceConfig rc
            "len": 1
        }, {
            "name": "SearchForFwas", //string dbi, string username, string fwaId, string searchParameters
            "len": 4
        }, {
            "name": "SetFwaAvailability", //string dbi, string username, string empId, string id
            "len": 4
        }, {
            "name": "CheckPriorToEmployeeAssn", //string dbi, string username, Fwa fwa, bool isScheduler
            "len": 4,
            "formHandler": false
        }, {
            "name": "GetSignatureHtmlDisplay",
            "len": 4
        }, {
            "name": "GetDailyFwaList", //string dbi, string username, string employeeId, string theDate
            "len": 4
        }, {
            "name": "FlagOfflineList", //string dbi, string username, string empId, List<string> fwaList
            "len": 4
        }, {
            "name": "ClearOfflineList",//string dbi, string username, string empId, List<string> fwaList
            "len": 4
        }, {
            "name": "GetSignatureBlock", //string dbi, string username, string employeeId, string fwaId, string which
            "len": 5
        }],
        "FwaStatus": [{
            "name": "GetList", //string dbi, string username, int start, int limit
            "len": 4
        }],
        "Holiday": [{
            "name": "GetListByEmployee", //string dbi,  string username, int start, int limit, string empId
            "len": 5
        }, {
            "name": "GetListByScheduleId", //string dbi, string username, int start, int limit, string empId, string holidayScheduleId
            "len": 6
        }],
        "LaborCode": [{
            "name": "GetList", //string dbi, string username, int start, int limit
            "len": 4
        }],
        "Role": [{
            "name": "GetList", //string dbi, string username, int start, int limit
            "len": 4
        }],
        "Licensing": [{
            "name": "GetLicenseAgreement",
            "len": 0
        }, {
            "name": "SetOkdLicense", //string dbi, string username
            "len": 2
        }],
        "Template": [{
            "name": "GetTemplates", //string dbi, string username
            "len": 2
        }, {
            "name": "GetHtmlTemplate", //string dbi, string username, string empId, int templateId, string modelId (FwaId or TsPeriodId)
            "len": 5
        }, {
            "name": "GetHtmlTemplateList", //string dbi, string username, string empId, int templateId, List<string> idList (FwaId or TsPeriodId) as JArrary
            "len": 5
        }],
        "TimeSheet": [{
            "name": "ApproveRejectTimesheet", //string dbi, string username, string tsDate (end date), string empId, bool flag (approve:true,reject:false), string comment, Attachment signature
            "len": 7
        }, {
            "name": "CreateEmpty", //string dbi, string username, string empId, string tsDate
            "len": 4
        }, {
            "name": "Copy", //string dbi, string username, string employeeId, string tsDate, Tsheet tsheet
            "len": 5
        }, {
            "name": "GetListByEmployee", //string dbi, string username, string employeeId, int start, int limit
            "len": 5
        }, {
            "name": "GetListByUsername", //string dbi, string username, int start, int limit
            "len": 4
        }, {
            "name": "GetByEmployeeByDate", //string dbi, string username, int start, int limit, string employeeId, string tsDate, bool includeCrewMembers
            "len": 7
        }, {
            "name": "GetTimesheetPeriods", //string dbi, string username
            "len": 2
        }, {
            "name": "GetTimesheetPeriodsForApproval",
            "len": 2
        }, {
            "name": "GetTimesheetApprovalSummary", //string dbi, string username, string empId, int tsPeriodId
            "len": 4
        }, {
            "name": "Save", //string dbi, string username,  Tsheet timesheet, bool isTsApproval
            "len": 4,
            "formHandler": false
        }, {
            "name": "Submit", //string dbi, string username,  Tsheet timesheet, Attachment signature
            "len": 4,
            "formHandler": false
        }, {
            "name": "SaveSubmitAfterWarning",  //string dbi, string username,  Tsheet timesheet, , bool isSubmit, Attachment signature
            "len": 5,
            "formHandler": false
        }],
        "TsBreak": [{
            "name": "GetByDate", //string  dbi, string username, int start, int limit,  string employeeId, string breakDate
            "len": 6
        }, {
            "name": "Update", //string dbi, string username, Tsheet timesheet, TsBreaks tsBreaks
            "len": 4,
            "formHandler": false
        }, {
            "name": "Delete", //string dbi, string username, string breakDate, string empId
            "len": 4
        }],
        "UnitCode": [{
            "name": "GetList", //string  dbi, string username, int start, int limit, string wbs1, string wbs2, string wbs3,  bool includeInactive
            "len": 8
        }, {
            "name": "SaveUnits",//string  dbi, string username, List<Unit> units
            "len": 3
        }, {
            "name": "GetFwaUnitsByWbs", //string dbi, string username, string fwaId, string wbs1, string wbs2, string wbs3, List<Unit> fwaUnits
            "len": 7
        }],
        "User": [{
            "name": "GetList", //string dbi, string username, int start, int end
            "len": 4
        }, {
            "name": "CheckPin", //string dbi, string emailaddress
            "len": 2
        }, {
            "name": "AuthenticatePin", //string dbi, string spacePin, string emailAddress
            "len": 3
        }, {
            "name": "CreatePin", //string dbi, string spacePin, string emailAddress, string lastFourSsn
            "len": 4
        }, {
            "name": "SendSms", //string dbi, string username, string mobileNumber, string provider, string message
            "len": 5
        }, {
            "name": "SupportIntegratedLogin", //string lang, string dbi
            "len": 2
        }, {
            "name": "Login",
            "len": 5
        }, {
            "name": "UpdatePassword",
            "len": 3
        }],
        "Wbs1": [{
            "name": "GetList", //string dbi, string username, int start, int limit, string filter, string empId, bool includeInactive, string app
            "len": 8
        }, {
            "name": "GetWbs1ById",
            "len": 3
        }, {
            "name": "GetWbsProjectTree", // string dbi, string username, string empId, string nodeId, string app
            "len": 5
        }],
        "Wbs2": [{
            "name": "GetList", //string dbi, string username, int start, int limit, string employeeId, string wbs1, bool includeInactive, string app
            "len": 8
        }, {
            "name": "GetWbs2List", //string dbi, string username, int start, int limit, string empId, bool includeInactive, string app
            "len": 7
        }, {
            "name": "GetWbs2ById", //string dbi, string username, string wbs1, string wbs2
            "len": 4
        }],
        "Wbs3": [{
            "name": "GetList", //string dbi, string username, string employeeId, string wbs1, string wbs2, bool includeInactive, string app
            "len": 7
        }, {
            "name": "GetWbs3List", //string dbi, string username, string empId, bool includeInactive
            "len": 4
        }],
        "BillCat": [{
            "name": "GetList", //string dbi, string username, int start, int limit
            "len": 4
        }],
        "WorkCode": [{
            "name": "GetList", //string dbi, string username, int start, int limit,  bool includeInactive
            "len": 5
        }, {
            "name": "SaveWorkCodes", //string dbi, string username, List<WorkCode> workCodes
            "len": 3
        }],
        "History": [{
            "name": "GetFwaHistory",
            "len": 3 //string dbi, string username, string fwaId
        }]
    }
};