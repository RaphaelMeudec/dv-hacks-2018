from flask.ext.restful import Resource

from model import Score


class LocalizedScoreAPI(Resource):
    def get(self, latitude1, longitude1, latitude2, longitude2):
        scores = Score.query.filter(
                            Score.latitude >= float(latitude1),
                            Score.latitude <= float(latitude2),
                            Score.longitude >= float(longitude1),
                            Score.longitude <= float(longitude2),
                        ).all()

        return [score.json for score in scores]
