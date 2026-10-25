import { Organization } from ".";

export interface AidType {
      id : number ; 
      label : string ; 
      year : number ;
      is_open : boolean ; 
      description : string ;
      beneficiary_count : number ;
}


export interface Aid { 
      id : number ;
      organization : Organization ;
      aid_type : number ;
      created_at : string ;
      beneficiary : string ;
}



