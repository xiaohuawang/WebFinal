# XiaohuaJinhaoproject (Xiaohua Wang and Jinhao Liu)

This project was created by Xiaohua Wang and Jinhao Liu. This is a shopping cart web application.
The project is deployed at https://xiaohuajinhaowebapp.herokuapp.com/
The youtube video url is https://www.youtube.com/watch?v=eiliNPJtFig&feature=youtu.be
There are three types of user in the web application : admin, buyer and seller.

## Admin User

There is only one admin user for this web application. You can not create another admin user.
When you login as an admin user, you can view and modify all the buyers and sellers' information.

username: admin
password: admin

## Seller

When you login as a seller, you can post products on the market,and define its price and you can also check out products from the market.
You can also register yourself as a seller.

Sample account:
username: 111
password: 222

## Buyer

When you login as a buyer, you can only put products into the shopping cart, and check out, you are not allowed to post any products.

Sample account:
username: test
password：user

## Navigation

User Registration: User need to put valid email address to register himself.
                   During the registration, the user can choose he want to be a buyer or a seller.
                   
User Login:        User can login by providing the username and password that registered before.

Profile View:      When user click the profile tab, the user will be able to view his profile information including
                   his role, his email and his description, and he can also view the item he has bought.
                   If you login as an admin user, there will be an additional tab called admin, you are able to view all other users' information

Add goods:         When you login as an admin or a seller, you are able to post products on the market, and define its price, you can also add 
                   description and put an image url for the product. （Only admin and seller can do this）

Market:            When you go to the market tab, you will see all the products which are available on the market, so you can click the button to 
                   put it in your shopping cart, and once the product is checked out, it will be removed from the market. You can view other users' 
                   post product, and their price.
                 

Cart:              Once you have choose the products from the market, it will be put into the shopping cart, where you can decide if you want to 
                   check out, continue shopping or remove the product from the shopping cart.
                   
Bought:            You can check the list of product you bought from this evil website, haha.


## Run in local
npm install then npm start then run in localhost 3000
