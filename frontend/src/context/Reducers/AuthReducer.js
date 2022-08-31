export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { token } = action.payload;
      //Saving the state to LocalStorage to persist data on reload
      localStorage.setItem("token", token);
      return token;

    case "LOGOUT":
      localStorage.removeItem("token");
      return null;

    default:
      return state;
  }
};
