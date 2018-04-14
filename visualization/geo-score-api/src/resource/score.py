from flask.ext.restful import Resource

from model import Score


class ScoreAPI(Resource):
    def get(self):
        scores = Score.query.all()

        return [score.json for score in scores]
