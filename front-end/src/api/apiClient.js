import axios from "axios";

export function createApiClient(oauth = null) {
    const apiClient = axios.create({baseURL: 'http://localhost:3001/'})

    if (oauth && oauth.token_type && oauth.access_token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${oauth.access_token}`
    }


    return {
        async getChannels() {
            const {data: channels} = await apiClient.get('/channels');
            return channels;
        },

        async getMessages(channelId) {
            const { data: messages } = await apiClient.get(`/channels/${channelId}/messages`);
            return messages;
        },

        async getUsers() {
            const { data: users } = await apiClient.get('/users');
            return users;
        },

        async getChannelUsers(channelId) {
            const { data: users } = await apiClient.get(`/channels/${channelId}/users`);
            return users;
        },

        async createMessage(channelId, content) {
            const { data }  = await apiClient.post(`/channels/${channelId}/messages`, { content })
            return data;
        },

        async createChannel(name) {
            const { data }  = await apiClient.post(`/channels`, { name })
            return data;
        }
    }
}
