import { Community, CommunityChat, CommunityChatMessage, User } from './database';

export type ChatItem = CommunityChat & {
    community: Community;
    last_message?: {
        message_text: string;
        created_at: string;
        user?: { name: string };
    } | null;
    unread_count?: number;
};

export type MessageWithUser = CommunityChatMessage & {
    user: User;
    parent_message?: CommunityChatMessage & {
        user?: { name: string } | { name: string }[];
    } | null;
    tempId?: string;
    isSending?: boolean;
};
