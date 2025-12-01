from flask import Flask, Blueprint,Response, abort, current_app
from app.db import get_db
from datetime import datetime
import uuid

post_page = Blueprint('post_page', __name__)

@post_page.route('/post/<int:post_id>', methods=['GET'])
def get_post_detail(post_id):
    headers = {}
    nonce_value = uuid.uuid4()

    try:
        with open('app/templates/detail-post.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
    
    except FileNotFoundError:
        abort(404)

    if hasattr(current_app, 'csp') and current_app.csp.get('status') == 'on':
        headers['Content-Security-Policy'] = f'script-src \'nonce-{nonce_value}\';'

    script_src = f"""
        <script nonce="{nonce_value}" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script nonce="{nonce_value}" src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
        <script nonce="{nonce_value}" src="/static/js/detail-post.js"></script>
    """.strip()

    html_content = html_content.replace("<!-- JS holder -->", script_src)
    
    return Response(html_content, headers=headers)

def regist_post_page(app):
    app.register_blueprint(post_page)