"""Add first score model

Revision ID: 457e1e8707f
Revises: 4aaee8797ca
Create Date: 2018-04-13 23:49:24.554330

"""

# revision identifiers, used by Alembic.
revision = '457e1e8707f'
down_revision = '4aaee8797ca'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table('score',
    sa.Column('latitude', sa.String(length=120), nullable=False),
    sa.Column('longitude', sa.String(length=120), nullable=False),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('latitude', 'longitude')
    )


def downgrade():
    op.drop_table('score')
