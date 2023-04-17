Ext.define('TS.common.fwaview.FwaHours', {
    extend: 'Ext.Sheet',
    xtype: 'ts-fwahours',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Employee Hours',
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    //action: 'close'
                    handler: function(){
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'component',
            height: 25,
            docked: 'top',
            userCls: 'ts-user-details',
            bind: {
                data: {
                    settings: '{settings}'
                }
            },
            tpl: new Ext.XTemplate('<div class="hours-header">',
                '<span><h2>Start</h2></span><span><h2>Employee</h2></span><span><h2>{settings.workCodeLabel}</h2></span></div>')
        },
        {
            xtype: 'list',
            scrollable: 'y',
            itemCls: 'ts-day-view-item',
            itemTpl: new Ext.XTemplate('<div class="hours-detail"><span>{workDate:date("n/j/Y")}</span><span>{[this.getEmployeeName(values)]}</span><span>{workCodeAbbrev}</span></div>',
                '<div>{[this.getCrewRole(values)]}</div>',
                '<div><b>Comments:</b> {comment}</div>',
                '{[this.getHours(values)]}',
                {
                    //we need this because sometimes all we have is the empId
                    getEmployeeName: function (values) {
                        return Ext.getStore('Employees').getById(values.empId).get('empName');
                    },

                    getCrewRole: function (values) {
                        var settings = TS.app.settings,
                            label = settings.crewLabel;

                        return '<b>' + label + ' Role:</b> ' + Ext.getStore('Roles').getById(values.crewRoleId).get('crewRoleName');
                    },

                    getHours: function (values) {
                        var settings = TS.app.settings,
                            html = '';

                        html += '<span><h2>Regular</h2><span>' + values.regHrs + '</span></span>';
                        if (settings.tsAllowOvtHrs)  html += '<span><h2>Overtime</h2><span>' + values.ovtHrs + '</span></span>';
                        if (settings.tsAllowOvt2Hrs)  html += '<span><h2>Ovt 2</h2><span>' + values.ovt2Hrs + '</span></span>';
                        if (settings.tsAllowTravelHrs)  html += '<span><h2>Travel</h2><span>' + values.travelHrs + '</span></span>';

                        return html;
                    }
                }
            ),

            itemHeight: 80, //making up some extra space
            onItemDisclosure: false,
            bind: {
                store: '{fwa.hours}'
            }
        }
    ]
});