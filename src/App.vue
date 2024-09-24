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
    id: 14,
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

function findNodeAndParentById(id: number) {
  // Recursive function to traverse the file structure
  const traverse = (
    node: FileNode,
    parent: FileNode | null
  ): { node: FileNode; parent: FileNode | null } | null => {
    if (node.id === id) {
      return { node, parent }
    }

    if (node.children) {
      for (const child of node.children) {
        const result = traverse(child, node)
        if (result) {
          return result
        }
      }
    }

    return null
  }

  // Start the traversal from the root of the file structure
  for (const file of files.value) {
    const result = traverse(file, null)
    if (result) {
      return result
    }
  }

  // If the node is not found, return null
  return null
}

const deleteNode = () => {
  if (fileManage.value.selectedId === null) return

  const item = findNodeAndParentById(fileManage.value.selectedId)

  if (item?.parent) {
    const childIndex = item?.parent.children!.indexOf(item.node)
    if (childIndex > -1) {
      item?.parent.children!.splice(childIndex, 1)
    }
  } else if (item?.node) {
    const childIndex = files.value.indexOf(item.node)
    if (childIndex > -1) {
      files.value.splice(childIndex, 1)
    }
  }
}

const addFolder = () => {
  const id = Date.now()
  const folder: FileNode = {
    id,
    children: null,
    name: '',
    open: false,
    type: 'folder'
  }

  if (fileManage.value.selectedId === null) {
    files.value.push(folder)
  } else {
    const item = findNodeAndParentById(fileManage.value.selectedId)

    console.log(item?.parent, item?.node)

    if (item?.node?.type === 'file') {
      item?.parent?.children?.push(folder)
    } else {
      if (item?.node && !item?.node?.children) item.node.children = []

      item?.node?.children?.push(folder)
    }
  }

  fileManage.value.renamingId = id
}

const addFile = () => {
  const id = Date.now()
  const folder: FileNode = {
    id,
    children: null,
    name: '',
    open: false,
    type: 'file'
  }

  if (fileManage.value.selectedId === null) {
    files.value.push(folder)
  } else {
    const item = findNodeAndParentById(fileManage.value.selectedId)

    console.log(item?.parent, item?.node)

    if (item?.node?.type === 'file') {
      item?.parent?.children?.push(folder)
    } else {
      if (item?.node && !item?.node?.children) item.node.children = []

      item?.node?.children?.push(folder)
    }
  }

  fileManage.value.renamingId = id
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
  <div class="background min-h-screen w-full flex justify-center py-5">
    <div class="container flex flex-col">
      <div class="w-32 p-2 flex items-center justify-between">
        <button class="bg-green-700 rounded w-8 h-8">
          <font-awesome-icon :icon="faFolderPlus" @click="addFolder" />
        </button>

        <button class="bg-blue-700 rounded w-8 h-8">
          <font-awesome-icon :icon="faFileCirclePlus" @click="addFile" />
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
