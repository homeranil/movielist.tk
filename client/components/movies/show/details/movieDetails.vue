<template>
  <div
    class="px-4 py-10 flex flex-col md:flex-row"
    @keydown.esc="viewTrailer = false"
  >
    <div>
      <img :src="movie.image" :alt="movie.title" class="w-96" />
    </div>
    <div class="md:mr-24">
      <!-- title -->
      <h2 class="text-4xl font-semibold">
        {{ movie.title }} ({{ $moment(movie.release_date).format('YYYY') }})
      </h2>
      <div class="flex flex-wrap items-center text-gray-400 text-sm">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fill-current text-orange-500 w-4"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 .587l3.668 7.568L24 9.306l-6.064 5.828 1.48 8.279L12 19.446l-7.417 3.967 1.481-8.279L0 9.306l8.332-1.151z"
            />
          </svg>
        </span>
        <span class="mr-1">{{ movie.vote_average }}%</span>
        <span class="mx-2">|</span>
        <span>
          {{ $moment(movie.release_date).format('MMM DD, YYYY') }}
        </span>
        <span class="mx-2">|</span>
        <genreList :genres="movie.genres" />
      </div>

      <p class="text-gray-300 mt-8 max-w-4xl">
        {{ movie.overview }}
      </p>

      <div
        v-if="
          (movie.created_by && movie.created_by.length > 0) ||
          movie.credits.crew.length > 0
        "
        class="mt-12"
      >
        <h4 class="text-lg text-white font-semibold">
          צוות \ יוצרים
        </h4>
        <div class="flex flex-wrap mt-4">
          <div
            v-for="crew in (movie.created_by ? movie.created_by.slice(0, 5) : movie.credits.crew.slice(0, 5))"
            :key="crew.id"
          >
            <div class="ml-8">
              <div>
                <nuxt-link
                  :to="{ name: 'actors-id', params: { id: crew.id } }"
                  class="hover:text-orange-500"
                >
                  {{ crew.name }}
                </nuxt-link>
              </div>
              <div v-if="!movie.created_by" class="text-sm text-gray-400">
                {{ crew.job }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="movie.videos.results.length > 0" class="mt-12">
        <template v-if="viewTrailer">
          <div
            style="background-color: rgba(0, 0, 0, 0.8);"
            class="fixed top-0 left-0 w-full h-full flex items-center overflow-y-auto rounded-lg shadow-2xl z-10"
            @click="viewTrailer = false"
          >
            <div class="container mx-auto lg:px-32 rounded-lg overflow-y-auto">
              <div class="bg-gray-900 rounded z-20">
                <div class="flex justify-start pr-4 pt-2">
                  <button
                    class="text-3xl leading-none hover:text-gray-300"
                    @click="viewTrailer = false"
                  >
                    &times;
                  </button>
                </div>
                <div class="modal-body px-8 py-8">
                  <div
                    class="responsive-container overflow-hidden relative"
                    style="padding-top: 56.25%;"
                  >
                    <client-only placeholder="Loading...">
                      <youtube
                        :player-vars="{ autoplay: 1 }"
                        player-width="100%"
                        player-height="100%"
                        host="https://www.youtube-nocookie.com"
                        :video-id="movie.videos.results[0].key"
                        class="responsive-iframe absolute top-0 left-0 w-full h-full"
                        @ready="ready"
                        @ended="ended"
                      />
                    </client-only>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <button
          class="flex items-center bg-orange-500 text-gray-900 rounded font-semibold px-5 py-4 hover:bg-orange-600 transition ease-in-out duration-150"
          @click="viewTrailer = true"
        >
          <svg class="w-6 fill-current" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
          </svg>
          <span class="mr-2">צפה בטריילר</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import genreList from '@/components/movies/genreList'
export default {
  components: {
    genreList,
  },
  props: {
    movie: {
      type: [Array, Object],
      required: true,
    },
  },
  data() {
    return {
      viewTrailer: false,
    }
  },
  methods: {
    ready(r) {},
    ended(r) {
      this.viewTrailer = false
    },
  },
}
</script>

<style scoped>
iframe {
  width: 100% !important;
  height: 100% !important;
}
</style>
