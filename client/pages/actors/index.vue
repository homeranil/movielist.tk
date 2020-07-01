<template>
  <div class="container mx-auto px-4 pt-10">
    <div class="movie-list">
      <h2 class="tracking-wider text-orange-500 text-lg font-semibold">
        שחקנים פופולרים
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mx-auto"
      >
        <div v-for="actor in actors" :key="actor.id" class="actor mt-8">
          <nuxt-link :to="{ name: 'actors-id', params: { id: actor.id } }">
            <img
              :src="actor.image"
              alt=""
              class="hover:opacity-75 transition ease-in-out duration-150"
            />
          </nuxt-link>
          <div class="mt-2">
            <nuxt-link
              :to="{ name: 'actors-id', params: { id: actor.id } }"
              class="text-lg hover:text-orange-500"
            >
              {{ actor.name }}
            </nuxt-link>
            <div class="text-gray-400 truncate text-sm">
              <span v-for="(m, index) in actor.known_for" :key="m.id">
                <nuxt-link
                  :to="{
                    name: (m.media_type === 'movie' ? 'movies' : 'tv') + '-id',
                    params: { id: m.id },
                  }"
                  class="hover:text-orange-500"
                >
                  <!-- eslint-disable-next-line prettier/prettier -->
                {{ m.title }}<template v-if="index + 1 < actor.known_for.length">,</template>
                </nuxt-link>
              </span>
            </div>
          </div>
        </div>
      </div>
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
export default {
  async asyncData({ $axios, query }) {
    const actors = await $axios.$get('/actors/popular')

    return {
      actors,
    }
  },
  watchQuery: ['page'],
  data() {
    return {
      actors: [],
      page: this.query && this.query.page > 1 ? this.query.page : 1,
    }
  },
  methods: {
    async infiniteScroll($state) {
      await setTimeout(async () => {
        this.page++
        const actors = await this.$axios.$get(
          '/actors/popular?page=' + this.page
        )
        if (actors.length > 1) {
          actors.forEach((item) => this.actors.push(item))
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 500)
    },
  },
  head: {
    title: 'שחקנים',
  },
}
</script>

<style></style>
