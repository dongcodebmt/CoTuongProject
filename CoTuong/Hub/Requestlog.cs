using Microsoft.AspNet.SignalR;

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
}