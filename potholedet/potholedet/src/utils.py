import numpy as np
from scipy.misc import imread
import matplotlib.pyplot as plt

def read_im(im_path, src='/Users/mohcine/pm/Zamohra/data/', mode='train'):
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
    im_path_ = src + mode + '/' + im_path
    im = imread(im_path_).astype(np.float32)
    return im

def rgb2gray(im):
    """Transforming image from RGB to grayscale.

    Parameters
    ----------
    im : np.array
        matrix of image.

    Returns
    -------
    np.array
        image in gray.

    """
    r, g, b = im[:,:,0], im[:,:,1], im[:,:,2]
    gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
    return gray

def plot_im(im, mode='gray'):
    """Ploting image.

    Parameters
    ----------
    im : np.array
        image array.
    mode : str
        Default is gray.

    Returns
    -------
    type
        Description of returned object.

    """
    plt.imshow(im, cmap=mode)
    plt.show()
