import {useContext, useState} from 'react'
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Button from "@material-ui/core/Button"
// import Icon from "@material-ui/core/Icon"
//import SendIcon from "@material-ui/icons/Send";
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
import Context from "../Context.js";
import {createApiClient} from "../api/apiClient.js";

const useStyles = (theme) => {
  // See https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/OutlinedInput/OutlinedInput.js
  const borderColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    form: {
      borderTop: `2px solid ${borderColor}`,
      padding: '.3rem',
      display: 'flex',
    },
    content: {
      flex: '1 1 auto',
      '&.MuiTextField-root': {
        marginRight: theme.spacing(1),
      },
    },
    send: {
    },
  }
}

export default ({
  refresh,
}) => {
  const [content, setContent] = useState('')
  const {oauth} = useContext(Context);
  const apiClient = createApiClient(oauth);
  const styles = useStyles(useTheme())
  const onSubmit = async () => {
    const message = await apiClient.createChannel(content)
    refresh()
      setContent('')
  }
  const handleChange = (e) => {
    setContent(e.target.value)
  }
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        id="outlined-multiline-flexible"
        label="New Channel's Name"
        multiline
        rowsMax={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          css={styles.send}
          onClick={onSubmit}
        >
          Create
        </Button>
      </div>
    </form>
  )
}
