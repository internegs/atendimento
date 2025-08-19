import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { MaskInput } from 'maska'
import firebaseVue from './firebase/index'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vue3-emoji-picker/css'
import '@/assets/styles/index.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistedState())

app.use(router)
app.use(pinia)
app.use(firebaseVue)

app.directive('mask', {
    mounted(el, binding) {
        el._mask = new MaskInput(el, { mask: binding.value })
    },

    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            if (el._mask) {
                el._mask.destroy()
            }
            el._mask = new MaskInput(el, { mask: binding.value })
        }
    },

    unmounted(el) {
        if (el._mask) {
            el._mask.destroy()
        }
    },
})

app.directive('tooltip', {
    mounted(el, binding) {
        const Tooltip = window.bootstrap?.Tooltip

        if (!Tooltip) {
            console.warn('Bootstrap Tooltip não encontrado')
            return
        }

        let options = {
            title: binding.value,
            placement: binding.arg || 'bottom',
            trigger: 'hover focus',
            delay: { show: 400, hide: 100 },
        }

        if (typeof binding.value === 'object') {
            options = {
                ...options,
                title: binding.value.title,
                delay: binding.value.delay || options.delay,
                customClass: binding.value.class || '',
                placement: binding.value.placement || options.placement,
            }
        }

        el._tooltipInstance = new Tooltip(el, options)

        if (options.customClass) {
            el.addEventListener('shown.bs.tooltip', () => {
                const tooltipElement = document.querySelector('.tooltip')

                if (tooltipElement) {
                    tooltipElement.classList.add(options.customClass)
                }
            })
        }
    },

    unmounted(el) {
        if (el._tooltipInstance) {
            el._tooltipInstance.dispose()
        }
    },
})

app.directive('no-select', {
    mounted(el) {
        el.style.userSelect = 'none'
        el.style.webkitUserSelect = 'none'
        el.style.mozuserSelect = 'none'
        el.style.msUserSelect = 'none'
    },
})

app.mount('#app')
