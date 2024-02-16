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
</script>


<template>
  <div class="absolute right-5 top-5">
    <FwbToast v-for="err in errors" type="danger" closable>{{ err }}</FwbToast>
  </div>
  <div class="absolute w-full h-16 text-center p-5 bg-neutral-900">Spotify-bpm</div>
  <div class="w-screen h-screen pt-16 flex items-center justify-center bg-neutral-800">
    <div v-if="loading" class="flex items-center">
      <FwbSpinner class="m-5" size="12" />
      Loading
    </div>
    <FwbButton v-else-if="!authenticated" color="green" size="xl" @click="() => sdk.authenticate()">Login with
      Spotify
    </FwbButton>
    <div v-else class="w-full h-full p-1 sm:p-16">
      <Search v-show="!selectedTrackOrArtist" @select="onSelect" />
      <Generate v-if="selectedTrackOrArtist" :selected="selectedTrackOrArtist" :playlistID="playlistID" />
    </div>
  </div>
</template>

<style scoped></style>
