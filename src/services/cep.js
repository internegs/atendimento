import Axios from "axios";

let cep = Axios.create({
  baseURL: "https://viacep.com.br/ws", // baseURL inicial
  timeout: 15000,
});

export default cep;





