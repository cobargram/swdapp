const getDate = (dateRaw) => {
    if(dateRaw!=null){
        let date = new Date(dateRaw);

        let year  = date.getFullYear();
        let month = date.getMonth() + 1;
        let day   = date.getDate();

        return `${year}-${month}-${day}`;
    }

    return null;
}

const setValue = (selector, value) => {
    document.querySelector(selector).value = value;
}

const setHtmlContent = (selector, value) => {
    document.querySelector(selector).innerHTML = value;
}

function error(message) {
    let responseError = document.querySelector("#error");
  
    responseError.innerHTML = message;
}