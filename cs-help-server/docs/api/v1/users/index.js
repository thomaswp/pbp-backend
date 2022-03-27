const getUser = require('./get-user');

module.exports = {
    paths:{
        // '/users':{
        //     ...getUsers,
        //     ...createUser
        // },
        '/users/{id}':{
            // ...updateUser,
            // ...deleteUser,
            ...getUser
        }
    }
}