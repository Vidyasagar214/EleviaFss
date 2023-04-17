/**
 * Created by SteveTess on 2/4/2022.
 */
Ext.define('TS.overrides.view.Table', {
    override: 'Ext.view.Table',

    /**
     * @private
     * Move a grid column from one position to another
     * @param {Number} fromIdx The index from which to move columns
     * @param {Number} toIdx The index at which to insert columns.
     * @param {Number} [colsToMove=1] The number of columns to move beginning at the `fromIdx`
     */
    moveColumn: function (fromIdx, toIdx, colsToMove) {
        var me = this,
            multiMove = colsToMove > 1,
            range = multiMove && document.createRange ? document.createRange() : null,
            fragment = multiMove && !range ? document.createDocumentFragment() : null,
            destinationCellIdx = toIdx,
            colCount = me.getGridColumns().length,
            lastIndex = colCount - 1,
            doFirstLastClasses = (me.firstCls || me.lastCls) && (toIdx === 0 || toIdx === colCount || fromIdx === 0 || fromIdx === lastIndex),
            i,
            j,
            rows, len, tr, cells,
            colGroups;

        // Dragging between locked and unlocked side first refreshes the view, and calls onHeaderMoved with
        // fromIndex and toIndex the same.
        if (me.rendered && toIdx !== fromIdx) {
            // Grab all rows which have column cells in.
            // That is data rows.
            rows = me.el.query(me.rowSelector);

            for (i = 0, len = rows.length; i < len; i++) {
                tr = rows[i];
                cells = tr.childNodes;

                // Keep first cell class and last cell class correct *only if needed*
                if (doFirstLastClasses) {

                    if (cells.length === 1) {
                        Ext.fly(cells[0]).addCls(me.firstCls);
                        Ext.fly(cells[0]).addCls(me.lastCls);
                        continue;
                    }
                    if (fromIdx === 0) {
                        Ext.fly(cells[0]).removeCls(me.firstCls);
                        Ext.fly(cells[1]).addCls(me.firstCls);
                    } else if (fromIdx === lastIndex) {
                        //debugger;
                        if (cells[lastIndex]) {
                            Ext.fly(cells[lastIndex]).removeCls(me.lastCls);
                            Ext.fly(cells[lastIndex - 1]).addCls(me.lastCls);
                        }

                    }
                    if (toIdx === 0) {
                        Ext.fly(cells[0]).removeCls(me.firstCls);
                        Ext.fly(cells[fromIdx]).addCls(me.firstCls);
                    } else if (toIdx === colCount) {
                        //debugger;
                        if(cells[lastIndex]){
                            Ext.fly(cells[lastIndex]).removeCls(me.lastCls);
                            Ext.fly(cells[fromIdx]).addCls(me.lastCls);
                        }
                    }
                }

                // Move multi using the best technique.
                // Extract a range straight into a fragment if possible.
                if (multiMove) {
                    if (range) {
                        range.setStartBefore(cells[fromIdx]);
                        range.setEndAfter(cells[fromIdx + colsToMove - 1]);
                        fragment = range.extractContents();
                    } else {
                        for (j = 0; j < colsToMove; j++) {
                            fragment.appendChild(cells[fromIdx]);
                        }
                    }
                    tr.insertBefore(fragment, cells[destinationCellIdx] || null);
                } else {
                    //debugger;
                    if (cells[fromIdx])
                        tr.insertBefore(cells[fromIdx], cells[destinationCellIdx] || null);
                }
            }

            // Shuffle the <col> elements in all <colgroup>s
            colGroups = me.el.query('colgroup');
            for (i = 0, len = colGroups.length; i < len; i++) {
                // Extract the colgroup
                tr = colGroups[i];

                // Move multi using the best technique.
                // Extract a range straight into a fragment if possible.
                if (multiMove) {
                    if (range) {
                        range.setStartBefore(tr.childNodes[fromIdx]);
                        range.setEndAfter(tr.childNodes[fromIdx + colsToMove - 1]);
                        fragment = range.extractContents();
                    } else {
                        for (j = 0; j < colsToMove; j++) {
                            fragment.appendChild(tr.childNodes[fromIdx]);
                        }
                    }
                    tr.insertBefore(fragment, tr.childNodes[destinationCellIdx] || null);
                } else {
                    tr.insertBefore(tr.childNodes[fromIdx], tr.childNodes[destinationCellIdx] || null);
                }
            }
        }
    }

});