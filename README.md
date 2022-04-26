
# HAGL
<div align="center">
  <a href="https://github.com/hoangphuc552001/Estate-Market">
    <img src="https://res.cloudinary.com/phucle/image/upload/v1650986196/HAGLEstateMarket/realestate_rxkqhq.png" alt="Logo" width="100" height="100" style="border-radius: 25px;">
  </a>
  <h3 align="center">Real Estate Market</h3>
</div>

![madewith](https://img.shields.io/badge/Made%20with-HAGL%20Team-1f425f.svg)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#description">Description</a>
    </li>
    <li>
      <a href="#component">Component</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
    <a href='#contributors'>Contributors</a>
    </li>
      <li>
    <a href='#license'>License</a>
    </li>
      <li>
    <a href='#demo'>Demo</a>
    </li>
      <li>
    <a href='#deployment'>Deployment</a>
    </li>
  </ol>
</details>

<br/>

# Description
- This project about the website which connect people who want buy or sell real estate products. More over it also connect with organization to perform their product
# Component
- This project based on MVC Model/Design Pattern

  ## 1. Server
    - Using Nodejs with v17.4.0
    - Framework: Express JS
      <br>
      ![nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ## 2. Template Engine
    - Using handlebarsjs with front end tools:
      <br>
      ![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
      ![html](https://img.shields.io/badge/HTML-e56d30?style=for-the-badge&logo=html5&logoColor=white)
      ![css](https://img.shields.io/badge/CSS-406ae9?&style=for-the-badge&logo=css3&logoColor=white)
# Demo

- Home page
  ![img](https://res.cloudinary.com/phucle/image/upload/v1650991917/HAGLEstateMarket/Capture_itt02q.png)
# Deployment

-
# Installation

**1. Install Nodejs**

- Minimum for Expressjs (server)
  <br>
  [![NPM Version][npm-image]][node-url]
- NPM version
  <br>
  [![NPM Version][npm-ver]][node-url]


Install [Node.js](https://nodejs.org/) and npm first. If you already have Nodejs and npm installed, skip this step.

I am using Nodejs with version v17.4.0
Install NodeJS through this link:
```sh
https://nodejs.org/en/download/
```

**2. Connect Database**

2.1 Connect database mysql with database name realestate

2.2 Run realestate.sql script in folder

2.3 Configure in file db.js that inside folder Utils
```sh
    host: '127.0.0.1',
    port: 
    user: 'root',
    password: 
    database: 'realestate'
```

**3. Run the project**

- Use these commands to run the project:
```sh
npm i
```
```sh
npm install
```
```sh
npm start
```
- Or, configure file app.js to be run in your IDE (Intellij). **File to run: ```app.js```**


# Contributors

HAGL - Team
- [Le Hoang Phuc](https://github.com/hoangphuc552001)
- [Hoang Minh Huy](https://github.com/galindo-hoang)
- [Pham Tien Quan](https://github.com/19127526)


## License

[Node](LICENSE.md)

[npm-image]: https://img.shields.io/node/v/express
[npm-ver]:https://img.shields.io/npm/v/node
[node-url]:https://nodejs.org/en/download/
