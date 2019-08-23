<template>
  <div class="light-box-bg" @click.stop="datePickerIsShow = false">
    <div class="light-box">
      <div class="title">{{title}}</div>
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
      <div class="wrap"
        v-if="state === flag.Order">
        <div class="form">
          <span class="label">姓名</span>
          <!-- <input type="text"> -->
          <tInput :validate="nameValidate"
            v-model="name"
            required
            :error="nameHasError"
            type="string"></tInput>
          <span class="label">電話</span>
          <tInput :validate="phoneValidate"
            v-model="phone"
            required
            :error="phoneHasError"
            type="tel"></tInput>
          <span class="label">預約起迄</span>
          <span class="input-group">
            <tInput type="text"
              autocomplete="new"
              autofill=false
              v-model="from"
              required
              :error="dateHasError"
              :validate="dateValidate"
              @click.native.stop="fromOnFocus"/> ~
            <tInput type="text"
              autocomplete="new"
              v-model="to"
              autofill=fasle
              required
              :error="dateHasError"
              :validate="dateValidate"
              @click.native.stop="toOnFocus"/>
          </span>
        </div>
        <div class="calculate">
          <div class="row">
            <span>平日時段</span><span>{{getNoramlDay()}}夜</span>
          </div>
          <div class="row">
            <span>假日時段</span><span>{{getHoliday()}}夜</span>
          </div>
        </div>
        <div class="result">
          <i class="material-icons">
            drag_handle
          </i>
          NT.{{getCountingPrice()}}
        </div>
        <div class="btn-row">
          <button class="cancel"
            @click.stop="onCancel">取消</button>
          <button class="confirm"
            @click.stop="onConfirm" :disabled="confirmIsDisabled">確定預約</button>
        </div>
        <DatePicker v-if="datePickerIsShow"
            :disabledDate="disabledDate"
            @add="onAdd"
            @remove="onRemove"
            :selected="selected"
            class="in-form"></DatePicker>
      </div>
      <div class="wrap" v-if="state === flag.Ordering">
        <div class="ordering">
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
      </div>
      <div class="wrap"
        v-if="state === flag.Success">
        <img class="success"
          src="../assets/amenities/tick-inside-circle.svg"
          alt="">
        <br>
        <button class="back"
          @click="$router.push('/')">回首頁</button>
      </div>
      <div class="wrap"
        v-if="state === flag.Failed">
        <div class="failed-text">
          預約時間已經被人預訂
        </div>
        <br>
        <button class="back"
          @click="state = flag.Order">返回</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DatePicker from './DatePickers.vue'
import { State } from 'vuex-class'
import dayjs, { Dayjs } from 'dayjs'
import { BookingDetail, RoomItemDetail } from '../api/hex-interface'
import tInput from './Input'
import { postBookingRoom } from '../api/hex'

enum flag {
  Order,
  Ordering,
  Failed,
  Success
}

@Component({
  components: {
    DatePicker,
    tInput
  }
})
export default class BookingDialog extends Vue {
  private flag = flag
  private state = flag.Order
  private datePickerIsShow = false
  private datePickerTarget = 'from'
  private selected: Set<string> = new Set()
  private name = ''
  private nameHasError = false
  private phone = ''
  private phoneHasError = false
  private from = ''
  private to = ''

  public dateHasError = false

  @State('bookingDetail') bookingDetail!: BookingDetail[]
  @State('roomDetail') roomDetail!: RoomItemDetail

  get title () {
    switch (this.state) {
      case flag.Order:
        return '預約時段'
      case flag.Ordering:
        return '預約中'
      case flag.Failed:
        return '預約失敗'
      case flag.Success:
        return '預約成功'
    }
  }
  getHoliday () {
    return [...this.selected].reduce((prev, curr) => (prev += dayjs(curr).get('day') % 6 === 0 ? 1 : 0), 0)
  }
  getNoramlDay () {
    return [...this.selected].reduce((prev, curr) => (prev += dayjs(curr).day() % 6 === 0 ? 0 : 1), 0)
  }

  getCountingPrice () {
    return this.getHoliday() * this.roomDetail.holidayPrice + this.getNoramlDay() * this.roomDetail.normalDayPrice
  }

  get disabledDate () {
    return this.bookingDetail.map(ele => ele.date)
  }

