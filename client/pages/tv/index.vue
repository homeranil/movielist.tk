<template>
  <div class="container mx-auto px-4 pt-10">
    <homeList
      title="סדרות פופולאריות"
      :movies="popularTv"
      class="pb-12"
      media-type="tv"
    />
    <homeList
      title="מתנגן עכשיו"
      media-type="tv"
      :movies="onTheAirTv"
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
    const popularTv = await $axios.$get('/tv/popular')
    const onTheAirTv = await $axios.$get('/tv/on_the_air')

    return {
      popularTv,
      onTheAirTv,
    }
  },
  data() {
    return {
      popularTv: [],
      onTheAirTv: [],
    }
  },
  head: {
    title: 'עמוד הבית',
  },
}
</script>

<style></style>
