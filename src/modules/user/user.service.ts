// Dependencies from other modules
import { NotFound, Unauthorized } from "exceptions";
import { UnsafeCredentials, ProtectedCredentials } from "modules/auth";
// Local dependencies
import { User, EmailAddress } from "./domain";
import { UserRepository } from "./user.repository";
import { UUID } from "./domain/UUID";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    register(email: EmailAddress, userName: string): User {
        const user = User.create(email, userName);
        this.userRepository.save(user);
        return user;
    }

    activate(userID: UUID, credentials: ProtectedCredentials[]): User {
        const user = this.userRepository.retrieveById(userID);
        if (user === undefined) {
            throw new NotFound(`User with id ${userID} could not be found.`);
        }
        user.activate(credentials);
        return user;
    }

    async login(user: User, credentials: UnsafeCredentials[]): Promise<User> {
        if(await user.validateEnteredCredentials(credentials) === false) {
            throw new Unauthorized();
        };

        return user;
    }
}