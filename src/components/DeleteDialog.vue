<script setup lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { onMounted } from 'vue'

const emits = defineEmits(['confirm'])
const isOpen = defineModel<boolean>('modelValue')

const confirm = () => {
  emits('confirm')
}
const close = () => {
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') confirm()

    if (e.key === 'Escape') close()
  })
})
</script>

<template>
  <div
    v-if="isOpen"
    class="modal-window fixed text-slate-600 bg-white bg-opacity-25 top-0 left-0 right-0 bottom-0 z-50"
  >
    <div
      class="absolute bg-white md:w-1/4 w-3/4 left-2/4 right-2/4 top-2/4 rounded-lg p-6"
    >
      <p class="mb-8">Delete item ?</p>

      <div class="flex justify-end gap-2 w-full">
        <button
          class="border-red-700 border-1 bg-transparent rounded w-24 h-15 p-2 px-3 flex justify-center items-center"
          @click="close"
        >
          cancel
        </button>

        <button
          class="bg-red-700 rounded text-white w-24 h-15 p-2 px-3"
          @click="confirm"
        >
          delete
          <font-awesome-icon :icon="faTrash" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.border-1 {
  border: 1px solid gray;
}
</style>
