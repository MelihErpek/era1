import React from 'react'
import {
    BrowserRouter as Routers,
    Switch,
    Route
} from "react-router-dom";

import Login from "../Components/Login"
import Register from "../Components/Register"
import Events from "../Components/Events"
import NewEvent from "../Components/NewEvent"
import MyEvents from "../Components/MyEvents"
import EventUpdate from "../Components/EventUpdate"
import EventDetail from "../Components/EventDetail"



export default function Router() {
    return (
        <div>
            <Routers >
                <Switch>
                    <Route path="/" exact component={Events} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/events" component={Events} />
                    <Route path="/newevent" component={NewEvent} />
                    <Route path="/myevents" component={MyEvents} />
                    <Route path="/eventupdate/:_id" component={EventUpdate} />
                    <Route path="/eventdetail/:_id" component={EventDetail} />
                    
                </Switch>
            </Routers>


        </div>
    )
}
