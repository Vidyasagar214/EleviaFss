Ext.define('TS.chart.theme.Basic', {
    extend: 'Ext.chart.theme.Base',
    singleton: true,
    alias: 'chart.theme.basic',
    config: {
        colors: [
            //Add at least 16 colors to the palette
            //orange, blue, green, red, gray, goldenrod
             '#0000FF', '#FFA500','#008000', '#FF0000', '#808080', '#DAA520'
        ]
    }
});