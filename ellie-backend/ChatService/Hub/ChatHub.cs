using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using ChatService;
using System.Linq;
using System;
namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser; //variable that shwos name of bot


        //using the singelon dictionary we added in startup to save the  user and room that comes with the default created Id
        private readonly IDictionary<string, UserConnection> _connections;


        //we saved the isntance of botuser and connections here 
        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "Sent By ellieBot";
            _connections = connections;
        }


        //override = technique that allows the invoking of functions from another class
        //the exception and return base.discconected comes along with overide class
        public override Task OnDisconnectedAsync(Exception exception)
        {
            //same as sendmessage 
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {

                //removes connectionID
                _connections.Remove(Context.ConnectionId);

                //To show that user left the room
                Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
            }

            //comes along with overide class

            return base.OnDisconnectedAsync(exception);
        }




        public async Task JoinRoom(UserConnection userConnection) //method that takes userConnection as object and near it is the name 
        {
            var users = _connections.Values
                .Select(c => c.User);
            var New_users = users.Count();

            //id by default from the context object of the hubclass
            if (New_users < 2)
            {

                //wait for id and room and then add them    
                await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);


                //keeping track of id when user join the room
                _connections[Context.ConnectionId] = userConnection;
                //This method is a handler in the frontend connection.on 
                //we could use Clients.Send.All to negate room but later we would do room for support 
                //clients stay in solo room until the support accept his request then he changes room 
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined");

            }
        }
        //This method wil recieve a string message 
        public async Task SendMessage(string message)
            //_connection is dictionary 
            //codition  that tryes to get the  value  of connectionID as a key 
            //out is used to get(return) variables/properties of the id which is the user and room  as a value
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {

                //method to recieve and send message to all conencted users in the room
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }
    }
}

    