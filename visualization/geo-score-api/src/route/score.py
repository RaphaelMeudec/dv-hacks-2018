from flask import Blueprint
from flask.ext.restful import Api

from resource.score import ScoreAPI

score_blueprint = Blueprint('score', __name__)
score_blueprint_api = Api(score_blueprint)


score_blueprint_api.add_resource(ScoreAPI, '/score')
