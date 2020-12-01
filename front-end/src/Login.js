import {useEffect} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import { useCookies  } from "react-cookie";
import Link from '@material-ui/core/Link';
import axios from 'axios'
import crypto from 'crypto'
import qs from 'qs'

const useStyles = (theme) => ({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > div': {
      margin: `${theme.spacing(1)}`,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '& fieldset': {
      border: 'none',
      '& label': {
        marginBottom: theme.spacing(.5),
        display: 'block',
      },
    },
  },
})

const base64URLEncode = (str) =>{
return str.toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
}

const sha256 = (buffer) =>{
return crypto
  .createHash('sha256')
  .update(buffer)
  .digest()
}

const Register = ({
  config,
  code_verifier}
) => {
  const dex = () => {
    const code_challenge = base64URLEncode(sha256(code_verifier))
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join('')
    window.location = url
    console.log("url :" + url)
  }

  return (
    <div>
      <Link onClick={dex}>Login with OAuth</Link>
    </div>
  )
}

const Token = ({
  user_tokens
}) => {
  const [, , removeCookie] = useCookies([])
  const {id_token} = user_tokens
  const playload = id_token.split(".")[1]
  const {email} = JSON.parse(atob(playload))
  const logout = (e) => {
    e.stopPropagation()
    removeCookie('user_tokens')
    window.location = "/"
  }
  return(
    <div>
      <div>
        Email user : {email}
      </div>
      <div>
        <Link onClick={logout}>Logout...</Link>
      </div>
    </div>
  )
}

export default ({
  onUser
}) => {
  const styles = useStyles(useTheme())
  const [cookies, setCookie, removeCookie] = useCookies([])
  const config = {
    authorization_endpoint: 'http://127.0.0.1:5556/dex/auth',
    token_endpoint: 'http://127.0.0.1:5556/dex/token',
    client_id: 'web-frontend',
    redirect_uri: 'http://127.0.0.1:3000/',
    scope: "openid%20email%20offline_access"
  }

  const parameters = new URLSearchParams(window.location.search)
  const code = parameters.get('code')

  if(!code){
    const user_tokens = cookies.user_tokens
    if(!user_tokens){
      const code_verifier = base64URLEncode(crypto.randomBytes(32))
      setCookie('code_verifier', code_verifier)
      return (
        <div css={styles.root}>
            <Register config={config} code_verifier={code_verifier} />
        </div>
      );
    }else{
      return(
        <div css={styles.root}>
            <Token user_tokens={user_tokens} />
        </div>
      )
    }
  } else {
    useEffect(()=>{
      const fetch = async () => {
        try{
          const code_verifier = cookies.code_verifier
          const {data: user_tokens} = await axios.post(config.token_endpoint, qs.stringify({
            grant_type: 'authorization_code',
            client_id: `${config.client_id}`,
            redirect_uri: `${config.redirect_uri}`,
            client_secret: 'ZXhhbXBsZS1hcHAtc2VjcmV0',
            code_verifier: `${code_verifier}`,
            code: ${code},
          }))
          console.log("done")
          removeCookie('code_verifier')
          setCookie('user_tokens', user_tokens)
          window.location = "/"
        }catch(e){
          console.log(e)
        }
      }
      fetch()
    }, [])
    return(
      <div/>
    )
  }

} 