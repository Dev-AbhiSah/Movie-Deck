// const testCard = document.querySelector(".movie-card").children;
 const imgLinkPrefix = "https://image.tmdb.org/t/p/original/";
 const moviesCardCnt = document.getElementById("movies-card-cnt");
 const likedHeart = "./images-icons/icons8-heart-48.png";
 const unlikedHeart = "./images-icons/icons8-heart-32.png";
 const pagesArray = [1,1,1];
 
 const searchInputBox = document.querySelector("#input-box-for-search");
 const pageBlock = document.querySelectorAll(".page-block");
 const prevPages = document.querySelector(".prev-pages");
 const nextPages = document.querySelector(".next-pages");
 const favbtn = document.querySelector("#favorites-btn");
 const sortByRating = document.querySelector("#btn-to-sort-by-rating");
 const sortByDate = document.querySelector("#btn-to-sort-by-date");
 const allMoviesBtn = document.querySelector("#all-movie-card-btn")
 const paginationCnt = document.querySelector("#pagination-cnt");
 
let specificMovieDisplayOrderIndex = 0;
 let moviesList;
 let tempMoviesList;
 let sortType="popularity.desc";
 let type=  "discover";   // by default type is discover but when we have to search type change to search and then discover;
 let query = "";          // this is to for query when search is input
 let currentActiveButton = allMoviesBtn;
 currentActiveButton.classList.add("current-active-btn");
 currentActiveButton.disabled =true;
let paginationDisplayValue = "none";
 let favMoviesList =[];
 let checkMoviesInFavMoviesList;
 let pageno = 0;
 let currentPageBlock = pageBlock[0];
async function getMoviesList(page,showFavMovies =  false, pagination = true)
{
    
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTMzMDQzOGY2YmI1MTNhNzczYTQwODQ3NDdlZjMxMSIsInN1YiI6IjY1ZGExZTU4YmVmZDkxMDE2NDFmNzQ0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xxbTtP8lN34P1ogTA2qRRP0YjObmfYeFynQrU8Byllo'
        }
      };
      paginationDisplayValue ="none";
    paginationCnt.style.display = paginationDisplayValue;
    favMoviesList = JSON.parse(localStorage.getItem("favMoviesList")) ? JSON.parse(localStorage.getItem("favMoviesList"))  : [];
     if(!showFavMovies)
    {
        let link = `https://api.themoviedb.org/3/${type}/movie?${query}include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortType}`
        let response =await fetch(`${link}`, options);
        let result = await response.json();
        moviesList = await result.results;
        paginationDisplayValue= "flex";
    }  
    else {
        moviesList = favMoviesList;
        console.log(moviesList);
    }

        
        for(let film of moviesList)
        {
            checkMoviesInFavMoviesList = favMoviesList.find((currentFilm)=>{
                
                    return film.id === currentFilm.id
            });
            let movieCard = document.createElement('div');
            movieCard.innerHTML= '<img src="" class="movie-poster" alt="Something Broken"><h1></h1><p>Rating: <span style="color: #da667b;"></span></p><p>Popularity: <span style="color: #da667b;"></span></p><img src="./images-icons/icons8-heart-32.png" class="heart" alt="heart">'
            movieCard.classList.add("movie-card");
            let movieCardItem = movieCard.children;
            if(film.poster_path === null)
            {
                movieCardItem.item(0).setAttribute("src","./images-icons/lost-image1.jpg");
            }
            else{
                movieCardItem.item(0).setAttribute("src",`${imgLinkPrefix}${film.poster_path}`);
            }
            
            movieCardItem.item(1).innerText = film.title;
            movieCardItem.item(2).firstElementChild.innerText = film.vote_average;
            movieCardItem.item(3).firstElementChild.innerText = film.popularity+"+";
            if(checkMoviesInFavMoviesList)
            {
                movieCardItem.item(4).setAttribute("src", likedHeart);
                movieCardItem.item(4).classList.toggle("liked-heart");
            }else{
                movieCardItem.item(4).setAttribute("src", unlikedHeart);
            }
            movieCardItem.item(4).addEventListener("click",function(e){
               
             clickHeart(e, film, movieCard);
            })
            moviesCardCnt.appendChild(movieCard);
        }
        if(pagination)
        paginationCnt.style.display = "flex";
        else 
        paginationCnt.style.display = "none";
    {// const listOfMoviesCard = document.querySelectorAll(".movie-card");
    // console.log(moviesList)}
}
}
currentPageBlock.classList.add("current-page");
getMoviesList(currentPageBlock.innerText);

function getMoviesListFromPage(e, showFavMovies =  false, pagination = true){
    currentPageBlock.classList.remove("current-page");
    currentPageBlock =this;
    currentPageBlock.classList.add("current-page");
    pageno = this.innerText;
    pagesArray[specificMovieDisplayOrderIndex] = pageno;
    moviesCardCnt.innerHTML= "";
    getMoviesList(pageno, showFavMovies, pagination);
}

function clickHeart(e,film ,movieCard)
        {
            e.target.classList.toggle("liked-heart");
           if(e.target.getAttribute("src") === unlikedHeart)
           {
            e.target.setAttribute("src" , likedHeart);
            favMoviesList.push(film);
            
           }
           else
           {
            e.target.setAttribute("src" , unlikedHeart);
           favMoviesList= favMoviesList.filter((currentFilm)=>{
                {
                    if(currentFilm.id !== film.id)
                    return currentFilm;
                }
            });
           }
           localStorage.setItem("favMoviesList", JSON.stringify(favMoviesList));
           if(currentActiveButton === favbtn )
           {
            moviesCardCnt.innerHTML= "";
            getMoviesList(currentPageBlock.innerText,true  )
           }
        //    console.log(favMoviesList);
        }
