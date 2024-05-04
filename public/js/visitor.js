document.addEventListener("DOMContentLoaded", function () {
    const visitorContainer = document.querySelector("#visitor");

    const getVisitor = () => {
        if(visitorContainer!=null){
            (new FetchRequest("GET", "users/find")).send(getVisitorSuccess, getVisitorFailure);
        }
    }

    const getVisitorSuccess = (data) => {
        const visitor = data;

        setHtmlContent("#username", visitor.username);
        setHtmlContent("#email", visitor.email);
        setHtmlContent("#first-name", visitor.first_name);
        setHtmlContent("#last-name", visitor.last_name);
        setHtmlContent("#dob", visitor.dob);
    }

    const getVisitorFailure = (data) => {
        visitorContainer.innerHTML = data.message;
    }

    getVisitor();
});