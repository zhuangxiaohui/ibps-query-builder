<template>
  <div class="rules-group-container">
    <div class="rules-group-header">
      <!--规则组条件-->
      <div class="btn-group group-conditions">
        <el-radio-group v-model="rules.condition" size="mini">
          <el-radio-button v-for=" condition in conditions" :disabled="!hasMultipleRule" :key="condition.value" :label="condition.value">{{ condition.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <!--规则操作-->
      <div class="btn-group pull-right group-actions">
        <el-button-group>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRule">{{ labels.addRulue }}</el-button>
          <el-button v-if="hasGroup" size="mini" type="success" icon="el-icon-circle-plus-outline" @click="addGroup">{{ labels.addGroup }}</el-button>
          <el-button v-if="depth > 1" size="mini" type="danger" icon="el-icon-close" @click="remove">{{ labels.removeGroup }}</el-button>
        </el-button-group>
      </div>
    </div>
    <!--规则-->
    <div class="rules-group-body">
      <div class="rules-list">
        <component
          v-for="(child, index) in rules[childrenKey]"
          :key="index"
          :is="child[childrenKey].condition?'query-builder-group':'query-builder-rule'"
          :rules.sync="child[childrenKey]"
          :filters="filters"
          :index="index"
          :max-depth="maxDepth"
          :depth="depth + 1"
          :labels="labels"
          :conditions="conditions"
          @child-deletion-requested="removeChild"/>
      </div>
    </div>
  </div>
</template>

<script>
import QueryBuilderRule from './query-builder-rule.vue'
import Utils from '../utils'

export default {
  name: 'query-builder-group',
  components: {
    QueryBuilderRule
  },
  props: {
    type: String,
    rules: Object,
    filters: Array,
    index: [String, Number],
    maxDepth: Number,
    depth: Number,
    labels: Object,
    conditions: Array,
    childrenKey: {// 儿子key
      type: String,
      default: 'rules'
    }
  },
  data() {
    return {}
  },
  computed: {
    hasMultipleRule() {
      return this.rules[this.childrenKey] && this.rules[this.childrenKey].length > 1
    },
    hasGroup() {
      return !this.maxDepth || (this.maxDepth && this.depth < this.maxDepth)
    }
  },
  methods: {
    // 默认规则
    getDefaultRule() {
      return {
        id: this.filters[0].id,
        operator: this.filters[0].operators[0].type,
        value: null
      }
    },
    // 添加规则
    addRule() {
      const updatedRules = Utils.deepClone(this.rules)
      const child = {
        rules: this.getDefaultRule()
      }
      updatedRules[this.childrenKey].push(child)
      this.$emit('update:rules', updatedRules)
    },
    // 添加组
    addGroup() {
      if (!this.hasGroup) { return }
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules[this.childrenKey].push({
        rules: {
          condition: this.conditions[0].value,
          [this.childrenKey]: [
            {
              rules: this.getDefaultRule()
            }
          ]
        }
      })
      this.$emit('update:rules', updatedRules)
    },
    remove() {
      this.$emit('child-deletion-requested', this.index)
    },
    removeChild(index) {
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules[this.childrenKey].splice(index, 1)
      this.$emit('update:rules', updatedRules)
    }
  }
}
</script>
