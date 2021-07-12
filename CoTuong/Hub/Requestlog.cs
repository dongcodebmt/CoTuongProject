using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace DemoAPI
{
    public class Requestlog : Hub
    {
        public static void PostToClient(string data)
        {
            try
            {
                var chat = GlobalHost.ConnectionManager.GetHubContext("Requestlog");
                if (chat != null)
                    chat.Clients.All.postToClient(data);
            }
            catch
            {
            }
        }
    }

    [HubName("chat")]
    public class DemoChat : Hub
    {
        public void Connect(string name)
        {
            Clients.Caller.connect(name);
        }
        public void Message(string name, string message)
        {
            Clients.All.message(name, message);
        }
    }
}