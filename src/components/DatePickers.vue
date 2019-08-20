<template>
  <div class="date-wrapper">
    <div class="row"
      v-for="(row, i) in currentCalender"
      :key="i">
      <button class="col"
        v-for="(col, j) in row"
        :value="col.value"
        :disabled="col.isBefore"
        :key="j">{{col.display}}
      </button>
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
  }) disabled!: string[]
  private selected: Set<string> = new Set()
  private stands = dayjs()
  private toDay = dayjs()
  get monthIndex () {
    return this.stands.get('month') + 1
  }
  get yearIndex () {
    return this.stands.get('y')
  }
  get currentCalender () {
    let start = this.stands.startOf('month')
    let end = this.stands.endOf('month')
    let range = Array.from({ length: end.get('date') - start.get('date') + 1 }).map((_, i) => {
      let d = start.add(i, 'day')
      return {
        value: d.format('YYYY-MM-DD'),
        display: '' + d.get('date'),
        week: d.get('day'),
        isBefore: d.isBefore(this.toDay)
      }
    })
    let padding = range[0].week === 0 ? 0 : range[0].week
    let pending = 6 - range[range.length - 1].week === 6 ? 0 : 6 - range[range.length - 1].week
    console.log(padding, pending)
    return chunk([...Array(padding).fill({ value: '', display: '0', week: -1, isBefore: true }), ...range, ...Array(pending).fill({ value: '', display: '0', week: -1 })], 7)
  }
}
</script>
