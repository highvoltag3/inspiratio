class IdeaSupportNewFeatures < ActiveRecord::Migration
  def self.up
    add_column :ideas, :public, :boolean
    add_column :ideas, :tags, :string
    add_column :ideas, :views, :integer
    add_column :ideas, :likes, :integer
    add_column :ideas, :colors, :string
  end

  def self.down
    remove_column :ideas, :public
    remove_column :ideas, :tags
    remove_column :ideas, :views
    remove_column :ideas, :likes
    remove_column :ideas, :colors
  end
end
