<template>
  <div class="light-box-bg"
    v-if="value"
    @click="$emit('input', false)">
    <div class="light-box"
      @click.stop="datePickerIsShow = false">
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
        v-if="state === flag.Order || state === flag.Ordering">
        <div class="form">
          <span class="label">姓名</span>
          <input type="text">
          <span class="label">電話</span>
          <input type="tel">
          <span class="label">預約起迄</span>
          <span class="input-group">
            <input type="text"
              autocomplete="new"
              autofill=false
              v-model="from"
              @click.stop="fromOnFocus"> ~
            <input type="text"
              autocomplete="new"
              v-model="to"
              autofill=fasle
              @click.stop="toOnFocus">
          </span>
          <DatePicker v-if="datePickerIsShow"
            @add="onAdd"
            @remove="onRemove"
            :selected="selected"
            class="in-form"></DatePicker>
        </div>
        <div class="calculate">
          <div class="row">
            <span>平日時段</span><span>1夜</span>
          </div>
          <div class="row">
            <span>假日時段</span><span>1夜</span>
          </div>
        </div>
        <div class="result">
          <i class="material-icons">
            drag_handle
          </i>
          NT.2850
        </div>
        <div class="btn-row">
          <button class="cancel" @click.stop="onCancel">取消</button>
          <button class="confirm" @click.stop="onConfirm">確定預約</button>
        </div>
      </div>
      <div class="wrap" v-if="state === flag.Success">
        <img class="success" src="../assets/amenities/tick-inside-circle.svg" alt="">
        <br>
        <button class="back" @click="$router.push('/')">回首頁</button>
      </div>
      <div class="wrap" v-if="state === flag.Failed">
        <div class="failed-text">
          預約時間已經被人預訂
        </div>
        <br>
        <button class="back" @click="$emit('input', false)">返回</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DatePicker from './DatePickers.vue'
import { } from 'vuex'

enum flag {
  Order,
  Ordering,
  Failed,
  Success
}

@Component({
  components: {
    DatePicker
  }
})
export default class BookingDialog extends Vue {
  @Prop() value!: Boolean
  private flag = flag
  private state = flag.Order
  private datePickerIsShow = false
  private datePickerTarget = 'from'
  private selected: Set<string> = new Set()
  private from = ''
  private to = ''
  get title () {
    switch (this.state) {
      case flag.Order:
      case flag.Ordering:
        return '預約時段'
      case flag.Failed:
        return '預約失敗'
      case flag.Success:
        return '預約成功'
    }
  }
  fromOnFocus () {
    this.datePickerTarget = 'from'
    this.datePickerIsShow = true
  }
  toOnFocus () {
    this.datePickerTarget = 'to'
    this.datePickerIsShow = true
  }
  onAdd (value: string) {
    if (this.datePickerTarget === 'from') {
      this.from = value
    } else {
      this.to = value
    }
  }
  onRemove (value: string) {
    if (this.datePickerTarget === 'from') {
      this.from = value
    } else {
      this.to = value
    }
  }
  onCancel () {
    this.state = flag.Failed
  }
  onConfirm () {
    this.state = flag.Success
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
      &.cancel
        color #6d7278
        background-color #d8d8d8
.wrap
  text-align center
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
</style>
