<template>
  <crud title="用户" :fields="fields" :crud="UserCrud" />
</template>
<script>
import Crud from '@/views/components/Crud'
import UserCrud from '@/api/user'
export default {
  name: 'User',
  components: { Crud },
  data() {
    return {
      fields: [
        { prop: 'deptId', name: '部门', location: ['add', 'modify'], searchable: true, required: true, type: 'treeselect', options: 'depts' },
        { prop: 'deptName', name: '部门', location: ['table'] },
        { prop: 'username', name: '用户名', required: true, type: 'input' },
        { prop: 'password', name: '密码', location: ['add'], required: true, type: 'input' },
        { prop: 'mobile', name: '电话', required: true, type: 'input' },
        { prop: 'email', name: '邮箱', type: 'input' },
        { prop: 'disabled', name: '状态', type: 'radio', options: [{ id: 0, name: '启用' }, { id: 1, name: '禁用' }] },
        { prop: 'createTime', location: ['table'], name: '创建时间' }
      ],
      UserCrud
    }
  }
}
</script>
