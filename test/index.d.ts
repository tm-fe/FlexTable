
interface FlexTableColumnOption {
    [index: string]: string | number | boolean;
    name: string;
    age: number;
    address: string;
    date: string;
}

interface FlexTableRow {
    row: FlexTableColumnOption;
    column: {
        title: string;
    };
}

interface SortOption {
    key: string;
    order: string;
}
