<template>
  <transition name="fade">
    <div class="img-view-bg"
      @click.stop="toggle()"
      v-show="value">
      <div class="img-view">
        <div class="img-wrap">
          <transition :name="transitionName"
            class="transition"
            mode="out-in">
            <img :src="img[0]"
              :key="img[0]"
              v-if="currentIndex === 0"
              alt="">
            <img :src="img[1]"
              :key="img[1]"
              v-if="currentIndex === 1"
              alt="">
            <img :src="img[2]"
              :key="img[2]"
              v-if="currentIndex === 2"
              alt="">
          </transition>
        </div>
        <div class="name">{{name}}</div>
        <div class="amount">{{(currentIndex + 1)}}/3</div>
        <i class="material-icons"
          left
          @click.stop="toLeft">chevron_left</i>
        <i class="material-icons"
          right
          @click.stop="toRight">chevron_right</i>
      </div>
    </div>
  </transition>
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
    },
    imgIndex: {
      default () {
        return 0
      },
      required: true
    }
  },
  computed: {
    isShow () {
      return this.value
    }
  },
  watch: {
    value (v) {
      if (v) {
        this.currentIndex = this.imgIndex
      }
    }
  },
  data () {
    return {
      transitionName: 'to-left',
      currentIndex: this.imgIndex
    }
  },
  methods: {
    toggle () {
      this.$emit('input', !this.value)
    },
    toLeft () {
      this.transitionName = 'to-left'
      this.currentIndex = this.currentIndex - 1 === -1 ? this.img.length - 1 : this.currentIndex - 1
    },
    toRight () {
      this.transitionName = 'to-right'
      this.currentIndex = this.currentIndex + 1 === this.img.length ? 0 : this.currentIndex + 1
    }
  }
}
</script>
<style lang="stylus" scoped>
.img-view-bg
  position fixed
  top 0
  left 0
  display flex
  justify-content center
  align-items center
  background-color rgba(#000, 0.5)
  width 100%
  height 100%
  z-index 10
  transition all .5s
  .img-view
    position relative
    width 100%
    display flex
    justify-content center
    user-select none
    i.material-icons
      position absolute
      top 50%
      transform translateY(-50%)
      font-size 80px
      color white
      cursor pointer
      padding 10rem 0
      user-select none
      &[left]
        left 152px
      &[right]
        right 152px
    .name, .amount
      position absolute
      top calc(100% + 19px)
      color white
      font-size 16px
    .amount
      right 30vw
    .name
      left 30vw
    .img-wrap
      position relative
      max-width 55vw
      height 55vh
      display flex
      justify-content center
      align-items center
      img
        max-width 100%
        max-height 100%
      .bottom-hint
        margin-top 19px
.transition
  width 100%
  height 100%
.to-left-enter-active, .to-right-enter-active, .to-left-leave-active, .to-right-leave-active, .fade-enter-active, .fada-leave-active
  transition 0.5s
.fade-enter, .fade-leave-to
  opacity 0

.to-left-enter, .to-right-leave-to
  opacity 0
  transform translateX(-350px)
.to-right-enter, .to-left-leave-to
  opacity 0
  transform translateX(350px)
</style>
