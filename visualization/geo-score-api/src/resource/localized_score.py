from flask.ext.restful import Resource

from model import Score


class LocalizedScoreAPI(Resource):
    def get(self, latitude1, longitude1, latitude2, longitude2):
        scores = Score.query.filter(
                            Score.latitude >= latitude1,
                            Score.latitude <= latitude2,
                            Score.longitude >= longitude1,
                            Score.longitude <= longitude2,
                        ).all()

        return [score.json for score in scores]
