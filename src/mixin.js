export default {
    props: {
        calWidth: {
            type: String,
            required: true,
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
        calWidthObj() {
            return JSON.parse(this.calWidth);
        },
    },
    methods: {
        setCellStyle(column, type) {
            const sWidth = this.calWidthObj[column.key];
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
                num += this.calWidthObj[item];
            });
            if (num) {
                return {
                    left: `${num}px`,
                };
            }
        },
    },
};
