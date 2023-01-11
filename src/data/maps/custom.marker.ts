export default class CustomMarker {
    title: string;
    lat: number;
    lng: number;
    type: string;
    constructor(title: string, lat: number, lng: number, type: string) {
      this.title = title;
      this.lat = lat;
      this.lng = lng;
      this.type = type;
    }
  }