/**
 * Created by steve.tess on 5/13/2019.
 */
Ext.define('TS.overrides.dom.Element', {
        override: 'Ext.dom.Element'
    },
    function(){
        let additiveEvents = this.prototype.additiveEvents,
            eventMap = this.prototype.eventMap;
        Ext.supports.Touch = false;
        Ext.supports.TouchEvents = true;
});