import numpy as np
from scipy.misc import imread

def read_im(im, src='/Users/mohcine/pm/Zamohra/data/', mode='train'):
    """Reading images from em path.

    Parameters
    ----------
    im : str
        path to the image.
    src : str
        source path to data.
    mode : str
        train or test mode.

    Returns
    -------
    np.array
        numpy array of the image.

    """
    im_path = src + mode + '/' + im
    im = imread(src).astype(np.float32)
    return im