  get confirmIsDisabled () {
    return (this.nameHasError || this.phoneHasError || this.dateHasError)
  }
  fromOnFocus () {
    this.datePickerTarget = 'from'
    this.datePickerIsShow = true
  }
  toOnFocus () {
    this.datePickerTarget = 'to'
    this.datePickerIsShow = true
  }
  fillSelect () {
    if (!this.selected.has(this.from)) this.selected.add(this.from)
    if (!this.selected.has(this.to)) this.selected.add(this.to)
    let from = dayjs(this.from)
    let to = dayjs(this.to)
    let tmp: Dayjs = from.clone()
    while (!tmp.add(1, 'day').isSame(to)) {
      this.selected.add(tmp.add(1, 'day').format('YYYY-MM-DD'))
      tmp = tmp.add(1, 'day')
    }
  }
  onAdd (value: string) {
    if (this.datePickerTarget === 'from') {
      if (!this.to) {
        this.from = value
        this.to = value
      } else if (this.to && dayjs(this.to).isAfter(value)) {
        this.from = value
        this.fillSelect()
      } else {
        alert('input incorrect')
      }
      this.selected.add(value)
    } else {
      if (!this.from) {
        this.to = value
      } else if (this.from && dayjs(this.from).isBefore(value)) {
        this.to = value
        this.fillSelect()
      } else {
        alert('Input incorrect')
      }
    }
    this.datePickerIsShow = false
    this.dateValidate()
    this.$forceUpdate()
  }
  onRemove (value: string) {
    if (this.datePickerTarget === 'from') {
      this.from = ''
      this.selected.clear()
      this.to !== '' && this.selected.add(this.to)
    } else {
      this.to = value
      this.selected.delete(value)
      this.selected.clear()
      this.from !== '' && this.selected.add(this.from)
    }
    this.datePickerIsShow = false
    this.$forceUpdate()
  }

  nameValidate (value: string) {
    this.nameHasError = value === ''
  }

  phoneValidate (value: string) {
    this.phoneHasError = value === ''
  }

  dateValidate () {
    this.dateHasError = this.from === '' || this.to === ''
  }

  validate () {
    this.nameValidate(this.name)
    this.phoneValidate(this.phone)
    this.dateValidate()
    if (!(this.nameHasError || this.phoneHasError || this.dateHasError)) {
      return true
    }
    return false
  }

  async runSubmit () {
    this.state = flag.Ordering
    let data = await postBookingRoom({
      name: this.name,
      tel: this.phone,
      date: [...this.selected]
    }, this.roomDetail.id)
    if (data instanceof Error) {
      console.error(data.message)
      this.state = flag.Failed
    } else if (!data.success) {
      this.state = flag.Failed
    } else {
      this.state = flag.Success
    }
  }

  async onCancel () {
    this.$emit('close')
  }
  onConfirm () {
    if (this.validate()) {
      this.runSubmit()
    }
  }
}
</script>
<style lang="stylus" scoped>
i
  vertical-align middle
button
  cursor pointer
.light-box-bg
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 10
  transition all 0.5s
  display flex
  justify-content center
  align-items center
  background-color rgba(#000, 0.6)
  .light-box
    font-family 'Noto Sans TC'
    display inline-block
    position relative
    width 423px
    background-color #fff
    text-align left
    overflow-x hidden
    .in-form
      position fixed
      top 70%
      left 50%
      transform translate(-50%, -50%) scale(0.8)
      box-shadow 0 2px 10px 0 black
    .title, .seperate, .form, .result, .btn-row
      margin-left 42px
      margin-right 42px
    .title
      font-size 24px
      margin-top 27px
      margin-bottom 12px
    .seperate
      i
        transform rotate(45deg)
    .form
      margin 29px 42px
      display grid
      grid-template-areas 'auto auto'
      align-items center
      .label
        width 95px
        font-size 14px
        margin-bottom 17px
        text-align left
      &>input
        margin-bottom 17px
        width 243px
      .input-group
        width 243px
        margin-bottom 17px
        display flex
        justify-content space-between
        align-items center
        input
          width 91px
      input
        text-align center
        height 32px
        font-size 12px
        border-radius 5px
        border 1px solid #c9c9c9
    .calculate
      box-sizing border-box
      padding 15px 42px 18px
      background-color #ededed
      color #6d7278
      font-size 12px
      .row
        display flex
        justify-content space-between
    .result
      text-align right
      font-size 26px
      color #ff5c5c
      margin-top 8px
      i
        margin-right 2em
    .btn-row
      display flex
      justify-content space-between
      margin-top 29px
      margin-bottom 34px
    button
      padding 8px 21px 9px
      font-size 14px
      border unset
      &.confirm
        color white
        background-color #484848
        &[disabled="disabled"]
          opacity 0.7
          cursor not-allowed
      &.cancel
        color #6d7278
        background-color #d8d8d8
    input.error
      border-color red
.wrap
  text-align center
  .ordering
    margin 4.1rem 0 6rem
  img.success
    width 60px
    margin 10px auto 25px
  button.back
    float right
    color white
    background-color #484848
    margin-left 42px
    margin-right 42px
    margin-bottom 42px
  .failed-text
    text-align left
    font-size 14px
    margin-left 42px
    margin-top 24px
    margin-bottom 31px
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
