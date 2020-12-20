/** @jsx jsx */
import {jsx} from '@emotion/core'
import {useContext, useState} from "react";
import Context from "../Context.js";
import {createApiClient} from "../api/apiClient.js";

export default ({channel, setChannel}) => {
    const {oauth, currentUser} = useContext(Context);
    const apiClient = createApiClient(oauth);
    const [users, setUsers] = useState([]);
    const [fetched, setFetched] = useState(false);
    const fetchUsers = async () => {
        const users = await apiClient.getUsers();
        updateUsers(channel, users);
        setFetched(true);
    }

    const inviteUser = async (userId, channelId) => {
        const channel = await apiClient.addUserToChannel(channelId, userId);
        setChannel(channel);
        updateUsers(channel, users);
    }

    const removeUser = async (userId, channelId) => {
        const channel = await apiClient.removeUserFromChannel(channelId, userId);
        setChannel(channel);
        updateUsers(channel, users);
    }

    const updateUsers = (channel, users) => {
        users = users.filter(user => user.id !== currentUser.id)
        users = users.map(user => {
            const isMember = channel.users.includes(user.id);
            const action = isMember ? () => removeUser(user.id, channel.id) : () => inviteUser(user.id, channel.id);
            const actionText = isMember ? 'remove' : 'add';
            return {
                ...user,
                isMember,
                action,
                actionText,
            };
        })
        setUsers(users);
    }

    if (!fetched) {
        fetchUsers();
    }
    return (
        <div>
            Channel Setting
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p>
                            <span>{user.username}</span>
                            {' - '}
                            <button onClick={user.action}>{user.actionText}</button>
                        </p>
                    </li>
                ))}
            </ul>
        </div>

    )
}
