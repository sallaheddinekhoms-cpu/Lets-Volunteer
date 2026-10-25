"use client"

import { VolunteerRegisterForm } from "./VolunteerRegisterForm";
import { OrganisationRegisterForm } from "./OrganisationRegisterForm";


export function RegisterForm({ userType }: { userType: "volunteer" | "organization" }) {
      return (
        <>
          {userType === "volunteer" ? 
            (<VolunteerRegisterForm/> ) :
            (<OrganisationRegisterForm/>)
          }
        </>
      );


    }