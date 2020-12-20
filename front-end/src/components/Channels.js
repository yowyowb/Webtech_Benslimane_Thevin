import {useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
// Local
import Context from '../Context'
import {useHistory, useParams} from 'react-router-dom'
import {createApiClient} from "../api/apiClient.js";
import NewChannel from './NewChannel.js'

const styles = {
  root: {
    minWidth: '300px',
  },
  channel: {
    padding: '.3rem .5rem',
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

  const fetchChannels = async () => {
    try{
      const channels = await apiClient.getChannels();
      setChannels(channels)
    }catch(err){
      console.error(err)
    }
  }

  useEffect( () => {
    fetchChannels()
  }, [oauth, setChannels])
  return (
    <ul style={styles.root}>
      <li>
      <NewChannel refresh={fetchChannels}/>
      </li>
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
