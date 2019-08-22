<template>
  <div class="img-view-bg">
    <div class="img-view">

      <i class="material-icons">chevron_left</i>
      <i class="material-icons">chevron_right</i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      default () {
        return ''
      },
      required: true
    },
    img: {
      default () {
        return []
      },
      required: true
    },
    value: {
      default () {
        return false
      },
      required: true
    }
  },
  computed: {
    isShow () {
      return this.value
    }
  },
  methods: {
    toggle () {
      this.$emit('input', !this.value)
    }
  }
}
</script>
<style lang="stylus" scoped>
.img-view-bg
  position fixed
  display flex
  justify-content center
  align-items center
  .img-view
    .img-wrap
      position relative
      max-width 55vw
      height 55vh
      display flex
      justify-content center
      align-items center
      img
        width 100%
        height auto
      .bottom-hint
        margin-top 19px

</style>
