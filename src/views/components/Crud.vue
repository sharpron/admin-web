<template>
  <div class="app-container">
    <div v-if="searchFields.length" class="filter-container">
      <dynamic-form
        :validate="false"
        :submit-loading="searchLoading"
        :reset-loading="resetSearchLoading"
        :inline="true"
        :fields="searchFields"
        :reset="resetSearch"
        :submit="doSearch"
      />
    </div>

    <el-row class="toolbar">
      <el-button v-permission="[perms.create]" size="mini" type="success" @click="toAdd">+ 新增</el-button>
      <!-- <el-button size="mini" type="danger">- 删除</el-button> -->
      <el-button v-permission="[perms.import]" size="mini" type="info">⬇ 导出</el-button>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        v-for="(field, index) in tableFields"
        :key="index"
        :prop="field.prop"
        :label="field.name"
        show-overflow-tooltip
        :width="field.width || ''"
      >
        <template slot-scope="scope">
          <span v-if="(field.prop).endsWith('Time')">
            {{ scope.row[field.prop] | parseTime }}
          </span>
          <span v-else>
            {{ scope.row[field.prop] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <slot name="operations" />
            <el-button v-if="crud && crud.update" v-permission="[perms.modify]" type="warning" icon="el-icon-edit" size="mini" @click="toModify(scope.row)" />
            <el-popover
              v-model="popoverShows[scope.$index]"
              v-permission="[perms.delete]"
              placement="top"
              width="160"
            >
              <p>确定删除这个{{ title }}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$set(popoverShows, scope.$index, false)">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteById(scope.row.id, scope.$index)">确定</el-button>
              </div>
              <el-button v-if="crud && crud.deleteById" slot="reference" icon="el-icon-delete" type="danger" size="mini" />
            </el-popover>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPagination"
      :current-page="pageable.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageable.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageable.total"
      background
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />

    <el-dialog :title="(form.id ? '修改' : '新增') + title" :visible.sync="dialogFormVisible">
      <dynamic-form :submit-loading="submitLoading" :fields="formFields" :data="form" :submit="save" />
    </el-dialog>
  </div>
</template>

<script>

import { parseTime } from '@/utils'
import DynamicForm from './DynamicForm'
export default {
  name: 'Crud',
  components: { DynamicForm },
  filters: {
    parseTime(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}')
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: false,
      default: () => []
    },
    crud: {
      type: Object,
      required: false,
      default: () => ({})
    },
    perms: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      listLoading: false,
      pageable: {
        total: 0,
        page: 0,
        size: 10
      },
      list: [],
      showPagination: true,
      searchLoading: false,
      resetSearchLoading: false,
      searchForm: {},
      submitLoading: false,
      form: {},
      popoverShows: [],
      downloadLoading: false,
      dialogFormVisible: false
    }
  },
  computed: {
    tableFields() {
      return this.getFields('table')
    },
    searchFields() {
      return this.fields
        .filter(field => field.searchable)
    },
    formFields() {
      const location = this.form.id ? 'modify' : 'add'
      return this.getFields(location)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    onSizeChange(val) {
      this.pageable.size = val
      this.getData()
    },
    onPageChange(val) {
      this.pageable.page = val - 1
      this.getData()
    },
    resetSearch() {
      this.resetSearchLoading = true
      this.doSearch({})
    },
    doSearch(data) {
      this.searchLoading = true
      this.searchForm = data
      this.pageable.page = 0
      this.getData()
        .finally(() => {
          this.searchLoading = false
          this.resetSearchLoading = false
        })
    },
    getData() {
      this.listLoading = true
      return this.crud.query({
        ...this.pageable,
        ...this.searchForm
      })
        .then(res => {
          const { totalElements, content } = res.data
          if (Array.isArray(res.data)) {
            this.list = res.data
            this.showPagination = false
          } else {
            this.pageable.total = totalElements
            this.list = content
          }
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    save(data) {
      this.submitLoading = true
      if (data.id) {
        this.crud.update(data)
          .then(() => {
            this.dialogFormVisible = false
            this.$notify.success(`修改${this.title}成功`)
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else {
        this.crud.create(data)
          .then(() => {
            this.dialogFormVisible = false
            this.$notify.success(`添加${this.title}成功`)
            this.getData()
          })
          .finally(() => {
            this.submitLoading = false
          })
      }
    },
    toModify(data) {
      this.form = data
      this.dialogFormVisible = true
    },
    getFields(location) {
      return this.fields
        .filter(field => field.location === undefined ||
          field.location.indexOf(location) !== -1)
    },
    toAdd() {
      this.toModify({})
    },
    deleteById(id, index) {
      this.crud.deleteById(id)
        .then(() => {
          this.$notify.success(`删除${this.title}成功`)
          this.getData()
        })
        .finally(() => {
          this.$set(this.popoverShows, index, false)
        })
    }
  }
}
</script>
<style scoped>
.danger {
  color: #F56C6C
}
.toolbar {
  margin-bottom: 14px;
}
.el-pagination {
  margin-top: 14px;
}
</style>
