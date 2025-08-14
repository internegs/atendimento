import Axios from 'axios'
import router from '@/router'

function getPath() {
    return router?.currentRoute?.value.params.token || localStorage.getItem('@AGENDA')
}

const API = Axios.create({
    baseURL: 'https://inzupt.com/api',
    timeout: 50000,
})

API.interceptors.request.use(
    config => {
        const token_acess = localStorage.getItem('@TOKEN')

        if (token_acess) {
            config.headers.Authorization = `Bearer ${token_acess}`
        }

        return config
    },

    error => {
        return Promise.reject(error)
    }
)

export async function getAgenda(config = {}) {
    try {
        const response = await API.post(`/agenda_disponivel/${getPath()}`, config)

        return response
    } catch (error) {
        if (error.status === 403) {
            const msgError = btoa(encodeURIComponent(error.response.data))

            return router.push(`/forbidden?error=${msgError}&code=403`)
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}

export async function enviaAgenda(data) {
    try {
        const response = await API.post('/envia_agenda', data)

        return response
    } catch (error) {
        if (error.status === 403) {
            const msgError = btoa(encodeURIComponent(error.response.data))

            return window.location.replace(`/forbidden?error=${msgError}&code=403`)
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}

export async function editaAgenda(data) {
    try {
        const response = await API.post('/edita_agenda', data)

        return response
    } catch (error) {
        if (error.status === 403) {
            const msgError = btoa(encodeURIComponent(error.response.data))

            return window.location.replace(`/forbidden?error=${msgError}&code=403`)
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}

export async function deleteAgenda(data) {
    try {
        const response = await API.post('/exclui_agenda', data)

        return response
    } catch (error) {
        if (error.status === 403) {
            const msgError = btoa(encodeURIComponent(error.response.data))

            return window.location.replace(`/forbidden?error=${msgError}&code=403`)
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}

export async function geraAgenda(data) {
    try {
        const response = await API.post('/gera_agenda', data)

        return response
    } catch (error) {
        if (error.status === 403) {
            const msgError = btoa(encodeURIComponent(error.response.data))

            return window.location.replace(`/forbidden?error=${msgError}&code=403`)
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}

export async function buscarPacientes(data, config = {}) {
    try {
        const response = await API.post('/pacientes_busca', data, config)

        return response
    } catch (error) {
        if (Axios.isCancel(error)) {
            return
        }

        if (error.response.data) {
            return console.error(error.response.data)
        }

        if (error.message) {
            return console.error(error.message)
        }

        return console.error(error)
    }
}
