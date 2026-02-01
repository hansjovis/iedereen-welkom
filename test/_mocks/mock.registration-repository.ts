import { Registration } from "modules/user/domain";
import { UUID } from "modules/user/domain/UUID";
import { RegistrationRepository } from "modules/user/registration.repository";

export class MockRegistrationRepository implements RegistrationRepository {
    private registrations: Map<string, Registration> = new Map();

    save(registration: Registration): void {
        this.registrations.set(registration.id.toString(), registration);
    }

    retrieve(id: UUID): Registration | undefined {
        return this.registrations.get(id.toString());
    }
}