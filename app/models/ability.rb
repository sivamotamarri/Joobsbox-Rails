class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #


    if user.has_role? :admin
      can :manage, :all
    elsif user.has_role?(:employer)      
      can :manage, Job
    elsif user.has_role?(:jobseeker) 
      can :manage, Resume
    elsif user.has_role?(:recruiter)
      can :manage, [Job,Resume]
    else
      can :read , [Job,Resume]
    end

    can :destroy, [Resume], :user_id => user.id

#    Group.all.each do |grp|
#      grp.permissions.each do |perm|
#        if perm.group.users.include?(user)
#          if perm.m == "manage"
#            if perm.joobs_model_name == "Job"
#              can :manage , Job
#            else
#              can :manage , Resume
#            end
#          else
#            s = []
#            s.push(:read) if perm.r != "read"
#            s.push(:create) if perm.c != "create"
#            s.push(:update) if perm.u != "update"
#            s.push(:delete) if perm.d != "delete"
#            if perm.joobs_model_name == "Job"
#              cannot s ,  Job , :user_id => user.id
#            else
#              cannot s ,  Resume , :user_id => user.id
#            end
#          end
#        end
#      end
#    end
    #
    # The first argument to `can` is the action you are giving the user permission to do.
    # If you pass :manage it will apply to every action. Other common actions here are
    # :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. If you pass
    # :all it will apply to every resource. Otherwise pass a Ruby class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end
end
