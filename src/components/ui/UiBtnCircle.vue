<template>
    <button
        class="btn-circle-main"
        :style="styles"
        @click="$emit('handle-btn-circle')"
    >
        <i
            class="fa-solid fa-chevron-right"
            :style="iconStyles"
        ></i>
    </button>
</template>

<script>
export default {
    name: 'UiBtnCircle',

    props: {
        top: {
            type: String,
        },

        right: {
            type: String,
        },

        bottom: {
            type: String,
        },

        left: {
            type: String,
        },

        bgColor: {
            type: String,
            default: 'white',
        },

        width: {
            type: String,
            default: '3rem',
        },

        height: {
            type: String,
            default: '3rem',
        },

        padding: {
            type: String,
            default: '2rem',
        },

        color: {
            type: String,
            default: '#20292E',
        },

        size: {
            type: Number,
            default: 16,
        },

        flip: {
            type: String,
            validator: value => ['left', 'right'].includes(value),
        },
    },

    emits: ['handle-btn-circle'],

    computed: {
        styles() {
            const styles = {}

            if (this.top) styles.top = this.top
            if (this.right) styles.right = this.right
            if (this.bottom) styles.bottom = this.bottom
            if (this.left) styles.left = this.left
            if (this.bgColor) styles.background = this.bgColor
            if (this.width) styles.width = this.width
            if (this.height) styles.height = this.height
            if (this.padding) styles.padding = this.padding

            return styles
        },

        iconStyles() {
            return {
                color: this.color,
                fontSize: `clamp(${this.size - 0.5}rem, 1vw, ${this.size}rem)`,
                transform: this.flip === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
            }
        },
    },
}
</script>

<style scoped>
.btn-circle-main {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    border-radius: 50%;
    cursor: pointer;
    transition: transform 200ms ease;
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
}

.btn-circle-main:hover {
    transform: scale(1.03);
}
</style>
