<template>
    <div class="caixa">
        <div
            v-if="loadingPage"
            class="loading-container"
        >
            <div
                class="spinner-grow text-info"
                role="status"
            >
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <template v-else>
            <banner-home :data="data" />
            <banner-solucoes />
            <banner-apresentacao :data="data" />
            <banner-planos class="mt-4" />
            <banner-perguntas />
            <banner-footer :data="data" />
        </template>

        <a
            href="https://api.whatsapp.com/send?phone=5565920011640&text=Acessei%20o%20site%20inzupt.com.br%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%A3o"
            class="link-flutuante"
        >
            <img
                src="../assets/whatsapp.png"
                alt=""
            />
        </a>
    </div>
</template>

<script>
import BannerHome from '@/components/index/BannerHome.vue'
import BannerSolucoes from '@/components/index/BannerSolucoes.vue'
import BannerApresentacao from '@/components/index/BannerApresentacao.vue'
import BannerPlanos from '@/components/index/BannerPlanos.vue'
import BannerFooter from '@/components/index/BannerFooter.vue'
import Api from '@/services/api'
import BannerPerguntas from '@/components/index/BannerPerguntas.vue'
import Swal from 'sweetalert2'

export default {
    name: 'IndexPage',

    components: {
        BannerHome,
        BannerSolucoes,
        BannerApresentacao,
        BannerPlanos,
        BannerFooter,
        BannerPerguntas,
    },

    data() {
        return {
            data: [],
            loadingPage: false,
        }
    },

    created() {
        localStorage.clear()

        this.front()
    },

    methods: {
        async front() {
            this.loadingPage = true

            await Api.get('/front')
                .then(response => {
                    this.data = response?.data
                })
                .catch(err => {
                    this.loadingPage = false

                    console.log(err)

                    Swal.fire({
                        position: 'center',
                        title: 'Processando...',
                        showConfirmButton: true,
                        confirmButtonText: `<div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>`,
                        timer: 6000,
                    })

                    setTimeout(() => {
                        this.front()
                    }, 6000)
                })
                .finally(() => (this.loadingPage = false))
        },
    },
}
</script>

<style>
.caixa {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
}

button {
    outline: 0;
    border: 0;
}

.link-flutuante {
    position: fixed;
    bottom: 15px;
    right: 20px;
}

.bg-laranja {
    background-color: #f58634;
}

.loading-container {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow-y: hidden;
}
</style>
