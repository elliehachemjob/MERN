using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using SignalRChat.Hubs;
using System.Collections;
using System.Collections.Generic;

namespace ChatService
{
    public class Startup
    {
        public void
            //
            ConfigureServices(IServiceCollection services)
        {

            //adding signalr service  for the hubs to work
            services.AddSignalR();


            //Cross-Origin Resource Sharing it allow us to do HTTP requests
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                    {
                        builder.WithOrigins("http://localhost:3000") 
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });


            //add singleton = single isntance of something 
            //to store use and room in it 
            //key connection ID and user and room as value
            //
            services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors();


            app.UseEndpoints(endpoints =>
            {

                //this is the url in the frontend that we use while connecting 
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
