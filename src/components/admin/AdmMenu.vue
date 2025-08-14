<template>
    <nav
        id="sidebar"
        class="sidebar js-sidebar"
    >
        <div class="sidebar-content js-simplebar">
            <div class="d-flex flex-column ps-2">
                <h1 class="font-roboto color-white fw-bold spacing fs-3">ADMINISTRADOR</h1>
                <span class="text-uppercase font-roboto color-cinza spacing">Painel</span>
            </div>

            <ul class="sidebar-nav mt-4">
                <template
                    v-for="(item, index) in option"
                    :key="item.target"
                >
                    <li
                        class="sidebar-item fs-4"
                        :class="{ active: item.id === selectedMenuId }"
                    >
                        <router-link
                            v-if="item.target === 'ATENDIMENTO'"
                            target="_blank"
                            to="/atendimento"
                            class="sidebar-link"
                        >
                            <i
                                class="icone"
                                :class="item.icone"
                            ></i>

                            <span class="align-middle font-roboto text-capitalize">
                                {{ item.name }}
                            </span>
                        </router-link>

                        <button
                            v-else
                            type="button"
                            class="sidebar-link"
                            role="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#submenuIndex' + index"
                            @click="handleMenu(item)"
                        >
                            <i
                                class="icone"
                                :class="item.icone"
                            ></i>

                            <span class="align-middle font-roboto text-capitalize">
                                {{ item.name }}
                            </span>
                        </button>

                        <div
                            :id="'submenuIndex' + index"
                            class="collapse multi-collapse"
                        >
                            <li
                                v-for="submenu in item.submenus"
                                :key="submenu.target"
                                class="sidebar-item fs-sub"
                            >
                                <a
                                    class="sidebar-link"
                                    href="#"
                                    style="padding-left: 40px"
                                    @click="change(submenu.target)"
                                >
                                    <i
                                        class="icone fs-sub"
                                        :class="submenu.icone"
                                    ></i>

                                    <span class="align-middle font-roboto text-capitalize">
                                        {{ submenu.name }}
                                    </span>
                                </a>
                            </li>
                        </div>
                    </li>
                </template>

                <li class="sidebar-item fs-4">
                    <a
                        class="sidebar-link"
                        @click="deslogar()"
                    >
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span class="align-middle font-roboto text-capitalize">Sair</span>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import middleware from '@/services/middleware'

export default {
    name: 'AdmMenu',

    props: {
        option: Array,
        change: { type: Function },
    },

    data() {
        return {
            selectedMenuId: null,
        }
    },

    methods: {
        handleMenu(menu) {
            this.selectedMenuId = menu.id

            this.change(menu.target)
        },

        deslogar() {
            middleware.logout()
        },
    },
}
</script>

<style scoped>
.color-white {
    color: #fff;
}
.color-cinza {
    color: #cfcfcf;
}
.icone {
    font-size: 1.1rem;
}
.li-color {
    color: #e9ecef;
}

nav {
    overflow-y: scroll;
}

#sidebar {
    position: fixed;
    left: 0;
    height: 100dvh;
    padding: 30px 0;
    z-index: 1000;
}

.spacing {
    letter-spacing: 1.2px;
}
.fs-sub {
    font-size: 15px;
}
</style>
