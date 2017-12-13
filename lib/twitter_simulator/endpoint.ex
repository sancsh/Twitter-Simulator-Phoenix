defmodule TwitterSimulator.Endpoint do
  use Phoenix.Endpoint, otp_app: :twitter_simulator

  socket "/socket", TwitterSimulator.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :twitter_simulator, gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug Plug.Session,
    store: :cookie,
    key: "_twitter_simulator_key",
    signing_salt: "aBy4CQVs"

  plug TwitterSimulator.Router

  def init(_key, config) do
    :ets.new(:user_pid_table, [:set, :public, :named_table]);
    :ets.new(:user_tweet_table, [:set, :public, :named_table]);
    :ets.new(:user_table, [:set, :public, :named_table]);
    :ets.new(:tweet_table, [:set, :public, :named_table]);
    :ets.new(:handle_table, [:set, :public, :named_table]);
    :ets.new(:hashtag_table, [:set, :public, :named_table]);
    :ets.new(:following_table, [:set, :public, :named_table]);
    :ets.new(:follower_table, [:set, :public, :named_table]);
    :ets.new(:user_sockets, [:set, :public, :named_table]);

    :ets.insert_new(:user_table, {"huz1", "sis"});
    :ets.insert_new(:user_table, {"huz2", "sis"});
    
    if config[:load_from_system_env] do
      port = System.get_env("PORT") || 4000
      {:ok, Keyword.put(config, :http, [:inet6, port: port])}
    else
      {:ok, config}
    end
  end
end
