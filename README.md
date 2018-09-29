# hapijs-demo (based on **hapijs v17.5.4**)

## Introduction

This is a hapijs https server basic demo, support the *HTTPS protocol*,*jwt authentication* .

**Requirements**
  - [Nodejs](https://nodejs.org/en/) >= 10.0.0
  - [hapi js](https://hapijs.com/) >= 17.0.0

**File directory** 

- config
  - config.js
  - test_data.js
- server
  - https_keys
  - routers
  - ultis
- test
  - fixtures
- view
  - static
    - css
    - font
    - img
    - js
  - index.html 
- www.js

**Getting start**

```
#clone the project
git clone https://github.com/fengqiaozhu/hapijs-demo.git
cd hapijs-demo

#install dependencies
npm install 
or
yarn

#run dev
npm start

#open project website
https://localhost

#project api documentation
https://localhost/documentation
```