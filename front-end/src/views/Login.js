import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
/** @jsx jsx */
import { jsx } from "@emotion/core";
// Layout
import { useTheme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// Local
import Context from "../Context";
import { useHistory } from "react-router-dom";
import iconMessages from "../icons/messages.png";
import iconLogin from "../icons/papano.png";
import iconScreen from "../icons/screenNoel.png";
import iconXmAs from "../icons/christmas.png";
import {ReactComponent as ChannelIcon} from '../icons/channel.svg';

import { relative } from "path";

console.log(iconMessages);
console.log(iconLogin);
console.log(iconScreen);
console.log(iconXmAs);

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    //background: theme.palette.background.default,
    backgroundImage : 'url('+iconScreen+')',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > div": {
      margin: `${theme.spacing(1)}`,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& fieldset": {
      border: "none",
      "& label": {
        marginBottom: theme.spacing(0.5),
        display: "block",
      },
    },
  },
  card: {
    textAlign: "center",
  },
  icon: {
    width: '30%',
    fill: '#fff',
  },
  icon2: {
    width: '80%',
    fill: '#fff',
  },
  bot: {
    textAlign: "center",
    position : 'relative',
    //right : '%',
    paddingTop : '35%',
    width: '80%',
    fill: '#fff',
  }
});

const Redirect = ({ config, codeVerifier }) => {
  const styles = useStyles(useTheme());
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join("");
    window.location = url;
  };
  return (
    <div css={styles.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
            <img css={styles.icon} src={iconMessages} alt="Messages" />
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
              <span> 
                The place to talk and be 
                <br></br>
                with your loved ones at any times
              </span>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}></div>
        </Grid>
      </Grid>
      
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
          <img css={styles.icon} src={iconLogin} alt="Login" />
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <Link onClick={redirect} color="secondary">
              Login with your Christmas spirit 
              <br></br>
              (OpenID Connect and OAuth2)
            </Link>
          </div>
        </Grid>
        <Grid item l>
          <div css={styles.card}>
          <img css={styles.bot} src={iconXmAs} alt="Xmas" />
          </div>
        </Grid>
      </Grid>

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
          <ChannelIcon css={styles.icon2} />
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <span>Create and use multiples channels !</span>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
          </div>
        </Grid>
      </Grid>
    </div>
    
  );
};

const Tokens = ({ oauth }) => {
  const { setOauth } = useContext(Context);
  const styles = useStyles(useTheme());
  const { id_token } = oauth;
  const id_payload = id_token.split(".")[1];
  const { email } = JSON.parse(atob(id_payload));
  const logout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <div css={styles.root}>
      Welcome {email}{" "}
      <Link onClick={logout} color="secondary">
        logout
      </Link>
    </div>
  );
};

export default ({ onUser }) => {
  const styles = useStyles(useTheme());
  const history = useHistory();
  // const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const { oauth, setOauth } = useContext(Context);
  const config = {
    authorization_endpoint: "http://127.0.0.1:5556/dex/auth",
    token_endpoint: "http://127.0.0.1:5556/dex/token",
    client_id: "webtech-frontend",
    redirect_uri: "http://127.0.0.1:3000",
    scope: "openid%20email%20offline_access",
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  // is there a code query parameters in the url
  if (!code) {
    // no: we are not being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32));
      setCookie("code_verifier", codeVerifier);
      return (
        <Redirect
          codeVerifier={codeVerifier}
          config={config}
          css={styles.root}
        />
      );
    } else {
      // yes: user is already logged in, great, is is working
      return <Tokens oauth={oauth} css={styles.root} />;
    }
  } else {
    // yes: we are coming from an oauth server
    const codeVerifier = cookies.code_verifier;
    useEffect(() => {
      const fetch = async () => {
        try {
          const { data } = await axios.post(
            config.token_endpoint,
            qs.stringify({
              grant_type: "authorization_code",
              client_id: `${config.client_id}`,
              code_verifier: `${codeVerifier}`,
              redirect_uri: `${config.redirect_uri}`,
              code: `${code}`,
            })
          );
          removeCookie("code_verifier");
          setOauth(data);
          // window.location = '/'
          history.push("/");
        } catch (err) {
          console.error(err);
        }
      };
      fetch();
    });
    return <div css={styles.root}>Loading tokens</div>;
  }
};
