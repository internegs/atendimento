<template>
    <transition
        name="modal-fade"
        appear
    >
        <base-modal
            v-if="isVisible"
            @close-modal="handleCloseModal"
        >
            <media-template
                :download="true"
                :dataMedia="choiseDataMedia"
                @close-modal="handleCloseModal"
            >
                <div class="display-main">
                    <ui-btn-circle
                        v-if="!isMobile"
                        :size="2.3"
                        left="2%"
                        top="50%"
                        flip="left"
                        :disabled="imgSelectedIndex === 0 || isDisabledBtn"
                        @click.stop
                        @handle-btn-circle="handleBtnCircle('left')"
                    />

                    <div
                        v-if="!isMobile"
                        class="img-wrapper"
                        @click.stop
                    >
                        <transition
                            :name="'slide-' + slideDirection"
                            mode="out-in"
                        >
                            <img
                                :key="choiseDataMedia.urlImage"
                                :src="choiseDataMedia.urlImage"
                                alt="Imagem chat."
                            />
                        </transition>
                    </div>

                    <div
                        v-if="isMobile"
                        ref="carousel"
                        class="carousel-grid"
                    >
                        <div
                            v-for="(item, index) in dataMediaArray"
                            :key="index"
                            class="carousel-wrapper"
                        >
                            <img
                                :src="item.url_link"
                                loading="lazy"
                                alt="Imagem enviada no chat."
                                @click.stop
                            />
                        </div>
                    </div>

                    <ui-btn-circle
                        v-if="!isMobile"
                        :size="2.3"
                        right="2%"
                        top="50%"
                        :disabled="imgSelectedIndex === dataMediaArray.length - 1 || isDisabledBtn"
                        @click.stop
                        @handle-btn-circle="handleBtnCircle('right')"
                    />
                </div>
            </media-template>
        </base-modal>
    </transition>
</template>

<script>
import UiBtnCircle from '@/components/ui/UiBtnCircle.vue'
import BaseModal from '../BaseModal.vue'
import MediaTemplate from '../media-template/MediaTemplate.vue'

export default {
    name: 'DisplayMedia',

    components: {
        BaseModal,
        MediaTemplate,
        UiBtnCircle,
    },

    props: {
        dataMediaSelected: [Object, Array],

        isVisible: {
            type: Boolean,
            default: false,
        },

        dataMediaArray: [Array, Object, String],

        btnDirectional: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['close-modal'],

    data() {
        return {
            imgSelectedIndex: null,
            slideDirection: 'right',
            isDisabledBtn: false,
            isMobile: false,
        }
    },

    computed: {
        choiseDataMedia() {
            if (this.imgSelectedIndex === null || !this.dataMediaArray[this.imgSelectedIndex]) {
                return this.dataMediaSelected
            }

            console.log(this.dataMediaSelected)

            return {
                ...this.dataMediaSelected,
                userName: this.dataMediaArray[this.imgSelectedIndex].name,
                urlImage: this.dataMediaArray[this.imgSelectedIndex].url_link,
                wook: this.dataMediaArray[this.imgSelectedIndex].wook,
            }
        },
    },

    watch: {
        dataMediaSelected: {
            immediate: true,
            handler(newVal) {
                if (newVal && this.dataMediaArray) {
                    this.imgSelectedIndex = this.dataMediaArray.findIndex(
                        media => media.url_link === newVal.urlImage
                    )
                }
            },
        },

        isVisible(newVal) {
            if (newVal && this.isMobile && this.imgSelectedIndex !== null) {
                this.$nextTick(() => this.scrollToSelected(true))
            }
        },

        imgSelectedIndex() {
            if (this.isMobile) {
                this.$nextTick(() => this.scrollToSelected())
            }
        },
    },

    mounted() {
        this.checkScreenSize()

        window.addEventListener('resize', this.checkScreenSize)
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize)
    },

    methods: {
        handleCloseModal() {
            this.$emit('close-modal')
        },

        handleBtnCircle(btnPosition) {
            this.isDisabledBtn = true
            this.slideDirection = btnPosition

            if (btnPosition === 'left' && this.imgSelectedIndex > 0) {
                this.imgSelectedIndex--
            } else if (
                btnPosition === 'right' &&
                this.imgSelectedIndex < this.dataMediaArray.length - 1
            ) {
                this.imgSelectedIndex++
            }

            setTimeout(() => {
                this.isDisabledBtn = false
            }, 300)
        },

        checkScreenSize() {
            this.isMobile = window.innerWidth <= 768
            if (this.isMobile && this.imgSelectedIndex !== null) {
                this.$nextTick(() => this.scrollToSelected(true))
            }
        },

        scrollToSelected(isInitial = false) {
            if (!this.isMobile || !this.$refs.carousel || this.imgSelectedIndex === null) return

            const container = this.$refs.carousel
            const items = container.querySelectorAll('.carousel-wrapper')
            const targetItem = items[this.imgSelectedIndex]

            if (targetItem) {
                // Rolagem instantânea
                if (isInitial) {
                    container.style.scrollBehavior = 'auto'
                }

                container.scrollTo({ left: targetItem.offsetLeft })

                // Restaura para rolagem suave
                if (isInitial) {
                    setTimeout(() => {
                        container.style.scrollBehavior = 'smooth'
                    }, 0)
                }
            }
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped>
.display-main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.img-wrapper {
    max-width: 1400px;
    padding: 1% 0;
}

.img-wrapper img {
    width: 90%;
    will-change: transform, opacity;
    backface-visibility: hidden;
}

/* Carrossel */
.carousel-grid {
    width: 90%;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;
    place-items: center;
    gap: 10rem;

    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    /*Retirar scrollbar: IE, EDGE and FIREFOX */
    scrollbar-width: none;
}

/* Retirar scrollbar: CHROME */
.carousel-grid::-webkit-scrollbar {
    display: none;
}

.carousel-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 600px;
    height: 300px;
    margin: 0 auto;
}

.carousel-grid img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;

    object-fit: contain;
    scroll-snap-align: center;
    scroll-snap-stop: always;
}

/* Transição da imagem */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 300ms ease-in-out;
    will-change: transform, opacity;
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
