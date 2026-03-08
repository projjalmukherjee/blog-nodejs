document.addEventListener('DOMContentLoaded',()=>{

    const searchBtn = document.querySelector('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchClose = document.querySelector('#searchclose');
    const searchInput = document.querySelector('#searchInput');
    
    searchBtn.addEventListener('click',()=>{
        searchBar.classList.add('open');
        searchBtn.setAttribute('aria-expanded','true');
        searchInput.focus();
    })
     searchClose.addEventListener('click',()=>{
        searchBar.classList.remove('open');
        searchBtn.setAttribute('aria-expanded','false');
    })

})