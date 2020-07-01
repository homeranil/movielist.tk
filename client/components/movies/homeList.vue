<template>
  <div class="movie-list">
    <h2 class="tracking-wider text-orange-500 text-lg font-semibold">
      {{ title }}
    </h2>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mx-auto"
    >
      <!-- Start movie card -->
      <div v-for="movie in movies" :key="movie.id" class="mt-8">
        <!-- image -->
        <div class="h-auto">
          <nuxt-link
            :to="{
              name: mediaType === 'movie' ? 'movies-id' : 'tv-id',
              params: { id: movie.id },
            }"
          >
            <img
              :src="movie.image"
              :alt="movie.title"
              class="hover:opacity-75 transition ease-in-out duration-150"
              style="min-height: 336px;"
            />
          </nuxt-link>
        </div>
        <!-- data -->
        <div class="mt-2">
          <!-- title -->
          <nuxt-link
            :to="{
              name: mediaType === 'tv' ? 'tv-id' : 'movies-id',
              params: { id: movie.id },
            }"
            class="text-lg mt-2 hover:text-orange-500"
          >
            {{ movie.title }}
          </nuxt-link>
          <!-- content -->
          <div class="flex items-center text-gray-400 text-sm mt-1">
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
          </div>
          <genreList :genres="movie.genres" :media-type="mediaType" />
        </div>
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
    title: {
      type: String,
      default: 'רשימה',
    },
    movies: {
      type: [Array, Object],
      required: true,
    },
    mediaType: {
      type: String,
      default: 'movie',
    },
  },
}
</script>

<style></style>
