import { Registration } from "./domain/Registration";
import { UUID } from "./domain/UUID";

export interface RegistrationRepository {
    save(registration: Registration): void;
    retrieve(id: UUID): Registration | undefined;
}