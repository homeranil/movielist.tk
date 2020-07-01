<template>
  <div>
    <div class="container mx-auto px-4 pt-10">
      <homeList
        :title="title"
        :movies="movies"
        :media-type="type === 'tv' ? 'tv' : 'movie'"
      />
    </div>
    <infinite-loading spinner="spiral" class="py-4" @infinite="infiniteScroll">
      <div slot="no-more"></div>
      <div slot="no-results">אין תוצאות.</div>
      <div slot="error" slot-scope="{ trigger }">
        שגיאה!, לחץ <a href="javascript:;" @click="trigger">כאן</a> לנסות שוב
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import homeList from '@/components/movies/homeList'

export default {
  components: {
    homeList,
  },
  async asyncData({ $axios, params }) {
    const id = params.id
    const type = params.type === 'tv' ? 'tv' : 'movies'
    const movies = await $axios.$get('/genres/' + type + '/' + id)

    return {
      id: movies.data.id,
      name: movies.data.name,
      movies: movies.movies,
      type,
    }
  },
  data() {
    return {
      id: 0,
      name: '',
      movies: [],
      page: 1,
      type: 'movies',
    }
  },
  computed: {
    title() {
      const title =
        this.type === 'tv' ? `סדרות ${this.name}` : `סרטי ${this.name}`
      return title
    },
  },
  methods: {
    async infiniteScroll($state) {
      await setTimeout(async () => {
        this.page++
        let movies = await this.$axios.$get(
          `/genres/movies/${this.id}?page=${this.page}`
        )
        movies = movies.movies
        if (movies.length > 1) {
          movies.forEach((item) => this.movies.push(item))
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 500)
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style></style>
