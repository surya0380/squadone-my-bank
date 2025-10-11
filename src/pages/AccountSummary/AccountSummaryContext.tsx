import { createContext, useState } from "react";
import AccountSummary from "./AccountSummary"
import Login from "../Login";



interface AccountSummaryContextType {
  showAcctDetails: boolean;
  setShowAcctDetails: (value: boolean) => void;
  showRegister: boolean;
  setshowRegister: (value: boolean) => void;
  // add other properties here
}
const defaultContextValue: AccountSummaryContextType = {
  showAcctDetails: false,
  setShowAcctDetails: () => {},
   showRegister: false,
  setshowRegister: () => {},
};

export const AccountsummaryContext = createContext<AccountSummaryContextType>(defaultContextValue);
  const[showAcctDetails,setShowAcctDetails] = useState(false);
   const[showRegister,setshowRegister] = useState(false);
<AccountsummaryContext.Provider value={{showAcctDetails,setShowAcctDetails,showRegister,setshowRegister}}>
<AccountSummary/>
<Login/>
</AccountsummaryContext.Provider>

