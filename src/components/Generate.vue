<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { SimpleArtist, SimpleTrack, isSimpleTrack } from '../composable/spotify';

const props = defineProps<{
  selected: SimpleTrack | SimpleArtist,
  playlistID: string,
}>()

const tempo = ref(80)

</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="w-11/12 sm:w-auto flex p-4 bg-neutral-900 my-6">
      <img class="w-24 aspect-square" :src="props.selected.image" />
      <div class="text-left ml-4">
        <div class="text-lg">{{ props.selected.name }}</div>
        <div v-if="isSimpleTrack(props.selected)" class="text-slate-400">
          {{ props.selected.artist }}
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center mb-6">
      <div class="mb-4">
        <div class="text-3xl">{{ tempo }}</div>
        <div>bpm</div>
      </div>
      <div>
        <FwbButton class="m-2" color="dark" @click="tempo -= 10" pill outline square>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 16-4-4 4-4m-6 8-4-4 4-4"/>
          </svg>
        </FwbButton>
        <FwbButton class="m-2" color="dark" @click="tempo -= 5" pill outline square>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 8-4 4 4 4"/>
          </svg>
        </FwbButton>
        <FwbButton class="m-2" color="dark" @click="tempo += 5" pill outline square>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
          </svg>
        </FwbButton>
        <FwbButton class="m-2" color="dark" @click="tempo += 10" pill outline square>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4"/>
          </svg>
        </FwbButton>
      </div>
    </div>
    <FwbButton class="mb-6" color="green" size="xl">Generate</FwbButton>
    <div class="w-full h-full p-2 bg-neutral-900">

    </div>
  </div>
</template>