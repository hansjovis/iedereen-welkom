import { User } from "actors/User";
import { URI } from "common/URI";
import { IedereenWelkomNS } from "namespaces";
import { UserRepository } from "repositories/UserRepository";
import { Credentials, UserService } from "services/UserService";
import { EmailAddress } from "values/EmailAddress";

class MockCredentials implements Credentials {
    readonly type: URI = new URI(IedereenWelkomNS, "credentials/mock");
    check(user: User): boolean {
        return true;
    }
}

class MockUserRepository implements UserRepository {
    private readonly users: Map<EmailAddress, User> = new Map();

    save(user: User): void {
        this.users.set(user.email, user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.get(email);
    }
}

describe("A user", () => {
    it("can register themselves", () => {
        const userService = new UserService(new MockUserRepository());

        const user: User = userService.register({
            userName: "hansjovis",
            email: new EmailAddress("hans-christiaan@hansjovis.net"),
        });

        expect(user.userName).toEqual("hansjovis");

        expect(user.outbox.items).toHaveLength(0);
        expect(user.inbox.items).toHaveLength(0);
    });
});
