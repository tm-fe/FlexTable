<template>
  <div class="test">
      <flex-table
        :row-class-name="rowClassName" :selectedClass="'selected-class'" :columns="column1" :data="data1">
      </flex-table>
  </div>
</template>

<script>
export default {
    data() {
        return {
            column1: [
                {
                    type: 'selection',
                    width: 20,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    title: 'Name',
                    key: 'name',
                },
                {
                    title: 'Age',
                    key: 'age',
                    className: 'flag-one',
                },
                {
                    title: 'Address',
                    key: 'address',
                },
            ],
            data1: [
                {
                    name: 'jack',
                    age: '18',
                    address: 'New York No. 1 Lake Park',
                    cellClassName: {
                        name: 'flag-two',
                    },
                },
                {
                    name: 'jack2',
                    age: '18',
                    address: 'New York No. 1 Lake Park',
                },
                {
                    name: 'jack',
                    age: '18',
                    address: 'New York No. 1 Lake Park',
                },
                {
                    name: 'jack',
                    age: '18',
                    address: 'New York No. 1 Lake Park',
                },
                {
                    name: 'jack',
                    age: '18',
                    address: 'New York No. 1 Lake Park',
                },
            ],
        }
    },
    methods: {
        rowClassName (row, index) {
            if (index === 4) {
                return 'flag-three';
            }
            if (row.name === 'jack2'){
                return 'flag-four'
            }
        },
    },
}
</script>

<style lang="less">
.selected-class{
    background-color:chocolate;
}
.flag-one{
    background-color: yellow;
}
.flag-two{
    background-color: Violet ;
}
.flag-four{
    background-color: aquamarine;
}
.flag-three{
    background-color: LightPink ;
}
</style>
