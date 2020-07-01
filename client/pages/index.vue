<template>
  <div class="container mx-auto px-4 pt-10">
    <homeList title=" סרטים פופולרים " :movies="popularMovies" class="pb-12" />
    <homeList
      title="סדרות פופלאריות"
      :movies="popularTv"
      media-type="tv"
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
    const popularTv = await $axios.$get('/tv/popular')

    return {
      popularMovies,
      popularTv,
    }
  },
  data() {
    return {
      popularMovies: [],
      popularTv: [],
    }
  },
  head: {
    title: 'עמוד הבית',
  },
}
</script>

<style></style>
