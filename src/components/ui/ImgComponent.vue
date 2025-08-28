<template>
    <img
        ref="zoomImage"
        :src="fileUrl"
        @click="handleZoom"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    />
</template>

<script>
export default {
    name: 'ImgComponent',

    props: {
        fileUrl: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            isZoomed: false,
        }
    },

    methods: {
        handleZoom(e) {
            const img = this.$refs.zoomImage
            const rect = img.getBoundingClientRect()

            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100

            if (!this.isZoomed) {
                img.style.transform = 'scale(3)'
                img.style.transformOrigin = `${x}% ${y}%`
                img.style.cursor = 'zoom-out'
                this.isZoomed = true

                return
            }

            this.resetZoom()
        },

        handleMouseMove(e) {
            if (this.isZoomed) {
                this.updateZoomOrigin(e)
            }
        },

        handleMouseLeave() {
            if (this.isZoomed) {
                this.resetZoom()
            }
        },

        resetZoom() {
            const img = this.$refs.zoomImage

            if (this.isZoomed) {
                img.style.transform = 'scale(1)'
                img.style.transformOrigin = '50% 50%'
                img.style.cursor = 'zoom-in'
                this.isZoomed = false
            }
        },

        updateZoomOrigin(e) {
            const img = this.$refs.zoomImage
            const rect = img.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100

            img.style.transformOrigin = `${x}% ${y}%`
        },
    },
}
</script>

<style scoped lang="scss">
img {
    width: 100%;
    max-width: 1000px;
    height: 70%;
    max-height: 600px;
    object-fit: contain;
    transition: transform 0.2s ease-in-out;
    cursor: zoom-in;

    @media (min-width: 768px) {
        & {
            height: 80%;
        }
    }

    @media (min-width: 1400px) {
        & {
            height: 100%;
        }
    }
}
</style>
