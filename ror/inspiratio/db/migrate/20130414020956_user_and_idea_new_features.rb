class UserAndIdeaNewFeatures < ActiveRecord::Migration
  def self.up
    add_column :ideas, :views, :integer
    add_column :ideas, :likes, :integer
    add_column :ideas, :colors, :string
    add_column :users, :location, :string
  end

  def self.down
    remove_column :ideas, :views
    remove_column :ideas, :likes
    remove_column :ideas, :colors
    remove_column :users, :location
  end
end
