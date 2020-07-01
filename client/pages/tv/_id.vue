<template>
  <div class="">
    <div class="container mx-auto movie-info border-b border-gray-800">
      <movieDetails :movie="movie" media-type="tv" />
    </div>
    <div
      v-if="movie.credits.cast.length > 0"
      class="movie-cast border-b border-gray-800"
    >
      <movieCast :cast="movie.credits.cast" media-type="tv" />
    </div>
    <div class="movie-images">
      <movieImages :images="movie.images.backdrops" media-type="tv" />
    </div>
  </div>
</template>

<script>
import movieDetails from '@/components/movies/show/details/movieDetails'
import movieCast from '@/components/movies/show/cast/castView'
import movieImages from '@/components/movies/show/media/images'

export default {
  components: {
    movieDetails,
    movieCast,
    movieImages,
  },
  async asyncData({ $axios, params }) {
    const movie = await $axios.$get(`/tv/${params.id}`)

    return {
      movie,
    }
  },
  data() {
    return {
      movie: {},
    }
  },
  computed: {
    setTitle() {
      return `${this.movie.title} (${this.$moment(
        this.movie.release_date
      ).format('YYYY')})`
    },
  },
  methods: {},
  head() {
    return {
      title: this.setTitle,
    }
  },
}
</script>
