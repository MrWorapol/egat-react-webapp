export interface DatarowInterface {
    meterID: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    role: string,
}

export class Datarow implements DatarowInterface {
    meterID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;

    constructor(
        meterID: string,
        fullName: string,
        email: string,
        phoneNumber: string,
        role: string) {
        this.meterID = meterID;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }
}