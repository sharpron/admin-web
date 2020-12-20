<template>
  <crud
    title="角色"
    :fields="fields"
    :crud="RoleCrud"
    :perms="{
      create: 'role:create',
      modify: 'role:modify',
    }"
  >
    <template v-slot:operations>
      <!-- <el-col :span="8">
        <el-tree
          :props="{
            label: 'title',
            children: 'children'
          }"
          :data="menus"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </el-col> -->
    </template>
  </crud>
</template>
<script>
import Crud from '@/views/components/Crud'
import RoleCrud from '@/api/role'
import MenuCrud from '@/api/menu'
export default {
  name: 'Role',
  components: { Crud },
  data() {
    return {
      fields: [
        { prop: 'deptId', name: '部门', location: ['add', 'modify'], searchable: true, required: true, type: 'treeselect', options: 'depts' },
        { prop: 'deptName', name: '部门', location: ['table'] },
        { prop: 'name', name: '角色名', required: true, type: 'input' },
        { prop: 'disabled', name: '状态', type: 'radio', options: [{ id: 0, name: '启用' }, { id: 1, name: '禁用' }] },
        { prop: 'description', name: '描述', required: true, type: 'input' },
        { prop: 'createTime', location: ['table'], name: '创建时间' },
        { prop: 'menus', location: ['add', 'modify'], name: '菜单', required: true, type: 'treeselect', multiple: true, options: 'menus' }
      ],
      RoleCrud,
      menus: []
    }
  },
  mounted() {
    MenuCrud.query().then(res => {
      this.menus = res.data
    })
  },
  methods: {
    handleCheckChange() {

    }
  }
}
</script>
