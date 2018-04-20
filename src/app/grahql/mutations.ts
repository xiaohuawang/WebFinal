import gql from 'graphql-tag';

export const AddUserMutation = gql`
    mutation addUser($data: Any!) {
        addUser(data: $data)
    }
`;

export const UpdatePostMutation = gql`
    mutation updatePost($id: ID!, $data: PostInput) { 
        updatePost(id: $id, data: $data) { 
            id  
            title 
            content
        }
    }
`;

export const AddPostMutation = gql`
    mutation addPost($data: PostInput!) {
    addPost(data: $data)
    }
`;