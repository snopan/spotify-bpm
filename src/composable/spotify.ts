
import { SpotifyApi, SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

const SPOTIFY_BPM_PLAYLIST_NAME = "-spotify bpm-"

export type SimpleTrack = {
    id: string,
    name: string,
    artist: string,
    image: string,
}

export type SimpleArtist = {
    id: string,
    name: string,
    image: string,
}

export type SearchResult = {
    tracks: SimpleTrack[],
    artists: SimpleArtist[],
}

const sdk = SpotifyApi.withUserAuthorization(
    import.meta.env.VITE_CLIENT_ID || "",
    import.meta.env.VITE_REDIRECT_URL || "",
    [
        "playlist-read-private",
        // "playlist-modify-public",
        "playlist-modify-private",
    ]
)

export const useSDK = () => {
    return sdk
}

export const searchTracksAndArtists = async (q: string): Promise<SearchResult> => {
    const result = await sdk.search(q, ["track", "artist"])
    const tracks: SimpleTrack[] = result.tracks.items.map(t => ({
        id: t.id,
        name: t.name,
        artist: t.artists.map(a => a.name).join(", "),
        image: t.album.images.length ? t.album.images[0].url : "",
    }))
    const artists: SimpleArtist[] = result.artists.items.map(a => ({
        id: a.id,
        name: a.name,
        image: a.images.length ? a.images[0].url : ""
    }))
    return { tracks, artists }
}

export const isSimpleTrack = (item: SimpleTrack | SimpleArtist): item is SimpleTrack => {
    return ["id", "name", "artist", "image"].map(field => field in item).reduce((a, b) => a && b)
}


const getAllPlaylists = async (): Promise<SimplifiedPlaylist[]> => {
    let offset = 0
    let playlists: SimplifiedPlaylist[] = []
    while (true) {
        const page = await sdk.currentUser.playlists.playlists(50, offset)
        playlists = playlists.concat(page.items)
        if (!page.next) {
            break
        } else {
            offset = page.offset
        }
    }
    return playlists
}

const findSpotifyBPMPlaylistID = (playlists: SimplifiedPlaylist[]): string => {
    for (let p of playlists) {
        if (p.name == SPOTIFY_BPM_PLAYLIST_NAME) {
            return p.id
        }
    }
    return ""

}

const createSpotifyBPMPlaylist = async (userID: string): Promise<string> => {
    const playlist = await sdk.playlists.createPlaylist(userID, {
        name: SPOTIFY_BPM_PLAYLIST_NAME,
        public: false,
        collaborative: false,
        description: "Playlist created by spotify-bpm"
    })
    return playlist.id
}

export const findOrCreateSpotifyBPMPlaylist = async (userID: string): Promise<string> => {
    const playlists = await getAllPlaylists();
    let playlistID = findSpotifyBPMPlaylistID(playlists)
    if (playlistID == "") {
        playlistID = await createSpotifyBPMPlaylist(userID)
    }
    return playlistID
}

const clearPlaylist = async (playlistID: string) => {
    const playlist = await sdk.playlists.getPlaylist(playlistID)
    const trackURIs = playlist.tracks.items.map(i => i.track.uri)
    const removePlaylistItemsTracks = trackURIs.map(uri => ({ uri }))
    await sdk.playlists.removeItemsFromPlaylist(playlistID, { tracks: removePlaylistItemsTracks })
}

export const updatePlaylist = async (playlistID: string, trackURIs: string[], tempoUsed: number, artistUsed: string, trackUsed?: string) => {
    await clearPlaylist(playlistID)
    await sdk.playlists.addItemsToPlaylist(playlistID, trackURIs)

    let description = `Playlist generated by spotify-bpm at ${tempoUsed} bpm with artist ${artistUsed}`
    if (trackUsed) {
        description = `Playlist generated by spotify-bpm at ${tempoUsed} bpm with track ${trackUsed} by ${artistUsed}`
    }
    await sdk.playlists.changePlaylistDetails(playlistID, { description })
}