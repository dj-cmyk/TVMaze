/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const missingImageURL = "https://tinyurl.com/tv-missing";

async function searchShows(query) {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  
  const returnArr = [];
  for (let item of response.data){
    try{
      const searchResults = {
        id: item.show.id,
        name: item.show.name,
        summary: item.show.summary,
        image: item.show.image.medium
      }
      returnArr.push(searchResults);
    } catch(e){
      const searchResults = {
        id: item.show.id,
        name: item.show.name,
        summary: item.show.summary,
        image: missingImageURL
      }
      returnArr.push(searchResults);
    }
   
  }
  return returnArr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-success" id="episodeBtn" data-toggle="modal" data-target="#exampleModalLong">Get Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});






/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const episodeResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodeArr = [];
  for (let episode of episodeResponse.data){
    const episodeData = {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }
    episodeArr.push(episodeData);
  }
  
  return episodeArr;
}



function populateEpisodes(episodeArray) {
  $("#episodes-area").show();
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  
  for (let ep of episodeArray) {
    let $item = `<li>${ep.name} (season ${ep.season}, number ${ep.number})</li>`;
    $episodesList.append($item);
  }
}





let btnForEpisodes = $("#shows-list");
btnForEpisodes.on("click", async function handleEpisodes(e){
  e.preventDefault();
 
  if (e.target.id === "episodeBtn"){
    
    let showId = e.target.parentElement.parentElement.getAttribute("data-show-id");
    
    let eps = await getEpisodes(showId);
   
    populateEpisodes(eps);
  }
})