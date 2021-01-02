export const initialState = {
    books: [],
    user: null,
  };
  
  
  function reducer(state, action) {
    switch (action.type) {
      case "SET_USER":
        console.log('distaptched..',action)
        return {
          ...state,
          user: action.user,
        };
      default:
        return { ...state };
        break;
    }
  }
  
  export default reducer;
  