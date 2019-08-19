<template>
  <div id="app">

    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomItem } from './api/hex-interface'
import { getAllRooms } from './api/hex'
@Component({
  components: {
  }
})
export default class App extends Vue {
  private items: RoomItem[] = []
  private hasError = false
  private activeItem: RoomItem = {
    id: '',
    imageUrl: '',
    normalDayPrice: 0,
    holidayPrice: 0,
    name: ''
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
    }
  }
  sideBarOnHover (id: number) {
    let item = this.items[id]
    if (item) {
      this.activeItem = item
    }
  }
  sideBarOnClick (id: string) {

  }
}
</script>
<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+TC|Roboto&display=swap')
*
  margin 0
  padding 0
size($w, $h = $w)
  width $w
  height $h
html, body
  margin 0
  padding 0
  size 100%
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  size 100%
  background-size cover
  background-color #fff
</style>
