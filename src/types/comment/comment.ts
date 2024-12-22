import type { Account } from '../account';
import type { Post } from '../post/post';

export type CommentCreatePayload = {
    content: string;
    postId: string;
};

export type TComment = {
    commentId: string;
    content: string;
    account: Account;
    post: Post;
    replies: TComment[];
    createdDate: string;
    updatedDate: string;
};

export type UpdateCommentPayload = {
    content: string;
};

export type CreateReplyPayload = {
    content: string;
    parentCommentId: string;
    postId: string;
};

export type TReply = {};
