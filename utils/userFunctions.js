
const user = require('./users'); 
const users = require('./usersArray');

// getCurrentUser.js
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


//User leaves chat
function userLeave(id)
{
    const index=users.findIndex(user=>user.id===id);
    if(index!==-1)
    {
        return users.splice(index,1)[0];
    }
    
}

//Get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}
module.exports = {getCurrentUser,userLeave,getRoomUsers};
