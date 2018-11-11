from flask import Flask, render_template
from flask_cors import CORS

from app import app
@app.route('/')
@app.route('/index.html')
def load_index():
    return render_template("index.html")

@app.route('/dashboard.html')
def load_dashboard():
    return render_template("dashboard.html")

@app.route('/adminsales.html')
def load_adminsales():
    return render_template("adminsales.html")

@app.route('/addproduct.html')
def load_addproduct():
    return render_template("addproduct.html")

@app.route('/cart.html')
def load_cart():
    return render_template("cart.html")

@app.route('/editproduct.html')
def load_editprod():
    return render_template("editproduct.html")

@app.route('/mysales.html')
def load_mysales():
    return render_template("mysales.html")
    
@app.route('/products.html')
def load_products():
    return render_template("products.html")

@app.route('/register.html')
def load_register():
    return render_template("register.html")

@app.route('/userproducts.html')
def load_userproducts():
    return render_template("userproducts.html")


