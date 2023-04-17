Ext.define('TS.common.map.FWA', {
    extend: 'TS.common.map.Default',
    xtype: 'map-fwa',

    controller: 'map-fwa',
    reference: 'fwamap',

    config: {
        fwaRecord: null,
        fwaStore: null,

        isSingleFwa: false,
        draggablePin: false,
        suppressMessages: true
    },

    listeners: {
        mapready: 'handleMapReady',
        scope: 'self.controller'
    }
});
