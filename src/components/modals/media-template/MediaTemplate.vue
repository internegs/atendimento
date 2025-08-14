<template>
    <BaseModal>
        <header>
            <div class="header-wrapper">
                <div class="user-wrapper">
                    <div class="user-photo">
                        <img
                            v-if="dataMedia.wook !== 'onack'"
                            :src="dataMedia.userPhoto"
                            alt="foto de perfil"
                        />
                        <div
                            v-else
                            class="callcenter-icon"
                        >
                            <i class="fa-solid fa-headset"></i>
                        </div>
                    </div>

                    <div class="user-info">
                        <span class="user-name ps-2">
                            {{ dataMedia.wook !== 'onack' ? dataMedia.userName : 'Você' }}
                        </span>
                    </div>
                </div>

                <div class="media-options">
                    <button
                        class="opt-btn-download"
                        @click="downloadImage(dataMedia.urlImage)"
                    >
                        <img
                            src="../../../assets/download-icon.png"
                            alt="Download da imagem"
                        />
                    </button>

                    <button
                        class="opt-btn-close"
                        @click="$emit('close-modal')"
                    >
                        <i class="fa-solid fa-xmark text-secondary"></i>
                    </button>
                </div>
            </div>
        </header>

        <div
            class="template-main"
            @click="$emit('close-modal')"
        >
            <slot></slot>
        </div>

        <footer></footer>
    </BaseModal>
</template>

<script>
import BaseModal from '../BaseModal.vue'

export default {
    name: 'MediaTemplate',

    emits: ['close-modal'],

    props: {
        dataMedia: [Object, Array],
    },

    components: {
        BaseModal,
    },

    methods: {
        downloadImage(url) {
            window.open(url, '_blank')
        },
    },
}
</script>

<style scoped>
header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.5% 0;
}

.header-wrapper {
    display: flex;
    justify-content: space-between;
    width: 97%;
}

.header-wrapper .user-wrapper {
    display: flex;
    align-items: center;
}

.user-photo {
    width: 50px;
}

.user-photo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    font-size: clamp(2rem, 2.5vw, 3rem);
}

.user-photo .callcenter-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    border-radius: 50%;
    font-size: clamp(1.2rem, 1vw, 1.5rem);
    color: #f4f4f4;
    background-color: #465157;
}

.user-photo .callcenter-icon i {
    padding: 1rem 0;
}

.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
}

.user-name {
    font-size: 16px;
    color: #20292e;
    font-weight: bolder;
}

.media-options {
    display: flex;
    align-items: center;
    padding: 0 2%;
    gap: 5%;
}

.media-options .opt-btn-download {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;

    border-radius: 50%;
    background-color: transparent;
    transition: background-color 300ms ease;
}

.media-options .opt-btn-download:active {
    background-color: #b1b1b1;
}

.media-options .opt-btn-download img {
    width: 1.7rem;
}

.media-options .opt-btn-close {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;

    border-radius: 50%;
    background-color: transparent;
    transition: background-color 300ms ease;
}

.media-options .opt-btn-close:active {
    background-color: #b1b1b1;
}

.media-options .opt-btn-close i {
    font-size: 1.6rem;
    color: #3b4a54;
}

/* MAIN */

.template-main {
    width: 100%;
    height: 80dvh;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
