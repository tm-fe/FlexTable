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
        type: {
            type: String,
            default: 'body',
        },
    },
    render: (h, ctx) => {
        const { column } = ctx.props;
        const { key } = column;
        const classDefault = `flex-table-slot-${ctx.props.type}`;
        const className = [
            classDefault,
            `${classDefault}-${key}`,
        ];
        return h('div', {
            class: className,
        }, ctx.props.owner.$scopedSlots[key]({
            row: ctx.props.row,
            column,
            index: ctx.props.index,
            type: ctx.props.type,
            key,
        }));
    },
};
