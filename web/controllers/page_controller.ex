defmodule TwitterSimulator.PageController do
  use TwitterSimulator.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def user(conn, _params) do
    render conn, "index.html"
  end
end
