# Spotify-bpm
This is a web application that aims to provide suggested songs for user based on song or artist they like in the tempo they want. The main goal or use case for this application was for my own workout needs, where I find that songs with a tempo that matches my current movement speed helps me dramatically to continue that exercise.

The application uses the official [Spotify Api](https://developer.spotify.com/) to search for songs or artists, generate recommendations then finally creating and modifying a playlist to store the generated songs for easy access. The authentication is done through [PKCE OAuth flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) so the applications does not require a backend server.

The web application is currently deployed on https://spotify-bpm.netlify.app/

## Requirements
You will need to login to spotify via the OAuth flow, meaning a spotify account is required to use this application. The application works with free accounts.

## Tech stack
The application is built as a single page applicaiton using [Vue 3](https://vuejs.org/), Typescript, [Tailwind CSS](https://tailwindcss.com/) and [Flowbite Vue 3](https://flowbite-vue.com/)

## Running locally
To run this locally you must have [Node](https://nodejs.org/en) installed

First pulling down the repo
```
git clone https://github.com/snopan/spotify-bpm.git
```
Then install the dependencies
```
npm install
```
Finally running the application locally
```
npm run dev
```
