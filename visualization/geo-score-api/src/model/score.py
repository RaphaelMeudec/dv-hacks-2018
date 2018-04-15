from .abc import db, BaseModel


class Score(db.Model, BaseModel):
    __tablename__ = 'score'

    latitude = db.Column(db.Float, primary_key=True)
    longitude = db.Column(db.Float, primary_key=True)
    score = db.Column(db.Float)
