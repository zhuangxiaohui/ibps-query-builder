<template>
  <div class="rule-container">
    <div class="rule-header">
      <!--规则过滤字段-->
      <div class="rule-filter-container">
        <el-select v-model="selectedFilter" size="small" @change="changeFilter">
          <el-option
            v-for="r in filters"
            :key="r.id"
            :label="r.label"
            :value="r.id"/>
        </el-select>
      </div>
      <!--规则操作符-->
      <div class="rule-operator-container">
        <el-select v-model="rules.operator" size="small">
          <el-option v-for="operator in selectedFilterObj.operators" :value="operator.type" :key="operator.type" :label="$t('components.queryBuilder.operators.'+operator.type)"/>
        </el-select>
      </div>
      <!--规则值-->
      <div v-if="hasRuleValue" class="rule-value-container">
        <el-input v-if="selectedFilterObj.input === 'text'" v-model="rules.value" type="text" size="small" clearable/>
        <el-input-number v-else-if="selectedFilterObj.input === 'number'" v-model="rules.value" size="small"/>
        <el-date-picker v-else-if="selectedFilterObj.input === 'date' || selectedFilterObj.input === 'datetime'" :editable="false" :type="selectedFilterObj.input+(nbInputs > 1 ? 'range' : '')" v-model="rules.value" value-format="timestamp" />
        <el-radio-group v-else-if="selectedFilterObj.input === 'radio'" v-model="rules.value">
          <el-radio v-for="option in iterateOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
        <el-checkbox-group v-else-if="selectedFilterObj.input === 'checkbox'" v-model="rules.value">
          <el-checkbox v-for="option in iterateOptions" :label="option" :key="option" :value="option"/>
        </el-checkbox-group>
        <el-select v-else-if="selectedFilterObj.input === 'select'" v-model="rules.value">
          <el-option v-for="option in iterateOptions" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
        <template v-else>
          <component :value="rules.value" :is="selectedFilterObj.component" v-bind="selectedFilterObj.attrs" @input="updateRules"/>
        </template>
      </div>

      <div class="btn-group pull-right rule-actions">
        <el-button size="small" type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../utils'
import QueryBuilder from '../constants'

export default {
  name: 'query-builder-rule',
  props: {
    rules: [Array, Object],
    index: [String, Number],
    filters: Array,
    labels: Object
  },
  data() {
    return {
      selectedFilterObj: this.filters[0],
      selectedFilter: this.rules.id || this.filters[0].id
    }
  },
  computed: {
    hasRuleValue() {
      return QueryBuilder.OPERATORS[this.rules.operator].nb_inputs > 0
    },
    nbInputs() {
      return QueryBuilder.OPERATORS[this.rules.operator].nb_inputs
    },
    iterateOptions() {
      if (typeof this.selectedFilterObj.values === 'undefined') {
        return []
      }
      const cleanValues = []
      Utils.iterateOptions(this.selectedFilterObj.values, function(value, label, optgroup) {
        cleanValues.push({
          value: value,
          label: label,
          optgroup: optgroup || null
        })
      })
      return cleanValues
    }
  },
  mounted() {
    // Set a default value for these types if one isn't provided already
    this.initValue()
    var selectedFilterCopy = this.selectedFilter
    var splitIndex = selectedFilterCopy.indexOf('-')
    if (splitIndex > -1) {
      this.selectedFilter = selectedFilterCopy.substring(0, splitIndex)
    } else {
      this.filters.forEach((rule) => {
        if (rule.id === this.selectedFilter) {
          this.selectedFilterObj = rule
          return false
        }
      })
    }
  },
  methods: {
    // 删除规则
    remove: function() {
      this.$emit('child-deletion-requested', this.index)
    },
    // 改变规则的条件
    changeFilter: function() {
      const _this = this
      this.rules.value = null
      this.filters.forEach(function(value) {
        if (value.id === _this.selectedFilter) {
          _this.selectedFilterObj = value
          _this.rules.id = _this.selectedFilter
          _this.initValue()
        }
      })
      this.rules.operator = this.selectedFilterObj.operators[0].type
    },
    /**
     * 初始化值
     */
    initValue() {
      this.rules.dataType = this.selectedFilterObj.dataType

      if (this.rules.value === null) {
        const updatedRules = Utils.deepClone(this.rules)
        if (this.selectedFilterObj.input === 'checkbox') {
          updatedRules.value = []
        } else if (
          this.selectedFilterObj.input === 'select' ||
          this.selectedFilterObj.input === 'radio'
        ) {
          updatedRules.value = this.selectedFilterObj.values[0].value
        } else if (
          this.selectedFilterObj.input === 'time' ||
          this.selectedFilterObj.input === 'date' ||
          this.selectedFilterObj.input === 'datetime'
        ) {
          updatedRules.value = this.nbInputs > 1 ? [] : null
        }
        this.$emit('update:rules', Utils.deepClone(updatedRules))
      }
    },
    updateRules(value) {
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules.value = value
      this.$emit('update:rules', updatedRules)
    }
  }
}
</script>
