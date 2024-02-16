<script setup lang="ts">
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { SimpleArtist, SimpleTrack, findOrCreateSpotifyBPMPlaylist, isSimpleTrack, useSDK } from "./composable/spotify"
import { FwbToast } from 'flowbite-vue'
import { ref, onMounted, Ref } from 'vue';
import Search from "./components/Search.vue"
import Generate from "./components/Generate.vue"

const sdk = useSDK()

const loading = ref(true)
const authenticated = ref(false)
const errors: Ref<string[]> = ref([])
const selectedTrackOrArtist: Ref<SimpleTrack | SimpleArtist | null> = ref(null)
const playlistID = ref("")

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code")
  if (code != null) {
    await sdk.authenticate()
  }
  const err = urlParams.get("error")
  if (err != null) {
    errors.value.push("Unable to login to spotify due to: " + err)
  }
  if (await sdk.getAccessToken() != null) {
    const userID = (await sdk.currentUser.profile()).id
    const pid = await findOrCreateSpotifyBPMPlaylist(userID)
    playlistID.value = pid
    authenticated.value = true
  }
  loading.value = false
})

const onSelect = async (selected: SimpleTrack | SimpleArtist) => {
  loading.value = true
  if (isSimpleTrack(selected)) {
    const features = await sdk.tracks.audioFeatures(selected.id)
    selected.tempo = features.tempo
  }
  selectedTrackOrArtist.value = selected
  loading.value = false
}

const onClickHome = () => {
  window.location.href = window.location.href
}
const onClickGithub = () => {
  window.location.href = "https://github.com/snopan/spotify-bpm"
}
</script>


<template>
  <div class="absolute right-5 top-5">
    <FwbToast v-for="err in errors" type="danger" closable>{{ err }}</FwbToast>
  </div>
  <div class="absolute w-full h-16 flex items-center justify-center bg-neutral-900">
    <div class="text-xl pb-3 px-8 cursor-pointer" @click="onClickHome">Spotify-bpm</div>
    <FwbButton class="absolute right-4 top-3" color="dark" @click="onClickGithub" outline square>
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2c-2.4 0-4.7.9-6.5 2.4a10.5 10.5 0 0 0-2 13.1A10 10 0 0 0 8.7 22c.5 0 .7-.2.7-.5v-2c-2.8.7-3.4-1.1-3.4-1.1-.1-.6-.5-1.2-1-1.5-1-.7 0-.7 0-.7a2 2 0 0 1 1.5 1.1 2.2 2.2 0 0 0 1.3 1 2 2 0 0 0 1.6-.1c0-.6.3-1 .7-1.4-2.2-.3-4.6-1.2-4.6-5 0-1.1.4-2 1-2.8a4 4 0 0 1 .2-2.7s.8-.3 2.7 1c1.6-.5 3.4-.5 5 0 2-1.3 2.8-1 2.8-1 .3.8.4 1.8 0 2.7a4 4 0 0 1 1 2.7c0 4-2.3 4.8-4.5 5a2.5 2.5 0 0 1 .7 2v2.8c0 .3.2.6.7.5a10 10 0 0 0 5.4-4.4 10.5 10.5 0 0 0-2.1-13.2A9.8 9.8 0 0 0 12 2Z" clip-rule="evenodd"/>
      </svg>
    </FwbButton>
  </div>
  <div class="w-screen h-screen pt-16 flex items-center justify-center bg-neutral-800">
    <div v-if="loading" class="flex items-center">
      <FwbSpinner class="m-5" size="12" />
      Loading
    </div>
    <FwbButton v-else-if="!authenticated" color="green" size="xl" @click="() => sdk.authenticate()">Login with
      Spotify
    </FwbButton>
    <div v-else class="w-full h-full p-1 sm:p-16">
      <Search v-if="!selectedTrackOrArtist" @select="onSelect" />
      <Generate
        v-else
        :selected="selectedTrackOrArtist"
        :playlistID="playlistID"
        @back="selectedTrackOrArtist = null"
      />
    </div>
  </div>
</template>

<style scoped></style>
