require 'test_helper'

class IdeasControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end

  def test_show
    get :show, :id => Idea.first
    assert_template 'show'
  end

  def test_new
    get :new
    assert_template 'new'
  end

  def test_create_invalid
    Idea.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end

  def test_create_valid
    Idea.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to idea_url(assigns(:idea))
  end

  def test_edit
    get :edit, :id => Idea.first
    assert_template 'edit'
  end

  def test_update_invalid
    Idea.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Idea.first
    assert_template 'edit'
  end

  def test_update_valid
    Idea.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Idea.first
    assert_redirected_to idea_url(assigns(:idea))
  end

  def test_destroy
    idea = Idea.first
    delete :destroy, :id => idea
    assert_redirected_to ideas_url
    assert !Idea.exists?(idea.id)
  end
end
