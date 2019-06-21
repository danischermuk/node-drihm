@ECHO OFF
start cmd /k mongod --dbpath c:/condorit/node-drihm/data
start cmd /k cd "c:/condorit/node-drihm" & npm start