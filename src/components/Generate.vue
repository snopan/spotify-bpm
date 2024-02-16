<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { FwbRange, FwbSpinner } from 'flowbite-vue'
import { SimpleArtist, SimpleTrack, isSimpleTrack } from '../composable/spotify';

const props = defineProps<{
  selected: SimpleTrack | SimpleArtist,
}>()

const tempo = ref(80)

</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-neutral-900">
    <div class="flex p-4 bg-neutral-950 mb-8">
      <img class="w-24 aspect-square" :src="props.selected.image" />
      <div class="text-left ml-4">
        <div class="text-lg">{{ props.selected.name }}</div>
        <div v-if="isSimpleTrack(props.selected)" class="text-slate-400">
          {{ props.selected.artist }}
        </div>
      </div>
    </div>
    <div>
      <div>
        <p class="text-xl">{{ tempo }}</p>
        <p> bpm</p>
      </div>
      <fwb-range v-model="tempo" class="w-64 sm:w-96" label="Large range" size="lg" min="0" max="200" steps="10" />
    </div>
  </div>
</template>