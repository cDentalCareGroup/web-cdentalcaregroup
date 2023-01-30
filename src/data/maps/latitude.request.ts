export class UpdateLatLngRequest {
    lat: number;
    lng: number;
    patientId: number;

    constructor(lat: number,
        lng: number,
        patientId: number) {
        this.lat = lat;
        this.lng = lng;
        this.patientId = patientId;
    }
}