// External dependencies
import { Inject, Injectable, Logger } from "@nestjs/common";
// Dependencies from other modules
import { NotFound, Unauthorized } from "../../exceptions/index.js";
import { UnsafeCredentials, CredentialsConfiguration, LoginCodeConfiguration, LoginCodeMail } from "../auth/index.js";
import { EmailService } from "../email/email.service.js";
// Local dependencies
import { User, EmailAddress, UserID } from "./domain/index.js";
import { UserRepository } from "./repositories/user.repository.js";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        @Inject("EmailService")
        private readonly emailService: EmailService,
    ) {}

    register(email: EmailAddress, userName: string): User {
        const user = User.create(email, userName);
        this.userRepository.create(user);
        this.logger.log(`Registered user with email ${email}.`);
        return user;
    }

    activate(userID: UserID, credentials: CredentialsConfiguration[]): User {
        const user = this.userRepository.retrieveById(userID);
        if (user === undefined) {
            throw new NotFound(`User with id ${userID} could not be found.`);
        }
        user.auth.clear();
        credentials.forEach(it => user.auth.configure(it));
        this.logger.log(`Activated user with id ${userID}.`);
        return user;
    }

    async login(email: EmailAddress, credentials: UnsafeCredentials[]): Promise<User> {
        const user = this.userRepository.retrieveByEmail(email);
        if (user === undefined) {
            this.logger.log(`User with email ${email} failed to log in (user not found).`);
            throw new NotFound(`User with email address ${email} could not be found.`);
        }
        if(await user.auth.check(...credentials) === false ) {
            this.logger.log(`User with email ${email} failed to log in.`);
            throw new Unauthorized("Invalid credentials");
        };
        this.logger.log(`User with email ${email} logged in.`);
        return user;
    }

    async sendLoginCode(user: User) {
        const loginCodeConfig = user.auth.get("login_code") as LoginCodeConfiguration;
        if (loginCodeConfig === undefined) return;
        const loginCode = await loginCodeConfig.generate();
        this.emailService.send(new LoginCodeMail(user, loginCode));
    }

    async retrieveByEmail(email: EmailAddress): Promise<User | undefined> {
        return this.userRepository.retrieveByEmail(email);
    }

    async retrieveByUserName(userName: string): Promise<User | undefined> {
        return this.userRepository.retrieveByUserName(userName);
    }

    async retrieveUserFromSession(session: Record<string, unknown>): Promise<User|undefined> {
        const uuidString = session.userID as string;
        if (uuidString === undefined) {
            return undefined;
        }

        const user = this.userRepository.retrieveById(
            new UserID(uuidString)
        );

        return user;
    }
}