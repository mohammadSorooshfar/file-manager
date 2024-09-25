<script setup lang="ts">
import {
  faChevronDown,
  faChevronRight,
  faFolder,
  faFolderOpen,
  faImage,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { FileManage, FileNode } from '../types/files-tree'
import { faFileAlt } from '@fortawesome/free-regular-svg-icons'
import { computed } from 'vue'
import {
  faCss3,
  faHtml5,
  faJs,
  faVuejs
} from '@fortawesome/free-brands-svg-icons'

const props = defineProps<{ file: FileNode; fileManage: FileManage }>()

const fileIcon = computed<{ icon: IconDefinition; class: string }>(() => {
  if (!props.file.name.includes('.')) return { icon: faFileAlt, class: '' }

  const fileNameArray = props.file.name.split('.')
  switch (fileNameArray[fileNameArray.length - 1].toLocaleLowerCase()) {
    case 'js':
      return { icon: faJs, class: 'text-[#f0db4f]' }
    case 'css':
      return { icon: faCss3, class: 'text-[#2965f1]' }
    case 'html':
      return { icon: faHtml5, class: 'text-[#e34c26]' }
    case 'json':
      return { icon: faJs, class: 'text-[#f0db4f]' }
    case 'vue':
      return { icon: faVuejs, class: 'text-[#41b883]' }
    case 'svg' || 'png' || 'jpg' || 'jpeg':
      return { icon: faImage, class: '' }

    default:
      return { icon: faFileAlt, class: '' }
  }
})

const vFocus = {
  mounted: (el: any) => el.focus()
}

const submitRename = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && props.file.name) props.fileManage.renamingId = null
  if (e.key === 'Escape' && props.file.name) props.fileManage.renamingId = null
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
      <div v-if="file.type === 'folder'" class="mr-2 text-sm text-[#bbc9bb]">
        <font-awesome-icon v-if="!file.open" :icon="faChevronRight" />

        <font-awesome-icon v-else :icon="faChevronDown" />
      </div>

      <div class="mr-3">
        <font-awesome-icon
          v-if="file.type === 'folder' && file.open"
          class="text-[#f8d775]"
          :icon="faFolderOpen"
        />

        <font-awesome-icon
          v-else-if="file.type === 'folder' && !file.open"
          class="text-[#f8d775]"
          :icon="faFolder"
        />

        <font-awesome-icon
          v-else
          :icon="fileIcon.icon"
          :class="fileIcon.class"
        />
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
