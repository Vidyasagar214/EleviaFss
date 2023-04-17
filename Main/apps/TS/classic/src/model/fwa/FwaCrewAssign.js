/**
 * Created by steve.tess on 6/20/2016.
 */
Ext.define('TS.model.fwa.FwaCrewAssign', {
    extend: 'Ext.data.Model',

    idProperty: 'fwaId',
    identifier: 'uuid',

    fields: [
        {
            name: 'schedStartDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'fwaId',
            type: 'string'
        },
        {
            name: 'fwaNum',
            type: 'string'
        },
        {
            name: 'fwaName',
            type: 'string'
        },
        {
            name: 'fwaStatusId',
            type: 'string'
        },
        {
            name: 'fieldPriorityId',
            type: 'string'
        },
        {
            name: 'fieldPriorityDesc',
            mapping: function(data){
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId);
                return priority ? priority.get('priorityDescr') : 'N/A';
            }
        },
        {
            name: 'fieldPriorityColor',
            mapping: function (data) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId),
                    colors;
                if (priority)
                    colors = priority.get('priorityHighlightColor');
                return colors ? 'background:rgb(' + colors + ');' : '';
            }
        },
        {
            name: 'fieldPriorityFontColor',
            mapping: function (data) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityId', data.fieldPriorityId),
                    colors,
                    luma,
                    r,
                    g,
                    b;
                if (priority) {
                    colors = priority.get('priorityHighlightColor');
                    if (colors) {
                        colors = colors.split(',');
                        r = colors[0] & 0xff;
                        g = colors[1] & 0xff;
                        b = colors[2] & 0xff;
                        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
                        if (luma < 40) {
                            return 'color:#fff !important;'
                        }
                        return 'color:#000';
                    }
                }
            }
        },
        {
            name: 'udf_t1',
            type: 'string'
        },
        {
            name: 'hours',
            type: 'hourslist'
        },
        {
            name: 'schedCrewCt',
            type: 'int'
        },
        {
            name: 'scheduledCrewId',
            type: 'string'
        },
        {
            name: 'scheduledCrewName',
            type: 'string'
        },
        {
            name: 'scheduledCrewChiefId',
            type: 'string'
        },
        {
            name: 'hasCrew',
            type: 'bool'
        },
        {
            name: 'crew1EmpId',
            type: 'string'
        },
        {
            name: 'crew1CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew1EmpName',
            type: 'string'
        },
        {
            name: 'crew2EmpId',
            type: 'string'
        },
        {
            name: 'crew2CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew3EmpId',
            type: 'string'
        },
        {
            name: 'crew3CrewRoleId',
            type: 'int'
        },
        {
            name: 'changesMade',
            type: 'bool'
        },
        {
            name: 'recurrencePattern', // Empty string if non-recurring
            type: 'string'
        },
        {
            name: 'recurrenceDatesInRange',
            type: 'auto'
        },
        {
            name: 'recurrenceConfig',
            type: 'string'
        },
        {
            name: 'nextDate',
            type: 'fssdate'
        },
        {
            name: 'hoverRows',
            type: 'string'
        },
        {
            name: 'crew4EmpId',
            type: 'string'
        },
        {
            name: 'crew4CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew5EmpId',
            type: 'string'
        },
        {
            name: 'crew5CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew6EmpId',
            type: 'string'
        },
        {
            name: 'crew6CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew7EmpId',
            type: 'string'
        },
        {
            name: 'crew7CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew8EmpId',
            type: 'string'
        },
        {
            name: 'crew8CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew9EmpId',
            type: 'string'
        },
        {
            name: 'crew9CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew10EmpId',
            type: 'string'
        },
        {
            name: 'crew10CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew11EmpId',
            type: 'string'
        },
        {
            name: 'crew11CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew12EmpId',
            type: 'string'
        },
        {
            name: 'crew12CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew13EmpId',
            type: 'string'
        },
        {
            name: 'crew13CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew14EmpId',
            type: 'string'
        },
        {
            name: 'crew14CrewRoleId',
            type: 'int'
        },
        {
            name: 'crew15EmpId',
            type: 'string'
        },
        {
            name: 'crew15CrewRoleId',
            type: 'int'
        }
    ]

});