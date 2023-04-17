Ext.define('TS.model.shared.Employee', {
    extend: 'TS.model.Base',

    idProperty: 'empId',
    identifier: 'uuid',

    fields: [
        {name: 'empId', type: 'auto'},
        {name: 'empGroupId', type: 'string'},
        {name: 'empGroupName', type: 'string'},
        {name: 'fname', type: 'string'},
        {name: 'lname', type: 'string'},
        {name: 'city', type: 'string'},
        {name: 'state', type: 'string'},
        {name: 'startDate', type: 'date'},
        {name: 'defaultBillCategory', type: 'string'},
        {name: 'isScheduler', type: 'bool'},
        {name: 'defaultCrewRoleId', type: 'string', reference: {parent: 'TS.model.shared.CrewRole'}},
        {name: 'crewRoleName', type: 'string'},
        {name: 'eMail', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'flags', type: 'string'},
        {name: 'phoneNumbers', type: 'auto'}, // List numbers: PhoneNumber & PhoneType
        {
            name: 'empNameLastFirst',
            mapping: function (data) {
                return data.lname + ', ' + data.fname
            }
        },
        {
            name: 'mobilePhone',
            mapping: function(data){
                var mobile = '';
                Ext.each(data.phoneNumbers, function(list){
                    if (list.phoneType === 'Mobile') {
                        mobile = list.phoneNumber;
                    }
                });
                return mobile.replace(/[.]/g ,'');
            }
        }
    ],

    // proxy: {
    //     type: 'default',
    //     api: {
    //         read: 'Employee.Get'
    //     },
    //     paramOrder: 'dbi|username|id'
    // }

});
