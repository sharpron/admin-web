<template>
  <crud
    title="菜单"
    :fields="fields"
    :crud="CrudOperates"
    :perms="{
      create: 'menu:create',
      modify: 'menu:modify',
    }"
  />
</template>
<script>
import Crud from '@/views/components/Crud'
import CrudOperates from '@/api/menu'
export default {
  name: 'Menu',
  components: { Crud },
  data() {
    return {
      fields: [

        { prop: 'title', name: '标题', required: true, type: 'input' },
        { prop: 'parentId', location: ['add', 'modify'], name: '上级菜单', required: true, type: 'treeselect', options: 'menus' },
        { prop: 'orderNo', name: '排序', required: true, type: 'input', rawtype: 'number' },
        { prop: 'path', name: '路径', type: 'input' },
        { prop: 'component', name: '组件', type: 'input' },
        { prop: 'hide', name: '隐藏', type: 'radio', options: [{ id: 0, name: '显示' }, { id: 1, name: '隐藏' }] },
        { prop: 'perm', name: '权限', type: 'input' }
      ],
      CrudOperates
    }
  }
}
</script>
