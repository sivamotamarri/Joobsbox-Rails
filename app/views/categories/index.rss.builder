xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Jobs In JoobsBox"
    xml.description "the most flexible open source job board application"
    xml.link categories_url

    for cat in @categories
      xml.item do
        xml.title cat.name
        xml.link category_url(cat)
        xml.guid category_url(cat)
      end
    end
  end
end