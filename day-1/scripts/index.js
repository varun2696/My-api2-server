const baseURL = "http://127.0.0.1:9090";
const recipeURL = "http://127.0.0.1:9090/recipeIngredients?_limit=10&_page=1";
const employeeURL = "http://localhost:9090/employees";
let page = 1;


let mainSection = document.getElementById("main-section");
let fetchIngredientsButton = document.getElementById("fetch-ingredient");
let fetchEmployeesButton = document.getElementById("fetch-employees");
let addEmployeeButton = document.getElementById("add-employee");

window.addEventListener("load", () => {
  fetch(employeeURL, {
    method: 'GET'
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      let employeesCardData = data.map(item => {
        let obj = { ...item };
        obj.image = baseURL + item.image
        obj.description = '$' + item.salary
        return obj;
      })
      renderCardList(employeesCardData, 'Employee list');
    })
});



// 3 additional data
// method
// body <JSON>
// headers Content-Type: 'application/json'
addEmployeeButton.addEventListener("click", function () {
  // any validation here - the type is number

  let newEmp = {
    name: document.getElementById('employee-name').value,
    image: document.getElementById('employee-image').value,
    department: document.getElementById('employee-dept').value,
    salary: document.getElementById('employee-salary').value
  }

  fetch(employeeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEmp)
  }).then((res) => {
    // check here if the respose was ok
    return res.json();
  }).then((data) => {
    alert(`${data.name} was successfully created.`)
  }).catch((err) => {
    alert(`${err} happened.`)
  })
})


fetchIngredientsButton.addEventListener("click", function () {
  fetch(recipeURL)
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      let recipeCardData = data.map(item => {
        let obj = { ...item };
        obj.image = baseURL + item.image
        obj.description = item.description.substring(1, 75) + '...'
        return obj;
      })
      renderCardList(recipeCardData, 'Recipe list');
    })
})

fetchEmployeesButton.addEventListener("click", function () {
  fetch(employeeURL)
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      let employeesCardData = data.map(item => {
        let obj = { ...item };
        obj.image = baseURL + item.image
        obj.description = '$' + item.salary
        return obj;
      })
      renderCardList(employeesCardData, 'Employee list');
    })
})


function renderCardList(cardData, heading) {
  mainSection.innerHTML = `
  <h1>${heading ? heading : 'Data list'}</h1>
  <hr>
  <div class="card-list">
    ${cardData
      .map((item) => {
        let imageURL = item.image;
        let title = item.name;
        let description = item.description;
        let link = `#`;

        return getAsCard(imageURL, title, description, link);
      })
      .join("")}
  </div>
`;
}

function parseLinkHeader(linkHeader) {
  const linkHeadersArray = linkHeader.split(", ").map(header => header.split("; "));
  const linkHeadersMap = linkHeadersArray.map(header => {
    const thisHeaderRel = header[1].replace(/"/g, "").replace("rel=", "");
    const thisHeaderUrl = header[0].slice(1, -1);
    return [thisHeaderRel, thisHeaderUrl]
  });
  return Object.fromEntries(linkHeadersMap);
}



function getAsCard(imgSrc, title, description, link) {
  return `
    <div class="card">
    <div class="card__img">
      <img
        src=${imgSrc}
        alt= ${title}'s image
      />
    </div>

    <div class="card__body">
      <h3 class="card__item card__title">${title}</h3>
      <div class="card__item card__description">
        ${description}
      </div>
      <a href=${link} class="card__item card__link">Read more</a>
    </div>
  </div>
`;
}


let getData = async () => {
  let res = await fetch(recipeURL);
  res = await res.json();
  console.log(res);
  renderDom(res);
};

let postData = async () => {
  let name = document.getElementById("name");
  let batch = document.getElementById("batch");
  let section = document.getElementById("section");
  let score = document.getElementById("eval_score");
  let image = document.getElementById("image");

  let data = {
    name: name.value,
    batch: batch.value,
    section: section.value,
    score: score.value,
    image: image.value,
  };

  data = JSON.stringify(data);

  let res = await fetch(recipeURL, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  name.value = null;
  batch.value = null;
  section.value = null;
  score.value = null;
  image.value = null;

  getData();
};

let card = ({ id, name, batch, section, score, image }) => {
  let div = document.createElement("div");
  div.setAttribute("class", "student");
  let img = document.createElement("img");
  img.src = image;

  let h3 = document.createElement("h3");
  h3.innerText = name;

  let p1 = document.createElement("p");
  p1.setAttribute("class", "student_score");
  p1.innerText = score;

  let p2 = document.createElement("p");
  p2.innerText = `Batch: ${batch}`;

  let p3 = document.createElement("p");
  p3.innerText = section;

  let button_div = document.createElement("div");

  let remove_btn = document.createElement("button");
  remove_btn.setAttribute("class", "remove_student");
  remove_btn.innerText = "Remove";
  remove_btn.onclick = () => {
    removeStudent(id);
  };

  let update_btn = document.createElement("button");
  update_btn.setAttribute("class", "update_score");
  update_btn.innerText = "Update Score";
  update_btn.onclick = () => {
    updateData(id);
  };

  button_div.append(remove_btn, update_btn);

  div.append(img, h3, p1, p2, p3, button_div);

  return div;
};

let renderDom = (data) => {
  let container = document.getElementById("container");
  container.innerHTML = null;
  data.forEach((el) => {
    container.append(card(el));
  });
};

let removeStudent = async (id) => {
  let res = await fetch(`${recipeURL}/${id}`, {
    method: "DELETE",
  });
  getData();
};

let updateData = async (id) => {
  let score = document.getElementById("new_score");
  score.removeAttribute("disabled");
  score.onkeypress = () => {
    updateScore(event, id);
  };
  let student = await fetch(`${recipeURL}/${id}`);
  student = await student.json();
  score.value = student.score;
};

let updateScore = async (e, id) => {
  let new_score = document.getElementById("new_score");
  let student = await fetch(`${recipeURL}/${id}`);
  student = await student.json();
  if (e.key === "Enter") {
    let data = { score: +new_score.value || +student.score };
    let res = await fetch(`${recipeURL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    new_score.value = null;
    new_score.setAttribute("disabled", true);
    getData();
  }
};

let sortLowToHigh = async () => {
  let res = await fetch(`${recipeURL}?_sort=score&_order=asc`);
  res = await res.json();
  renderDom(res);
};

let sortHighToLow = async () => {
  let res = await fetch(`${recipeURL}?_sort=score&_order=desc`);
  res = await res.json();
  renderDom(res);
};

let greaterThan = async () => {
  let res = await fetch(`${recipeURL}?score_gt=5`);
  res = await res.json();
  renderDom(res);
};

let lessThan = async () => {
  let res = await fetch(`${recipeURL}?score_lte=5`);
  res = await res.json();
  renderDom(res);
};


// async function getUser(userId){
//   try {
//     let res = await fetch(`http://localhost:9090/users/${userId}`);
//     if (res.ok) {
//       let data = await res.json();
//       return data;
//     } else {
//       return `server responded with a ${res.status} error.`
//     }
//   } catch (error) {
//     return 'error';
//   }
// }

// getUser(51).then(dat => console.log(dat));