<template>
  <transition name="fade" mode="out-in">
    <div class="container"
      id="loading-ctn"
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
    <div class="about"
      v-else>
      <div class="img-banner">
        <div :key="i"
          v-for="(img, i) in roomImg">
          <img :src="img"
            @mousemove="imgOnMouseOver($event)"
            @mouseleave="imgOnMouseLeave($event)"
            @click.stop="imgOnClick(i)"
            alt="">
        </div>
      </div>
      <Logo class="logo"></Logo>
      <div class="context">
        <div class="left-block">
          <h1>{{name}}</h1>
          <div class="info">
            <div class="li">房客人數限制：{{info.GuestMin + ' ~ ' + info.GuestMax}}人</div>
            <div class="li">床型：{{bed}}</div>
            <div class="li">衛浴數量：{{info['Private-Bath']}}間</div>
            <div class="li">房間大小：{{info.Footage}}平方公尺</div>
          </div>
          <div class="detail">{{detail}}</div>
          <div class="seperate">
            <i class="material-icons">
              remove
            </i>
            <i class="material-icons">
              remove
            </i>
            <i class="material-icons">
              remove
            </i>
          </div>
          <span class="check-in">
            <span class="label">Check In</span>
            <span class="time">
              {{checkInTime[0]}}
              <i class="material-icons">
                remove
              </i>
              {{checkInTime[1]}}
            </span>
          </span>
          <span class="check-out">
            <span class="label">Check Out</span>
            <span class="time">
              {{checkOutTime}}
            </span>
          </span>
          <div class="amenities">
            <div class="amenity"
              v-for="(ele, i) in amenities"
              :key="i"
              :enabled="ele.value">
              <img :src="ele.img"
                alt="">
              <span class="tag">{{ele.tag}}</span>
            </div>
          </div>
        </div>
        <div class="middle-block">
          <div class="normal-day-price">NT.{{normalDayPrice}}</div>
          <div class="normal-day">平日(一~四)</div>
          <div class="holiday-price">NT.{{holidayPrice}}</div>
          <div class="holiday">假日(五~日)</div>
        </div>
        <div class="right-block">
          <DatePicker :disabledDate="disabledDate"></DatePicker>
          <div class="order"
            @click="bookingDialogIsShow = true">預約時段</div>
        </div>
      </div>
      <BookingDialog :disabled="disabledDate"
        @close="bookingDialogIsShow = false"
        v-if="bookingDialogIsShow"></BookingDialog>
      <img-viewer v-model="imgViewerIsShow"
        :img="roomImg"
        :name="name"
        :imgIndex="imgViewerIndex"></img-viewer>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { RoomItemDetail, BookingDetail } from '../api/hex-interface'
import { getRoomDetail } from '../api/hex'
import ImgViewer from '@/components/ImgView.vue'
/* eslint-disable-next-line */
import Logo from '@/components/svg/LogoBlock.vue'
import DatePicker from '@/components/DatePickers.vue'
import BookingDialog from '@/components/BookingDialog.vue'
const amenitiesImg = require.context('@/assets/amenities')
const amenitiesDict = new Map([
  ['airConditioner', '空調'],
  ['breakfast', '早餐'],
  ['childFriendly', '適合兒童'],
  ['greatView', '漂亮的視野'],
  ['miniBar', 'Mini Bar'],
  ['petFriendly', '寵物攜帶'],
  ['refrigerator', '冰箱'],
  ['roomService', 'Room Service'],
  ['smokeFree', '禁止吸菸'],
  ['sofa', '沙發'],
  ['television', '電視'],
  ['wifi', 'Wi-Fi']
])

@Component({
  components: {
    DatePicker,
    Logo,
    ImgViewer,
    BookingDialog
  }
})
export default class About extends Vue {
  @Prop() id!: string
  @Action('setRoomDetail') setRoomDetail!: (roomDetail: RoomItemDetail) => void
  @Action('setBookingDetail') setBookingDetail!: (bookingDetail: BookingDetail[]) => void
  private bookingDialogIsShow = false
  private isLoading = true
  @State('roomDetail') roomDetail!: RoomItemDetail
  @State('bookingDetail') bookingDetail!: BookingDetail[]
  private imgViewerIsShow = false
  private imgViewerIndex = 0
  private hasError = false

  get roomImg () {
    let result: string[] = []
    if (this.isLoading) return result
    result = this.roomDetail.imageUrl
    return result
  }

  get name () {
    if (this.isLoading) return ''
    return this.roomDetail.name
  }

  get info () {
    if (this.isLoading) {
      return {
        GuestMin: '',
        GuestMax: '',
        Bed: '',
        'Private-Bath': '',
        Footage: ''
      }
    }
    return this.roomDetail.descriptionShort
  }

  get bed () {
    if (this.isLoading) return ''
    return this.roomDetail.descriptionShort.Bed.join(' ,')
  }

  get detail () {
    if (this.isLoading) return ''
    return this.roomDetail.description
  }

  get checkInTime () {
    if (this.isLoading) return ['', '']
    let { checkInEarly, checkInLate } = this.roomDetail.checkInAndOut
    return [checkInEarly, checkInLate]
  }

  get checkOutTime () {
    if (this.isLoading) return ''
    return this.roomDetail.checkInAndOut.checkOut
  }

