<template>
  <div class="date-wrapper" @click.stop>
    <div class="date-picker">
      <div class="nav">
        <i class="material-icons"
          @click="backwardOnClick">
          chevron_left
        </i>
        <span class="year-and-month">
          {{yearIndex + ' / ' + monthIndex}}
        </span>
        <i class="material-icons"
          @click="forwardOnClick">
          chevron_right
        </i>
      </div>
      <table class="date-table">
        <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          <tr class="row"
            v-for="(row, i) in getCurrentCalender()"
            :key="i">
            <td class="col"
              v-for="(col, j) in row"
              :value="col.value"
              :disabled="col.disabled"
              :is-before="col.isBefore"
              :class="selected.has(col.value) ? 'active' : ''"
              @click.prevent="dateOnClick(col)"
              :key="j">
              {{col.display}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { chunk } from 'lodash'

@Component
export default class DatePicker extends Vue {
  @Prop({
    default () { return [] }
  }) disabledDate!: string[]

  @Prop({ default () { return new Set() } }) selected!: Set<string>
  private stands = dayjs()
  private toDay = dayjs()
  get monthIndex () {
    return this.stands.get('month') + 1
  }
  get yearIndex () {
    return this.stands.get('y')
  }
  getCurrentCalender () {
    let start = this.stands.startOf('month')
    let end = this.stands.endOf('month')
    let range = Array.from({ length: end.get('date') - start.get('date') + 1 }).map((_, i) => {
      let d = start.add(i, 'day')
      return {
        value: d.format('YYYY-MM-DD'),
        display: '' + d.get('date'),
        week: d.get('day'),
        isBefore: d.isBefore(this.toDay),
        disabled: !!~this.disabledDate.indexOf(d.format('YYYY-MM-DD'))
      }
    })
    let padding = range[0].week === 0 ? 0 : range[0].week
    let pending = 6 - range[range.length - 1].week === 6 ? 0 : 6 - range[range.length - 1].week
    return chunk([...Array(padding).fill({ value: '', display: '', week: -1, isBefore: true }), ...range, ...Array(pending).fill({ value: '', display: '', week: -1 })], 7)
  }
  forwardOnClick () {
    this.stands = this.stands.add(1, 'month')
  }
  backwardOnClick () {
    if (!dayjs().isBefore(this.stands.subtract(1, 'month').endOf('month'))) {
      return false
    } else {
      this.stands = this.stands.subtract(1, 'month')
    }
  }
  dateOnClick (col: { value: string, display: string, week: number, isBefore: boolean, disabled: boolean }) {
    if (col.isBefore || col.disabled) return false
    console.log(col.value)
    if (!this.selected.has(col.value)) {
      this.$emit('add', col.value)
    } else {
      this.$emit('remove', col.value)
    }
  }
}
</script>
<style lang="stylus" scoped>
size($w, $h = $w)
  width $w
  height $h
i
  vertical-align middle
  cursor pointer
  user-select none
  transition all 0.6s
  &:active
    background-color rgba(black, 0.3)
.date-wrapper
  display inline-block
  font-family 'Noto Sans TC'
  background-color #f7f7f7
  box-shadow 0 2px 10px 0 rgba(0, 0, 0, 0.15)
  box-sizing border-box
  padding-top 30px
.date-picker
  display inline-block
  text-align center
  size 383px
  .nav
    size 100% 27px
    display flex
    justify-content space-between
    box-sizing border-box
    padding 0 31px
    font-size 18px
  table
    width 383px
    box-sizing border-box
    padding 19px 31px 44px
    border-spacing 0px
    th
      font-size 18px
      padding-bottom 27px
    td
      size 31px
      font-size 14px
      padding 11px 0
      cursor pointer
      user-select none
      &[disabled='disabled']
        background-image repeating-linear-gradient(45deg, rgba(#c2c2c2), rgba(#c2c2c2) 0.8px, rgba(255, 255, 255, 0.25) 0, rgba(255, 255, 255, 0.25) 4px)
      &[is-before='true']
        color #C9CCD0
      &:hover:not([disabled='disabled'])
        background-color rgba(0, 0, 0, 0.5)
        color white
      &.active
        background-color rgba(0, 0, 0, 0.3)
        color white
</style>
