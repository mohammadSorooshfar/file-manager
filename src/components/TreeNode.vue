<script setup lang="ts">
import {
  faChevronDown,
  faChevronRight,
  faFile,
  faFolder
} from '@fortawesome/free-solid-svg-icons'
import { FileManage, FileNode } from '../types/files-tree'

const props = defineProps<{ file: FileNode; fileManage: FileManage }>()

const vFocus = {
  mounted: (el: any) => el.focus()
}
const submitRename = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && props.file.name) props.fileManage.renamingId = null
}
const toggle = () => {
  props.file.open = !props.file.open
  props.fileManage.selectedId = props.file.id
  props.fileManage.renamingId = null
}
</script>

<template>
  <div>
    <div
      :class="{ 'bg-blue-600': fileManage.selectedId === file.id }"
      class="flex items-center cursor-pointer select-none"
      @click.stop="toggle"
    >
      <div v-if="file.type === 'folder'" class="mr-2">
        <font-awesome-icon v-if="!file.open" :icon="faChevronRight" />

        <font-awesome-icon v-else :icon="faChevronDown" />
      </div>

      <div class="mr-2">
        <font-awesome-icon v-if="file.type === 'folder'" :icon="faFolder" />

        <font-awesome-icon v-else :icon="faFile" />
      </div>

      <span v-if="fileManage.renamingId !== file.id" class="text-lg">{{
        file.name
      }}</span>

      <span v-else class="w-full"
        ><input
          v-focus
          class="bg-transparent text-lg"
          type="text"
          v-model="file.name"
          @click.stop
          @keyup="submitRename"
      /></span>
    </div>
    <div v-if="file.open" class="ps-5">
      <TreeNode
        v-for="fileChild in file.children"
        :file="fileChild"
        :file-manage="fileManage"
      />
    </div>
  </div>
</template>
