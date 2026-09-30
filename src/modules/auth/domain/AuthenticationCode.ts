import { UserID } from "modules/user/index.js";
import { Secret } from "./Secret.js";
import { Duration } from "./Duration.js";

export class AuthenticationCode {
    // eslint-disable-next-line max-params
    constructor(
        readonly createdAt: Date,
        readonly userId: UserID,
        readonly secret: Secret,
        readonly validDuration: Duration,
    ) {}

    static create(userId: UserID): AuthenticationCode {
        return new AuthenticationCode(
            new Date(),
            userId,
            Secret.create(),
            Duration.parse("2 minutes"),
        );
    }

    get validUntil() {
        return new Date(this.createdAt.getTime() + this.validDuration.inMilliseconds);
    }

    isValid(currentTime: Date) {
        return currentTime < this.validUntil;
    }

    equals(other: AuthenticationCode): boolean {
        return other.secret.equals(this.secret);
    }

    toJSON() {
        return this.secret.toString();
    }
};