/**
 * Created by steve.tess on 6/16/2016.
 */
Ext.define('TS.common.dd.EmployeeAssignGridDragZone', {
    extend: 'Ext.dd.DragZone',

    grid: null,

    // Tell Ext how to recover from an invalid drop
    getRepairXY: function () {
        return this.dragData.repairXY;
    },

    // To pair together a drag zone and drop zone
    ddGroup: 'employees',

    getDragData: function (e) {
        var sourceEl = e.getTarget(),
            view = this.grid.getView(),
            rowEl = view.findItemByChild(sourceEl),
            dragRec = rowEl && view.getRecord(rowEl);

        if (sourceEl && dragRec) {
//            var d = sourceEl.cloneNode(true);

            // Prepare the content to be put inside the drag proxy
            var wrap = Ext.get(Ext.core.DomHelper.createDom({
                tag: 'div',
                cls: 'dd-employee',
                style: {
                    width: '100px'
                }
                ,
                children: [
                    {
                        tag: 'span',
                        cls: 'dd-employee-hd',
                        html: '&nbsp;'
                    }
                ]
            }));

            var records = this.grid.getSelectionModel().getSelection();
            //check if highlighted row(records[0]) matches the record being dragged(dragRec)
            if (records.length === 0 || records[0] != dragRec) {
                records = [dragRec];
            }

            for (var i = 0; i < records.length; i++) {
                var record = records[i],
                    node = view.getNodeByRecord(record);

                if (node) {
                    var d = node.cloneNode(true);

                    Ext.fly(d).update(record.get('fname') + ' ' + record.get('lname'));

                    wrap.appendChild(d);
                }
            }

            return {
                // For the drag zone contract, must return some DOM node to be dragged
                ddel: wrap.dom,

                // Let the drag zone know the animation target if drag fails
                repairXY: Ext.fly(rowEl).getXY(),

                // We can add any data we want to this object, we only require the
                // drop zone to know about the unplanned task record
                records: records
            };
        }
    }
});