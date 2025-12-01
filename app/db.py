from flask import current_app, g
import click
import os
import sqlite3


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            os.path.join(current_app.instance_path, 'database.db'),
            detect_types=sqlite3.PARSE_DECLTYPES
        )

        g.db.row_factory = sqlite3.Row
    
    return g.db

def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    
def init_data():
    db = get_db()

    with current_app.open_resource('init-data.sql') as f:
        db.executescript(f.read().decode('utf8'))

def close_db(e=None):
    db = g.pop('db', None)

    if db:
        db.close()
    
@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('Initialized database')

@click.command('init-data')
def init_data_command():
    init_data()
    click.echo('Initilized data in database')

def regist_db(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(init_data_command)
