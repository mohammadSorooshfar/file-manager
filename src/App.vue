<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import TreeNode from './components/TreeNode.vue'
import { FileManage, FileNode } from './types/files-tree'
import {
  faFileCirclePlus,
  faFolderPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

const fileManage = ref<FileManage>({
  selectedId: null,
  renamingId: null
})
const files = ref<FileNode[]>([
  {
    id: 0,
    name: '.vscode',
    type: 'folder',
    children: [
      {
        id: 1,
        name: 'extensions.json',
        type: 'file',
        children: null,
        open: false
      }
    ],
    open: false
  },
  {
    id: 2,
    name: 'node_modules',
    type: 'folder',
    children: null,
    open: false
  },
  {
    id: 3,
    name: 'public',
    type: 'folder',
    children: [
      {
        id: 4,
        name: 'vite.svg',
        type: 'file',
        children: null,
        open: false
      }
    ],
    open: false
  },
  {
    id: 5,
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 6,
        name: 'assets',
        type: 'folder',
        children: [
          {
            id: 7,
            name: 'vue.svg',
            type: 'file',
            children: null,
            open: false
          }
        ],
        open: false
      },
      {
        id: 8,
        name: 'components',
        type: 'folder',
        children: null,
        open: false
      },
      {
        id: 9,
        name: 'types',
        type: 'folder',
        children: null,
        open: false
      },
      {
        id: 10,
        name: 'App.vue',
        type: 'file',
        children: null,
        open: false
      },
      {
        id: 11,
        name: 'main.ts',
        type: 'file',
        children: null,
        open: false
      }
    ],
    open: false
  },
  {
    id: 12,
    name: 'index.html',
    type: 'file',
    children: null,
    open: false
  },
  {
    id: 13,
    name: 'vite.config.ts',
    type: 'file',
    children: null,
    open: false
  }
])

const reset = () => {
  fileManage.value.renamingId = null
  fileManage.value.selectedId = null
}

const findNodeByIdWithParent = (
  nodes: FileNode[] | null,
  id: number
): { parent: FileNode | null; child: FileNode | null } => {
  if (!nodes) return { parent: null, child: null }

  for (let node of nodes) {
    if (node.id === id) {
      return { parent: null, child: node }
    }

    if (node.children) {
      for (let child of node.children) {
        if (child.id === id) {
          return { parent: node, child: child }
        }
        const result = findNodeByIdWithParent(child.children, id)
        if (result.child) {
          return result
        }
      }
    }
  }
  return { parent: null, child: null }
}

const deleteNode = () => {
  if (fileManage.value.selectedId === null) return

  const { parent, child } = findNodeByIdWithParent(
    files.value,
    fileManage.value.selectedId
  )

  if (parent && child) {
    const childIndex = parent.children!.indexOf(child)
    if (childIndex > -1) {
      parent.children!.splice(childIndex, 1)
    }
  } else if (child) {
    const childIndex = files.value.indexOf(child)
    if (childIndex > -1) {
      files.value.splice(childIndex, 1)
    }
  }
}

onMounted(() => {
  window.addEventListener('keyup', (e) => {
    if (e.key === 'F2')
      fileManage.value.renamingId = fileManage.value.selectedId

    if (e.key === 'Delete') deleteNode()
  })
})
</script>

<template>
  <div
    class="background min-h-screen w-full flex justify-center py-5"
    @click="reset"
  >
    <div class="container flex flex-col">
      <div class="w-32 p-2 flex items-center justify-between">
        <button class="bg-green-700 rounded w-8 h-8">
          <font-awesome-icon :icon="faFolderPlus" />
        </button>

        <button class="bg-blue-700 rounded w-8 h-8">
          <font-awesome-icon :icon="faFileCirclePlus" />
        </button>

        <button
          class="rounded w-8 h-8"
          :class="{
            'bg-red-400': !fileManage.selectedId,
            'bg-red-700': fileManage.selectedId
          }"
          :disabled="!fileManage.selectedId"
          @click="deleteNode"
        >
          <font-awesome-icon :icon="faTrash" />
        </button>
      </div>

      <template v-for="file in files">
        <TreeNode :file="file" :fileManage="fileManage" />
      </template>
    </div>
  </div>
</template>
