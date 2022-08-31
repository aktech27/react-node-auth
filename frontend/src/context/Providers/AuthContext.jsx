import { createContext, useReducer } from "react";
import { authReducer } from "../Reducers/authReducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const initialState = null;

  //Initializing state using init method.
  //Check if user is already logged in and set state accordingly
  const init = () => {
    //If Local Storage not present, go with initial state(null)
    return localStorage.getItem("token") ? localStorage.getItem("token") : initialState;
  };

  const [token, dispatch] = useReducer(authReducer, initialState, init);

  return <AuthContext.Provider value={{ token, dispatch }}>{children}</AuthContext.Provider>;
};
