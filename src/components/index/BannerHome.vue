<template>
    <div class="bg-color">
        <HeaderMenu />
        <section
            class="home"
            style="padding-top: 100px"
            id="home"
        >
            <div class="container">
                <div class="row d-flex flex-column-reverse flex-md-row justify-content-around">
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                        <h1 class="fw-bold f-36 text-white mt-3 font-oswald">
                            {{ bannerData?.titulo || 'Não definido' }}
                        </h1>
                        <p
                            style="
                                font-size: 18px;
                                font-family:
                                    Fira Sans,
                                    sans-serif;
                            "
                            class="text-white mt-3"
                        >
                            {{ bannerData?.resumo || 'Não definido' }}
                        </p>

                        <div class="btn-div mt-3">
                            <a
                                href="#planos"
                                class="bg-laranja text-white rounded mt-3 fs-4 fw-bold"
                            >
                                COMECE AGORA
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <iframe
                            class="responsive-iframe"
                            src="https://inzupt.com/inzupt_video.mp4"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import HeaderMenu from './HeaderMenu.vue'

export default {
    name: 'BannerHome',

    components: { HeaderMenu },

    props: {
        data: Array,
    },

    computed: {
        bannerData() {
            return this.data && this.data.length > 0 ? this.data[0] : null
        },
    },
}
</script>

<style scoped>
.home {
    height: 100vh;
    padding: 30px;
    display: flex;
    align-items: center;
}

.f-36 {
    font-size: 50px;
}
.img-home {
    width: 90%;
}
.mr-60 {
    margin-right: 60px;
}
.btn-div a {
    padding: 12px 20px;
}

@media (max-width: 771px) {
    .btn-div a {
        width: 100%;
    }
    .home {
        height: auto;
    }
}

@media (max-width: 350px) {
    .btn-div button {
        margin-bottom: 50px;
    }
    .f-36 {
        font-size: 40px;
    }
}

.responsive-iframe {
    width: 100%;
    height: 100%;
    padding-top: 5%;
}

.bg-color {
    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}
</style>
