import numpy as np
from scipy.misc import imread
import matplotlib.pyplot as plt
import cv2
import pandas as pd

def read_im(im_path):
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
    im = cv2.imread(im_path)
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

def get_crop_pothole(im_atlas='positive_data/G0011595.JPG', crop_x=(1700,1800), crop_y=(2600,2850)):
    """crop image.

    Parameters
    ----------
    im_atlas : str
        image path to crop.
    crop_x : tuple
        index of x coordinates.
    crop_y : tuple
        index of y coordinates.

    Returns
    -------
    np.array
        crop image.

    """
    im = read_im(im_atlas, src='/Users/mohcine/pm/Zamohra/data/', mode='train')
    im = rgb2gray(im)
    ndp = im[crop_x[0]:crop_x[1], crop_y[0]:crop_y[1]]
    return ndp

def gaussianblur_transform(im):
    """apply gaussian blur on the image.

    Parameters
    ----------
    im : np.array
        original image.

    Returns
    -------
    np.array
        image with blur.

    """
    im_gblur = cv2.GaussianBlur(im,(5,5),0)
    return im_gblur

def canny_transform(im):
    """Apply canny filters.

    Parameters
    ----------
    im : np.array
        Original image.

    Returns
    -------
    np.array
        image with canny contours.

    """
    im_edge = cv2.Canny(im,9,220)
    return im_edge

def medianblur_transform(im):
    """Apply median blur to image.

    Parameters
    ----------
    im : np.array
        Original image.

    Returns
    -------
    np.array
        image with median blur.

    """
    im_mblur = cv2.medianBlur(im,5)
    return im_mblur

def get_score(im):
    """Short summary.

    Parameters
    ----------
    im : np.array
        original image.

    Returns
    -------
    int
        score.

    """
    return (im == 255).sum()
