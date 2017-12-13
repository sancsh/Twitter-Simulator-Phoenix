use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :twitter_simulator, TwitterSimulator.Endpoint,
  secret_key_base: "207KXaphEzvyJ5AoqVN5YA29REpYsQSkGm1gyTDxL+pErQgKbkd9N3Ds7HJ4r/Ko"

# Configure your database
config :twitter_simulator, TwitterSimulator.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "twitter_simulator_prod",
  pool_size: 15
