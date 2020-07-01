<template>
  <div @keydown.esc="viewImage = false">
    <div v-if="images.length > 0" class="container mx-auto px-4 py-10">
      <h2 class="text-4xl font-semibold">תמונות</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
        <div v-for="(image, i) in images" :key="i" class="mt-8">
          <a href="#" @click.prevent="openImage(image)">
            <img
              :src="`${baseUrl}media/500/${image.file_path}`"
              alt=""
              class="hover:opacity-75 transition ease-in-out duration-150"
            />
          </a>
        </div>
      </div>
    </div>
    <template v-if="viewImage">
      <div
        style="background-color: rgba(0, 0, 0, 0.8);"
        class="fixed top-0 left-0 w-full h-full flex items-center overflow-y-auto rounded-lg shadow-2xl z-10"
        @click="viewImage = false"
      >
        <div class="container mx-auto lg:px-32 rounded-lg overflow-y-auto">
          <div class="bg-gray-900 rounded z-20">
            <div class="flex justify-start pr-4 pt-2">
              <button
                class="text-3xl leading-none hover:text-gray-300"
                @click="viewImage = false"
              >
                &times;
              </button>
            </div>
            <div class="modal-body px-8 py-8">
              <img :src="currnetImage.image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    baseUrl: {
      type: String,
      default: process.env.API_URL,
    },
    images: {
      type: [Array, Object],
      required: true,
    },
  },
  data() {
    return {
      viewImage: false,
      currnetImage: {},
    }
  },
  mounted() {
    // const that = this
    // document.addEventListener('keyup', function (evt) {
    //   if (evt.keyCode === 27) {
    //     that.viewImage = false
    //   }
    // })
  },
  methods: {
    openImage(image) {
      this.viewImage = true
      this.currnetImage = {
        image: `${this.baseUrl}media/original/${image.file_path}`,
      }
    },
  },
}
</script>

<style></style>
