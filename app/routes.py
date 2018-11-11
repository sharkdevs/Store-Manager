from flask import Flask, render_template
from flask_cors import CORS

from app import app
@app.route('/')
def load_index():
    return render_template("index.html")
