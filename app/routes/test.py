from flask import Blueprint, Response

test_route = Blueprint('test_route', __name__)

@test_route.route('/test', methods=['GET'])
def test():
    headers = {'Content-Security-Policy':'script-src \'self\''}

    html_content = """
<html>
    <h2 id="h2">Hello
    </h2>
    <body>
        <input type="text" id="input-text" name="input-text">
        <input type="submit" id="input-btn" name="input-btn">
        <div id="commentList"></div>
    <body>
</html>

<script src="https://example.com"></script>
    """

    return Response(html_content, headers=headers)

@test_route.route('/test/srcdoc/attribute', methods=['GET'])
def test_srcdoc_attr():
    headers = {
        'Content-Security-Policy':'script-src \'self\''
    }
    html_content = """
<html>
<iframe srcdoc="
<!DOCTYPE html>
<html>
    <script src='/static/js/malicious.js'></script>
</html>
"></iframe>
</html>
"""

    return Response(html_content, headers=headers)

def regist_test(app):   
    app.register_blueprint(test_route)
