<style lang="scss">
@import '../scss/icons';
</style>

<template>
  <icon-button name="save" class="ar-icon ar-icon__xs ar-icon--no-border" @click="upload" />
</template>

<script>
import IconButton from './icon-button'
import UploaderPropsMixin from '@/mixins/uploader-props'

export default {
  props: {
    record: { type: Object },

    filename: { type: String, default: 'record' },
    format: { type: String, default: 'mp3' },
    headers: { type: Object, default: () => ({}) },
    uploadUrl: { type: String }
  },

  components: {
    IconButton
  },

  methods: {
    upload() {
      if (!this.record.url) {
        return
      }

      this.$eventBus.$emit('start-upload')

      const data = new FormData()
      data.append('audio', this.record.blob, `${this.filename}.mp3`)

      const headers = Object.assign(this.headers, {})
      headers['Content-Type'] = `multipart/form-data; boundary=${data._boundary}`

      this.$http.post(this.uploadUrl, data, { headers: headers }).then(resp => {
        this.$eventBus.$emit('end-upload', { status: 'success', response: resp })
      }).catch(error => {
        this.$eventBus.$emit('end-upload', { status: 'fail', response: error })
      })
    }
  }
}
</script>
