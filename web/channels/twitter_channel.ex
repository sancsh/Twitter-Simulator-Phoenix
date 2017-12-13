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
        {:noreply, socket}
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
                push(socket, "Login", %{status: "OK", login_message: "Login Successful" , username: username})
            else
                push(socket, "Login", %{status: "N_OK", login_message: "Incorrect Password"})
            end
        end
        {:noreply, socket}
    end

    def handle_in("retweet", payload, socket) do
        username = payload["username"];
        tweetId = payload["tweetId"];
        tweetText = DatabaseHandler.getTweetById(tweetId);
        followers = DatabaseHandler.getAllFollowers(username);
        Enum.map(followers, fn follower -> sendTweetToUser(follower, tweetId, tweetText) end);
        {:noreply, socket}
    end


    def handle_in("tweet", payload, socket) do
        user = payload["username"];
        tweetText = payload["tweetText"];
        handles = TweetParser.getAllHandles(tweetText);
        hashtags = TweetParser.getAllHashtags(tweetText);
        tweetId = :ets.info(:tweet_table)[:size];
        DatabaseHandler.insertTweet(tweetId, user, tweetText);
        Enum.map(handles, fn (handle) -> DatabaseHandler.insertHandleTweet(handle, tweetId) end);
        Enum.map(hashtags, fn (hashtag) -> DatabaseHandler.insertHashtagTweet(hashtag, tweetId) end);

        #send Tweet to Followers
        followersList = DatabaseHandler.getAllFollowers(user)
        Enum.map(followersList, fn follower -> sendTweetToUser(follower, tweetId, tweetText) end);
        
        #send Tweet to Mentions
         Enum.map(handles, fn handle -> sendTweetToUser(handle, tweetId, tweetText) end);
         
         push(socket, "ReceiveTweet", %{tweetId: tweetId, tweetText: tweetText});
         {:noreply, socket}
    end

    def handle_in("getAllTweets", payload, socket) do
        username = payload["username"];
        tweetList = DatabaseHandler.getAllTweetsByUser(username);
        push(socket, "ReceiveAllTweets", %{tweetList: tweetList});
        {:noreply, socket}
    end

    def handle_in("subscribeTo", payload, socket) do
        username = payload["username"];
        subscribedUser = payload["subscribedUser"];
        DatabaseHandler.addUserToFollowingList(username, subscribedUser);
        DatabaseHandler.addUserToFollowersList(subscribedUser, username);
        {:noreply, socket}
    end

    def handle_in("getTweetsByHashtag", payload, socket) do
        hashtag = payload["hashtag"];
        tweets = DatabaseHandler.getAllTweetsByHashtag(hashtag);
        push(socket, "TweetsByHashtag", %{hashtag: hashtag, tweets: tweets})
        {:noreply, socket}
    end

    def handle_in("getTweetsByHandle", payload, socket)  do
        handle = payload["handle"];
        tweets = DatabaseHandler.getAllTweetsByHandle(handle);
        push(socket, "TweetsByHandle", %{handle: handle, tweets: tweets})
        {:noreply, socket}
    end

    def handle_in("getAllSubscribersTweets", payload, socket) do
        username = payload["username"];
        tweets = DatabaseHandler.getSubscribedUsersTweets(username);
        push(socket, "SubscribedUsersTweets", %{tweets: tweets})
        {:noreply, socket}
    end

    def handle_call("getAllFollowing", payload, socket) do
        user = payload["username"];
        followingList = DatabaseHandler.getAllFollowing(user)
        push(socket, "AllFollowingUsers", %{followingList: followingList});
        {:noreply, socket}
    end

    def handle_call("getAllFollowers", payload, socket) do
        user = payload["username"];
        followersList = DatabaseHandler.getAllFollowers(user)
        push(socket, "AllFollowers", %{followersList: followersList});
        {:noreply, socket}
    end


    def sendTweetToUser(user, tweetId, tweetText) do
        DatabaseHandler.insertTweetInUserTable(user, tweetId);
        userSocket = DatabaseHandler.getUserSocketByName(user);
        if userSocket !== nil do
            push(userSocket, "ReceiveTweet", %{tweetId: tweetId, tweetText: tweetText});
        end
    end
end