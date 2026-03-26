<template>
    <div
        id="settings"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="offcanvasSettingsLabel"
    >
        <div class="offcanvas-header p-2">
            <button
                type="button"
                class="btn btn-danger fs-4 fw-bold ms-auto"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            >
                Fechar
            </button>
        </div>

        <div class="offcanvas-body">
            <div class="row container-fluid">
                <h2
                    id="offcanvasSettingsLabel"
                    class="offcanvas-title fs-3 fw-bold mb-4"
                >
                    Configurações
                </h2>

                <div class="col-md-12">
                    <h2 class="text-start fs-4 fw-bold">Notificações</h2>

                    <div class="w-100 d-flex align-items-center mt-3 gap-4">
                        <span class="fs-4 fw-bold">Som:</span>

                        <div class="form-check form-switch fs-4">
                            <input
                                id="isNotificationSongSwitch"
                                class="form-check-input"
                                type="checkbox"
                                :checked="audioStatus"
                                @change="$emit('ativar-notificacao')"
                            />

                            <label
                                class="form-check-label"
                                for="isNotificationSongSwitch"
                            >
                                {{ audioStatus ? 'Ativado' : 'Desativado' }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'SettingsOffcanvas' })

defineProps({
    audioStatus: {
        type: Boolean,
        required: true,
    },
})

defineEmits(['ativar-notificacao'])
</script>

<style lang="scss" scoped>
.offcanvas {
    width: 35rem;

    @media (max-width: 768px) {
        width: 100%;
    }
}
</style>
