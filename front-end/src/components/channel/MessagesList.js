import {forwardRef, useContext, useImperativeHandle, useLayoutEffect, useRef} from 'react'
/** @jsx jsx */
import {jsx} from '@emotion/core'
// Layout
import {useTheme} from '@material-ui/core/styles';
// Markdown
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import Context from "../../Context.js";
import {createApiClient} from "../../api/apiClient.js";

dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
    calendar: {
        sameElse: 'DD/MM/YYYY hh:mm A'
    }
})

const useStyles = (theme) => ({
    root: {
        position: 'relative',
        flex: '1 1 auto',
        'pre': {

            overflowY: 'auto',
        },
        '& ul': {
            'margin': 0,
            'padding': 0,
            'textIndent': 0,
            'listStyleType': 0,
        },
    },
    message: {
        padding: '.2rem .5rem',
        ':hover': {
            backgroundColor: 'rgba(255,255,255,.05)',
        },
    },
    fabWrapper: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50px',
    },
    fab: {
        position: 'fixed !important',
        top: 0,
        width: '50px',
    },
})

export default forwardRef(({
                               channel,
                               messages,
                               onScrollDown,
                               refreshMessages,
                           }, ref) => {
    const styles = useStyles(useTheme())
    // Expose the `scroll` action
    useImperativeHandle(ref, () => ({
        scroll: scroll
    }));
    const rootEl = useRef(null)
    const scrollEl = useRef(null)
    const {currentUser, oauth} = useContext(Context)
    const apiClient = createApiClient(oauth);
    const scroll = () => {
        scrollEl.current.scrollIntoView()
    }
    // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
    const throttleTimeout = useRef(null) // react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        const rootNode = rootEl.current // react-hooks/exhaustive-deps
        const handleScroll = () => {
            if (throttleTimeout.current === null) {
                throttleTimeout.current = setTimeout(() => {
                    throttleTimeout.current = null
                    const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
                    onScrollDown(scrollTop + offsetHeight < scrollHeight)
                }, 200)
            }
        }
        handleScroll()
        rootNode.addEventListener('scroll', handleScroll)
        return () => rootNode.removeEventListener('scroll', handleScroll)
    })

    const removeMessage = message => async () => {
        await apiClient.deleteMessage(message);
        refreshMessages();
    }

    return (
        <div css={styles.root} ref={rootEl}>
            { channel && <h1>Messages for {channel.name}</h1>}
            <ul>
                {messages.map((message, i) => {
                    const {contents: content} = unified()
                        .use(markdown)
                        .use(remark2rehype)
                        .use(html)
                        .processSync(message.content)
                    return (
                        <li key={i} css={styles.message}>
                            <p>
                                <span>{message.author.username}</span>
                                {' - '}
                                <span>{dayjs(message.creation).format('DD/MM/YYYY - HH:mm')}</span>

                                {message.author.id === currentUser.id && <button onClick={removeMessage(message)}>X</button>}

                            </p>
                            <div dangerouslySetInnerHTML={{__html: content}}>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div ref={scrollEl}/>
        </div>
    )
})
