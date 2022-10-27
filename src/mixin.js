export default {
    props: {
        calWidth: {
            type: Object,
            required: true,
        },
        scrollLeft: {
            type: Number,
            required: false,
        },
    },
    computed: {
        owner() {
            let parent = this.$parent;
            while (parent && !parent.tableId) {
                parent = parent.$parent;
            }
            return parent;
        },
    },
    methods: {
        setCellStyle(column, type) {
            const sWidth = this.calWidth[column.key];
            const oStyle = {};
            if (sWidth) {
                oStyle.width = `${sWidth}px`;
                oStyle.flex = 'none';
            }
            if (column.align) {
                oStyle['text-align'] = column.align;
            }
            if (type !== 'head') {
                oStyle.display = 'grid';
                oStyle['align-items'] = 'center';
            }

            return oStyle;
        },
        alignCls(column, row = {}) {
            let cellClassName = '';
            if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                cellClassName = row.cellClassName[column.key];
            }
            return [
                {
                    [`${cellClassName}`]: cellClassName, // cell className
                    [`${column.className}`]: column.className, // column className
                },
            ];
        },
        handleWidth(curColumn, oriColumn) {
            const idx = this.columns.findIndex(
                item => item.key === curColumn.key
                    && curColumn.fixed === 'left'
                    && curColumn.type !== 'selection',
            );
            const beforeKey = JSON.parse(JSON.stringify(oriColumn))
                .splice(0, idx)
                .map(item => item.key);
            let num = 0;
            beforeKey.forEach((item) => {
                num += this.calWidth[item];
            });
            if (num) {
                return {
                    left: `${num}px`,
                };
            }
        },
        isFixedCol(column) {
            return column.fixed === 'left' || column.type === 'selection';
        },
        handleColWidth(curColumn) {
            if (this.isFixedCol(curColumn)) {
                const finalColumns = this.columns.filter(c => this.isFixedCol(c));
                const idx = finalColumns.findIndex(item => item.key === curColumn.key);
                const beforeKey = finalColumns.slice(0, idx).map(item => item.key);
                let num = 0;
                beforeKey.forEach((item) => {
                    num += this.calWidth[item];
                });
                return {
                    left: `${num + this.scrollLeft}px`,
                };
            }
            return {
                left: `${0}px`,
            };
        },
    },
};
