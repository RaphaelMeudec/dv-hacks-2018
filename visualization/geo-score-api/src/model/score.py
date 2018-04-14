from .abc import db, BaseModel


class Score(db.Model, BaseModel):
    __tablename__ = 'score'

    latitude = db.Column(db.String(120), primary_key=True)
    longitude = db.Column(db.String(120), primary_key=True)
    score = db.Column(db.Integer)
