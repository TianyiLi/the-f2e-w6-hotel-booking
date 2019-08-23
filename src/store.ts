import Vue from 'vue'
import Vuex from 'vuex'
import { RoomItemDetail, BookingDetail } from './api/hex-interface'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roomDetail: {},
    bookingDetail: [{}]
  },
  mutations: {

  },
  actions: {
    setRoomDetail ({ state }, roomDetail: RoomItemDetail) {
      state.roomDetail = roomDetail
    },
    setBookingDetail ({ state }, bookingDetail: BookingDetail[]) {
      state.bookingDetail = bookingDetail
    }
  }
})
