class SessionsController < Devise::SessionsController

  def create    
    # resource = warden.authenticate!(:scope => resource_name, :recall => :failure )
    resource = User.find(:first, :conditions => ["email = ?", params[:user][:email]])
    status = resource.valid_password?(params[:user][:password]) unless resource.nil?
  
    if status
      return sign_in_and_redirect(resource_name, resource)
    else
      return render:json => {:success => false, :errors => ["Invalid email or password"]}
    end
  end

  def sign_in_and_redirect(resource_or_scope, resource=nil)

    scope = Devise::Mapping.find_scope!(resource_or_scope)

    resource ||= resource_or_scope

    sign_in(scope, resource) unless warden.user(scope) == resource

    return render :json => {:success => true, :redirect => stored_location_for(scope) || after_sign_in_path_for(resource)}

  end



  #  def failure
  #
  #    return render:json => {:success => false, :errors => ["Login failed."]}
  #
  #  end
end
