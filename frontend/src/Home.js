import React, { useEffect,useState } from "react";
import {
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";

import { useStateValue } from "./globalState/StateProvider";

function Home() {
  
  const user = JSON.parse(localStorage.getItem('user'))
  const [{books }] = useStateValue();
  const history = useHistory();

  useEffect(() => {
   
    if (user === null) {
      console.log("user is null..", user);
      history.push("/sign-in");
    } else {
      console.log('user from localstorage: which should not be null..',user)
      history.push('/books')
    }
    return () => {};
  }, []);

  return (
    <div className="home">
      <div className="auth-wrapper">
        <div className="auth-inner">
          {/* <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={Signup} />
          </Switch> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
