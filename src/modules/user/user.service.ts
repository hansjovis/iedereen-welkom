// Dependencies from other modules
import { Unauthorized, NotFound } from "exceptions";
import { UnsafeCredentials, ProtectedCredentials } from "authorization/Credentials";
// Local dependencies
import { User, EmailAddress, Registration } from "./domain";
import { UserRepository } from "./user.repository";
import { RegistrationRepository } from "./registration.repository";
import { UUID } from "./domain/UUID";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly registrationRepository: RegistrationRepository,
    ) {}

    register(email: EmailAddress, userName: string): Registration {
        const registration = Registration.create(email, userName);
        this.registrationRepository.save(registration);
        return registration;
    }

    activate(id: UUID, credentials: ProtectedCredentials[]): User {
        const registration = this.registrationRepository.retrieve(id);
        if (registration === undefined) {
            throw new NotFound(`Registration with id "${id}" could not be found.`);
        }

        const user = User.create(registration.email, registration.userName);

        user.activate(credentials);

        this.userRepository.save(user);

        return user;
    }

    login(emailAddress: EmailAddress, credentials: UnsafeCredentials[]): boolean {
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