function prevIconClick(){    //This is click function, get executed when previous icon is clicked;
    const startPage = pageBlock[0].innerText;
    if(startPage>4)
    {
        let index=3;
        for(let i =startPage-1; i>=startPage-4;i--, index--)
        {
            pageBlock[index].innerText = i;
        }
        getMoviesListFromPage.call(pageBlock[3])
    }
    // console.log("prevClicked");
}
function nextIconClick(){     //This is click function, get executed when next icon is clicked;
    const startPage = Number(pageBlock[3].innerText);
    if(startPage<200)
    {
        let index=0;
        for(let i =startPage+1; i<=startPage+4;i++, index++)
        {
            pageBlock[index].innerText = i;
        }
        getMoviesListFromPage.call(pageBlock[0])
    }
}
function favBtnClick(){      //This is click function, get executed when favorite is clicked;
    currentActiveButton.disabled =false;
    currentActiveButton.classList.remove("current-active-btn","active-fav");
    currentActiveButton =this;
    currentActiveButton.classList.add("active-fav");
    currentActiveButton.disabled =true;
    moviesCardCnt.innerHTML= "";
   getMoviesList(currentPageBlock.innerText,true, false  );
}
function updatePage(e)
{  
   currentPageBlock.classList.remove("current-page");
   let temp = pagesArray[specificMovieDisplayOrderIndex];
//    console.log(temp);
   let i =0;
   let j=0;

   if(temp%4 === 0)
   {
       if(temp === 0 )
       {
           for( i = 1;i <=4; i++,j++)
              pageBlock[j].innerText = i;
       }
       else{
           for(i = temp-3; i<=temp; i++, j++)
           pageBlock[j].innerText = i;
       }
       currentPageBlock  = pageBlock[3];
   }
    else{
        i = temp - temp%4+1;
        let times = i+3;
        for( ; i<=times; i++, j++)
        pageBlock[j].innerText = i;
        currentPageBlock  = pageBlock[temp%4-1];
    }
    getMoviesListFromPage.call(currentPageBlock,e, false , true);
}
function activeState()
{
    currentActiveButton.disabled =false;
    currentActiveButton.classList.remove("current-active-btn","active-fav");
    currentActiveButton =this;
    currentActiveButton.classList.add("current-active-btn");
    currentActiveButton.disabled =true;
}
function allBtnClick(e){
    activeState.call(this);
    specificMovieDisplayOrderIndex =0;
    sortType="popularity.desc"
    updatePage(e);
    // console.log(e.target.innerText);
}
function sortMoviesByDate(e){
    activeState.call(this);
    sortType= "primary_release_date.desc";
    specificMovieDisplayOrderIndex =1;
    updatePage(e);
}
function sortMoviesByRating(e)
{
    activeState.call(this);
    sortType= "vote_average.desc";
    specificMovieDisplayOrderIndex =2;
    updatePage(e)
}
function search(e)
{
    runDebounce(e);
}
function debounce(time)
{
    let timeOutId;
    return (e)=>{
        if(timeOutId)
        {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(()=>{
            let rawText = e.target.value;
            if(rawText==="")
            {
            if(currentActiveButton === favbtn)
            {
            moviesCardCnt.innerHTML= "";
            getMoviesList(currentPageBlock.innerText,true, false  );
            }
            else
            getMoviesListFromPage.call(currentPageBlock,e, false );
            }
            else if(currentActiveButton === favbtn)
            {
                const regexp = new RegExp(rawText, 'i')
                const searchedFavMovies = favMoviesList.filter((film)=>
                    regexp.test(film.title)
                )
                const temp =favMoviesList;
                favMoviesList = searchedFavMovies;
                localStorage.setItem("favMoviesList", JSON.stringify(favMoviesList));
                moviesCardCnt.innerHTML= "";
                getMoviesList(currentPageBlock.innerText,true, false  );
                localStorage.setItem("favMoviesList", JSON.stringify(temp));
                favMoviesList = JSON.parse(localStorage.getItem("favMoviesList"));
            }
            else
            {
            let newText = "%22";
            for(let i=0;i <rawText.length;i++)
            {
                if(rawText.charAt(i)===' ')
                newText = newText+"%20";
                else
                newText+=rawText.charAt(i);
            }
            newText =`${newText}%22`;
            moviesCardCnt.innerHTML= "";
            const temp = sortType;
            sortType ='';
            type = "search";
            query = `query=${newText}&`
            // console.log(query);
            getMoviesList(1, false, false);
            type = "discover";
            query= "";
            sortType = temp;
        }
        },time);
        
    }
}
const runDebounce = debounce(0);

searchInputBox.addEventListener("input",search)
sortByRating.addEventListener("click", sortMoviesByRating)
sortByDate.addEventListener("click",sortMoviesByDate)
favbtn.addEventListener("click",favBtnClick );
allMoviesBtn.addEventListener("click", allBtnClick)
prevPages.addEventListener("click", prevIconClick);
nextPages.addEventListener("click", nextIconClick);
for(let node of pageBlock)
{
    node.addEventListener("click",getMoviesListFromPage)
}







// async function check(){
//     const options = {
//         method: 'GET',
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTMzMDQzOGY2YmI1MTNhNzczYTQwODQ3NDdlZjMxMSIsInN1YiI6IjY1ZGExZTU4YmVmZDkxMDE2NDFmNzQ0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xxbTtP8lN34P1ogTA2qRRP0YjObmfYeFynQrU8Byllo'
//         }
//       };
      
//       let response =await fetch('https://api.themoviedb.org/3/search/movie?query=%22%20land%20of%22&include_adult=false&include_video=false&language=en-US&page=1', options);
//       let result = await response.json();
//       let arr = await result.results;
//       console.log(arr);
// }
// check(); 