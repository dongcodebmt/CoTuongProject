﻿using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace DemoAPI
{
    public class Requestlog : Hub
    {
        public void Connect(string group, string name)
        {
            Clients.Caller.connect(group, name);
            Groups.Add(Context.ConnectionId, group);
        }

        public void Message(string group, string name, string msg)
        {
            Clients.Group(group).message(group, name, msg);
        }

        public static void PostToClient(string group, string name, string data)
        {
            try
            {
                var chat = GlobalHost.ConnectionManager.GetHubContext("Requestlog");
                if (chat != null)
                {
                    chat.Clients.Group(group).postToClient(group, name, data);
                    //chat.Clients.All.postToClient(data);
                }
            }
            catch
            {
            }
        }
    }
}