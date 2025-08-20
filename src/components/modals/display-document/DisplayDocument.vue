<template>
    <base-modal v-if="isVisible">
        <media-template></media-template>
    </base-modal>
</template>

<script>
import BaseModal from '../BaseModal.vue'
import MediaTemplate from '../media-template/MediaTemplate.vue'

export default {
    name: 'DisplayDocument',

    components: { BaseModal, MediaTemplate },

    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },

        dataDocumentSelected: [Object, Array, String],
    },

    emits: ['close-modal'],

    methods: {
        handleCloseModal() {
            this.$emit('close-modal')
        },
    },
}
</script>

<style scoped lang="scss"></style>
