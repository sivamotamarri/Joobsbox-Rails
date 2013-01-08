class AppliedResume < ActiveRecord::Base
  attr_accessible :job_id, :resume_id , :covering_letter, :applied_date
  belongs_to :resume
  belongs_to :job
  validates :resume_id , :presence => true
end
