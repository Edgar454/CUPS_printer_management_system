from fastapi import  Request

def get_db_pool(request: Request):
    return request.app.state.pool

def get_settings(request: Request):
    return request.app.state.settings

def get_cups_conn(request: Request):
    return request.app.state.cups_conn

