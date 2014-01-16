# root
get '/' do
  erb :'panels/about'
end

# flush blog and pocket
get '/flushcache' do
  #CACHE.flush_all()
  CACHE.delete('blog-posts')
  #CACHE.delete('reading-list')
  redirect '/'
end

# panel pages
pages = %w[about projects blog tweeting reading]

# standard routes
route_rgx = %r{^/(#{pages.join '|'})\/?$}i # case-insensitive
get route_rgx do
  erb ('panels/' + params[:captures].first.downcase).to_sym
end

# ajax requests
route_rgx = %r{^/ajax/(#{pages.join '|'})$}i # case-insensitive
get route_rgx do
  erb ('panels/'+params[:captures].first.downcase).to_sym, :layout => false
end

#project page redirects
projects = %w[ prism amicus essaytyper hardlyworkin travelogue hackyale whatsherface-book
              turntaylor chomalab chickentenders subletmeyale ]
route_rgx = %r{^/(#{projects.join '|'})$}i # case-insensitive
get route_rgx do
  redirect '/projects/#' + params[:captures].first.downcase
end


#map all stylesheets to sass
get '/stylesheets/:name.css' do
 content_type 'text/css', :charset => 'utf-8'
 scss(:"/../public/stylesheets/#{params[:name]}")
end

#errors
not_found do
  erb :'errors/404'
end
error do
  erb :'errors/500'
end