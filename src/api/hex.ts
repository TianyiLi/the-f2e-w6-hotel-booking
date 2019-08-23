import axios from 'axios'
import { RoomItem, BookingPost, RoomItemDetail, BookingDetail } from './hex-interface'

const headers = {
  Authorization: 'Bearer ' + process.env.VUE_APP_SECRET,
  'Content-type': 'application/json',
  Accept: 'application/json'
}
const api = 'https://challenge.thef2e.com/api/thef2e2019/stage6'

function getAllRooms (): Promise<{ success: boolean, items: RoomItem[] } | Error> {
  return axios.get(api + '/rooms', { headers }).then(res => res.data).catch(err => Error(err))
}

function getRoomDetail (id: string): Promise<{ success: boolean, room: RoomItemDetail[], booking: BookingDetail[] } | Error> {
  return axios.get(api + '/room/' + id, { headers }).then(res => res.data).catch(err => Error(err))
}

function postBookingRoom (detail: BookingPost, id: string): Promise<{ success: boolean, room: RoomItemDetail[], booking: Boolean[] } | Error> {
  return axios.post(api + '/room/' + id, detail, { headers, responseType: 'json' }).then(res => res.data).catch(err => Error(err))
}

function deleteBooking (): Promise<{ success: boolean } | Error> {
  return axios.delete(api + '/rooms', {
    headers,
    responseType: 'json'
  }).then(res => res.data)
    .catch(err => Error(err))
}

export {
  getAllRooms,
  getRoomDetail,
  postBookingRoom,
  deleteBooking
}
