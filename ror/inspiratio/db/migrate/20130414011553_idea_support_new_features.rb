class IdeaSupportNewFeatures < ActiveRecord::Migration
  def self.up
    add_column :ideas, :public, :boolean
    add_column :ideas, :tags, :string
  end

  def self.down
    remove_column :ideas, :public
    remove_column :ideas, :tags
  end
end
