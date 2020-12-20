<template>
  <crud title="部门" :fields="fields" :crud="DeptCrud" />
</template>
<script>
import Crud from '@/views/components/Crud'
import DeptCrud from '@/api/dept'
export default {
  name: 'User',
  components: { Crud },
  data() {
    return {
      fields: [
        { prop: 'name', name: '部门', searchable: true, required: true, type: 'input' },
        { prop: 'parentId', name: '上级', location: ['add', 'modify'], type: 'treeselect', options: 'depts' },
        { prop: 'orderNo', name: '排序', required: true, type: 'input', rawtype: 'number' },
        { prop: 'createTime', name: '创建时间', location: ['table'] },
        { prop: 'createBy', name: '创建人', location: ['table'] },
        { prop: 'modifyTime', location: ['table'], name: '修改时间' },
        { prop: 'modifyBy', location: ['table'], name: '修改人' }
      ],
      DeptCrud
    }
  }
}
</script>
