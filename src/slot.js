export default {
    name: 'TableSlot',
    functional: true,
    props: {
        class: String,
        row: Object,
        index: Number,
        column: {
            type: Object,
            default: null,
        },
        owner: Object,
    },
    render: (h, ctx) => {
        return h('div', ctx.props.owner.$scopedSlots[ctx.props.column.key]({
            row: ctx.props.row,
            column: ctx.props.column,
            index: ctx.props.index,
        }));
    },
};
