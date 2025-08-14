import Axios from "axios";
let token_acess = localStorage.getItem("@TOKEN");
let apiImagem = Axios.create({
  // baseURL: "https://inzupt.com.br/api", // baseURL inicial
  baseURL: "https://inzupt.com/api", // baseURL inicial
  headers: {
    'Authorization':'Bearer '+token_acess, //configuracao do header padrao,7
  },
  "Content-Type": "multipart/form-data",

  
  timeout: 50000,
});

export default apiImagem;
