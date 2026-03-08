// Dependencies from other modules
import { NotFound, Unauthorized } from "../../exceptions/index.js";
import { UnsafeCredentials, ProtectedCredentials } from "../../modules/auth/index.js";
// Local dependencies
import { User, EmailAddress, UUID } from "./domain/index.js";
import { UserRepository } from "./user.repository.js";

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

    async login(email: EmailAddress, credentials: UnsafeCredentials[]): Promise<User> {
        const user = this.userRepository.retrieveByEmail(email);
        if (user === undefined) {
            throw new NotFound(`User with email address ${email} could not be found.`);
        }
        if(await user.validateEnteredCredentials(credentials) === false) {
            throw new Unauthorized("Invalid credentials");
        };

        return user;
    }
}