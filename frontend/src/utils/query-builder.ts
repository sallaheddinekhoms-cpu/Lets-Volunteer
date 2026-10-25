      import { OpportunityFilters, ParticipationsFilters } from "@/types/filters";

      export function buildQueryString(filters? : Partial<OpportunityFilters> | Partial<ParticipationsFilters> ){

            const params = new URLSearchParams();

            if (filters) {
                  Object.entries(filters).forEach(([key, value]) => {
                      if (value) {
                          params.append(key, value.toString());
                      }
                  });
              }
              


            return params.toString();


      }
