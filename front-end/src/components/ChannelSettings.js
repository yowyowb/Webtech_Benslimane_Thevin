/** @jsx jsx */
import {jsx} from '@emotion/core'
import {useContext, useState} from "react";
import Context from "../Context.js";
import {createApiClient} from "../api/apiClient.js";

export default ({channel, refreshChannel}) => {
    const {oauth, currentUser} = useContext(Context);
    const apiClient = createApiClient(oauth);
    const [appUsers, setAppUsers] = useState([]);
    const [fetched, setFetched] = useState(false);
    const fetchUsers = async () => {
        const users = await apiClient.getUsers();
        setAppUsers(users);
        setFetched(true);
    }

    const inviteUser = async (userId, channelId) => {
        await apiClient.addUserToChannel(channelId, userId);
        refreshChannel();
    }

    const removeUser = async (userId, channelId) => {
        await apiClient.removeUserFromChannel(channelId, userId);
        refreshChannel();
    }

    const formatUsers = () => {
        return appUsers
            .filter(user => user.id !== currentUser.id)
            .map(user => {
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
    }

    if (!fetched) {
        fetchUsers();
    }

    return (
        <div>
            Channel Setting
            <ul>
                {formatUsers().map(user => (
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
