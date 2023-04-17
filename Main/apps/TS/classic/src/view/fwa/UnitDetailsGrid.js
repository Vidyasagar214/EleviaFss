/**
 * Created by steve.tess on 11/29/2016.
 */
Ext.define('TS.view.fwa.UnitDetailsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-unitdetails',

    reference: 'fwaUnitDetailGrid',
    itemId: 'fwaUnitDetailGrid',

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }, {
        ptype: 'responsive'
    }],

    responsiveConfig: {
        small: {
            width: 500,
            height: 300
        },
        normal: {
            width: 700
        }
    },

    store: {
        model: 'TS.model.fwa.UnitDetail',
        sorters: [{
            property: 'dtDate',
            direction: 'ASC'
        }],
        sortOnLoad: false
    },

    viewConfig: {
        columnLines: false,
        markDirty: false
    },

    columns: [
        {
            flex: 1.5,
            xtype: 'datecolumn',
            editor: 'datefield',
            text: 'Date',
            dataIndex: 'dtDate',
            align: 'center'
        }, {
            flex: 1.5,
            editor: 'textfield',
            text: 'From',
            dataIndex: 'from'
        },{
            flex: 1,
            editor: 'textfield',
            text: 'To',
            dataIndex: 'to'
        }, {
            flex: 1.5,
            editor: {
                xtype: 'numberfield'
            },
            text: 'Starting<br/>Odometer',
            dataIndex: 'lValue1',
            align: 'right',
            style: 'text-align: center'
        }, {
            flex: 1,
            editor: {
                xtype: 'numberfield'
            },
            text: 'Ending<br/>Odometer',
            dataIndex: 'lValue2',
            align: 'right',
            style: 'text-align: center'
        }, {
            flex: 1,
            // editor: {
            //     xtype: 'numberfield'
            // },
            text: 'Miles',
            dataIndex: 'lValue3',
            align: 'right',
            renderer: function (value, metaData, record, rowIndex) {
                return record ? record.get('lValue2') - record.get('lValue1') : 0;
            },
            readOnly: true
        }, {
            flex: 3.5,
            text: 'Description',
            editor: 'textfield',
            dataIndex: 'sValue1'
        }
    ],
    listeners:{
        beforeedit: function(editor, context){
            var readOnly = this.getView().up('window').unitRecord.get('readOnly');
            if(readOnly){
                return false;
            }
            return true;
        }
    }
});