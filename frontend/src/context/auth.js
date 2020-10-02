import React from "react";

const initialSessionState = {
  activeUser: {},
  isAuth: false,
  token: "",
};

function authReducer(state, action) {
  switch (action.type) {
    case "addActiveUser":
      return {
        isAuth: true,
        activeUser: action.user,
        token: action.token,
      };
    case "logOut":
      return {
        isAuth: false,
        activeUser: {},
        role: "",
        token: "",
      };
    default:
      throw new Error("Session reducer case not found");
  }
}

const SessionContext = React.createContext(initialSessionState);
export function SessionProvider({ children }) {
  const [sessionState, dispatchSessionState] = React.useReducer(
    authReducer,
    initialSessionState
  );

  return (
    <SessionContext.Provider value={{ sessionState, dispatchSessionState }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionState() {
  const { sessionState } = React.useContext(SessionContext);
  return sessionState;
}

export function useSessionDispatch() {
  const { dispatchSessionState } = React.useContext(SessionContext);
  return dispatchSessionState;
}
