import os
import pandas as pd

from . import utils as ut

class PotholeDetection(object):
    """ PotholeDetection object """
    def __init__(self, dir_path):
        """init function.

        Parameters
        ----------
        dir_path : str
            images directory path.

        """
        if dir_path[-1] == '/':
            self.dir_path = dir_path
        else:
            self.dir_path = dir_path + '/'
        self.im_paths = [el for el in os.listdir(dir_path) if '_crop.png' in el]

    def get_score(self):
        """Calculate score of images.

        Returns
        -------
        pd.DataFrame
            dataframe of score per image.

        """
        df_gps = pd.read_csv(self.dir_path + 'gps_coords.csv',header=None, index_col=0)
        df_score = pd.DataFrame(columns=['latitude', 'longitude', 'score'])
        for im_p in self.im_paths:
            im = ut.read_im(self.dir_path + im_p)
            im_blur = ut.gaussianblur_transform(im)
            im_edges = ut.canny_transform(im_blur)
            score = ut.get_score(im_edges)
            df_score = df_score.append({'latitude': df_gps.loc[im_p.split('_crop.png')[0]][1], 'longitude': df_gps.loc[im_p.split('_crop.png')[0]][2], 'score': score}, ignore_index=True)
        return df_score

    def dump_score(self, path):
        """dump score file as csv.

        Parameters
        ----------
        path : str
            path to dump csv file.

        """
        df_score = self.get_score()
        df_score.to_csv(path, index=None)
