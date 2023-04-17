Ext.define('TS.Messages', {

    singleton: true,

    prompts: {
        //TS.controller.Login
        notAuthorizedForApplication: {
            title: 'Not Authorized',
            message: 'User not authorized for '
        },
        //TS.controller.LicenseAgreement
        cancelledLicenseAgreement: {
            title: 'Non-Agreement',
            message: 'No access to application until accepting the terms in the license agreement.'
        },
        // TS.controller.Messenger
        sessionTimeout: {
            title: 'Session Timeout',
            message: 'Session has timed out. Please log in again.'
        },
        // TS.controller.view.form.FWA
        fwaSubmitSuccess: {
            title: 'Successfully Submitted',
            message: 'Work has been successfully submitted.'
        },
        // TS.controller.view.form.FWA
        fwaSubmitNoChiefSig: {
            title: 'Submission Failure',
            message: 'This Work cannot be submitted without the party chief\'s signature.'
        },
        // TS.controller.view.form.FWA
        fwaSaveSuccess: {
            title: 'Successfully Saved',
            message: 'Work has been successfully saved.'
        },
        fwaUpdateSuccess: {
            title: 'Successfully Updated',
            message: 'Work has been successfully updated.'
        },
        // TS.controller.view.form.FWA
        fwaAddressSuccess: {
            title: 'Successfully Saved',
            message: 'Work location has been successfully saved.'
        },
        // TS.controller.view.form.FWA
        fwaStartWorkSuccess: {
            title: 'Successfully Started',
            message: 'Work has been started.'
        },
        // TS.controller.view.form.FWA
        fwaStopWorkSuccess: {
            title: 'Successfully Stopped',
            message: 'Work has been stopped.'
        },
        // TS.controller.view.grid.Crew
        crewDelete: {
            title: 'Crew Delete',
            message: 'Are you sure you want to delete this crew?'
        },
        // TS.controller.view.viewport.Timesheet
        timesheetCopySuccess: {
            title: 'Timesheet Copied',
            message: 'Timesheet has been successfully copied.'
        },
        // TS.controller.view.viewport.Timesheet
        timesheetRequireSelect: {
            title: 'Select Timesheet',
            message: 'You must select a timesheet to copy.'
        },
        // TS.controller.view.viewport.Timesheet
        timesheetRequireSelectApprovals: {
            title: 'Select Timesheet',
            message: 'You must select a timesheet before viewing approvals.'
        },
        // TS.controller.view.viewport.Timesheet
        timesheetSaveSuccess: {
            title: 'Sucessfully Saved',
            message: 'Timesheet has been successfully saved.'
        },
        // TS.controller.view.viewport.Timesheet
        timesheetSubmitSuccess: {
            title: 'Success',
            message: 'Timesheet successfully submitted.'
        },
        // TS.controller.view.form.ExpenseList
        expenseSubmitSuccess: {
            title: 'Successfully Submitted',
            message: 'Expense Report has been successfully submitted.'
        },
        expenseSaveSuccess: {
            title: 'Successfully Saved',
            message: 'Expense Report has been successfully saved.'
        },
        // TS.controller.view.window.Email
        sendEmailSuccess: {
            title: 'Success',
            message: '<p style="text-align:center">Email successfully sent.</p>'
        },
        // TS.controller.view.window.SMS
        sendSmsSuccess: {
            title: 'Success',
            message: 'Text successfully sent.'
        },
        // TS.controller.view.window.Email
        sendEmailMissingFields: {
            title: 'Required Fields',
            message: 'Please enter missing required fields.'
        },
        // TS.controller.view.window.Print
        noPrintTemplate: {
            title: 'Warning',
            message: 'No printing template selected.'
        },
        // TS.controller.view.window.TimesheetEmployee
        timesheetApproveSuccess: {
            title: 'Success',
            message: 'Timesheet has been approved.'
        },
        // TS.controller.view.window.TimesheetEmployee
        timesheetRejectSuccess: {
            title: 'Success',
            message: 'Timesheet has been rejected.'
        },
        // TS.controller.view.viewport.Timesheet
        confirmApproval: {
            title: 'Please Confirm',
            message: 'Are you sure you want to approve this?'
        },
        // TS.controller.view.viewport.Timesheet
        confirmSubmission: {
            title: 'Please Confirm',
            message: 'Are you sure you want to submit?'
        },
        // TS.controller.view.viewport.Timesheet
        rejectionCommentRequired: {
            title: 'Missing Comment',
            message: 'Comments are required when rejecting a timesheet.'
        },
        // TS.controller.view.window.ExpenseApproval
        expenseApproveSuccess: {
            title: 'Success',
            message: 'Expense has been approved.'
        },
        // TS.controller.view.window.ExpenseApproval
        expenseRejectSuccess: {
            title: 'Success',
            message: 'Expense has been rejected.'
        },
        // TS.controller.view.viewport.FWA
        unsavedChanges: {
            title: 'Unsaved Changes',
            message: 'You have unsaved changes. Do you want to discard your changes and continue?'
        },
        // TS.controller.view.window.UserSettings
        settingsSaved: {
            title: 'Successfully Saved',
            message: 'Settings have been successfully saved.'
        },
        // TS.Application
        viewportInitError: {
            title: 'URL Error',
            message: 'An invalid entry was entered for the URL "app" parameter (' + Ext.Object.fromQueryString(location.search).app + ').'
        },
        // TS.Application
        viewportInitErrorScheduler: {
            title: 'URL Error',
            message: Ext.Object.fromQueryString(location.search).app + ' is not compatible on mobile at this time.'
        },
        //TS.controller.view.form.FWA
        submitWithoutApproval: {
            title: 'Submit without Client Approval?',
            message: 'This FWA requires a client signature, but does not have one. Do you still want to submit?'
        },
        //TS.controller.view.grid.Crew
        onDeleteCrew: {
            title: 'Crew Delete',
            message: 'Are you sure you want to delete this crew?'
        },
        //TS.controller.view.viewport.FWA
        formUnsaved: {
            title: 'Unsaved Changes',
            message: 'You have unsaved changes. Do you want to discard your changes and continue?'
        },
        tsSubmitPinBadField:{
            title: 'Incorrect PIN',
            message: 'You have entered an incorrect PIN, please try again.'
        },
        //TS.controller.view.viewport.Timesheet
        approveTimeSheet: {
            title: 'Please Confirm',
            message: 'Are you sure you want to approve this?'
        },
        //TS.controller.view.viewport.Timesheet
        timesheetSaved: { //line 116 and line 126
            title: 'Success',
            message: 'Timesheet successfully saved.'
        },
        //TS.controller.view.viewport.Timesheet
        submitTimesheet: {
            title: 'Please Confirm',
            message: 'Are you sure you want to submit?'
        },
        //TS.controller.view.viewport.Timesheet
        timesheetRowUnsaved: {
            title: 'Unsaved Changes',
            message: 'You have unsaved changes. Do you want to discard your changes and continue?'
        },

        //TS.controller.view.window.Attachment
        //line 107, on 'onFileUpload' function, this message is dynamic so I'm not sure how to handle this
        //line 167, on 'performRecordUpload', also dynamic

        //TS.controller.view.window.TimesheetEmployee
        confirmSubmit: {
            title: 'Please Confirm',
            message: 'Are you sure you want to save your changes and submit?'
        },

        checkPinMissingFields: {
            title: 'PIN Error',
            message: 'Missing or illegal PIN'
        },

        //TS.controller.Messenger
        //handleGoogleMaps, two messages: ZERO_RESULTS, INVALID_REQUEST not sure how to handle those and if needed..

        //TS.controller.User
        globalSettingsLoadError: {
            title: 'Critical Failure',
            message: 'Unable to load global settings from server. Contact support.'
        }
        //TS.view.fieldset.Address
        //Tooltip text, line 79 and line 87: 'Click to save work location'

        //TS.view.scheduler.Crew
        // 'lockedViewConfig' on line 112 'Drag and drop to order'

        //TS.view.window.ContactInfo
        //line 42, emailText: 'Sorry please enter a valid email address'


    },

    loaders: {
        savingFwa: 'Saving FWA...'
    },

    phrases: {
        // TS.controller.Direct
        FailedRemoteAPI: 'Failed to load remote API.',
        // TS.controller.Error
        UnknownError: 'Unknown Error - Please Contact Support',
        // TS.controller.Messenger
        FailedUpdate: 'Failed to perform update.',
        // TS.controller.view.grid.Employee
        AvailableEmployeesFor: 'Available employees for',
        // TS.controller.view.viewport.Timesheet
        SelectInitialTimesheet: 'Please select an initial timesheet.',
        // TS.controller.view.window.Attachment
        OnlyImageFilesAllowed: 'Only Image files allowed',
        // TS.controller.view.form.FWA
        SubmitWithoutClientApproval: 'Submit without Client Approval?',
        // TS.controller.view.form.FWA
        RequireClientApprovalConfirm: 'This FWA requires a client signature, but does not have one. Do you still want to submit?'
    },

    words: [{
        submitted: 'submitted'
    }, {
        successfully: 'successfully'
    }, {
        // TS.viewmodel.FWA
        Start: 'Start'
    }, {
        // TS.viewmodel.FWA
        Stop: 'Stop'
    }, {
        // TS.controller.view.viewport.Timesheet
        Open: 'Open'
    }, {
        // TS.controller.view.viewport.Timesheet
        Copy: 'Copy'
    }, {
        // TS.controller.view.grid.Crew
        NewCrew: 'New Crew'
    }, {
        // TS.controller.view.window.Attachment
        Upload: 'Upload'
    }, {
        // TS.controller.Messenger
        Message: 'Message'
    }],

    getByCode: function (code) {
         var message = this.prompts[code] || this.loaders[code];
        if (!message) {
            // TODO - Extended fallback, missing message code
            // <debug>
            console.debug('Missing coded message in Messenger Controller', code);
            // </debug>
            return false;
        } else {
            return message;
        }
    },

    getReadOnlyMessage: function(reason){
        Ext.Msg.show({
            title: 'FYI',
            message: 'Selected record is read only. </br>' + reason,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    getSimpleAlertMessage: function(code){
        var message = this.getByCode(code);
        Ext.Msg.show({
            title: message.title,
            message: message.message,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    }

});

/*
 List of models that arn't being used:
 -------------------------------------
 TS.model.admin.Policy.js
 TS.model.admin.PredefRule
 TS.model.admin.Rule

 TS.model.common.Address
 TS.model.common.Formatting
 TS.model.common.Phone
 TS.model.common.PhoneType
 TS.model.common.SeRole
 TS.model.common.User

 TS.model.field.Address
 TS.model.field.AddressList
 TS.model.field.EmployeeList

 TS.model.fwa.FwaStatus

 TS.model.shared.CcgResponseMessages
 TS.model.shared.EmpGroup
 TS.model.shared.EmpGroupx
 TS.model.shared.Error
 TS.model.shared.HolidaySchedule
 TS.model.shared.JsonReturnModel
 TS.model.shared.Phone
 TS.model.shared.PhoneType
 TS.model.shared.Photo
 TS.model.shared.Policy
 TS.model.shared.Rule
 TS.model.shared.User

 TS.model.ts.TsPeriod


 */

