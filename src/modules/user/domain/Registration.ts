import { Equatable } from "common/Equatable";
import { EmailAddress } from "./EmailAddress";
import { UUID } from "./UUID";

export class Registration implements Equatable<Registration> {
    constructor(
        public readonly id: UUID,
        public readonly email: EmailAddress,
        public readonly userName: string,
    ){}

    static create(email: EmailAddress, userName: string): Registration {
        const id = UUID.create();
        return new Registration(id, email, userName);
    }

    equals(other: Registration): boolean {
        return this.id.equals(other.id);
    }
}