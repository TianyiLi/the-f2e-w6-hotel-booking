<template>
  <div class="home">
    <template v-for="(ele, i) in (!isLoading ? items : [])">
      <transition mode="out-in"
        :key="i"
        name="slide">
        <img :src="ele.imageUrl"
          v-show="ele.id === activeItem.id"
          class="bg"
          alt="">
      </transition>
    </template>
    <transition mode="out-in">
      <div class="wrap"
        v-if="!isLoading">
        <div class="white-space-logo"><span>White</span><span>Space</span></div>
        <div class="room-index">{{roomIndex}}</div>
        <div class="room-name">{{activeItem.name}}</div>
        <div class="social-media">
          <img src="@/assets/facebook-square-brands.svg"
            alt="">
          <img src="@/assets/instagram-brands.svg"
            alt="">
        </div>
        <div class="contact">
          <span class="phone"><i class="material-icons">call</i>02-17264937</span>
          <span class="mail"><i class="material-icons">email</i>whitespace@whitespace.com.tw</span>
          <span class="address"><i class="material-icons">home</i>臺北市羅斯福路十段30號</span>
        </div>
        <div class="side-bar">
          <div @click.stop="sideBarOnClick(ele.id)"
            @mouseover="sideBarOnHover(i)"
            v-for="(ele, i) in items"
            class="side-bar-li"
            :key="i">{{ele.name}}</div>
        </div>
      </div>
      <div class="container"
        v-if="isLoading">
        <svg viewBox="0 0 32 32"
          width="32"
          height="32">
          <circle id="spinner"
            cx="16"
            cy="16"
            r="14"
            fill="none"></circle>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomItem } from '@/api/hex-interface'
import { getAllRooms } from '@/api/hex'

@Component({
})
export default class Home extends Vue {
  private items: RoomItem[] = []
  private hasError = false
  private currentRoomIndex = 1
  private isLoading = true
  private activeItem: RoomItem = {
    id: '',
    imageUrl: '',
    normalDayPrice: 0,
    holidayPrice: 0,
    name: ''
  }
  get roomIndex () {
    return '0' + this.currentRoomIndex
  }
  async beforeCreate () {
    let data = await getAllRooms()
    if (data instanceof Error) {
      console.error(data.message)
      this.hasError = true
      return false
    } else {
      if (data.success) {
        this.items = data.items
        this.activeItem = data.items[0]
      } else {
        this.hasError = true
        console.error(data)
      }
      this.isLoading = false
    }
  }
  sideBarOnHover (id: number) {
    let item = this.items[id]
    this.currentRoomIndex = id + 1
    if (item) {
      this.activeItem = item
    }
  }
  sideBarOnClick (id: string) {
    this.$router.push('/about/' + id)
  }
}
</script>
<style lang="stylus" scoped>
size($w, $h = $w)
  width $w
  height $h
zebra()
  background-image repeating-linear-gradient(45deg, rgba(white), rgba(white) 0.8px, rgba(255, 255, 255, 0.25) 0, rgba(255, 255, 255, 0.25) 6px)
.home
  size 100%
  position relative
  overflow hidden
  box-sizing border-box
  background-color #000
.slide-enter-active, .slide-leave-active
  transition all 0.5s
.slide-enter
  opacity 0
  transform translateX(calc(-50% + 230px))
.slide-leave-to
  opacity 0
  transform translateX(calc(-50% - 230px))
img.bg
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
.wrap
  position relative
  z-index 1
  font-family 'Noto Sans TC'
  size 100%
  .side-bar
    position absolute
    right 0
    top 50px
  .white-space-logo
    size 148px
    color white
    display flex
    justify-content center
    align-items center
    flex-direction column
    margin-top 62px
    margin-left 68px
    background-color #dadada
    border 2px solid #fff
    font-size 31px
    line-height 44px
    position relative
    &:before
      z-index -1
      content ''
      position absolute
      width 100%
      height 100%
      top -15px
      left -15px
      zebra()
  .room-index
    position absolute
    display flex
    justify-content center
    align-items center
    color white
    font-size 66px
    size 86px 76px
    left 68px
    top 622px
    &:before
      content ''
      position absolute
      height 20px
      width 100%
      zebra()
      left 0
      bottom 0
  .room-name
    position absolute
    left 68px
    font-size 24px
    color white
    letter-spacing 2.51px
    top 693px
  .contact
    color white
    position absolute
    right 30px
    font-size 14px
    top 640px
    display flex
    justify-content center
    align-items flex-start
    flex-direction column
    &>span
      margin 8px 0
      i
        vertical-align middle
        margin-right 11px
  .side-bar
    position absolute
    background-color #fff
    color black
    font-size 14px
    letter-spacing 1.46px
    display flex
    flex-direction column
    justify-content space-between
    align-items flex-start
    box-sizing border-box
    padding 37px 112px 62px 34px
    height 404px
    &:before
      z-index -1
      content ''
      position absolute
      width 100%
      height 100%
      top 15px
      left 15px
      zebra()
    .side-bar-li
      position relative
      cursor pointer
      padding 9% 0
      &:after
        content ''
        left -34px
        height 1px
        width 0px
        background-color #000
        position absolute
        top 50%
        transition 0.3s linear
      &:hover:after
        width 23px
  .social-media
    display inline-block
    position absolute
    white-space nowrap
    top 571px
    right 222px
    img
      size 21px
      margin 5px
.container
  position absolute
  left 50%
  top 50%
  transform translate(-50%, -50%)
#spinner
  box-sizing border-box
  stroke #673AB7
  stroke-width 3px
  transform-origin 50%
  -webkit-animation line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite, rotate 1.6s linear infinite
@keyframes rotate
  from
    transform rotate(0)
  to
    transform rotate(450deg)
@keyframes line
  0%
    stroke-dasharray 2, 85.964
    transform rotate(0)
  50%
    stroke-dasharray 65.973, 21.9911
    stroke-dashoffset 0
  100%
    stroke-dasharray 2, 85.964
    stroke-dashoffset -65.973
    transform rotate(90deg)
</style>
