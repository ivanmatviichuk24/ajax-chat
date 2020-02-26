sendRequest = (method, url, body = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    xhr.responseType = "json";

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send(JSON.stringify(body));
  });
};

class Chat {
  constructor(target) {
    this.target = document.getElementsByClassName(target)[0];
    this.users = [];
  }
  render = () => {
    const chat = document.createElement("section");
    chat.classList = "chat";
    const h3Chat = document.createElement("h3");
    h3Chat.textContent = "chat";
    chat.append(h3Chat);
    const messagesList = document.createElement("div");
    messagesList.classList = "messages-list";
    chat.append(messagesList);
    this.target.append(chat);
    const users = document.createElement("section");
    users.classList = "users";
    const h3Users = document.createElement("h3");
    h3Users.textContent = "Users";
    const usersList = document.createElement("div");
    usersList.classList = "users-list";
    const addUser = document.createElement("div");
    addUser.classList = "add-user";
    const addUserButton = document.createElement("button");
    addUserButton.textContent = "Add user";
    addUserButton.classList = "add-user-button";
    addUser.append(addUserButton);
    users.append(h3Users);
    users.append(usersList);
    users.append(addUser);
    this.target.append(users);
    this.addButtonListener();
  };
  renderUser = ({ firstname, lastname, city, phone, picture: imgUrl }) => {
    const user = document.createElement("div");
    user.classList = "user";
    const userImg = document.createElement("img");
    userImg.src = imgUrl;
    userImg.alt = "userLogo";
    user.append(userImg);
    const personalInformation = document.createElement("div");
    const name = document.createElement("h4");
    name.textContent = `${firstname} ${lastname}`;
    const userCity = document.createElement("p");
    userCity.textContent = `City: ${city}`;
    const userPhone = document.createElement("p");
    userPhone.textContent = `Phone: ${phone}`;
    personalInformation.append(name);
    personalInformation.append(userCity);
    personalInformation.append(userPhone);
    user.append(personalInformation);
    this.target.getElementsByClassName("users-list")[0].append(user);
  };
  addUser = () => {
    sendRequest("GET", "https://randomuser.me/api/")
      .then(body => {
        const res = body.results[0];
        this.users.push(
          new User(
            res.name.first,
            res.name.last,
            res.location.city,
            res.phone,
            res.picture.medium
          )
        );
        this.renderUser(this.users[this.users.length - 1]);
        setInterval(
          this.users[this.users.length - 1].randomText,
          Math.random() * (30000 - 5000) + 5000,
          this.renderMessage
        );
      })
      .catch(err => alert(err));
  };
  addButtonListener = () => {
    this.target
      .getElementsByClassName("add-user-button")[0]
      .addEventListener("click", this.addUser);
  };

  renderMessage = (firstname, lastname, imgUrl, { text_out }) => {
    const message = document.createElement("div");
    message.classList = "message";
    const userImg = document.createElement("img");
    userImg.src = imgUrl;
    userImg.alt = "userLogo";
    message.append(userImg);
    const personalInformation = document.createElement("div");
    const name = document.createElement("h4");
    name.textContent = `${firstname} ${lastname}`;
    personalInformation.append(name);
    const text = document.createElement("p");
    text.innerHTML = text_out;
    personalInformation.append(text);
    message.append(personalInformation);
    this.target.getElementsByClassName("messages-list")[0].append(message);
  };
}

const chat = new Chat("js-app");

chat.render();

class User {
  constructor(firstname, lastname, city, phone, picture) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.city = city;
    this.phone = phone;
    this.picture = picture;
    this.messages = [];
  }
  randomText = renderMessage => {
    sendRequest("GET", "http://www.randomtext.me/api/lorem/p-2/5-15/")
      .then(body => {
        this.messages.push(body);
        renderMessage(this.firstname, this.lastname, this.picture, body);
      })
      .catch(err => alert(err));
  };
}
