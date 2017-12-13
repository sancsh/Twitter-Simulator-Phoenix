defmodule TwitterSimulator.TwitterChannel do
    use Phoenix.Channel

    def join("twitter", _payload, socket) do
        #DatabaseHandler.init();
        {:ok, socket}    
        
    end

    def handle_in("register_account", payload, socket) do
        username = payload["username"];
        password = payload["password"];
        returnValue = :ets.insert_new(:user_table, {username, password});
        push(socket, "Registered", %{status: returnValue});
        {:no_reply, socket}
    end

    def handle_in("login_user", payload, socket) do
        username = payload["username"];
        password = payload["password"];
        returnValue = :ets.lookup(:user_table, username);
        if(returnValue == []) do
            push(socket, "Login", %{status: "N_OK", login_message: "Error: User Does Not Exist"})
        else
            [{username,returnedPassword}] = returnValue
            if(returnedPassword == password) do
                :ets.insert(:user_sockets, {username, socket})
                push(socket, "Login", %{lstatus: "OK", login_message: "Login Successful" , username: username})
            else
                push(socket, "Login", %{status: "N_OK", login_message: "Incorrect Password"})
            end
        end
        {:no_reply, socket}
    end
end