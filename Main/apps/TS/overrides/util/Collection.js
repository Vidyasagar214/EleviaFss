// // EXTJS-16685
// // Grouped grid does not respect store.insert(index)
// Ext.define('TS.overrides.util.Collection', {
//     override: 'Ext.util.Collection',
//
//     findInsertionIndex: function (item, items, comparatorFn, index) {
//         var beforeCheck, afterCheck, len;
//
//         items = items || this.items;
//         comparatorFn = comparatorFn || this.getSortFn();
//         len = items.length;
//
//         if (index < len) {
//             beforeCheck = index > 0 ? comparatorFn(items[index - 1], item) : 0;
//             afterCheck = index < len - 1 ? comparatorFn(item, items[index]) : 0;
//             if (beforeCheck < 1 && afterCheck < 1) {
//                 return index;
//             }
//         }
//
//         return Ext.Array.binarySearch(items, item, comparatorFn);
//     },
//    
//     splice: function (index, toRemove, toAdd) {
//         var me = this,
//             autoSort = me.sorted && me.getAutoSort(),
//             map = me.map,
//             items = me.items,
//             length = me.length,
//             removeItems = (toRemove instanceof Array) ? me.decodeRemoveItems(toRemove) : null,
//             isRemoveCount = !removeItems,
//             Num = Ext.Number,
//             range = Num.clipIndices(length, [index, isRemoveCount ? toRemove : 0],
//                 Num.Clip.COUNT),
//             begin = range[0],
//             end = range[1],
//             removeCount = end - begin,
//             newItems = me.decodeItems(arguments, 2),
//             newCount = newItems ? newItems.length : 0,
//             addItems, newItemsMap, removeMap,
//             insertAt = begin,
//             indices = me.indices || ((newCount || removeItems) ? me.getIndices() : null),
//             adds = null,
//             removes = removeCount ? [begin] : null,
//             newKeys = null,
//             source = me.getSource(),
//             chunk, chunkItems, chunks, i, item, itemIndex, k, key, keys, n, duplicates,
//             sorters;
//
//         if (source && !source.updating) {
//             if (isRemoveCount) {
//                 removeItems = [];
//                 for (i = 0; i < removeCount; ++i) {
//                     removeItems.push(items[begin + i]);
//                 }
//             }
//
//             if (begin < length) {
//                 i = source.indexOf(items[begin]);
//             } else {
//                 i = source.length;
//             }
//
//
//             me.requestedIndex = index;
//             source.splice(i, removeItems, newItems);
//             delete me.requestedIndex;
//             return me;
//         }
//
//
//         if (newCount) {
//             addItems = newItems;
//             newKeys = [];
//             newItemsMap = {};
//
//
//             if (autoSort) {
//                 // We'll need the sorters later as well
//                 sorters = me.getSorters();
//
//                 if (newCount > 1) {
//                     if (!addItems.$cloned) {
//                         newItems = addItems = addItems.slice(0);
//                     }
//                     me.sortData(addItems);
//                 }
//             }
//
//             for (i = 0; i < newCount; ++i) {
//                 key = me.getKey(item = newItems[i]);
//
//                 if ((k = newItemsMap[key]) !== undefined) {
//
//                     (duplicates || (duplicates = {}))[k] = 1;
//                 } else {
//
//                     itemIndex = indices[key];
//                     if (itemIndex < begin || end <= itemIndex) {
//                         (removes || (removes = [])).push(itemIndex); // might be the first
//                     }
//                 }
//
//                 newItemsMap[key] = i; // track the last index of this key in newItems
//                 newKeys.push(key); // must correspond 1-to-1 with newItems
//             }
//
//             if (duplicates) {
//                 keys = newKeys;
//                 addItems = [];
//                 newKeys = [];
//                 addItems.$cloned = true;
//
//                 for (i = 0; i < newCount; ++i) {
//                     if (!duplicates[i]) {
//                         item = newItems[i];
//                         addItems.push(item);
//                         newKeys.push(keys[i]);
//                     }
//                 }
//
//                 newCount = addItems.length;
//             }
//
//             adds = {
//
//                 items: addItems,
//                 keys: newKeys
//             };
//         }
//
//         for (i = removeItems ? removeItems.length : 0; i-- > 0;) {
//             key = me.getKey(removeItems[i]);
//             if ((itemIndex = indices[key]) !== undefined) {
//                 // ignore items we don't have (probably due to filtering)
//                 (removes || (removes = [])).push(itemIndex); // might be the first remove
//             }
//         }
//
//         if (!adds && !removes) {
//             return me;
//         }
//
//         me.beginUpdate();
//        
//         if (removes) {
//             chunk = null;
//             chunks = [];
//             removeMap = {};
//             if (removes.length > 1) {
//                 removes.sort(Ext.Array.numericSortFn);
//             }
//
//             for (i = 0, n = removes.length; i < n; ++i) {
//                 key = me.getKey(item = items[itemIndex = removes[i]]);
//                 if (!(key in map)) {
//                     continue;
//                 }
//
//
//                 delete map[key];
//
//
//                 if (!chunk || itemIndex > (chunk.at + chunkItems.length)) {
//                     chunks.push(chunk = {
//                         at: itemIndex,
//                         items: (chunkItems = []),
//                         keys: (keys = []),
//                         map: removeMap,
//                         next: chunk,
//                         replacement: adds
//                     });
//
//                     // Point "replaced" at the last chunk
//                     if (adds) {
//                         adds.replaced = chunk;
//                     }
//                 }
//
//                 chunkItems.push(removeMap[key] = item);
//                 keys.push(key);
//
//                 if (itemIndex < insertAt - 1) {
//
//                     --insertAt;
//                 }
//
//                 if (removeCount > 1 && itemIndex === begin) {
//
//                     //
//                     --removeCount;
//                     removes[i--] = ++begin;
//                 }
//             }
//
//             if (adds) {
//                 adds.at = insertAt;
//             }
//
//             for (k = chunks.length; k-- > 0;) {
//                 chunk = chunks[k];
//                 i = chunk.at;
//                 n = chunk.items.length;
//
//                 if (i + n < length) {
//
//                     me.indices = indices = null;
//                 }
//
//                 me.length = length -= n;
//
//                 items.splice(i, n);
//
//                 if (indices) {
//                     keys = chunk.keys;
//                     for (i = 0; i < n; ++i) {
//                         delete indices[keys[i]];
//                     }
//                 }
//
//                 ++me.generation;
//                 me.notify('remove', [chunk]);
//             }
//         } // if (removes)
//
//         if (adds) {
//             if (autoSort && newCount > 1 && length) {
//                 me.spliceMerge(addItems, newKeys);
//             } else {
//                 if (autoSort) {
//                     if (newCount > 1) {
//                         insertAt = 0;
//                         me.indices = indices = null;
//                     } else {
//
//                         insertAt = sorters.findInsertionIndex(adds.items[0], items, me.getSortFn(), index);
//                     }
//                 }
//
//                 if (insertAt === length) {
//                     end = insertAt;
//                     for (i = addItems.length - 1; i >= 0; --i) {
//                         items[end + i] = addItems[i];
//                     }
//
//                     indices = me.indices;
//                     if (indices) {
//                         for (i = 0; i < newCount; ++i) {
//                             indices[newKeys[i]] = insertAt + i;
//                         }
//                     }
//                 } else {
//                     // inserting
//                     me.indices = null;
//                     Ext.Array.insert(items, insertAt, addItems);
//                 }
//
//                 for (i = 0; i < newCount; ++i) {
//                     map[newKeys[i]] = addItems[i];
//                 }
//
//                 me.length += newCount;
//                 adds.at = insertAt;
//                 adds.atItem = insertAt === 0 ? null : items[insertAt - 1];
//                 ++me.generation;
//                 me.notify('add', [adds]);
//             }
//         }
//
//         me.endUpdate();
//
//         return me;
//     }
// });
