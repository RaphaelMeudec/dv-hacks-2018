from flask import Blueprint
from flask.ext.restful import Api

from resource.localized_score import LocalizedScoreAPI
from resource.score import ScoreAPI

score_blueprint = Blueprint('score', __name__)
score_blueprint_api = Api(score_blueprint)


score_blueprint_api.add_resource(ScoreAPI, '/score')
score_blueprint_api.add_resource(
    LocalizedScoreAPI,
    '/score/<string:latitude1>/<string:longitude1>/<string:latitude2>/<string:longitude2>'
)
