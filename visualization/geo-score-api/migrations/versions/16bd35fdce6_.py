"""empty message

Revision ID: 16bd35fdce6
Revises: None
Create Date: 2018-04-15 00:46:20.917518

"""

# revision identifiers, used by Alembic.
revision = '16bd35fdce6'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('score',
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('latitude', 'longitude')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('score')
    ### end Alembic commands ###
