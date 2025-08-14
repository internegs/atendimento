<template>
    <div class="forgot">
        <div class="form">
            <h1 class="text-uppercase text-center">Recuperar Senha</h1>

            <div class="input bg-branco mt-5 d-flex align-items-center">
                <i
                    class="fa fa-envelope"
                    aria-hidden="true"
                ></i>

                <input
                    type="email"
                    placeholder="Digite Seu E-mail"
                />
            </div>

            <button class="button-forgot mt-5 text-uppercase">recuperar</button>

            <span
                class="voltar text-center mt-3"
                @click="change('login')"
            >
                Voltar
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Bannerforgot',
    props: {
        change: { type: Function },
    },
}
</script>

<style scoped>
.voltar:hover {
    text-decoration: underline;
    cursor: pointer;
}

.bg-branco {
    background-color: #fff;
}
.forgot {
    width: 90%;
    max-width: 500px;
    /* background: rgb(32, 32, 36); */
    background: #fff;
    border-radius: 5px;
}

.form {
    display: flex;
    flex-direction: column;
    padding: 32px;
}

.input {
    padding: 15px 10px;
    border-radius: 5px;
    border-bottom: 1px dashed #9e9e9e;
    font-size: 1.2rem;
}

.input:hover,
.input:hover i {
    border-color: #f58634;
    color: #f58634;
}

.input input {
    width: 90%;
    background-color: transparent;
    outline: 0;
    padding: 0px 10px;
    border: 0;

    color: #4d4f5c;
}

.input input::placeholder {
    font-size: 1.2rem;
}

.input i {
    color: #9e9e9e;
    font-size: 20px;
}
.button-forgot {
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;

    font-size: 1.5rem;
    padding: 10px 20px;

    border-radius: 5px;

    background-color: #f58634;
}
.laranja {
    color: #f58634;
}
</style>
