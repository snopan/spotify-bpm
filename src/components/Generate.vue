<script setup lang="ts">
import { Ref, defineProps, onMounted, ref } from 'vue';
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { SimpleArtist, SimpleTrack, isSimpleTrack, getRecommendations, updatePlaylist, trackIDToURI } from '../composable/spotify';

const props = defineProps<{
  selected: SimpleTrack | SimpleArtist,
  playlistID: string,
}>()

const tempo = ref(80)
const loading = ref(false)
const recommendations: Ref<SimpleTrack[]> = ref([])

onMounted(() => {
  if (isSimpleTrack(props.selected) && props.selected.tempo) {
    tempo.value = Math.ceil(props.selected.tempo / 5) * 5
  }
})

const generate = async () => {
  loading.value = true
  const tem = tempo.value
  const selected = props.selected
  const playlistID = props.playlistID
  const isTrack = isSimpleTrack(selected)
  const rec = await getRecommendations(selected, tem)
  await updatePlaylist(
    playlistID,
    rec.map(r => r.id).map(trackIDToURI),
    tem,
    isTrack ? selected.artist : selected.name,
    isTrack ? selected.name : undefined
  )
  recommendations.value = rec
  loading.value = false
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="w-11/12 sm:w-auto flex p-4 bg-neutral-900 my-6">
      <img class="w-24 aspect-square" :src="props.selected.image" />
      <div class="text-left ml-4">
        <div class="text-lg">{{ props.selected.name }}</div>
        <div v-if="isSimpleTrack(props.selected)" class="text-slate-400">
          <div>{{ props.selected.artist }}</div>
          <div>{{ props.selected.tempo && `${Math.round(props.selected.tempo)} bpm` }}</div>
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
    <FwbButton class="mb-6" color="green" size="xl" :disabled="loading" @click="generate">Generate</FwbButton>
    <div v-if="loading || recommendations.length" class="w-full h-full overflow-y-auto p-2 flex items-center justify-center bg-neutral-900">
      <FwbSpinner v-if="loading" size="12" />
      <div v-else class="w-full h-full flex flex-col">
        <div v-for="t in recommendations" class="flex p-4">
          <img class="w-20 aspect-square" :src="t.image" />
          <div class="text-left ml-4">
            <div class="text-lg">{{ t.name }}</div>
            <div class="text-slate-400">{{ t.artist }}</div>
          </div>
        </div>
    </div>
    </div>
  </div>
</template>