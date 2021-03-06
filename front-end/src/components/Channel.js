import {useContext, useRef, useState} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// Local
import MessageForm from './channel/MessageForm'
import MessagesList from './channel/MessagesList'
import ChannelSettings from "./ChannelSettings.js";
import Context from '../Context'
import { useHistory, useParams } from 'react-router-dom'
import {createApiClient} from "../api/apiClient.js";

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'auto',
  },
  fab: {
    position: 'absolute !important',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: 'none !important',
  }
})

export default () => {
  const history = useHistory()
  const { id } = useParams()
  const {channels, oauth, currentUser} = useContext(Context)
  if(!channels.find( channel => channel.id === id)) {
    history.push('/oups')
    return <div/>
  }
  const apiClient = createApiClient(oauth);
  const styles = useStyles(useTheme())
  const listRef = useRef()
  const channelId = useRef()
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([])
  const [scrollDown, setScrollDown] = useState(false)

  const addMessage = (message) => {
    fetchMessages()
  }

  const fetchChannel = async () => {
    const channel = await apiClient.getChannel(id);
    setChannel(channel);
  }

  const fetchMessages = async () => {
    setMessages([])
    const messages = await apiClient.getMessages(id)
    setMessages(messages)
    if(listRef.current){
      listRef.current.scroll()
    }
  }

  if(channelId.current !== id){
    fetchChannel();
    fetchMessages()
    channelId.current = id
  }
  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown)
  }
  const onClickScroll = () => {
    listRef.current.scroll()
  }

  return (
    <div css={styles.root}>
      { channel && currentUser.id === channel.owner &&
      <ChannelSettings
          channel={channel}
          refreshChannel={fetchChannel}
      />
      }
      <MessagesList
        channel={channel}
        messages={messages}
        onScrollDown={onScrollDown}
        refreshMessages={fetchMessages}
        ref={listRef}
      />
      <MessageForm addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  );
}
