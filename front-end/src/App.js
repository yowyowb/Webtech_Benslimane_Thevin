import {useContext, useState} from 'react'
/** @jsx jsx */
import {jsx} from '@emotion/core'
// Local
import Oups from './views/Oups'
import Footer from './components/Footer'
import Header from './components/Header'
import Main from './components/Main'
import Login from './views/Login'
import Context from './Context'
// Rooter
import {
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom"
import {createApiClient} from "./api/apiClient.js";

const styles = {
    root: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#3a3631',
        padding: '50px',
    },
}

export default () => {
    const location = useLocation()
    const {oauth, setCurrentUser, currentUser} = useContext(Context)
    const apiClient = createApiClient(oauth);
    const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
    const drawerToggleListener = () => {
        setDrawerMobileVisible(!drawerMobileVisible)
    }
    const fetchCurrentUser = async (oauth) => {
        if (!currentUser) {
            const currentUser = oauth ? await apiClient.getCurrentUser() : null;
            setCurrentUser(currentUser);
        }
    }
    fetchCurrentUser(oauth);
    return (
        <div className="App" css={styles.root}>
            <Header drawerToggleListener={drawerToggleListener}/>
            <Switch>
                <Route exact path="/">
                    {
                        oauth ? (
                            <Redirect
                                to={{
                                    pathname: "/channels",
                                    state: {from: location}
                                }}
                            />
                        ) : (
                            <Login/>
                        )
                    }
                </Route>
                <Route path="/channels">
                    {
                        oauth ? (
                            <Main/>
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: {from: location}
                                }}
                            />
                        )
                    }
                </Route>
                <Route path="/Oups">
                    <Oups/>
                </Route>
            </Switch>
            <Footer/>
        </div>
    );
}
