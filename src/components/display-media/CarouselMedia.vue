<template>
    <div
        ref="glide"
        class="glide"
    >
        <div
            class="glide__track"
            data-glide-el="track"
        >
            <ul class="glide__slides">
                <li
                    v-for="(media, index) in mediaArray"
                    :key="index"
                    class="glide__slide"
                >
                    <div class="media-container">
                        <img-component
                            v-if="media.type === 'image'"
                            :file-url="media.url_link"
                        />

                        <video
                            v-else-if="media.type === 'video'"
                            :src="media.url_link"
                            controls
                            preload="metadata"
                            autoplay
                        />

                        <div
                            v-else
                            class="media-error"
                        >
                            Tipo de mídia não suportado
                        </div>
                    </div>

                    <!-- Caption opcional -->
                    <div
                        v-if="media.caption"
                        class="media-caption"
                    >
                        {{ media.caption }}
                    </div>
                </li>
            </ul>
        </div>

        <!-- Setas de navegação -->
        <div
            v-if="showArrows"
            data-glide-el="controls"
            class="glide__arrows"
        >
            <button
                class="glide__arrow glide__arrow--left"
                data-glide-dir="<"
                :disabled="isFirstSlide"
                @click="updateNavigationState"
            >
                <i class="fa-solid fa-angle-left"></i>
            </button>

            <button
                class="glide__arrow glide__arrow--right"
                data-glide-dir=">"
                :disabled="isLastSlide"
                @click="updateNavigationState"
            >
                <i class="fa-solid fa-angle-right"></i>
            </button>
        </div>

        <!-- Bullets/Dots -->
        <div
            v-if="showDots"
            class="glide__bullets"
            data-glide-el="controls[nav]"
        >
            <button
                v-for="(item, index) in mediaArray"
                :key="`bullet-${index}`"
                class="glide__bullet"
                :data-glide-dir="`=${index}`"
                :class="{ 'glide__bullet--active': currentSlide === index }"
            />
        </div>
    </div>
</template>

<script>
import Glide from '@glidejs/glide'
import ImgComponent from '../ui/ImgComponent.vue'

export default {
    name: 'CarouselMedia',

    components: {
        ImgComponent,
    },

    props: {
        mediaArray: {
            type: Array,
            required: true,
            default: () => [],
        },

        // Configurações do carrossel
        startAt: {
            type: Number,
            default: 0,
        },

        perView: {
            type: Number,
            default: 1,
        },

        gap: {
            type: Number,
            default: 20,
        },

        // Controles visuais
        showArrows: {
            type: Boolean,
            default: true,
        },

        showDots: {
            type: Boolean,
            default: true,
        },

        // Configurações de comportamento
        keyboard: {
            type: Boolean,
            default: true,
        },

        swipeThreshold: {
            type: Number,
            default: 80,
        },

        dragThreshold: {
            type: Number,
            default: 120,
        },

        type: {
            type: String,
            default: 'slider',
            validator: value => ['carousel', 'slider'].includes(value),
        },
    },

    data() {
        return {
            glideInstance: null,
            currentSlide: this.startAt,
            isFirstSlide: false,
            isLastSlide: false,
        }
    },

    watch: {
        mediaArray: {
            handler() {
                this.$nextTick(() => {
                    if (this.glideInstance) {
                        this.glideInstance.destroy()
                    }

                    this.initGlide()
                })
            },
            deep: true,
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.initGlide()
        })
    },

    beforeUnmount() {
        if (this.glideInstance) {
            this.glideInstance.destroy()
        }
    },

    methods: {
        initGlide() {
            if (!this.$refs.glide || !this.mediaArray.length) return

            const config = {
                type: this.type,
                startAt: this.startAt,
                perView: this.perView,
                gap: this.gap,
                keyboard: this.keyboard,
                swipeThreshold: this.swipeThreshold,
                dragThreshold: this.dragThreshold,
                rewind: this.type === 'carousel',
                bound: this.type === 'slider',
            }

            this.glideInstance = new Glide(this.$refs.glide, config)
            this.glideInstance.mount()

            this.updateNavigationState()
        },

        updateNavigationState() {
            setTimeout(() => {
                if (!this.glideInstance) return

                this.isFirstSlide = this.glideInstance?.index === 0
                this.isLastSlide = this.glideInstance?.index === this.mediaArray?.length - 1
            }, 200)
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped lang="scss">
.glide {
    display: flex;
    width: 100%;
    height: 100%;

    .glide__track {
        width: 100%;
        height: 100%;

        .glide__slides {
            width: 100%;
            height: 100%;

            .glide__slide {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;

                .media-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    max-width: 90%;
                    max-height: 50%;

                    @media (min-width: 768px) {
                        & {
                            max-width: 600px;
                        }
                    }

                    @media (min-width: 1400px) {
                        & {
                            max-width: 800px;
                        }
                    }

                    img,
                    video {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        border-radius: 8px;
                    }
                }

                .media-caption {
                    margin-top: 1rem;
                    padding: 0.5rem;
                    color: #666;
                    font-size: 0.9rem;
                }

                .media-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    background: #f5f5f5;
                    color: #999;
                    border-radius: 8px;
                }
            }
        }
    }

    // Customização das setas
    .glide__arrow {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        width: 40px;
        height: 40px;

        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;

        transform: translateY(-50%);
        transition: background-color 0.3s ease;

        &:hover:not(:disabled) {
            background: rgba(0, 0, 0, 0.8);
        }

        &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        @media (max-width: 768px) {
            & {
                width: 35px;
                height: 35px;
                font-size: 1rem;

                &--left {
                    left: 5px;
                }

                &--right {
                    right: 5px;
                }
            }
        }

        &--left {
            left: 10px;
        }

        &--right {
            right: 10px;
        }
    }

    // Customização dos bullets
    .glide__bullets {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .glide__bullet {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #ccc;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            border-color: #999;
        }

        &--active {
            background: #007bff;
            border-color: #007bff;
        }
    }
}
</style>
