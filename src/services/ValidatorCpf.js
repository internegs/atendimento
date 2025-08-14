import Axios from "axios";

let validatorCpf = Axios.create({
  baseURL: "https://inzupt.com/api/validaCPF",
  timeout: 15000,
});

export default validatorCpf;
