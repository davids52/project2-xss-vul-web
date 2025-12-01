from flask import Flask, Blueprint,Response, abort, request
from app.db import get_db
import json

comment_page = Blueprint('comment-page', __name__)

@comment_page.route('/comment/<int:comment_id>', methods=['GET'])
def get_detail_comment(comment_id):
    try:
        with open('app/templates/detail-comment.html', 'r', encoding='utf-8') as f:
            html_content_bytes = f.read()
    
    except FileNotFoundError:
        abort(404)
    
    return Response(html_content_bytes)

@comment_page.route('/add/comment/<int:post_id>', methods=['GET'])
def add_new_comment(post_id):
    try:
        with open('app/templates/add-comment.html' , 'r', encoding='utf-8') as file:
            html_content_bytes = file.read()
    
    except FileNotFoundError as e:
        abort(404)

    return Response(html_content_bytes)

def regist_comment_page(app):
    app.register_blueprint(comment_page)