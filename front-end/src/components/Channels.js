import {useContext, useEffect} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
// Local
import Context from '../Context'
import {useHistory} from 'react-router-dom'
import {createApiClient} from "../api/apiClient.js";

const styles = {
  // root: {
  //   minWidth: '200px',
  // },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap',
  }
}

export default () => {
  const {
    oauth,
    channels, setChannels
  } = useContext(Context)
  const history = useHistory();
  const apiClient = createApiClient(oauth);
  useEffect( () => {
    const fetch = async () => {
      try{
        const channels = await apiClient.getChannels();
        setChannels(channels)
      }catch(err){
        console.error(err)
      }
    }
    fetch()
  }, [oauth, setChannels])
  return (
    <ul style={styles.root}>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href={`/channels/${channel.id}`}
            onClick={ (e) => {
              e.preventDefault()
              history.push(`/channels/${channel.id}`)
            }}
          >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
