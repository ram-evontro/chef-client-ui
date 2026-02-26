const path = require("path");
const axios = require('axios');


const baseUrl = 'https://chefs-a-porter-backend.onrender.com/v1'  //`https://chefv2.hypervergedemo.site/v1`;

exports.onCreatePage =  async ({ actions, graphql }) => {
    const { createPage } = actions;
    const EventsRequest = await axios(baseUrl + '/menu/?limit=1000')
    EventsRequest.data.results.forEach((item)=>{
        createPage({
            path: `event-details/${item.id}/`,
            component: path.resolve("./src/templates/EventsTemplate.js"),
            context: {
              id: item.id
            },
          });
    })  


    const TicketedDetailRequest = await axios(baseUrl + '/event/all/?limit=1000')
    TicketedDetailRequest.data.results.forEach((item)=>{
        createPage({
            path: `ticketed-detail/${item.id}/`,
            component: path.resolve("./src/templates/TicketedDetailTemplate.js"),
            context: {
              id: item.id
            },
          });
    })  

    const ChefsRequest = await axios(baseUrl + '/cms/our_chefs/')
    ChefsRequest.data.our_chefs.our_chefs.chefs.results.forEach((item)=>{
        createPage({
            path: `chef-details/${item.id}/`,
            component: path.resolve("./src/templates/ChefsDetailTemplate.js"),
            context: {
              id: item.id
            },
          });
    }) 
    
    


};