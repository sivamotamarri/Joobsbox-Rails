xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Jobs In #{@category.name}"
    xml.description "the most flexible open source job board application"
    xml.link jobs_url

    for job in @jobs
      xml.item do
        xml.title job.title
        xml.description job.description
        xml.pubDate job.created_at.to_s(:rfc822)
        xml.link job_url(job)
        xml.guid job_url(job)
      end
    end
  end
end