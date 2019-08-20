<template>
  <div class="about">
    <h1>This is an about page</h1>
    <DatePicker></DatePicker>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomItemDetail, BookingDetail } from '../api/hex-interface'
import { getRoomDetail } from '../api/hex'
import DatePicker from '@/components/DatePickers.vue'
@Component({
  components: {
    DatePicker
  }
})
export default class About extends Vue {
  @Prop() id!: string
  private isLoading = true
  private roomDetail: RoomItemDetail[] = []
  private bookingDetail: BookingDetail[] = []
  private hasError = false
  async created () {
    let data = await getRoomDetail(this.id)
    if (data instanceof Error) {
      console.error(data.message)
      this.hasError = true
    } else {
      if (data.success) {
        this.roomDetail = data.room
        this.bookingDetail = data.booking
      } else {
        this.hasError = true
        console.log(data)
      }
    }
  }
}
</script>
