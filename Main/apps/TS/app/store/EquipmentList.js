/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.store.EquipmentList', {
    extend: 'Ext.data.Store',

    storeId: 'EquipmentList',

    model: 'TS.model.shared.EquipmentList',
    autoLoad: false,
    settingsDependency: true, //custom property

    proxy: {
        type: 'default',
        directFn: 'Equipment.GetList',
        paramOrder: 'dbi|username|start|limit|unitCodeId',
        extraParams: {
            unitCodeId: 'First__a5eLoad'
        }
    }
});