from flask import Flask, Response, request, redirect, g, current_app, abort
from app.db import regist_db
from app.routes.api import regist_api
from app.routes.comment_page import regist_comment_page
from app.routes.post_page import regist_post_page
from app.routes.test import regist_test
import os, uuid

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.csp = {'status':'off'}

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'database.db')
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    @app.route('/index', methods=['GET', 'POST'])
    def index():
        if request.method == 'POST':
            name = request.form.get('name')
            app.login_name = name 
            
            return Response(status=200)

        try:
            with open('app/templates/index.html', 'r', encoding='utf-8') as file:
                html_content = file.read()

        except FileNotFoundError:
            abort(500)

        return Response(html_content.encode())

    @app.route('/home', methods=['GET'])
    def home():
        headers = {}
        nonce_value = uuid.uuid4()
        
        if not hasattr(app, 'login_name') or not app.login_name:
            return redirect('/index')
        
        try:
            with open('app/templates/home.html', 'r', encoding='utf-8') as file:
                html_content = file.read()
                
        except FileNotFoundError:
            abort(500)

        if app.csp.get('status') == 'on':
            headers['Content-Security-Policy'] = f'script-src \'self\' https://cdn.jsdelivr.net; style-src \'self\' https://cdn.jsdelivr.net '

        script_src = f"""
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            <script src="static/js/home.js"></script>
        """.strip()
        
        html_content = html_content.replace("<!-- JS holder -->", script_src)
        html_content = html_content.replace('<!-- User holder -->', f"<div><h1>Welcome {app.login_name}</h1></div>")
        # html_content = html_content.replace('!-- CSS holder --', f'<link nonce="{nonce_value}" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">')

        return Response(html_content.encode('utf-8'), headers=headers)

    regist_db(app)
    regist_api(app)
    regist_comment_page(app)
    regist_post_page(app)
    regist_test(app)

    return app