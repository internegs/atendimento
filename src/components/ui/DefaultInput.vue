<template>
    <div
        class="input-container"
        :style="styles"
    >
        <input
            :id="idHash"
            ref="inputElement"
            type="text"
            :placeholder="placeholder"
            :disabled="disabled"
            :value="modelValue"
            :maxlength="maxLength"
            @input="filterValues"
        />
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

defineOptions({
    name: 'DefaultInput',
})

const props = defineProps({
    width: {
        type: String,
        default: '90%',
    },

    height: {
        type: String,
        default: '45px',
    },

    placeholder: {
        type: String,
        required: true,
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    type: {
        type: String,
        default: 'text',
    },

    modelValue: [String, Number, Boolean],

    maxLength: Number,
})

const emit = defineEmits(['update:modelValue'])

const idHash = ref('')
const inputElement = ref(null)

onMounted(() => {
    generateHash(props.placeholder)
})

const styles = computed(() => ({
    '--input-width': props.width,
    '--input-height': props.height,
}))

const generateHash = async text => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    idHash.value = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

defineExpose({
    focus: () => inputElement.value?.focus(),
})

const filterValues = event => {
    let value = event.target.value

    if (props.type === 'number') {
        value = value.replace(/\D/g, '')
    }

    if (event.target.value !== value) {
        event.target.value = value
    }

    emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.input-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: var(--input-width);
    height: var(--input-height);

    @media (max-width: 1400px) {
        & {
            height: calc(var(--input-height) * 0.95);
        }
    }

    @media (max-width: 768px) {
        & {
            height: calc(var(--input-height) * 0.9);
        }
    }

    @media (max-width: 460px) {
        & {
            height: calc(var(--input-height) * 0.8);
        }
    }

    & input {
        width: 100%;
        height: 100%;
        padding: 0 1rem;

        outline: none;
        border-radius: 10px;
        border: 2px solid #f3f3f3;
        transition: 100ms ease;
        z-index: 1;
        color: #4d4f5c;
        background-color: white;

        @media (max-width: 1400px) {
            & {
                font-size: 14px;
            }
        }

        @media (max-width: 460px) {
            & {
                font-size: 12px;
            }
        }

        &:disabled {
            background-color: #f7f7f7;
        }

        &:focus,
        &:active {
            border: 3px solid #f3f3f3;
        }
    }
}
</style>
