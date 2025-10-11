import React, { createContext, useState } from "react";
import AccountSummary from "./AccountSummary"


interface AccountSummaryContextType {
  showAcctDetails: boolean;
  setShowAcctDetails: (value: boolean) => void;
  // add other properties here
}
const defaultContextValue: AccountSummaryContextType = {
  showAcctDetails: false,
  setShowAcctDetails: () => {},
};

export const AccountsummaryContext = createContext<AccountSummaryContextType>(defaultContextValue);
  const[showAcctDetails,setShowAcctDetails] = useState(false);

<AccountsummaryContext.Provider value={{showAcctDetails,setShowAcctDetails}}>
<AccountSummary/>
</AccountsummaryContext.Provider>

