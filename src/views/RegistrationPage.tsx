import React from "react";

import MainLayout from "./layouts/MainLayout";
import EmailInput from "./components/form/EmailInput";
import TextInput from "./components/form/TextInput";
import SubmitButton from "./components/form/SubmitBurron";
import Form from "./components/form/Form";

export default function RegistrationPage() {
    return <MainLayout
        title="Registratiepagina - Iedereen Welkom"
        description="Registreer je nu op Iedereen Welkom!">
        <main>
            <Form className="card" endpoint="/api/v1/users">
                <h1>Registreer</h1>
                <EmailInput label="emailadres"/>
                <TextInput label="gebruikersnaam"/>
                <SubmitButton>
                    Registreer
                </SubmitButton>
            </Form>
        </main>
    </MainLayout>
}
