<template>
    <div
        class="input-wrapper"
        :style="styles"
    >
        <div class="input-container">
            <input
                :id="idHash"
                type="text"
                :placeholder="placeholder"
                :maxlength="maxLength"
                :disabled="disabled"
                :value="modelValue"
                :required="required"
                @input="searchList($event.target.value)"
                @focus="showOptions = true"
                @blur="showOptions = false"
                @keydown="handleKeydown"
            />

            <i
                class="fa-solid fa-caret-down"
                :class="{ rotated: showOptions }"
            ></i>
        </div>

        <div
            v-if="showOptions"
            class="input-options"
        >
            <ul ref="listRef">
                <li
                    v-for="(item, index) in listData"
                    :key="index"
                >
                    <button
                        type="button"
                        :class="{ selected: index === selectedIndex }"
                        @mousedown.prevent="selectOpt(item)"
                    >
                        <span>{{ item?.nome ?? item }}</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'

defineOptions({
    name: 'SelectSearchable',
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

    modelValue: [String, Number, Boolean],

    maxLength: Number,

    list: {
        type: Array,
        required: true,
    },

    type: {
        type: String,
        default: 'text',
    },

    required: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(['update:modelValue', 'obj-value'])

const idHash = ref('')
const showOptions = ref(false)
const listData = ref([])
const selectedIndex = ref(-1)
const listRef = ref(null)

onMounted(() => {
    generateHash(props.placeholder)
    listData.value = [...props.list]
})

watch(
    () => props.list,
    newValue => {
        listData.value = [...newValue]
    },
    { deep: true }
)

watch(
    () => listData.value,
    () => {
        selectedIndex.value = -1
    }
)

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

const searchList = value => {
    const valueFiltered = filteredValue(value)

    emits('update:modelValue', valueFiltered)

    if (valueFiltered.length < 3) {
        listData.value = []

        return
    }

    if (valueFiltered.length === 0) {
        listData.value = [...props.list]

        return
    }

    if (props.type === 'number') {
        listData.value = [...props.list].filter(item => item.startsWith(valueFiltered))

        return
    }

    listData.value = [...props.list].filter(item =>
        item.toString().toLowerCase().startsWith(valueFiltered.toString().toLowerCase())
    )

    return
}

const selectOpt = item => {
    emits('obj-value', item)

    emits('update:modelValue', item?.nome ?? item)

    showOptions.value = false

    document.getElementById(idHash.value).blur()
}

const scrollToSelected = () => {
    if (listRef.value && selectedIndex.value >= 0) {
        const selectedElement = listRef.value.children[selectedIndex.value]
        if (selectedElement) {
            selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }
}

const handleKeydown = event => {
    if (!showOptions.value) return

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()

            selectedIndex.value = Math.min(selectedIndex.value + 1, listData.value.length - 1)

            scrollToSelected()
            break
        case 'ArrowUp':
            event.preventDefault()

            selectedIndex.value = Math.max(selectedIndex.value - 1, 0)

            scrollToSelected()
            break
        case 'Enter':
            event.preventDefault()

            if (selectedIndex.value >= 0 && listData.value[selectedIndex.value]) {
                selectOpt(listData.value[selectedIndex.value])
            }
            break
        case 'Escape':
            showOptions.value = false
            selectedIndex.value = -1
            break
    }
}

const filteredValue = value => {
    switch (props.type) {
        case 'number':
            return value.replace(/\D/g, '')

        case 'email':
            return value.replace(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '')

        default:
            return value
    }
}
</script>

<style scoped lang="scss">
.input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: var(--input-width);
    height: var(--input-height);

    .input-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;

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
            background-color: transparent;

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

            &:focus,
            &:active {
                border: 3px solid #f3f3f3;
            }

            &:focus + i {
                transform: rotate(180deg);
            }

            &:disabled {
                background-color: #efefef4d;
            }
        }

        & i {
            position: absolute;
            z-index: 2;
            right: 1rem;

            color: #8e8e8e;
            transition: transform 300ms ease;
            cursor: pointer;
        }
    }

    .input-options {
        position: absolute;
        top: var(--input-height);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: auto;
        min-height: 4vh;
        max-height: 20vh;
        z-index: 10;

        background-color: white;
        border-radius: 10px;
        border: 2px solid #f3f3f3;

        @media (max-width: 1400px) {
            & {
                top: calc(var(--input-height) * 0.95);
            }
        }

        @media (max-width: 768px) {
            & {
                top: calc(var(--input-height) * 0.9);
            }
        }

        @media (max-width: 460px) {
            & {
                top: calc(var(--input-height) * 0.88);
            }
        }

        & ul {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 0;

            list-style-type: none;
            overflow-y: auto;

            @media (max-width: 460px) {
                & {
                    padding: 0.4rem 0;
                }
            }

            & li {
                width: 100%;

                & button {
                    width: 100%;
                    padding: 0.4rem 1.5rem;

                    text-align: start;
                    border: none;
                    background-color: transparent;
                    border-radius: 5px;
                    transition: all 100ms ease-in-out;

                    &:hover {
                        background-color: #f3f3f3;
                    }

                    &.selected {
                        background-color: #f3f3f3;
                    }

                    & span {
                        color: #4d4f5c;

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
                    }
                }
            }
        }
    }
}
</style>
