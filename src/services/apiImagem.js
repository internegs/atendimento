import Axios from 'axios'
const token_acess = localStorage.getItem('@TOKEN')

const apiImagem = Axios.create({
    baseURL: 'https://inzupt.com/api', // baseURL inicial

    headers: {
        Authorization: 'Bearer ' + token_acess,
    },

    'Content-Type': 'multipart/form-data',

    timeout: 15000,
})

export default apiImagem
