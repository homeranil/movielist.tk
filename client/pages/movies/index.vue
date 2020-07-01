<template>
  <div class="container mx-auto px-4 pt-10">
    <homeList title=" סרטים פופולרים " :movies="popularMovies" class="pb-12" />
    <homeList
      v-if="nowPlaying.length > 0"
      title="מתנגן עכשיו"
      :movies="nowPlaying"
      class="pb-24 pt-12"
    />
  </div>
</template>

<script>
import homeList from '@/components/movies/homeList'

export default {
  components: {
    homeList,
  },
  async asyncData({ $axios }) {
    const popularMovies = await $axios.$get('/movie/popular')
    const nowPlaying = await $axios.$get('/movie/now_playing')

    return {
      popularMovies,
      nowPlaying,
    }
  },
  data() {
    return {
      popularMovies: [],
      nowPlaying: [],
    }
  },
  head: {
    title: 'עמוד הבית',
  },
}
</script>

<style></style>
