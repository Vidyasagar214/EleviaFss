Ext.util.Format.belongsTo = function (value, meta, record, rowIndex, colIndex, store, view) {
    var column = view.getColumnManager().getHeaderAtIndex(colIndex),
        associationGetterName = record.associations[column.associationKey].getterName,
        associationDisplayProperty = column.associationDisplay;

    record[associationGetterName]({
        callback: function (rec) {
            var output = (rec ? column.associationDisplay(rec) : (value + ' (Missing Association)'));
            view.getCell(record, column).down('div').setHtml(output);
        },
        scope: this
    });
    return record[associationGetterName]().get(associationDisplayProperty) || 'Loading...';
};
