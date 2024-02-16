<script setup lang="ts">
import { FwbInput, FwbSpinner } from 'flowbite-vue';
import { Ref, ref, defineEmits } from 'vue';
import { SearchResult, SimpleArtist, SimpleTrack } from '../composable/spotify';
import { searchTracksAndArtists } from '../composable/spotify';

const INPUT_WAIT_TIME = 2000

const emit = defineEmits<{
  (event: 'select', selected: SimpleTrack | SimpleArtist): void
}>()
const query = ref("")
const queryResult: Ref<SearchResult | null> = ref(null)
const numTracksShown = ref(5)
const numArtistsShown = ref(5)

let waitTyping: NodeJS.Timeout | null = null
const onInput = () => {
  queryResult.value = null
  numTracksShown.value = 5
  numArtistsShown.value = 5
  if (query.value) {
    if (waitTyping) {
      clearTimeout(waitTyping)
    }
    waitTyping = setTimeout(makeQuery, INPUT_WAIT_TIME)
  }
}
const makeQuery = async () => {
  const q = query.value
  if (!q) return
  const result = await searchTracksAndArtists(q)
  queryResult.value = result
}
</script>

<template>
  <div class="w-full h-full pt-4 pb-16 sm:pb-24  flex flex-col items-center">
    <div :class="'transition-all ' + (query ? 'mt-0 w-full' : 'w-3/4 sm:w-1/2 mt-36')">
      <div v-if="!query" class="mb-4">Pick a song or artist you like...</div>
      <FwbInput v-model="query" class="w-full" placeholder="Enter here..." :oninput="onInput" />
    </div>
    <div v-if="query" class="w-full h-full min-h-full mt-1 sm:mt-4 flex flex-col items-center justify-center bg-neutral-900">
      <FwbSpinner v-if="!queryResult" size="12" />
      <div v-else class="w-full h-full overflow-x-auto">
        <div v-for="t in queryResult?.tracks.slice(0, numTracksShown)"
          class="flex items-center w-full p-4 hover:bg-neutral-700 cursor-pointer" @click="emit('select', t)">
          <img class="h-10 aspect-square" :src="t.image" />
          <div class="text-left ml-4">
            <div class="text-lg">{{ t.name }}</div>
            <div class="text-slate-400">{{ t.artist }}</div>
          </div>
        </div>
        <div
          v-if="numTracksShown < queryResult?.tracks.length"
          @click="numTracksShown += 5"
          class="text-neutral-400 p-2 hover:text-blue-500 cursor-pointer"
        >
          Load more songs...
        </div>
        <div class="w-11/12 h-0.5 bg-neutral-700 mx-auto my-5" />
        <div v-for="a in queryResult?.artists.slice(0, numArtistsShown)"
          class="flex items-center w-full p-4 hover:bg-neutral-700 cursor-pointer" @click="emit('select', a)">
          <img class="h-10 aspect-square" :src="a.image" />
          <div class="text-left ml-4 text-lg">{{ a.name }}</div>
        </div>
        <div
          v-if="numArtistsShown < queryResult?.artists.length"
          @click="numArtistsShown += 5"
          class="text-neutral-400 p-2 hover:text-blue-500 cursor-pointer"
        >
          Load more artists...
        </div>
      </div>
    </div>
  </div>
</template>