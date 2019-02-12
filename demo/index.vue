<template>
  <ibps-container type="full" class="page">
    <ibps-query-builder
      ref="queryBuilder"
      :filters="filters"
      :conditions="conditions"
      v-model="rules"/>
  </ibps-container>

</template>
<script>
import IbpsQueryBuilder from '@/components/ibps-query-builder'
export default {
  components: {
    IbpsQueryBuilder
  },
  data() {
    return {
      conditions: {
        'all': '所有条件',
        'any': '任何一个条件'
      },
      filters: [
        {
          id: 'vegetable',
          input: 'text',
          label: '蔬菜'
        },
        {
          input: 'radio',
          id: 'fruit',
          label: '水果',
          values: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
          ]
        },
        {
          input: 'select',
          id: 'fruit2',
          label: '水果2',
          values: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
          ]
        },
        {
          id: 'createDate',
          type: 'datetime',
          input: 'date',
          label: '创建时间'
        },
        {
          id: 'custom',
          input: 'custom',
          component: 'el-slider',
          label: '自定义',
          attrs: {
            'min': 5,
            'max': 20
          },
          operators: ['equal', 'not_equal']
        }
      ],

      rules: {
        'condition': 'all',
        'rules': [
          {
            'rules': {
              'id': 'vegetable',
              'operator': 'contains',
              'value': '测试'
            }
          },
          {
            'rules': {
              'id': 'fruit',
              'operator': 'equal',
              'value': 'banana'
            }
          }
        ]
      }
    }
  },
  watch: {
    rules() {
      console.info(this.rules)
    }
  }
}
</script>
<style lang="scss">
  .query-builder{
    .rule-value-container .el-slider{
      width: 200px;
      padding-left: 10px;
      height: 32px;
    }
  }
</style>

