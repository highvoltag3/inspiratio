require 'test_helper'

class IdeaTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Idea.new.valid?
  end
end