  get normalDayPrice () {
    if (this.isLoading) return ''
    return this.roomDetail.normalDayPrice
  }
  get holidayPrice () {
    if (this.isLoading) return ''
    return this.roomDetail.holidayPrice
  }

  get disabledDate () {
    if (this.isLoading) return []
    return this.bookingDetail.map(ele => ele.date)
  }

  amenitiesFormat (amenities: {}) {
    return Object.entries(amenities).map(([key, value]) => {
      let k = key === 'Wi-Fi' ? 'wifi' : key.replace('-', '').replace(/^(.)/, x => x[0].toLowerCase())
      if (k === 'smokeFree') value = !value
      return {
        key: k,
        value,
        img: amenitiesImg(`./${k}.svg`),
        tag: amenitiesDict.get(k)
      }
    })
  }

  get amenities () {
    if (this.isLoading) {
      return this.amenitiesFormat({
        'Wi-Fi': false,
        'Breakfast': false,
        'Mini-Bar': false,
        'Room-Service': false,
        'Television': false,
        'Air-Conditioner': false,
        'Refrigerator': false,
        'Sofa': false,
        'Great-View': false,
        'Smoke-Free': false,
        'Child-Friendly': false,
        'Pet-Friendly': false
      })
    }
    return this.amenitiesFormat(this.roomDetail.amenities)
  }

  async mounted () {
    let data = await getRoomDetail(this.id)
    if (data instanceof Error) {
      console.error(data.message)
      this.hasError = true
    } else {
      if (data.success) {
        this.setRoomDetail(data.room[0])
        this.setBookingDetail(data.booking)
        this.isLoading = false
      } else {
        this.hasError = true
        console.log(data)
      }
    }
  }
  imgOnMouseOver (ev: { offsetX: number, offsetY: number, target: HTMLElement }) {
    let dom: HTMLElement = ev.target
    dom.classList.add('scale')
    dom.setAttribute('style', `transform-origin: ${ev.offsetX}px ${ev.offsetY}px`)
  }
  imgOnMouseLeave (ev: { target: HTMLElement }) {
    ev.target.classList.remove('scale')
    ev.target.setAttribute('style', '')
  }
  imgOnClick (imgIndex: number) {
    this.imgViewerIsShow = true
    this.imgViewerIndex = imgIndex
  }
}
</script>
<style lang="stylus" scoped>
.about
  font-family 'Noto Sans TC'
  .context
    margin 0 auto
    max-width 1200px
    @media (max-width 768px)
      width 100%
  .img-banner
    height 596px
    width 100%
    display grid
    grid-template-columns repeat(3, 1fr)
    box-shadow 0 0px 1.5rem gray
    &> div
      overflow hidden
    & > div img
      max-width 100%
      max-height 100%
    img
      object-fit cover
      object-position center
      width 100%
      height auto
      transition 0.5s
      cursor pointer
      &.scale
        transition 0s
        transform scale(1.5)
    div:nth-child(1)
      grid-row 1 / 3
      grid-column 1 / 3
      @media (max-width: 1376px)
        img
          height 100%
          width auto
  .logo
    position absolute
    left 49px
    top 32px
  .context
    box-sizing border-box
    padding 47px 62px 100px
    display flex
    justify-content space-between
    .left-block
      display inline-block
      width 481px
      h1
        font-size 36px
    .middle-block
      display inline-block
      width 129px
    .right-block
      display inline-block
      width 400px
  .info
    margin 31px 0
    font-size 14px
    line-height 31px
    letter-spacing 1.5px
  .detail
    font-size 12px
    text-align justify
    line-height 20px
  .check-in, .check-out
    display inline-flex
    flex-direction column
    margin-bottom 40px
    i
      vertical-align middle
    .label
      font-size 14px
    .time
      font-size 21px
  .seperate
    margin 30px 0
    i
      transform rotate(45deg)
  .check-in
    margin-right 96px
  .amenities
    display grid
    align-items center
    grid-template-columns repeat(3, 1fr)
    background-color #f0f0f0
    box-sizing border-box
    padding 26px
    padding 21px
    width 482px
    height 221px
    .amenity
      height 21px
      opacity 0.4
      &[enabled]
        opacity 1
      img
        width 21px
        height 100P
        vertical-align middle
        margin-right 5px
  .middle-block
    text-align right
    font-weight lighter
    .normal-day-price
      font-size 30px
    .holiday-price
      font-size 16px
      height 27px
    .normal-day, .holiday
      height 27px
      margin-bottom 16px
      font-size 14px
      color #6d7278
  .right-block
    position relative
    z-index 1
    .order
      margin-top 26px
      padding 13px 23px 16px 24px
      font-size 16px
      color white
      background-color #575757
      position relative
      display inline-block
      cursor pointer
      user-select none
      &:before
        content ''
        position absolute
        width 100%
        height 100%
        background-image repeating-linear-gradient(45deg, rgba(gray), rgba(gray) 1px, rgba(255, 255, 255, 0.25) 0, rgba(255, 255, 255, 0.25) 4px)
        top 8px
        left 6px
        z-index -1
      &:active
        margin-top 29px
        &:before
          top 4px
.fade-enter-active, .fade-leave-active
  transition opacity .5s
.fade-enter, .fade-leave-to
  opacity 0
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
#loading-ctn
  position fixed
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background-color #fff
</style>
