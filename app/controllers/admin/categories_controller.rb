class Admin::CategoriesController < ApplicationController
  before_filter :authenticate_user!
  
  layout 'admin'
  require 'json'

  def index
  end

  def create   
    data =  JSON.parse params[:data]
    categories = data['categories']
    must_reload = false
    found_categories  = Array.new

    categories.each do |cat|   
      if cat["id"].blank?
        parentid = cat["parentId"].kind_of?(Fixnum) ? cat["parentId"] : cat["parentId"].gsub(/[node_]/, '')
        name = cat["name"].gsub(/(^\w\.-\s)/, '')
        category = Category.new
        category.name = name
        category.parent_id = parentid
        if category.valid?
          category.save
          found_categories.push(category.id)
          must_reload = true
        end
      else
        if cat["id"] != 0
          id = cat["id"].gsub(/[node_]/, '')
          parentid = cat["parentId"].kind_of?(Fixnum) ? cat["parentId"] : cat["parentId"].gsub(/[node_]/, '')
          ex_cat = Category.find_by_id(id)
          found_categories.push(ex_cat.id)
          if ex_cat.name != cat["name"] || ex_cat.parent_id != parentid
            begin
             ex_cat.update_attributes(:name => cat["name"] , :parent_id => parentid)
              must_reload = true
            rescue
            end
          end
        end
      end   
    end
    
    #Deleteing records
    total_cat = Category.all.map(&:id)

    deleted_ones =  total_cat - found_categories
    if !deleted_ones.blank?
       Category.where(:id => deleted_ones).delete_all
    end

    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: {"mustReload" => must_reload}}
    end
    
  end
end
