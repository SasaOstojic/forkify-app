import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './recipeView.js';
import searchView from './searchView.js';
import resultsView from './resultsView.js';
import paginationView from './paginationView.js';
import bookmarksView from './bookmarksView.js';
import addRecipeView from './addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');
// console.log(recipeContainer)

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if(module.hot){
  module.hot.accept()
}

const controllRecipes = async function(){
  //Loading recipe
  try{

    const id = window.location.hash.slice(1);
    
    if(!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage())
    
    bookmarksView.update(model.state.bookmarks)
    
    await model.loadRecipe(id);
    
    //render
    recipeView.render(model.state.recipe);
    
    // console.log(recipeContainer)

    //Rendering recipe
  }catch(err){
   
    recipeView.renderError()
  }
}

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if(!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage())

    //Render initial pagination
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function(goToPage) {
    // Render new results
    resultsView.render(model.getSearchResultsPage(goToPage))

    //Render initial pagination
    paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  // Update the recipe servings
  model.updateServings(newServings)

  //Update the rcipe view
  recipeView.render(model.state.recipe)
}

const controlAddBookmark = function(){
  //Add bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //Update recipeview
  recipeView.update(model.state.recipe)

  //Render bookmark
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{

     //Show loading spinner
     addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)
    // Render recipe
    recipeView.render(model.state.recipe)

     //Success message
     addRecipeView.renderMessage();

     //Render bookmark view
     bookmarksView.render(model.state.bookmarks);

     //Change ID in the url
     window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //Close form popu
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  }catch(err){
    addRecipeView.renderError(err.message)
  }
}

// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controllRecipes));
const init = function() {
  bookmarksView.addHndlerRender(controlBookmarks)
  recipeView.addHandlerRender(controllRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();


