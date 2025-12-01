from flask import Flask, Blueprint,Response, request, g, current_app
from app.db import get_db
from datetime import datetime
import json

api = Blueprint('api', __name__)

@api.route('/api/posts')
def get_all_posts():
    db = get_db()

    posts_obj = db.execute("SELECT post_id, post_title, author, content, avatar_url, created_at FROM posts").fetchall()
    post_data = []

    for post in posts_obj:
        post_dict = {}

        for key in post.keys():
            if hasattr(post[key], 'isoformat'):
                post_dict[key] = post[key].isoformat()

            else:
                post_dict[key] = post[key]

        post_data.append(post_dict)

    data = {
        'status':True,
        'posts':post_data
    }

    return Response(json.dumps(data, ensure_ascii=False), headers={
        'Content-Type':'application/json'
    })

@api.route('/api/comments')
def get_all_comments():
    headers = {'Content-Type':'application/json'}
    db = get_db()

    comments_obj = db.execute("SELECT comment_id, post_id, commentor, star, title, content, created_at FROM comments").fetchall()
    comment_data = []

    for comment in comments_obj:
        comment_dict = {}

        for key in comment.keys():
            if hasattr(comment[key], 'isoformat'):
                comment_dict[key] = comment[key].isoformat()
        
            else:
                comment_dict[key] = comment[key]
                
        comment_data.append(comment_dict)

    data = {
        'status':True,
        'comments':comment_data
    }
    return Response(json.dumps(data, ensure_ascii=False), headers=headers)

@api.route('/api/comment/<int:comment_id>')
def get_detail_comment(comment_id):
    headers = {'Content-Type':'application/json'}
    db = get_db()

    comment = db.execute("SELECT post_id, commentor, title, content, star, created_at FROM comments WHERE comment_id = ?", (comment_id,)).fetchone()
    comment_data = {}

    if not comment:
        comment_data['status'] = False
        return Response(json.dumps(comment_data, ensure_ascii=False), headers={'Content-Type':'application/json'})

    for key in comment.keys():
        if hasattr(comment[key], 'isoformat'):
            comment_data[key] = comment[key].isoformat()

        else:
            comment_data[key] = comment[key]
        
    comment_data['status'] = True
    return Response(json.dumps(comment_data, ensure_ascii=False), headers=headers)

@api.route('/api/comment/add/<int:post_id>', methods=['POST'])
def post_new_comment(post_id):
    headers = {'Content-Type':'application/json'}

    db = get_db()
    upd_query = """
        INSERT INTO comments (post_id, commentor, star, title, content)
        VALUES(?, ?, ?, ?, ?)
"""
    commentor = 'anonymous'
    star = request.form.get('star')
    title = request.form.get('title')
    content = request.form.get('content')

    if not all([commentor, star, title, content]):
        return Response(json.dumps({'status':False, 'message':'Missing required field'}), headers=headers)

    try:
        db.execute(upd_query, (post_id, commentor, star, title, content,))
        db.commit()
    
    except Exception as error:
        print(f"Error when adding comment, {error}")
        db.rollback()

        return Response(json.dumps({'status':False, 'message':'Internal Server Error'}).encode(), headers=headers)

    return Response(json.dumps({'status':True, 'message':'Add new comment successfully'}).encode(), headers=headers)

@api.route('/api/post/<int:post_id>')
def get_detail_post(post_id):
    headers = {'Content-Type':'applcation/json'}
    db = get_db()
    comments = db.execute("SELECT comment_id, commentor, star, created_at, title, content FROM comments WHERE post_id = ?", (post_id,)).fetchall()

    comment_data = []
    for comment in comments:
        comment_dict = {}
        
        for key in comment.keys():
            if hasattr(comment[key], 'isoformat'):
                comment_dict[key] = comment[key].isoformat()
            
            else:
                comment_dict[key] = comment[key]
        comment_data.append(comment_dict)
    
    post = db.execute("SELECT author, post_title, avatar_url, content, created_at FROM posts WHERE post_id = ?", (post_id,)).fetchone()

    post_data = {'status':True}
    if not post:
        return Response(json.dumps(post_data, ensure_ascii=False), headers=headers)
    
    for key in post.keys():
        if hasattr(post[key], 'isoformat'):
            post_data[key] = post[key].isoformat()

        else:
            post_data[key] = post[key]
    
    post_data['comments'] = comment_data

    return Response(json.dumps(post_data, ensure_ascii=False), headers={
        'Content-Type':'application/json'
    })

@api.route('/api/csp/on', methods=['POST'])
def turn_csp_on():
    if current_app.csp['status'] != 'on':
        current_app.csp['status'] = 'on'
    
    return Response(json.dumps(current_app.csp))

@api.route('/api/csp/off', methods=['POST'])
def turn_csp_off(): 
    if current_app.csp['status'] != 'off':
        current_app.csp['status'] = 'off'
    
    return Response(json.dumps(current_app.csp))

def regist_api(app):
    app.register_blueprint(api)