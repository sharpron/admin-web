<template>
  <el-form
    ref="dataForm"
    :inline="inline"
    :model="form"
    :label-position="labelPosition"
    :label-width="inline ? '' : labelWidth"
  >

    <el-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.name"
      :prop="field.prop"
      :rules="getRules(field)"
    >
      <el-input
        v-if="field.type === TYPE_INPUT"
        v-model="form[field.prop]"
        :rows="field.rows || 5"
        :type="field.rawtype || 'text'"
        :maxlength="field.maxlength || 255"
        show-word-limit

        :placeholder="'请输入' + field.name"
      />
      <el-select
        v-else-if="field.type === TYPE_SELECT"
        v-model="form[field.prop]"
        :placeholder="'请选择' + field.name"
      >
        <el-option
          v-for="option in fieldOptions[field.prop]"
          :key="option.id"
          :label="option.name"
          :value="option.id"
        />
      </el-select>
      <treeselect
        v-else-if="field.type === TYPE_TREESELECT"
        v-model="form[field.prop]"
        :options="fieldOptions[field.prop]"
        :placeholder="'选择' + field.name"
        :no-children-text="'无子' + field.name"
        :multiple="field.multiple || false"
        :no-options-text="'没有任何' + field.name"
        :searchable="true"
        no-results-text="没有匹配的结果"
        :normalizer="node => ({
          id: node.id,
          label: node.name || node.title,
          children: node.children.length ? node.children : null,
        })"
      />
      <div
        v-else-if="field.type === TYPE_RADIO"
      >
        <el-radio
          v-for="option in fieldOptions[field.prop]"
          :key="option.id"
          v-model="form[field.prop]"
          :label="option.id"
        >{{ option.name }}</el-radio>
      </div>
      <el-date-picker
        v-else-if="field.type === TYPE_DATE"
        v-model="form[field.prop]"
        :placeholder="'请选择时间' + field.name"
        value-format="timestamp"
        :type="field.rawtype || 'datetime'"
      />

    </el-form-item>
    <el-row type="flex" justify="center" :style="{display: inline ? 'inline' : ''}">
      <el-button :loading="submitLoading" type="primary" @click="submitForm">确 认</el-button>
      <el-button :loading="resetLoading" type="info" @click="resetForm">重 置</el-button>
    </el-row>
  </el-form>
</template>
<script>
import { getDict } from '@/api/dict'

const TYPE_INPUT = 'input'
const TYPE_SELECT = 'select'
const TYPE_TREESELECT = 'treeselect'
const TYPE_RADIO = 'radio'
const TYPE_DATE = 'date'
export default {
  name: 'Edit',
  props: {
    rules: {
      type: Object,
      required: false,
      default: () => ({})
    },
    labelPosition: {
      type: String,
      required: false,
      default: () => 'right'
    },
    labelWidth: {
      type: String,
      required: false,
      default: () => '100px'
    },
    fields: {
      type: Array,
      required: false,
      default: () => []
    },
    data: {
      type: Object,
      required: false,
      default: () => ({})
    },
    inline: {
      type: Boolean,
      required: false,
      default: () => false
    },
    validate: {
      type: Boolean,
      required: false,
      default: () => true
    },
    submit: {
      type: Function,
      required: false,
      default: () => () => {}
    },
    submitLoading: {
      type: Boolean,
      required: false,
      default: () => false
    },
    resetLoading: {
      type: Boolean,
      required: false,
      default: () => false
    },
    reset: {
      type: Function,
      required: false,
      default: () => () => {}
    }
  },
  data() {
    return {
      TYPE_INPUT,
      TYPE_SELECT,
      TYPE_RADIO,
      TYPE_DATE,
      TYPE_TREESELECT,
      form: this.data,
      backupData: {},
      fieldOptions: {}
    }
  },
  watch: {
    data(newVal) {
      this.form = newVal
    }
  },
  created() {
    // 修复treeselect在异步加载数据同时v-model不为空值时候的报错
    this.fields.filter(e => e.type === TYPE_TREESELECT)
      .forEach(e => {
        this.backupData[e.prop] = this.form[e.prop]
        this.form[e.prop] = null
      })
  },
  mounted() {
    console.log(this.fields)
    // 处理field.options中的操作
    this.fields.filter((field) => field.options || false)
      .forEach(field => {
        if (Array.isArray(field.options)) {
          console.log('this is ' + field.prop + JSON.stringify(field.options))
          this._updateOptions(field, field.options)
        } else if (typeof (field.options) === 'string') {
          this._requestOptions(field, field.options)
        } else {
          field.options((options) => {
            this._updateOptions(field, options)
          })
        }
      })
  },
  methods: {
    _updateOptions(field, options) {
      // fix bug
      this.$set(this.fieldOptions, field.prop, options)
      if (this.backupData[field.prop]) {
        this.form[field.prop] = this.backupData[field.prop]
      }
    },
    _requestOptions(field, url) {
      getDict(url).then(res => {
        this._updateOptions(field, res.data)
      })
    },
    getRules(field) {
      if (this.validate) {
        const rules = field.rules || []
        if (field.required) {
          return [
            { required: true, message: `${field.name}不能为空`, trigger: 'blur' },
            ...rules
          ]
        }
        return rules
      }
      return []
    },
    resetForm() {
      this.form = {}
      this.reset()
    },
    submitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.data)
          this.submit(Object.assign({}, this.data))
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>
.el-form--inline .el-form-item__content {
  width: 14rem;
}
</style>
