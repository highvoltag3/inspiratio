Inspiratio::Application.routes.draw do

  resources :ideas do
    member do
      get :like # NOTE: choose either a "post"
      post :comment
      post :save_bubble_list
    end
  end

  devise_for :users
  
  # Do this once you build a Users Controller
  # resources :users do
  #  member do
  #    resources :ideas
  #  end
  # end
  
  get 'users/:id/ideas' => 'ideas#user_idea', :as => :user_idea

  root :to => "home#index"

  # this route is for file downloads
  # TODO: we don't need it right now
  # match "ideas/get/:id" => "ideas#get", :as => "download"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'

end
