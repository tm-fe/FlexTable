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
            if (sWidth) {
                oStyle.width = `${sWidth}px`;
                oStyle.flex = 'none';
            }
            if (column.align) {
                oStyle['text-align'] = column.align;
            }

            return oStyle;
        },
    },
};
