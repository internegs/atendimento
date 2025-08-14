import Swal from 'sweetalert2'

export default {
    install(app) {
        const tokenWatcher = {
            intervalId: null,

            start(router) {
                if (this.intervalId) return

                this.intervalId = setInterval(() => {
                    if (!localStorage.getItem('@TOKEN')) {
                        this.stop()

                        Swal.fire({
                            icon: 'warning',
                            title: 'Sessão Expirada',
                            text: 'Sua sessão foi encerrada. Você será redirecionado para a tela de login.',
                            showConfirmButton: true,
                        }).then(() => {
                            router.replace('/login')
                        })
                    }
                }, 10000)
            },

            stop() {
                if (this.intervalId) {
                    clearInterval(this.intervalId)

                    this.intervalId = null
                }
            },
        }

        app.config.globalProperties.$validateTokenPage = tokenWatcher
    },
}
