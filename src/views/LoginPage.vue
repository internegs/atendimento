<template>
    <div class="box">
        <front-menu :change="setSelect" />

        <div class="login-content">
            <banner-login
                v-show="selected === option[0].name"
                :change="setSelect"
            />

            <banner-forgot
                v-show="selected === option[1].name"
                :change="setSelect"
            />
        </div>
    </div>
</template>

<script>
import BannerLogin from '@/components/login/BannerLogin.vue'
import FrontMenu from '@/components/GLOBALS/FrontMenu.vue'
import BannerForgot from '@/components/login/BannerForgot.vue'

export default {
    name: 'LoginPage',

    components: { BannerLogin, FrontMenu, BannerForgot },

    data() {
        return {
            selected: 'login',
            option: [
                {
                    name: 'login',
                    target: 'LOGIN',
                },
                {
                    name: 'forgot',
                    target: 'FORGOT',
                },
            ],
        }
    },
    methods: {
        setSelect(name) {
            this.selected = name
        },
    },
}
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
}

.login-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100% !important;
    padding-top: 100px;

    background-image: linear-gradient(to right, #7ed0dd, #479fcf);
}
</style>
