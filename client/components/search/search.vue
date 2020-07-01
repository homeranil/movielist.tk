<template>
  <div>
    <div
      v-if="show"
      class="fixed inset-0 w-screen h-full bg-black opacity-50"
      @click="show = false"
    ></div>
    <div class="relative mt-3 md:mt-0 z-50">
      <input
        v-if="inputIsVisible"
        ref="searchBox"
        v-model="input"
        type="text"
        class="bg-gray-800 text-sm rounded-full w-64 px-4 pr-8 py-1 focus:outline-none focus:shadow-outline"
        placeholder="חיפוש"
        @focus="input.length > 2 ? (show = true) : (show = false)"
        @keydown.shift.tab="show = false"
        @keydown.prevent.esc="
          show = false
          $refs.searchBox.blur()
        "
      />
      <div class="absolute top-0">
        <svg
          class="fill-current w-4 text-gray-500 mt-2 mr-2"
          viewBox="0 0 24 24"
        >
          <path
            class="heroicon-ui"
            d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      </div>

      <div v-if="loading" class="spinner top-0 left-0 ml-4 mt-4"></div>

      <div
        v-if="show && !loading"
        class="absolute bg-gray-800 text-sm rounded w-64 mt-2"
      >
        <div v-if="results.length <= 0" class="px-3 py-3">
          לא נמצאו סרטים או סדרות
        </div>
        <ul v-else>
          <li
            v-for="(data, index) in results"
            :key="data.id"
            class="border-b border-gray-700"
            @click="clear"
            @keydown.tab.exact="
              index + 1 === results.length ? (show = false) : (show = true)
            "
          >
            <nuxt-link
              :to="{
                name:
                  data.media_type === 'movie'
                    ? 'movies-id'
                    : data.media_type === 'tv'
                    ? 'tv-id'
                    : 'actors-id',
                params: { id: data.id },
              }"
              class="flex items-baseline justify-between hover:bg-gray-700 px-3 py-3"
            >
              <span class="flex items-center">
                <img :src="data.image" alt="" class="w-8" />
                <span class="mr-4">{{ data.title || data.name }}</span>
              </span>
              <span class="text-xs text-gray-500">
                <template v-if="data.media_type === 'tv'">סדרה</template>
                <template v-else-if="data.media_type === 'movie'">סרט</template>
                <template v-else>שחקן</template>
              </span>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      debouncedInput: '',
      results: [],
      show: false,
      loading: false,
      inputIsVisible: true,
    }
  },
  computed: {
    input: {
      get() {
        return this.debouncedInput
      },
      set(val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.debouncedInput = val
          this.doSearch()
        }, 500)
      },
    },
  },
  mounted() {
    const that = this
    document.addEventListener('keyup', function (evt) {
      /**
       * click / || SHIFT || F4 - to search
       */
      if (evt.keyCode === 191 || evt.keyCode === 16 || evt.keyCode === 115) {
        that.$refs.searchBox.focus()
      }
    })
  },
  methods: {
    async doSearch() {
      if (this.debouncedInput.length > 2) {
        this.loading = true
        const results = await this.$axios.$get(
          `/search/all?search=${this.debouncedInput}`
        )
        this.results = results.slice(0, 10)
        this.show = true
        this.loading = false
      } else {
        this.show = false
        this.results = []
      }
    },
    clear() {
      this.input = ''
      this.debouncedInput = ''
      this.show = false
    },
  },
}
</script>

<style></style>
