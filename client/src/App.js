import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import "./App.scss";

import Home from "./pages/home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Switch>
              <Container
                className="pt-5 justify-content-center d-flex align-items-center"
                style={{ height: "100vh" }}
              >
                <DynamicRoute exact path="/" component={Home} authenticated />

                <div className="login-register-div">
                  {console.log("windows loc::", window.location.pathname)}
                  <DynamicRoute
                    cRoute
                    path="/register"
                    component={Register}
                    guest
                  />
                  <DynamicRoute path="/login" component={Login} guest />
                </div>
              </Container>
            </Switch>

            {/* <div className="abc">
              <Switch>
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute path="/register" component={Register} guest />
                <DynamicRoute path="/login" component={Login} guest />
              </Switch>
            </div> */}
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
