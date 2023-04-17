/**
 * Created by steve.tess on 12/29/2017.
 */
Ext.define('TS.view.fwa.PdfViewer', {
    extend: 'Ext.Panel',
    xtype: 'pdfviewer',

    config: {
        /**
         * @cfg {String} src (required)
         * URL src of the pdf file
         */
        src: null,

        /**
         * @cfg {String|Integer} height
         * The height of the pdf viewer
         */
        height: '100%',

        /**
         * @cfg {String|Integer} width
         * The width of the pdf viewer
         */
        width: '100%',

        overflow: 'scroll'

    },

    constructor: function(config) {
        this.callParent([
            config
        ]);

        var me = this,
            src = me.getSrc(),
            height = me.getHeight(),
            width = me.getWidth(),
            style = me.config.style;

        me.bodyElement.createChild( {
            tag: 'embed',
            height: height,
            width: width,
            style: style,
            src: src
        });
    }
});