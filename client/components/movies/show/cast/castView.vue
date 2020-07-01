<template>
  <div>
    <div class="container mx-auto px-4 py-10">
      <h2 class="text-4xl font-semibold">שחקנים</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mx-auto mt-10"
      >
        <!-- Start movie card -->
        <div v-for="(Cast, index) in cast.slice(0, castView)" :key="index">
          <nuxt-link :to="{ name: 'actors-id', params: { id: Cast.id } }">
            <!-- image -->
            <img
              :src="Cast.image"
              alt=""
              class="hover:opacity-75 transition ease-in-out duration-150"
              style="min-height: 336px;"
            />
            <!-- data -->
            <div class="text-center mt-2">
              <div class="text-lg mt-2 hover:text-gray-300">
                {{ Cast.name }}
              </div>
              <div class="text-gray-400 text-sm">
                {{ Cast.character }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div class="text-left py-4 text-sm text-orange-500 hover:text-white">
        <nuxt-link to="/">לרשימה המלאה</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    castView: {
      type: Number,
      default: 5,
    },
    cast: {
      type: [Array, Object],
      required: true,
    },
  },
  methods: {},
}
</script>

<style></style>
