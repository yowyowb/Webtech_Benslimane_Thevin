import {
    useContext
} from 'react'
/** @jsx jsx */
import {
    jsx
} from '@emotion/core'
// Layout
import {
    useTheme
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import Context from '../Context'
import Login from '../views/Login';
//Packages
var gravatar = require('gravatar');
var crypto = require('crypto');
var request = require('request');


const useStyles = (theme) => ({
    header: {
        padding: theme.spacing(1),
        backgroundColor: 'rgba(255,255,255,.3)',
        flexShrink: 0,
        //textAlign: "right",
    },
    headerLogIn: {
        backgroundColor: 'red',
    },
    headerLogOut: {
        backgroundColor: 'blue',
    },
    menu: {
        [theme.breakpoints.up('sm')]: {
            display: 'none !important',
        },
    },
    link: {
        position: "absolute",
        left: '92%',
    }
})

export default ({
                    drawerToggleListener
                }) => {
    const styles = useStyles(useTheme())
    const {
        oauth,
        setOauth,
        drawerVisible,
        setDrawerVisible
    } = useContext(Context)
    const drawerToggle = (e) => {
        setDrawerVisible(!drawerVisible)
    }
    const onClickLogout = (e) => {
        e.stopPropagation()
        setOauth(null)
    }
    if (oauth) {
        //Getting the email adress from the user
        var email = oauth.email
    } else {
        var email = 'none'
    }

    //Getting a md5-hash of an email adress
    var hash = crypto.createHash('md5').update(email).digest("hex");

    request("https://www.gravatar.com/" + hash + ".xml", function (err, response, body) {
        if (!err) {
            console.log(body);
        } else {
            console.log("Error :" + err);
        }
    })

    const gravatar = ("https://www.gravatar.com/avatar/" + hash + ".jpg");

    return (
        <header css={styles.header}>

            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={drawerToggle}
                css={styles.menu}
            >
                <MenuIcon/>
            </IconButton>
            {
                oauth ?
                    <span>
          {oauth.email}
                        <img
                            src={gravatar}
                            Width="40"
                            height="40"
                            alt="Login"
                        />
        <Link onClick={onClickLogout}> logout < /Link>
          < /span> :
        <span> Welcome to the new ChatApp ! We hope you will have an happy Christmas and enjoy the skin of the webpage < /span>
    }

    <
        /header>
  );
}
