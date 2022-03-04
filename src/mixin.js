export default {
    props: {
        calWidth: {
            type: Object,
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
    },
    methods: {
        setCellStyle(column) {
            const sWidth = this.calWidth[column.key];
            const oStyle = {};
            const { vertical } = column;
            if (sWidth) {
                oStyle.width = `${sWidth}px`;
                oStyle.flex = 'none';
            }
            if (column.align) {
                oStyle['text-align'] = column.align;
            }
            if (vertical || this.vertical) {
                oStyle.display = 'flex';
                oStyle['align-items'] = 'center';
            }
            return oStyle;
        },
        alignCls (column, row = {}) {
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
    },
};
