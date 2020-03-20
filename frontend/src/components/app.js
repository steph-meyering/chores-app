import React from "react";
import { AuthRoute, ProtectedRoute } from "../util/route_util";
import { Route, Switch, Redirect } from "react-router-dom";
import SplashPage from "./splash/splash_page";
import DashboardContainer from "./dashboard/dashboard_container";
import "../styles/application.scss";
import BillsIndexContainer from "./bills/bills_index_container";
import ChoresContainer from "./chores/chores_container";
import HouseholdCalendar from "./calendar/calendar";
import NavBar from "./nav/nav";

const App = () => (
  <div className="app">
    <div className="main-container">
      <Route path="/" component={NavBar} />
      <Switch>
        <AuthRoute exact path="/" component={SplashPage} />
        <ProtectedRoute
          exact
          path="/dashboard"
          component={DashboardContainer}
        />
        <ProtectedRoute exact path="/chores" component={ChoresContainer} />
        <ProtectedRoute exact path="/bills" component={BillsIndexContainer} />
        <Route exact path="/calendar" component={HouseholdCalendar} />
        {/* Default redirect given bad path */}
        <Redirect path="*" to="/dashboard" />
      </Switch>
    </div>
  </div>
);

export default App;
