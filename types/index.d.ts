import Vue, { VNode, CreateElement } from "vue";

interface sortOption {
    key: string;
    order: string;
}

export declare class FlexTable extends Vue {
    /**
     *  显示数据
     */
    list: object[];

    /**
     * 汇总信息
     */
    sum?: object | boolean;

    /**
     * 表格列的配置
     */
    columns: object[];

    /**
     * 加载状态, default: false
     */
    loading: boolean;

    /**
     * 高度
     */
    height?: number;

    /**
     * 是否可以调整列宽，default: false
     */
    resizable?: boolean;

    /**
     * 没有数据时显示的文案, default: 'No Data'
     */
    noData?: string;

    /**
     * 排序发生变化时触发
     * @returns {Object} option
     * 
     */
    $emit(
        eventName: "on-sort-change",
        option: sortOption
    ): this;

    /**
     * 拖拽调整列宽时触发
     * @returns newWidth, oldWidth, column, event
     * 
     */
    $emit(
        eventName: "on-col-width-resize",
        newWidth: number,
        oldWidth: number,
        column: object,
        event: MouseEvent
    ): this;
}
