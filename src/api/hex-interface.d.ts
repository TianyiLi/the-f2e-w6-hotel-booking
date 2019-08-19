export interface RoomItem {
  /** 房間編號 */
  id: string
  /** 圖片網址 */
  imageUrl: string
  /** 平日價格 */
  normalDayPrice: number
  /** 假日價格 */
  holidayPrice: number
  /** 房間名稱 */
  name: string
}

export interface RoomItemDetail {
  "id": string,
  "name": string,
  "imageUrl": string[],
  "normalDayPrice": number,
  "holidayPrice": number,
  "descriptionShort": {
      "GuestMin": number,
      "GuestMax": number,
      "Bed": string[],
      "Private-Bath": number,
      "Footage": number
  },
  "description": string,
  "checkInAndOut": {
      "checkInEarly": string,
      "checkInLate": string,
      "checkOut": string
  },
  "amenities": {
      "Wi-Fi": boolean,
      "Breakfast": boolean,
      "Mini-Bar": boolean,
      "Room-Service": boolean,
      "Television": boolean,
      "Air-Conditioner": boolean,
      "Refrigerator": boolean,
      "Sofa": boolean,
      "Great-View": boolean,
      "Smoke-Free": boolean,
      "Child-Friendly": boolean,
      "Pet-Friendly": boolean
  }
}

export interface BookingDetail {
  name: string
  tel: string
  date: string
}

export interface BookingPost {
  name: string
  tel: string
  /** Y-m-d */
  date: string[]
}
