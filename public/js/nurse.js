document.addEventListener("DOMContentLoaded", function () {
    // visitors list
    const visitorsContainer = document.querySelector("#visitors");

    const getListOfVisitors = () => {
        if(visitorsContainer!=null){
            (new FetchRequest("GET", "users/visitors")).send(listOfVisitorsSuccess, listOfVisitorsFailure);
        }
    }

    const listOfVisitorsSuccess = (data) => {
        let row = "";

        data.forEach((visitor, i) => {
            row += "<tr>" +
                `<td>${i + 1}</td>` +
                `<td>${visitor.username}</td>` +
                `<td>${visitor.email}</td>` +
                `<td>${visitor.first_name}</td>` +
                `<td>${visitor.last_name}</td>` +
                `<td>${getDate(visitor.dob)}</td>` +
                `<td><div>
                    <a href="/visitor/${visitor.id}/edit">Edit</a>
                    <button onclick="deleteUserRecord(${visitor.id})">Delete</button>
                </div></td>` +
            "</tr>";
        });

        visitorsContainer.innerHTML = row;
    }

    const listOfVisitorsFailure = (data) => {
        const row = "<tr>" +
                `<td colspan="6">${data.message}</td>` +
            "</tr>";

        visitorsContainer.innerHTML = row;
    }

    getListOfVisitors();

    // edit visitor info
    const editUserRecord = () => {
        const url = window.location.href;

        if(url.includes("visitor/")){
            const splitUrl = url.split("/");

            const id = splitUrl[4];

            (new FetchRequest("GET", `users/find/${id}`)).send(editUserRecordSuccess, editUserRecordFailure);
        }
    }

    const editUserRecordSuccess = (data) => {
        setValue("#user-id", data.id);
        setValue("#username", data.username);
        setValue("#email", data.email);
        setValue("#first-name", data.first_name);
        setValue("#last-name", data.last_name);
        setValue("#dob", data.dob);
    }

    const editUserRecordFailure = (data) => {
        error(data.message);

        document.querySelector("#first-name").readonly = true;
        document.querySelector("#last-name").readonly = true;
        document.querySelector("#dob").readonly = true;
    }

    editUserRecord();
});

// delete user record
const deleteUserRecord = (userId) => {
    const confirmAction = confirm("The record of the selected user would now be removed?");

    if(confirmAction){
        (new FetchRequest("DELETE", "users", { userId })).send(deleteUserRecordSuccess, deleteUserRecordFailure);
    }
}

const deleteUserRecordSuccess = (data) => {
    alert("The selected record has been removed successfully");
    window.location.reload();
}

const deleteUserRecordFailure = (data) => {
    console.log(data);
}

// update visitor record
const getValue = (selector) => {
    return document.querySelector(selector).value;
}

const updateUserRecord = () => {
    const userId    = getValue("#user-id");
    const firstName = getValue("#first-name");
    const lastName  = getValue("#last-name");
    const dob       = getValue("#dob");

    (new FetchRequest("PUT", `records/update/${userId}`, { firstName, lastName, dob })).send(updateUserRecordSuccess, updateUserRecordFailure);
}

const updateUserRecordSuccess = (data) => {
    alert(data.message);
}

const updateUserRecordFailure = (data) => {
    error(data.message);
}
