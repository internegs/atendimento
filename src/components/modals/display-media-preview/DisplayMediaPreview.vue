<template>
    <transition
        name="modal-slide"
        appear
    >
        <base-modal
            :is-visible="isVisible"
            teleport-to="container-main"
        >
            <media-template
                :data-media="dataMediaSelected"
                @close-modal="handleCloseModal"
            >
                <div
                    v-show="!mediaLoading"
                    class="midia-container"
                >
                    <header>
                        <h2>{{ dataMediaSelected?.dataFile?.name }}</h2>
                    </header>

                    <div class="midia-main">
                        <img-component
                            v-if="isImage && urlFile"
                            :file-url="urlFile"
                        />

                        <video
                            v-else
                            :src="urlFile"
                            controls
                            muted
                            preload="metadata"
                        ></video>
                    </div>

                    <!-- SERVE SOMENTE PARA AJUDAR NO ALINHAMENTO -->
                    <div></div>
                </div>

                <template
                    v-if="!mediaLoading"
                    #footer
                >
                    <div class="btn-wrapper">
                        <button
                            type="button"
                            class="btn-send"
                            @click="sendMedia()"
                        >
                            <img
                                v-if="!sendLoading"
                                src="../../../assets/enviar.png"
                                class="icon-send"
                                alt="Enviar"
                            />

                            <div
                                v-if="sendLoading"
                                class="spinner-border text-light spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </button>
                    </div>
                </template>

                <div
                    v-if="mediaLoading"
                    class="spinner-border text-secondary"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
            </media-template>
        </base-modal>
    </transition>
</template>

<script>
import Swal from 'sweetalert2'
import BaseModal from '../BaseModal.vue'
import MediaTemplate from '../media-template/MediaTemplate.vue'
import api from '@/services/api/api.js'
import { formatSize, formatTypeDocument } from '@/utils/formatters'
import ImgComponent from '@/components/ui/ImgComponent.vue'

export default {
    name: 'DisplayMediaPreview',

    components: { BaseModal, MediaTemplate, ImgComponent },

    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },

        dataMediaSelected: {
            type: Object,
            required: true,
        },
    },

    emits: ['close-modal', 'update-messages'],

    data() {
        return {
            urlFile: null,
            mediaLoading: false,
            sendLoading: false,
        }
    },

    computed: {
        isImage() {
            const mimes = {
                imgs: [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/bmp',
                    'image/tiff',
                ],
                videos: [
                    'video/mp4',
                    'video/quicktime', // .mov
                    'video/x-msvideo', // .avi
                    'video/x-ms-wmv', // .wmv
                    'video/3gpp', // .3gp
                    'video/x-flv', // .flv
                    'video/webm',
                    'video/x-matroska', // .mkv
                ],
            }

            return mimes.imgs.some(img => img === this.dataMediaSelected?.dataFile?.type)
        },
    },

    watch: {
        dataMediaSelected: {
            async handler(newValue) {
                if (newValue?.dataFile) {
                    await this.$nextTick()

                    await this.loadMedia()
                }
            },
            immediate: true,
        },
    },

    methods: {
        handleCloseModal() {
            if (this.urlFile) {
                URL.revokeObjectURL(this.urlFile)
            }

            this.$emit('close-modal')
        },

        async loadMedia() {
            this.mediaLoading = true

            try {
                const file = this.dataMediaSelected.dataFile

                this.urlFile = URL.createObjectURL(file)
            } catch (error) {
                console.error('Erro ao carregar mídia:', error)

                this.mediaLoading = false
            } finally {
                this.mediaLoading = false
            }
        },

        async sendMedia() {
            this.sendLoading = true

            try {
                const obj = {
                    user_id: localStorage.getItem('@USER_ID'),
                    fone: this.dataMediaSelected?.recipientFone,
                    midia: this.dataMediaSelected?.dataFile,
                    type: 2,
                }

                const binaryObj = new FormData()

                Object.entries(obj).forEach(([key, value]) => {
                    binaryObj.append(key, value)
                })

                await api.post('/envia_midianovo/ZmlsYWRlYXRlbmRpbWVudG8=', binaryObj)

                this.$emit('update-messages')

                this.handleCloseModal()
            } catch (error) {
                console.error(error)

                this.sendLoading = false

                Swal.fire({
                    icon: 'error',
                    title: 'Erro ',
                    text: 'Erro ao enviar documento.',
                    confirmButtonColor: '#17a2b8',

                    didOpen: () => {
                        const confirmBtn = Swal.getConfirmButton()
                        const actionsContainer = confirmBtn.parentElement

                        actionsContainer.style.width = '100%'
                        actionsContainer.style.display = 'flex'
                        actionsContainer.style.justifyContent = 'center'

                        confirmBtn.style.width = '90%'
                    },
                }).then(() => {
                    this.handleCloseModal()
                })
            } finally {
                this.sendLoading = false
            }
        },

        teste(value) {
            console.log(value)
        },
    },
}
</script>

<style scoped lang="scss">
.midia-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    overflow: hidden;

    header {
        width: 90%;

        h2 {
            margin-top: 10px;

            font-size: 14px;
            font-weight: 500;
            white-space: break-word;
            overflow-wrap: break-word;
            text-align: center;

            @media (min-width: 1400px) {
                & {
                    font-size: 16px;
                }
            }
        }
    }

    .midia-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-height: 500px;
        gap: 1rem;

        @media (min-width: 768px) {
            & {
                max-height: auto;
            }
        }

        video {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            border-radius: 8px;
            object-fit: contain;
        }
    }
}

.btn-wrapper {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-send {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 3rem;

        background-color: #2cacbf;
        border-radius: 50%;
        transition: all 200ms ease;
        will-change: transform;

        &:hover {
            opacity: 0.9;
        }

        &:active {
            transform: translateY(2px) scale(0.95);
        }

        @media (min-width: 768px) {
            & {
                width: 3.5rem;
                height: 3.5rem;
            }
        }

        @media (min-width: 1400px) {
            & {
                width: 4rem;
                height: 4rem;
            }
        }

        .icon-send {
            width: 1.2rem;
            height: 1.2rem;

            @media (min-width: 768px) {
                & {
                    width: 1.4rem;
                    height: 1.4rem;
                }
            }

            @media (min-width: 1400px) {
                & {
                    width: 1.5rem;
                    height: 1.5rem;
                }
            }
        }
    }
}
</style>
