Ext.define('TS.data.proxy.Default', {
    extend: 'Ext.data.proxy.Direct',

    alias: 'proxy.default',

    config: {
        reader: 'default',
        writer: {
            type: 'json'
            //writeAllFields: true
        }
    },

    doRequest: function (request) {
        // Get the global settings and the requests extraParams
        var settingsData = TS.app.settings,
            params = this.getParamOrder();

        // Establish a mapping from the settings variables to the request params
        var paramMap = {
            username: 'username',
            empId: 'empId',
            empGroupId: 'empGroupId',
            employeeName: 'empName',
            includeCrewMembers: 'tsCanEnterCrewMemberTime',
            isPreparer: 'isPreparer',
            includeInactive: 'includeInactive',
            isPreparedByMe: 'schedFwaPreparedByMe'

        };
        var extraParams = {};
        Ext.Object.each(paramMap, function (key, value) {
            if (Ext.Array.contains(params, key)) {
                extraParams[key] = settingsData[value];
            }
        });

        // Set the extra params from settings against the request
        this.setExtraParams(Ext.Object.merge(extraParams, this.getExtraParams()));

        this.callParent(arguments);
    }
});
