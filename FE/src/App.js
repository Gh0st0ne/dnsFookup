import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import MyBins from "./MyBins";
import NewBin from "./NewBin";

/* eslint-disable */

class App extends Component {
  state = {
    logged: false,
    name: ""
  };

  getUser = () => {
    var bearer = "Bearer " + localStorage.getItem("access_token");
    //console.log(bearer);
    var obj = {
      method: "GET",
      headers: new Headers({
        Accept: "aplication/json",
        Authorization: bearer,
        //   "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Headers": "Authorization, Accept"
      })
    };
    fetch("http://localhost:5000/api/user", obj)
      .then(res => res.json())
      .then(data => {
        if (
          (data.name != null)
        ) {
          this.setUser(data);
          console.log('LoggenIn ok');
        } else if (window.location.pathname != "/") {
          this.handleLogout();
          console.log('HandleLogout');

        }
      })
      .catch(err => {
        if (window.location.pathname != "/") {
          this.handleLogout();
          console.log('HandleLogout');
        }

      });
  };

  setUser = data => {
    this.setState({
      logged: true,
      name: data.name
    });
    console.log(this.state);
  };

  unsetUser = () => {
    this.setState({
      logged: false,
      name: ""
    });
    localStorage.removeItem("access_token");
    console.log("user unset");
    window.location = "/"
  };

  componentDidMount() {

    this.getUser()
  }

  isLogged = () => {
    return this.state.logged;
  };

  handleLogout = event => {
    var bearer = "Bearer " + localStorage.getItem("access_token");
    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: new Headers({
        Accept: "aplication/json",
        Authorization: bearer
        // 'Content-Type': 'form-data',
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error === true) {
          console.log("Logout error");
        }
        else {
          this.unsetUser();
        }
      })
      .catch(err => {
        this.unsetUser();
      });
  };

  render() {
    return (
      <div className="App">
        <Router>
          {this.isLogged() && (
            <TopBar
              handleLogout={this.handleLogout}
              unsetUser={this.unsetUser}
            />
          )}
          <Route path="/" exact component={Home} />
          {!this.isLogged() && (
            <div>
              <Route
                path="/login"
                component={() => <Login setUser={this.setUser} />}
              />
              <Route
                path="/signup"
                component={() => <Signup setUser={this.setUser} />}
              />
              <Route path="/dashboard" component={() => <Redirect to="/" />} />
            </div>
          )}
          {this.isLogged() && (
            <div>
              <Route path="/" component={() => <Redirect to="/dashboard" />} />
              <Route
                path="/login"
                component={() => <Redirect to="/dashboard" />}
              />
              <Route
                path="/signup"
                component={() => <Redirect to="/dashboard" />}
              />
              <Route
                path="/dashboard"
                component={() => (
                  <Dashboard
                    name={this.state.name}
                    unsetUser={this.unsetUser}
                  />
                )}
              />
              <Route path="/mybins" component={() => <MyBins />} />
              <Route path="/dnsbin" component={() => <NewBin />} />
            </div>
          )}
        </Router>
      </div>
    );
  }
}

export default App;
