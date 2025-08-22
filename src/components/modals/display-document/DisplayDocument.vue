<template>
    <transition
        name="modal-slide"
        appear
    >
        <base-modal
            v-if="isVisible"
            @close-modal="handleCloseModal"
        >
            <media-template
                :data-media="dataDocumentSelected"
                @close-modal="handleCloseModal"
            >
                <div
                    v-show="!pdfLoading"
                    class="doc-container"
                >
                    <canvas
                        v-if="isPdf"
                        ref="pdfCanvas"
                    ></canvas>

                    <i
                        v-else
                        v-bind="fileIconConfig"
                    ></i>
                </div>

                <template
                    v-if="!pdfLoading"
                    #footer
                >
                    <div class="btn-wrapper">
                        <button
                            type="button"
                            class="btn-send"
                            @click="sendDocument()"
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
                    v-if="pdfLoading"
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
import * as pdflib from 'pdfjs-dist'
import api from '@/services/api'

export default {
    name: 'DisplayDocument',

    components: { BaseModal, MediaTemplate },

    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },

        dataDocumentSelected: {
            type: Object,
            required: true,
        },
    },

    emits: ['close-modal', 'update-messages'],

    data() {
        return {
            pdfLoading: false,
            sendLoading: false,
        }
    },

    computed: {
        isPdf() {
            return this.dataDocumentSelected?.dataFile?.type === 'application/pdf'
        },

        fileIconConfig() {
            const fileType = this.dataDocumentSelected?.dataFile?.type
            let iconType
            let color

            switch (fileType) {
                case 'application/msword':
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    iconType = 'fa-file-word'
                    color = '#2B579A'
                    break

                case 'application/vnd.ms-excel':
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    iconType = 'fa-file-excel'
                    color = '#217346'
                    break

                case 'application/vnd.ms-powerpoint':
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                    iconType = 'fa-file-powerpoint'
                    color = '#D24726'
                    break

                case 'text/plain':
                    iconType = 'fa-file-lines'
                    color = '#6C757D'
                    break

                case 'application/rtf':
                    iconType = 'fa-file-word'
                    color = '#6F42C1'
                    break

                case 'text/csv':
                    iconType = 'fa-file-csv'
                    color = '#198754'
                    break

                case 'application/zip':
                case 'application/vnd.rar':
                case 'application/x-rar-compressed':
                case 'application/x-7z-compressed':
                    iconType = 'fa-file-zipper'
                    color = '#c01c28'
                    break

                default:
                    iconType = 'fa-file'
                    color = '#6C757D'
                    break
            }

            return {
                class: `fa-solid ${iconType}`,
                style: `color: ${color};`,
            }
        },
    },

    watch: {
        dataDocumentSelected: {
            async handler(newValue) {
                if (newValue?.dataFile && this.isPdf) {
                    await this.$nextTick()

                    this.loadPdf()
                }
            },
            immediate: true,
        },
    },

    methods: {
        handleCloseModal() {
            if (this.pdfViewerUrl) {
                URL.revokeObjectURL(this.pdfViewerUrl.split('file=')[1])
            }

            this.$emit('close-modal')
        },

        async loadPdf() {
            this.pdfLoading = true

            try {
                const file = this.dataDocumentSelected.dataFile
                const arrayBuffer = await file.arrayBuffer()
                const pdf = await pdflib.getDocument({
                    data: arrayBuffer,
                    disableAutoFetch: true, // desabilita o pré-carregamento
                }).promise
                const page = await pdf.getPage(1)

                const canvas = this.$refs.pdfCanvas
                const context = canvas.getContext('2d')
                const viewport = page.getViewport({ scale: 1 })

                canvas.width = viewport.width
                canvas.height = viewport.height

                await page.render({ canvasContext: context, viewport }).promise
            } catch (error) {
                console.error('Erro ao carregar PDF:', error)

                this.pdfLoading = false
            } finally {
                this.pdfLoading = false
            }
        },

        async sendDocument() {
            this.sendLoading = true

            try {
                const obj = {
                    user_id: localStorage.getItem('@USER_ID'),
                    fone: this.dataDocumentSelected?.recipientFone,
                    midia: this.dataDocumentSelected?.dataFile,
                    type: 2,
                }

                const binaryObj = new FormData()

                Object.entries(obj).forEach(([keyBy, value]) => {
                    binaryObj.append(keyBy, value)
                })

                console.log(binaryObj)

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
.doc-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    canvas {
        transform: scale(0.4);

        @media (min-width: 1200px) {
            & {
                transform: scale(0.5);
            }
        }

        @media (min-width: 1400px) {
            & {
                transform: scale(0.7);
            }
        }
    }

    i {
        font-size: 6rem;

        @media (min-width: 1400px) {
            & {
                font-size: 8rem;
            }
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
