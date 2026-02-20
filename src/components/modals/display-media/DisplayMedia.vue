<template>
    <transition
        name="modal-fade"
        appear
    >
        <base-modal
            :is-visible="isVisible"
            teleport-to="container-main"
            @close-modal="handleCloseModal"
        >
            <media-template
                :download="true"
                :dataMedia="choiseDataMedia"
                @close-modal="handleCloseModal"
            >
                <div
                    v-if="showCarousel"
                    class="display-main"
                >
                    <carousel-media
                        :media-array="dataMediaArray"
                        :start-at="imgSelectedIndex"
                        :show-arrows="!isMobile"
                        :show-dots="false"
                    />
                </div>
            </media-template>
        </base-modal>
    </transition>
</template>

<script>
import BaseModal from '../BaseModal.vue'
import MediaTemplate from '../media-template/MediaTemplate.vue'
import CarouselMedia from '@/components/display-media/CarouselMedia.vue'

export default {
    name: 'DisplayMedia',

    components: {
        BaseModal,
        MediaTemplate,
        CarouselMedia,
    },

    props: {
        dataMediaSelected: [Object, Array],

        isVisible: {
            type: Boolean,
            default: false,
        },

        dataMediaArray: [Array, Object, String],
    },

    emits: ['close-modal'],

    data() {
        return {
            imgSelectedIndex: null,
            showCarousel: false,
            windowWidth: window.innerWidth,
        }
    },

    computed: {
        choiseDataMedia() {
            if (this.imgSelectedIndex === null || !this.dataMediaArray[this.imgSelectedIndex]) {
                return this.dataMediaSelected
            }

            return {
                ...this.dataMediaSelected,
                userName: this.dataMediaArray[this.imgSelectedIndex].name,
                urlMedia: this.dataMediaArray[this.imgSelectedIndex].url_link,
                type: this.dataMediaArray[this.imgSelectedIndex].type,
                wook: this.dataMediaArray[this.imgSelectedIndex].wook,
            }
        },

        isMobile() {
            if (this.windowWidth < 768) {
                return true
            }

            return false
        },
    },

    watch: {
        dataMediaSelected: {
            handler(newVal) {
                if (newVal && this.dataMediaArray) {
                    this.imgSelectedIndex = this.dataMediaArray.findIndex(
                        media => media.url_link === newVal.urlMedia
                    )
                }
            },
            immediate: true,
        },

        isVisible(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.showCarousel = true
                })
            } else {
                // Resetar quando modal fecha
                this.showCarousel = false
            }
        },

        windowWidth(newVal) {
            this.windowWidth = newVal
        },
    },

    mounted() {
        window.addEventListener('resize', this.updateResize)
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.updateResize)
    },

    methods: {
        handleCloseModal() {
            this.showCarousel = false

            setTimeout(() => this.$emit('close-modal'), 100)
        },

        updateResize() {
            this.windowWidth = window.innerWidth
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped lang="scss">
.display-main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
</style>
