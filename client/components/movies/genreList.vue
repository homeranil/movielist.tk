<template>
  <span class="text-gray-400 text-sm">
    <span v-for="(genre, index) in genres" :key="genre.id">
      <nuxt-link
        :to="{
          name: 'genres-id-type',
          params: { id: genre.id, type: mediaType },
        }"
        class="hover:text-orange-500"
      >
        {{ genre.name }}<template v-if="index + 1 < genres.length">,</template>
      </nuxt-link>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    genres: {
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
