defmodule TwitterSimulator.UserController do
    use TwitterSimulator.Web, :controller
  
    alias TwitterSimulator.User

    def index(conn, _params) do
      render conn, "index.html"
    end

    def show(conn, %{"id" => id}) do
        render conn, "show.html", %{id: id}
    end
  
    # def show(conn, %{"id" => id}) do
    #     #user = Repo.get!(User, id)
    #     html conn, "<html> <body> <h1> Hello, #{id} </h1> </body> </html>";
    # end

  end
  