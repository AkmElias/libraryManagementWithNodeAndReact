import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { useStateValue } from "./globalState/StateProvider";

function Home() {
  const [{ user, books }] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      console.log("user..", user);
      history.push("/sign-up");
    } else {
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
