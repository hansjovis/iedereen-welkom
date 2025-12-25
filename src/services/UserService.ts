import { User } from "../actors/User";
import { EmailAddress } from "values/EmailAddress";
import { Unauthorized } from "exceptions/Unauthorized";
import { UserRepository } from "repositories/UserRepository";
import { NotFound } from "exceptions/NotFound";
import { UnsafeCredentials, ProtectedCredentials } from "authorization/Credentials";

export interface Registration {
    userName: string,
    email: EmailAddress,
}

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    register(registration: Registration): User {
        const user = new User({
            userName: registration.userName,
            name: registration.userName,
            email: registration.email,
            summary: `Hello, my name is ${registration.userName}!`
        });

        this.userRepository.save(user);

        return user;
    }

    activate(emailAddress: EmailAddress, credentials: ProtectedCredentials[]) {
        const user = this.userRepository.retrieveByEmail(emailAddress);

        if (user === undefined) {
            throw new NotFound(`User with email address "${emailAddress}" could not be found.`);
        }

        user.activate(credentials);

        this.userRepository.save(user);
    }

    login(emailAddress: EmailAddress, credentials: UnsafeCredentials[]) {
        const user: User|undefined = this.userRepository.retrieveByEmail(emailAddress);

        if (user === undefined) {
            throw new Unauthorized();
        }

        if (user.isActivated === false) {
            throw new Unauthorized();
        }

        if(user.validateEnteredCredentials(credentials) === false) {
            throw new Unauthorized();
        };

        return true;
    }
}